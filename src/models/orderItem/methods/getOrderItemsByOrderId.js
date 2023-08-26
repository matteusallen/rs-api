// @flow
import type { OrderItemType } from '../types';

async function getOrderItemsByOrderId(orderId: number | string): Promise<[?Array<OrderItemType>, ?string]> {
  const orderItems = await this.findAll({ where: { orderId } });
  return [orderItems, undefined];
}

export default getOrderItemsByOrderId;
