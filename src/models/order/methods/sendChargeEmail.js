// @flow
import type { OrderItemType } from 'Models/orderItem/types';
import type { UserType } from 'Models/user/types';
import type { ReservationType } from 'Models/reservation/types';
import updateConfirmationEmail from 'Services/email/reservationConfirmation/updateConfirmationEmail';

async function sendConfirmationEmail(
  order: OrderItemType,
  user: UserType,
  reservations: [ReservationType],
  newCost: any,
  total: number,
  fee: number
): Promise<null> {
  const { Order } = this.sequelize.models;
  const { id } = order;
  const [fullOrderData] = await Order.getFullOrder(id);
  const { event, orderItems } = fullOrderData;
  const orderItemData = orderItems || { orderItems: [] };
  const { rvs, stalls, addOns, receiptLineItems } = this.getChargeEmailData(orderItemData, event, reservations, newCost);
  const transactionFee = newCost ? newCost.serviceFee + newCost.stripeFee : 0;
  if (Number(transactionFee) > 0) receiptLineItems.push({ desc: 'Transaction Fee', amount: transactionFee.toFixed(2) });

  const request = {
    user,
    order: fullOrderData,
    rvs,
    stalls,
    addOns,
    lineItems: receiptLineItems,
    total,
    fee,
    reservations,
    newCost
  };

  await updateConfirmationEmail(request);
  return null;
}

export default sendConfirmationEmail;
