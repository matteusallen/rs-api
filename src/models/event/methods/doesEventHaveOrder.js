// @flow
import { Order } from 'Models';

async function doesEventHaveOrder(eventId: number): Promise<boolean> {
  const order = await Order.findAll({ where: { eventId, canceled: null }, limit: 1 });
  return order && order.length;
}

export default doesEventHaveOrder;
