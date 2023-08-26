// @flow
import Bugsnag from '@bugsnag/js';

import type { UpsertUserInputType } from 'Models/user/types';
import type { OrderItemInputType } from 'Models/orderItem/types';
import type { Multipayment } from './orderCheckout';
import logger from 'Config/winston';
import * as Helpers from '../helpers';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

type OrderPaymentInputType = {
  adminId?: number | string,
  saveCard?: boolean,
  selectedCard?: string,
  token?: string,
  useCard: boolean,
  isNonUSCard: boolean
};

type OrderUpsertInputType = {
  eventId: number | string,
  orderItems: Array<OrderItemInputType>,
  userId: number | string
};

type GroupOrderCheckoutInputType = {
  orderInput: OrderUpsertInputType,
  paymentInput: OrderPaymentInputType,
  userInput: UpsertUserInputType,
  groupId: number,
  orderId: number,
  multipaymentInput: Multipayment
};

const ADDON_PRODUCT = 2;

async function groupOrderCheckout(
  { orderInput, paymentInput, userInput, orderId, multipaymentInput }: GroupOrderCheckoutInputType,
  adminId: number,
  roleId: number
) {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].GROUP_ORDER_CHECKOUT, roleId);
  const transaction = await this.sequelize.transaction();

  try {
    const { Event, User, Payment, Order, OrderItem, StallProduct, RVProduct } = this.sequelize.models;
    const order = await Order.findOne({ where: { id: orderId } });
    const event = await Helpers.getEvent(Event, orderInput.eventId);
    const orderItems = [];
    let postedPayment;
    let postedCardPayment;
    let postedCashPayment;

    for (const orderItem of orderInput.orderItems) {
      const { reservation, xProductId, xRefTypeId } = await OrderItem.findOne({
        where: { id: orderItem.id },
        include: [{ association: 'reservation' }]
      });

      // @FlowIgnore we dont need id
      // eslint-disable-next-line no-unused-vars
      const { id, ...rest } = orderItem;

      const selectedXProductId = xRefTypeId === ADDON_PRODUCT ? xProductId : reservation.xProductId;
      const selectedXRefTypeId = xRefTypeId === ADDON_PRODUCT ? xRefTypeId : reservation.xRefTypeId;

      orderItems.push({
        xProductId: selectedXProductId,
        xRefTypeId: selectedXRefTypeId,
        ...rest
      });
    }

    orderInput.orderItems = orderItems;

    await Helpers.checkMinNightsInProducts(orderInput.orderItems, StallProduct, RVProduct);

    const costs = await Helpers.getCosts(this, paymentInput.useCard, orderInput.orderItems, paymentInput.isNonUSCard, roleId);

    const upsertedUser = await Helpers.upsertUser(User, userInput, event.venue.id, transaction, roleId);

    if (!upsertedUser) throw Error('User not found!');

    if (multipaymentInput && multipaymentInput.isMultipayment) {
      const response = await Helpers.settleMultiPayment(costs, paymentInput, upsertedUser, User, adminId, Payment, event, multipaymentInput, false);
      postedCardPayment = response.postedCardPayment;
      postedCashPayment = response.postedCashPayment;
    } else {
      postedPayment = await Helpers.settlePayment(costs, paymentInput, upsertedUser, User, adminId, Payment, event);
    }

    await this.update({ total: costs.total }, { where: { id: orderId }, transaction });

    transaction.afterCommit(async () => {
      let paymentRes = {};
      let paymentCardRes = {};
      let paymentCashRes = {};

      if (costs.total) {
        if (multipaymentInput && multipaymentInput.isMultipayment) {
          const multiPaymentResponse = await Helpers.createMultiPayment(
            adminId,
            postedCardPayment,
            postedCashPayment,
            paymentInput,
            orderId,
            costs,
            Payment,
            event,
            orderInput,
            multipaymentInput
          );
          paymentCardRes = multiPaymentResponse.cardPaymentResponse;
          paymentCashRes = multiPaymentResponse.cashPaymentResponse;
        } else {
          const paymentResponse = await Helpers.createPayment(adminId, postedPayment, paymentInput, orderId, costs, Payment, event, orderInput);
          paymentRes = paymentResponse;
        }
      }

      order.userId = adminId;
      order.discount = costs.discount;

      let paymentResIds = null;

      if (multipaymentInput && multipaymentInput.isMultipayment) {
        paymentResIds = [paymentCardRes.id, paymentCashRes.id];
      } else {
        paymentResIds = [paymentRes.id];
      }

      await this.createOrderRecordActivity(paymentResIds, order, orderInput, true);

      logger.info('Activity recorded in OrderHistory for cash or card transactions');
    });

    await transaction.commit();
    // Do not delete - This may seem odd, but it is required to make sure that Sequelize is truly done with the transaction.
    // Without this, the call to getOrderItemsById may only return the addOnProduct order items, and not the Reservation order items
    const delay = milliseconds => new Promise(resolve => setTimeout(() => resolve(), milliseconds));
    await delay(300);

    logger.info('Order process is completed.');
    logger.info(JSON.stringify(order));

    return [order, undefined];
  } catch (error) {
    logger.error('Error Occured in Order Group Checkout');
    logger.error(error.message);

    // eslint-disable-next-line flowtype/no-weak-types
    Bugsnag.notify(new Error(error), function (e: any) {
      e.setUser(orderInput.userId);
      e.context = `eventId ${orderInput.eventId}, error ${error.message}`;
    });

    await transaction.rollback();
    return [undefined, error];
  }
}

export default groupOrderCheckout;
