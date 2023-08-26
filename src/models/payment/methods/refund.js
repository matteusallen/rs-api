// @flow
import type { RefundInputType } from 'Models/order/types';
import ssRefundAction from 'Services/payment/refund';
import logger from 'Config/winston';
import { STRIPE_ACCOUNT_TYPE, ORDER_HISTORY_CHANGE_TYPES, ACTIONS, MENU } from 'Constants';
import { isLast4Unique } from 'Utils/orderUtils';
import { validateAction } from 'Utils';

async function refund(
  venueId: number,
  adminId: number,
  input: [RefundInputType],
  transaction?: {},
  isSpecialRefund: boolean,
  orderId: string | number,
  roleId: number
): Promise<[[] | void, string | void]> {
  const paymentResponses = [];
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].ORDER_REFUND, roleId);
  try {
    const { Order, Venue, OrderHistory } = this.sequelize.models;

    const order = await Order.findOne({
      where: { id: orderId },
      include: [{ association: 'user' }]
    });

    if (!order) {
      throw Error('order not found, refund cannot be processed.');
    }

    const { user } = order;
    const [venue] = await Venue.getVenueById(venueId);

    if (!venue) {
      throw Error('venue not found, refund cannot be processed.');
    }

    if (input.length <= 5 && isLast4Unique(input)) {
      for (let refundInfo of input) {
        const { amount, ssChargeId, cardPayment, cardBrand, last4, orderId, userId, notes } = refundInfo;
        let ssRefund = {};
        let refundSuccess = true;
        if (cardPayment) {
          ssRefund = await ssRefundAction({
            amount: Number(amount * 100).toFixed(0),
            ssChargeId,
            userId: userId ? userId : user.ssGlobalId,
            stripeAccount: venue.stripeAccountType === STRIPE_ACCOUNT_TYPE.standard ? venue.stripeAccount : null
          });
          refundSuccess = ssRefund && Object.prototype.hasOwnProperty.call(ssRefund, 'success') ? ssRefund.success : true;
        }
        const refundTransaction = {
          adminId,
          ssChargeId,
          cardPayment,
          cardBrand,
          last4,
          ssRefundId: ssRefund && ssRefund.data && ssRefund.data.id ? ssRefund.data.id : null,
          orderId,
          // $FlowFixMe
          amount: -Math.abs(Number(amount).toFixed(2)),
          notes: input.length > 1 ? `MULTI REFUND: ${notes}` : notes,
          success: cardPayment ? refundSuccess : true,
          stripeAccountType: venue.stripeAccountType
        };

        const [newRefund, newRefundError] = await this.addPayment(refundTransaction, transaction);
        if (newRefundError) throw new Error(newRefundError);
        if (ssRefund && ssRefund.error) throw new Error(ssRefund.error);

        paymentResponses.push(newRefund);

        if (isSpecialRefund) {
          const activity = {
            adminId,
            orderId,
            changeType: ORDER_HISTORY_CHANGE_TYPES.specialRefund,
            oldValues: {},
            newValues: {},
            paymentId: newRefund.id
          };

          await OrderHistory.recordActivity(activity, transaction);
          await Order.update({ total: order.total }, { where: { id: orderId }, transaction });

          const [, emailError] = await Order.sendRefundEmail({
            order,
            payment: newRefund
          });
          if (emailError) logger.error(emailError); //no need to reverse refund if email fail to send.
        }
      }
    } else {
      throw new Error('Order has more than 5 cards saved');
    }

    return [paymentResponses, undefined];
  } catch (error) {
    logger.error(error.message);
    error.message =
      paymentResponses.length > 1
        ? `We were able to process ${paymentResponses.length} of ${input.length} refunds, please see order details for more info`
        : error.message;
    return [undefined, error];
  }
}

export default refund;
