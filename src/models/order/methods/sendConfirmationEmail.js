// @flow
import type { OrderType } from 'Models/order/types';
import type { UserType } from 'Models/user/types';
import reservationConfirmation from 'Services/email/reservationConfirmation/reservationConfirmation';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function sendConfirmationEmail(order: OrderType, user: UserType, isUpdatedReservation: boolean = false, roleId: number): Promise<null> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].SEND_CONFIRMATION_EMAIL, roleId);
  const { Order } = this.sequelize.models;
  const { id, discount } = order;
  const [fullOrderData] = await Order.getFullOrder(id);
  const { event, orderItems } = fullOrderData;
  const orderItemData = orderItems || { orderItems: [] };
  const { subtotal, rvs, stalls, addOns, receiptLineItems } = this.getConfirmationEmailData(orderItemData, event);
  const transactionFee = fullOrderData.total - subtotal + discount;

  if (Number(transactionFee) > 0) receiptLineItems.push({ desc: 'Transaction Fee', amount: transactionFee.toFixed(2) });

  const request = {
    user,
    order: fullOrderData,
    rvs,
    stalls,
    addOns,
    lineItems: receiptLineItems,
    // determines which confirmation email to send (confirm or update)
    isUpdatedReservation
  };

  await reservationConfirmation(request, roleId);
  return null;
}

export default sendConfirmationEmail;
