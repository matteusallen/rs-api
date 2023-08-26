// @flow
import type { OrderItemType } from '../types';

async function getOrderItemProductsByOrderId(orderId: number): Promise<[OrderItemType]> {
  const orderItems = await this.findAll({
    where: { orderId },
    include: [
      {
        association: 'reservation',
        attributes: ['id', 'xProductId', 'xRefTypeId']
      }
    ],
    attributes: ['id', 'xProductId', 'xRefTypeId']
  });

  return orderItems;
}

export default getOrderItemProductsByOrderId;
