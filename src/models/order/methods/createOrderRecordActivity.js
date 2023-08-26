// @flow
import {
  STALL_PRODUCT_X_REF_TYPE_ID,
  ADD_ON_PRODUCT_X_REF_TYPE_ID,
  RV_PRODUCT_X_REF_TYPE_ID,
  ORDER_HISTORY_CHANGE_TYPES,
  RESERVATION_X_REF_TYPE_ID
} from 'Constants';
import moment from 'moment';

async function createOrderRecordActivity(paymentIds: [number], newOrder: any, orderInput: any, isGroupOrder?: boolean) {
  const { OrderHistory, OrderItem } = this.sequelize.models;
  const orderitems = await OrderItem.getOrderItemProductsByOrderId(newOrder.id);

  let rvs = null,
    stalls = null,
    addOns = [];

  for (const orderItem of orderInput.orderItems) {
    if (orderItem.xRefTypeId == STALL_PRODUCT_X_REF_TYPE_ID) {
      const oi = orderitems.find(o => o.xRefTypeId == RESERVATION_X_REF_TYPE_ID && o.reservation && o.reservation.xRefTypeId == orderItem.xRefTypeId);

      stalls = {
        quantity: orderItem.quantity,
        startDate: moment.utc(orderItem.startDate).format('YYYY-MM-DD'),
        endDate: moment.utc(orderItem.endDate).format('YYYY-MM-DD'),
        reservationId: oi.reservation.id,
        xProductId: oi.reservation.xProductId
      };
    }

    if (orderItem.xRefTypeId == RV_PRODUCT_X_REF_TYPE_ID) {
      const oi = orderitems.find(o => o.xRefTypeId == RESERVATION_X_REF_TYPE_ID && o.reservation && o.reservation.xRefTypeId == orderItem.xRefTypeId);

      rvs = {
        quantity: orderItem.quantity,
        startDate: moment.utc(orderItem.startDate).format('YYYY-MM-DD'),
        endDate: moment.utc(orderItem.endDate).format('YYYY-MM-DD'),
        reservationId: oi.reservation.id,
        xProductId: oi.reservation.xProductId
      };
    }

    if (orderItem.xRefTypeId == ADD_ON_PRODUCT_X_REF_TYPE_ID) {
      const oi = orderitems.find(o => o.xProductId == orderItem.xProductId);
      addOns.push({ quantity: orderItem.quantity, orderItemId: oi.id });
    }
  }

  const activities = {
    orderId: newOrder.id,
    adminId: newOrder.userId,
    changeType: ORDER_HISTORY_CHANGE_TYPES.orderChange,
    oldValues: {},
    newValues: {
      discount: newOrder.discount,
      // $FlowIgnore
      ...(rvs && { rvs }),
      // $FlowIgnore
      ...(stalls && { stalls }),
      // $FlowIgnore
      ...(addOns.length && { addOns })
    },
    paymentIds,
    isGroupOrder
  };

  await OrderHistory.recordActivities([activities]);
}

export default createOrderRecordActivity;
