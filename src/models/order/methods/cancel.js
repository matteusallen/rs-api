// @flow
import logger from 'Config/winston';
const moment = require('moment');
import type { OrderType, RefundInputType } from '../types';
import { ACTIONS, MENU, ORDER_HISTORY_CHANGE_TYPES } from 'Constants';
import { validateAction } from 'Utils';

type CancelOrderType = {
  refundInformation: [RefundInputType],
  refundPayment: boolean,
  orderId?: string | number
};

const STALL = 1;
const ADDONS = 2;
const RV = 3;
const RESERVATION = 4;

const createReservation = (product, quantity) => ({
  endDate: moment(product.endDate).format('YYYY-MM-DD'),
  quantity,
  startDate: moment(product.startDate).format('YYYY-MM-DD'),
  xProductId: product.xProductId,
  reservationId: product.id
});

const calculateOldValues = async (orderItems, reservationModel) => {
  const addOns = [];
  let rvs = {};
  let stalls = {};

  for (const product of orderItems) {
    if (product.xRefTypeId === ADDONS) {
      addOns.push({
        quantity: product.quantity,
        orderItemId: product.id
      });
    }

    if (product.xRefTypeId === RESERVATION) {
      const reservationProduct = await reservationModel.findOne({ where: { id: product.xProductId } });

      if (reservationProduct.xRefTypeId === STALL) {
        stalls = createReservation(reservationProduct, product.quantity);
      }

      if (reservationProduct.xRefTypeId === RV) {
        rvs = createReservation(reservationProduct, product.quantity);
      }
    }
  }

  const cancellationOldValues = {};

  if (addOns.length) {
    cancellationOldValues.addOns = addOns;
  }

  if (Object.keys(stalls).length) {
    cancellationOldValues.stalls = stalls;
  }

  if (Object.keys(rvs).length) {
    cancellationOldValues.rvs = rvs;
  }

  return cancellationOldValues;
};

async function cancel(input: CancelOrderType, adminId: number, venueId?: number, roleId: number): Promise<[OrderType | void, string | void]> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].ORDER_CANCELATION, roleId);
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].ORDER_CANCELATION_AFTER_SETTLEMENT, roleId);
  const { Payment, ReservationStatus, GroupOrder, OrderHistory, Reservation } = this.sequelize.models;
  const transaction = await this.sequelize.transaction();

  try {
    const { refundPayment, refundInformation, orderId } = input;
    const groupOrder = await GroupOrder.findOne({
      where: { orderId },
      include: [{ association: 'order', include: [{ association: 'payments' }] }]
    });
    const groupOrderIsSettled = groupOrder?.order?.payments?.length > 0;

    const order = await this.findOne({
      where: { id: orderId },
      include: [{ association: 'orderItems' }]
    });

    if (!order) throw Error('order not found');

    const orderItemIds = order.orderItems.filter(orderItem => orderItem.xRefTypeId === 4).map(orderItem => orderItem.id);

    for (const orderItemId of orderItemIds) {
      const [, updateReservationError] = await ReservationStatus.updateReservationStatus({ orderItemId, statusId: 4 }, transaction, roleId);
      if (updateReservationError) throw Error(updateReservationError);
    }

    order.canceled = Date.now();
    const updatedOrder = await order.save();
    if (groupOrder) {
      await GroupOrder.update({ deletedAt: order.canceled }, { where: { orderId }, transaction });
    }

    let paymentIds = [],
      refunds = [],
      refundError = null;

    // changes with card refunds
    if (refundPayment) {
      [refunds, refundError] = await Payment.refund(venueId, adminId, refundInformation, transaction, false, orderId, roleId);
      if (refundError) throw Error(refundError);
    }

    paymentIds = refunds.map(payment => payment.id);

    const oldValues = await calculateOldValues(order.orderItems, Reservation);

    // record activities
    const activity = {
      paymentIds,
      adminId,
      orderId,
      changeType: ORDER_HISTORY_CHANGE_TYPES.orderCancellation,
      oldValues,
      newValues: {},
      isGroupOrder: groupOrder && !groupOrderIsSettled ? true : false
    };

    const activities = [];
    activities.push(activity);
    await OrderHistory.recordActivities(activities, transaction);
    await transaction.commit();

    // send cancellation email once
    await this.sendCancellationEmail(orderId, order.userId, null);

    if (refunds.length && refundPayment) {
      const updatedOrder = await this.findOne({
        where: { id: orderId },
        include: [{ association: 'user' }]
      });

      // send email for every refund refunds
      const [, emailError] = await this.sendRefundEmail({
        order: updatedOrder,
        payment: refunds
      });

      if (emailError) logger.error(emailError);
      logger.info('Refund emails sent');
    }

    return [updatedOrder, undefined];
  } catch (error) {
    await transaction.rollback();
    return [undefined, error.message];
  }
}

export default cancel;
