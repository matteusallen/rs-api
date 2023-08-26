// @flow
import moment from 'moment';
import { getTotalAndStripeFee, getPercentageFee } from 'Utils/stripeFeeUtils';
import { ADD_ON_PRODUCT_X_REF_TYPE_ID, RESERVATION_X_REF_TYPE_ID, ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

type OrderItemCostType = {|
  endDate: Date,
  orderItemCost?: number,
  quantity: number,
  startDate: Date,
  xProductId: number | string,
  xRefTypeId: number | string,
  discount: number,
  discountStartDate: Date | null,
  discountEndDate: Date | null
|};

type OrderCostsInputType = {|
  selectedOrderItems: Array<OrderItemCostType>,
  useCard: boolean,
  isNonUSCard: boolean,
  applyPlatformFeeOnUpdate?: boolean,
  applyFeePerProduct?: boolean,
  applyPercentageFee?: boolean
|};

export type OrderCostsReturnType = {|
  orderItemsCostsWithDetails: Array<OrderItemCostType>,
  serviceFee: number,
  stripeFee: number,
  subtotal: number,
  total: number,
  discount: number
|};

async function calculateOrderCosts(input: OrderCostsInputType, roleId: number): Promise<OrderCostsReturnType | void> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].ORDER_COSTS, roleId);
  try {
    const { selectedOrderItems, useCard, isNonUSCard = false, applyPlatformFeeOnUpdate = true, applyFeePerProduct = true, applyPercentageFee = true } = input;

    if (!selectedOrderItems.length) throw Error('orderCosts: invalid orderitems!');

    const { ProductXRefType, Reservation } = this.sequelize.models;
    let event = {},
      totalRvAndStallQuantity = 0;
    selectedOrderItems.map(orderItem => {
      const values = Object.values(orderItem);
      const index = values.findIndex(value => !value && value !== 0);
      if (index > -1) throw Error('orderCosts: selected order items lack sufficient data');

      totalRvAndStallQuantity += Number(orderItem.xRefTypeId) !== ADD_ON_PRODUCT_X_REF_TYPE_ID ? orderItem.quantity : 0;
    });
    const orderItemsCosts = await Promise.all(
      selectedOrderItems.map(async (orderItem, index) => {
        const { xProductId, xRefTypeId, quantity, startDate, endDate } = orderItem;
        const itemType = await ProductXRefType.findOne({ where: { id: xRefTypeId } });

        let reservation;
        if (Number(xRefTypeId) === RESERVATION_X_REF_TYPE_ID) {
          reservation = await Reservation.findOne({
            where: { id: xProductId }
          });
        }

        // If reservation exists, this is an edit, and need reservation.xProductId
        const productWhereClause = {
          where: { id: reservation ? reservation.xProductId : xProductId },
          include: index === 0 ? [{ association: 'event', include: [{ association: 'venue' }] }] : []
        };

        const product = await this.sequelize.models[itemType.name].findOne(productWhereClause);
        if (index === 0) event = product.event;

        const orderItemCostWithDetails = {
          xProductId,
          xRefTypeId,
          quantity,
          startDate,
          endDate,
          orderItemCost: 0
        };

        if (product.nightly) {
          const discountInfo = await this.calculateProductDiscount(xRefTypeId, xProductId, startDate, endDate, product.price, quantity);

          const numberOfNights = moment(endDate).diff(moment(startDate), 'days');

          return {
            ...orderItemCostWithDetails,
            orderItemCost: quantity * product.price * numberOfNights,
            discount: discountInfo.amount,
            discountStartDate: discountInfo.start,
            discountEndDate: discountInfo.end
          };
        }

        return {
          ...orderItemCostWithDetails,
          orderItemCost: quantity * product.price,
          discount: 0,
          discountStartDate: null,
          discountEndDate: null
        };
      })
    );

    // Sum discounts
    const discountAmount = orderItemsCosts.reduce((acc, curr) => acc + curr.discount, 0);

    const subtotal =
      orderItemsCosts.reduce((acc, curr) => {
        // We need to put this defense to prevent: 'Cannot perform arithmetic operation because undefined [1] is not a number'
        let currentCost = 0;
        if (curr && curr.orderItemCost) currentCost = curr.orderItemCost;
        return acc + currentCost;
      }, 0) - discountAmount;
    let serviceFee = 0;

    if (event.venue.platformFee && totalRvAndStallQuantity > 0 && applyPlatformFeeOnUpdate) {
      serviceFee = !event.venue.applyPlatformFeeOnZeroDollarOrder && !subtotal ? 0 : event.venue.platformFee;
    } else if (event.venue.feePerProduct && subtotal > 0 && applyFeePerProduct) {
      serviceFee = event.venue.feePerProduct * totalRvAndStallQuantity;
    } else if (applyPercentageFee) {
      serviceFee = getPercentageFee(subtotal, applyPercentageFee, event);
    }

    const [total, stripeFee] = getTotalAndStripeFee(
      subtotal,
      serviceFee,
      useCard,
      applyPlatformFeeOnUpdate ? event.venue.includeStripeFee : false,
      isNonUSCard
    );

    const selectedOrderItemCostSummary = {
      orderItemsCostsWithDetails: orderItemsCosts,
      subtotal,
      discount: discountAmount,
      stripeFee: Math.round((stripeFee + Number.EPSILON) * 100) / 100,
      serviceFee,
      total: Math.round((total + Number.EPSILON) * 100) / 100
    };

    return selectedOrderItemCostSummary;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default calculateOrderCosts;
