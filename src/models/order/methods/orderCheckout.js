// @flow
import Bugsnag from '@bugsnag/js';

import type { OrderType } from '../types';
import type { UpsertUserInputType } from 'Models/user/types';
import type { OrderItemInputType } from 'Models/orderItem/types';
import logger from 'Config/winston';
import * as Helpers from '../helpers';
import { ACTIONS, MENU, RENTER } from 'Constants';
import { validateAction } from 'Utils';

export type OrderPaymentInputType = {|
  adminId?: number | string,
  saveCard?: boolean,
  selectedCard?: string,
  token?: string,
  useCard: boolean,
  isNonUSCard: boolean
|};

type OrderUpsertInputType = {|
  eventId: number | string,
  notes: string,
  adminNotes: string,
  orderItems: Array<OrderItemInputType>,
  userId: number | string
|};

export type Multipayment = {|
  isMultipayment: boolean,
  totalToCash: string,
  totalToCard: string
|};

type OrderCheckoutInputType = {|
  orderInput: OrderUpsertInputType,
  paymentInput: OrderPaymentInputType,
  userInput: UpsertUserInputType,
  groupId: number,
  multipaymentInput: Multipayment,
  groupCode?: string
|};

async function orderCheckout(input: OrderCheckoutInputType, adminId: number, roleId: number): Promise<[?OrderType, ?string]> {
  const { Event, User, Payment, StallProduct, RVProduct, GroupOrder, GroupOrderBill } = this.sequelize.models;
  const { paymentInput, userInput, orderInput, groupId, groupCode, multipaymentInput } = input;
  const transaction = await this.sequelize.transaction();

  logger.info(`Processing order for userId: ${orderInput.userId} with email: ${userInput.email}`);
  logger.info(JSON.stringify(input));

  try {
    if (paymentInput && paymentInput.useCard && !paymentInput.token && !paymentInput.selectedCard && !groupId) throw Error('invalid payment information');

    const event = await Helpers.getEvent(Event, orderInput.eventId);

    let groupOrderBillResponse = {};
    let postedPayment;
    let postedCardPayment;
    let postedCashPayment;

    const upsertedUser = await Helpers.upsertUser(User, userInput, event.venue.id, transaction, roleId);

    if (!upsertedUser) throw Error('User not found!');

    orderInput.userId = orderInput.userId || upsertedUser.id;

    const isRenter = upsertedUser.roleId === RENTER ? 'true' : 'false';

    if (isRenter && groupCode && !event.isGroupCodeRequired && !paymentInput.token && paymentInput.selectedCard === null) throw Error('Payment is Required');

    validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].ORDER_CHECKOUT, roleId);

    await Helpers.checkAvailability(this, StallProduct, RVProduct, orderInput.orderItems, event.id, null, isRenter, roleId);

    await Helpers.checkMinNightsInProducts(orderInput.orderItems, StallProduct, RVProduct);

    const costs = await Helpers.getCosts(this, groupId ? false : paymentInput.useCard, orderInput.orderItems, paymentInput.isNonUSCard, roleId);

    const [newOrder, newOrderError] = await this.createOrder(orderInput, costs, transaction, roleId);

    if (newOrderError) throw Error(newOrderError);
    logger.info(`Order Created ${newOrder.id}`);

    if (groupId) {
      if (isRenter && paymentInput.token && groupCode)
        postedPayment = await Helpers.groupSaveRenterPayment(paymentInput, upsertedUser, User, adminId, Payment, event);
      await GroupOrder.createGroupOrder(
        { groupId, orderId: newOrder.id, groupCode, last4: isRenter && ((postedPayment && postedPayment.last4) || paymentInput.selectedCard) },
        transaction
      );

      const input = {
        orderId: newOrder.id,
        amount: costs.total,
        isRefund: false,
        note: null,
        adminId
      };
      groupOrderBillResponse = costs.total ? await GroupOrderBill.createGroupOrderBill(input, transaction) : {};
      logger.info('GroupOrderBill processed');
    } else {
      validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].ORDER_PAYMENT, roleId);

      if (multipaymentInput && multipaymentInput.isMultipayment) {
        const response = await Helpers.settleMultiPayment(costs, paymentInput, upsertedUser, User, adminId, Payment, event, multipaymentInput, isRenter);
        postedCardPayment = response.postedCardPayment;
        postedCashPayment = response.postedCashPayment;
      } else {
        postedPayment = await Helpers.settlePayment(costs, paymentInput, upsertedUser, User, adminId, Payment, event, isRenter);
      }
    }

    transaction.afterCommit(async () => {
      let paymentRes = {};
      let paymentCardRes = {};
      let paymentCashRes = {};

      if (!groupId && costs.total) {
        if (multipaymentInput && multipaymentInput.isMultipayment) {
          const multiPaymentResponse = await Helpers.createMultiPayment(
            adminId,
            postedCardPayment,
            postedCashPayment,
            paymentInput,
            newOrder.id,
            costs,
            Payment,
            event,
            orderInput,
            multipaymentInput
          );
          paymentCardRes = multiPaymentResponse.cardPaymentResponse;
          paymentCashRes = multiPaymentResponse.cashPaymentResponse;
        } else {
          const paymentResponse = await Helpers.createPayment(adminId, postedPayment, paymentInput, newOrder.id, costs, Payment, event, orderInput);
          paymentRes = paymentResponse;
        }
      }

      newOrder.userId = adminId;
      newOrder.discount = costs.discount;

      let paymentResIds = null;

      if (multipaymentInput && multipaymentInput.isMultipayment) {
        paymentResIds = [paymentCardRes.id, paymentCashRes.id];
      } else {
        paymentResIds = paymentRes && paymentRes.id ? [paymentRes.id] : null;
      }

      await this.createOrderRecordActivity(paymentResIds ? paymentResIds : [groupOrderBillResponse.id], newOrder, orderInput, groupId ? true : false);

      logger.info('Activity recorded in OrderHistory for cash or card transactions');
    });

    await transaction.commit();
    // Do not delete - This may seem odd, but it is required to make sure that Sequelize is truly done with the transaction.
    // Without this, the call to getOrderItemsById may only return the addOnProduct order items, and not the Reservation order items
    const delay = milliseconds => new Promise(resolve => setTimeout(() => resolve(), milliseconds));
    await delay(300);

    logger.info('Order process is completed.');
    logger.info(JSON.stringify(newOrder));

    return [newOrder, undefined];
  } catch (error) {
    logger.error('Error Occured in Order Checkout');
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

export default orderCheckout;
