// @flow
import { Reservation, OrderItem, User, GroupOrderBill, Payment, OrderHistoryPayments, RVProduct, StallProduct } from 'Models';
import logger from 'Config/winston';
import { ORDER_HISTORY_CHANGE_TYPES } from 'Constants';
import moment from 'moment';

type OrderHistoryDetailsType = {|
  createdAt: string,
  groupOrderBill?: {},
  payment?: {},
  user?: {},
  productType: string,
  quantity?: number,
  nightly?: boolean,
  productName: string,
  startDate?: string,
  endDate?: string,
  prevStartDate?: string,
  prevEndDate?: string,
  prevQuantity?: number,
  prevProductId?: string | number,
  noRefundReason?: string,
  isNoRefund?: boolean,
  discount?: number
|};

async function getOrderHistoryDetails(orderId: number): Promise<[OrderHistoryDetailsType] | []> {
  try {
    let orderHistoryDetails = [];
    const orderHistories = await this.findAll({
      where: { orderId },
      order: [['createdAt', 'DESC']]
    });

    for (const orderHistory of orderHistories) {
      const userInfo = await User.getUser({ id: orderHistory.adminId });
      const ohPayments = await OrderHistoryPayments.findAll({
        where: { orderHistoryId: orderHistory.id },
        include: [
          {
            association: 'payment',
            attributes: ['id', 'ssChargeId', 'ssRefundId', 'amount', 'cardPayment', 'cardBrand', 'last4', 'notes']
          }
        ]
      });

      const payments = ohPayments.reduce((acc, pymt) => {
        if (pymt.payment) acc.push(pymt.payment);
        return acc;
      }, []);

      let isNoRefund = 'noRefundReason' in orderHistory.newValues;

      const shouldCheckInsideAddOns = 'addOns' in orderHistory.newValues && !isNoRefund;
      const addOnWithNoRefundReason = orderHistory.newValues.addOns?.some(addOn => 'noRefundReason' in addOn);
      // At this point we need to check if inside an addon
      // there is a noRefundReason property
      if (shouldCheckInsideAddOns && addOnWithNoRefundReason) {
        isNoRefund = true;
      }

      const orderHistoryDetail = {
        createdAt: orderHistory.createdAt,
        groupOrderBill:
          ohPayments[0]?.paymentId && ohPayments[0]?.isGroupOrder
            ? await GroupOrderBill.findOne({ where: { id: ohPayments[0]?.paymentId }, attributes: ['id', 'amount', 'isRefund', 'note'] })
            : null,
        payment:
          !orderHistory.isGroupOrder && orderHistory.paymentId
            ? await Payment.findOne({
                where: { id: orderHistory.paymentId },
                attributes: ['id', 'ssChargeId', 'ssRefundId', 'amount', 'cardPayment', 'cardBrand', 'last4', 'notes']
              })
            : null,
        user: userInfo && userInfo.payload ? { firstName: userInfo.payload.firstName || '', lastName: userInfo.payload.lastName || '' } : null,
        productType: '',
        quantity: 0,
        startDate: '',
        endDate: '',
        prevStartDate: '',
        prevEndDate: '',
        prevQuantity: 0,
        prevProductId: null,
        productId: orderHistory.newValues.rvs?.xProductId || orderHistory.newValues.stalls?.xProductId,
        noRefundReason: orderHistory.newValues.noRefundReason,
        discount: orderHistory.newValues.discount,
        isNoRefund,
        payments
      };

      if (orderHistory.changeType === ORDER_HISTORY_CHANGE_TYPES.specialRefund) {
        orderHistoryDetails.push({
          ...orderHistoryDetail,
          productType: ORDER_HISTORY_CHANGE_TYPES.specialRefund
        });
      } else if (orderHistory.changeType === ORDER_HISTORY_CHANGE_TYPES.orderCancellation) {
        orderHistoryDetails.push({
          ...orderHistoryDetail,
          productType: ORDER_HISTORY_CHANGE_TYPES.orderCancellation
        });
      } else {
        for (const k in orderHistory.newValues) {
          const v = orderHistory.newValues[k];
          const ov = orderHistory.oldValues[k];
          const ProductModel = k === 'rvs' ? RVProduct : StallProduct;
          let reservation;
          let reservationProduct;

          if (k !== 'addOns') {
            if (v.xProductId) {
              [reservationProduct] = await ProductModel.findAll({
                where: { id: v.xProductId },
                attributes: ['name', 'nightly']
              });
            }

            if (v.reservationId) {
              [reservation] = await Reservation.findAll({
                where: { id: v.reservationId },
                include: [{ association: k == 'stalls' ? 'stallProduct' : 'rvProduct', attributes: ['nightly', 'name'] }]
              });

              orderHistoryDetail.prevQuantity = ov && ov?.quantity;
              orderHistoryDetail.quantity = v?.quantity || (ov && ov?.quantity);
              orderHistoryDetail.startDate = (v.startDate && moment.utc(v.startDate).format('YYYY-MM-DD')) || reservation.startDate;
              orderHistoryDetail.endDate = (v.endDate && moment.utc(v.endDate).format('YYYY-MM-DD')) || reservation.endDate;
              orderHistoryDetail.prevStartDate = ov && ov.startDate;
              orderHistoryDetail.prevEndDate = ov && ov.endDate;
              const isChangeProductType = ov?.xProductId && ov.xProductId !== v.xProductId;
              orderHistoryDetail.prevProductId = isChangeProductType ? ov?.xProductId : null;

              if (k === 'stalls') {
                orderHistoryDetail.productType = 'stalls';
                if (
                  orderHistoryDetail.prevQuantity &&
                  orderHistoryDetail.prevStartDate &&
                  (orderHistoryDetail.prevEndDate != orderHistoryDetail.endDate ||
                    orderHistoryDetail.prevStartDate != orderHistoryDetail.startDate ||
                    orderHistoryDetail.prevQuantity != orderHistoryDetail.quantity) &&
                  !isChangeProductType
                ) {
                  const newOrderHistoryDetail = { ...orderHistoryDetail };
                  if (orderHistoryDetail.prevQuantity === orderHistoryDetail.quantity) {
                    delete newOrderHistoryDetail.prevQuantity;
                  }
                  orderHistoryDetail.endDate = ov?.endDate || v.endDate;
                  orderHistoryDetail.startDate = ov?.startDate || v.startDate;
                  delete orderHistoryDetail.prevEndDate;
                  delete orderHistoryDetail.prevStartDate;

                  orderHistoryDetails.push({
                    ...newOrderHistoryDetail,
                    productName: reservationProduct?.name || reservation.stallProduct?.name,
                    nightly: reservationProduct?.nightly || reservation.stallProduct?.nightly
                  });
                } else {
                  orderHistoryDetails.push({
                    ...orderHistoryDetail,
                    productName: reservationProduct?.name || reservation.stallProduct?.name,
                    nightly: reservationProduct?.nightly || reservation.stallProduct?.nightly
                  });
                }
              }

              if (k === 'rvs') {
                orderHistoryDetail.productType = 'rvs';
                if (
                  orderHistoryDetail.prevQuantity &&
                  orderHistoryDetail.prevStartDate &&
                  (orderHistoryDetail.prevEndDate != orderHistoryDetail.endDate ||
                    orderHistoryDetail.prevStartDate != orderHistoryDetail.startDate ||
                    orderHistoryDetail.prevQuantity != orderHistoryDetail.quantity) &&
                  !isChangeProductType
                ) {
                  const newOrderHistoryDetail = { ...orderHistoryDetail };
                  if (orderHistoryDetail.prevQuantity === orderHistoryDetail.quantity) {
                    delete newOrderHistoryDetail.prevQuantity;
                  }
                  orderHistoryDetail.endDate = ov?.endDate || v?.endDate;
                  orderHistoryDetail.startDate = ov?.startDate || v?.startDate;
                  delete orderHistoryDetail.prevEndDate;
                  delete orderHistoryDetail.prevStartDate;

                  orderHistoryDetails.push({
                    ...newOrderHistoryDetail,
                    productName: reservationProduct?.name || reservation.rvProduct?.name,
                    nightly: reservationProduct?.nightly || reservation.rvProduct?.nightly
                  });
                } else {
                  orderHistoryDetails.push({
                    ...orderHistoryDetail,
                    productName: reservationProduct?.name || reservation.rvProduct?.name,
                    nightly: reservationProduct?.nightly || reservation.rvProduct?.nightly
                  });
                }
              }
            }
          }

          if (k === 'addOns') {
            orderHistoryDetail.prevProductId = null;
            const addOnOldValues = ov;
            const addOnNewValues = v;
            for (let i = 0; i < addOnNewValues.length; i++) {
              orderHistoryDetail.productType = 'addOns';
              orderHistoryDetail.quantity = addOnNewValues[i]?.quantity;
              const odlQty = addOnOldValues && addOnOldValues.find(item => item.orderItemId == addOnNewValues[i].orderItemId)?.quantity;
              orderHistoryDetail.prevQuantity = odlQty ? odlQty : 0;

              const [orderItem] = await OrderItem.findAll({
                where: { id: addOnNewValues[i].orderItemId },
                include: [{ association: 'addOnProduct', include: [{ association: 'addOn', attributes: ['name'] }] }]
              });

              orderHistoryDetails.push({
                ...orderHistoryDetail,
                productName: orderItem.addOnProduct.addOn.name
              });
            }
          }
        }
      }
    }
    return orderHistoryDetails;
  } catch (error) {
    logger.error(error.message);
    return [];
  }
}

export default getOrderHistoryDetails;
