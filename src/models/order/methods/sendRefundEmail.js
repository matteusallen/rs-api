//@flow
import type { OrderType } from '../types';
import type { PaymentType } from 'Models/payment/types';
import refundEmail from 'Services/email/refundEmail';

type SendRefundEmailInputType = {|
  order: OrderType,
  payment: [PaymentType]
|};

async function sendRefundEmail({ order, payment }: SendRefundEmailInputType): Promise<[boolean | void, string | void]> {
  try {
    const { User } = this.sequelize.models;
    const user = await User.getUser({ id: order.userId });
    const { id } = order;
    const [fullOrderData] = await this.getFullOrder(id);
    const { event, orderItems } = fullOrderData;
    const orderItemData = orderItems || { orderItems: [] };

    const { subtotal, rvs, stalls, addOns, receiptLineItems } = this.getConfirmationEmailData(orderItemData, event);

    await refundEmail({
      user: user.payload,
      payment,
      order: fullOrderData,
      subtotal,
      rvs,
      stalls,
      addOns,
      receiptLineItems
    });

    return [true, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default sendRefundEmail;
