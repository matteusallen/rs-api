//@flow
import type { PaymentType } from 'Models/payment/types';
import cancellationEmail from 'Services/email/cancellationEmail';
import logger from 'Config/winston';

async function sendCancellationEmail(orderId: number, userId: number, refund?: PaymentType): Promise<void> {
  try {
    const { User } = this.sequelize.models;
    const user = await User.getUser({ id: userId });
    const [order] = await this.getFullOrder(orderId);
    const { event, orderItems } = order;
    const orderItemData = orderItems || { orderItems: [] };
    const { rvs, stalls, addOns } = this.getConfirmationEmailData(orderItemData, event);
    await cancellationEmail(order, user.payload && user.payload.email, refund, { rvs, stalls, addOns });
  } catch (error) {
    logger.error(error.message);
  }
}

export default sendCancellationEmail;
