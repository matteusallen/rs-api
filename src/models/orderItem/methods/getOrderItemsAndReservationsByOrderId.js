// @flow
import type { OrderItemType } from '../types';

import { productXRefTypeHelper } from 'Utils';

/**
 * Return OrderItems AND their associated reservations and spaces
 * @param orderId
 * @param productTypeFilter (optional) - Either stall or rv product
 */
async function getOrderItemsAndReservationsByOrderId(
  orderId: number | string,
  productTypeFilter?: 'StallProduct' | 'RVProduct'
): Promise<[?Array<OrderItemType>, ?string]> {
  const orderItems = await this.findAll({
    where: { orderId },
    include: [
      {
        association: 'reservation',
        include: [{ association: 'reservationSpaces' }]
      }
    ]
  });

  if (!orderItems) {
    return [[], undefined];
  }

  if (productTypeFilter) {
    const orderIdsFilteredByProductType = await Promise.all(
      orderItems.reduce((sum, orderItem) => {
        if (orderItem) {
          const { xRefTypeId } = orderItem.reservation;
          const key = productXRefTypeHelper.ProductXRefTypeMap[xRefTypeId];
          const include = key === productTypeFilter;
          if (include) {
            return [...sum, orderItem];
          }
          return sum;
        }
        return sum;
      }, [])
    );
    return [orderIdsFilteredByProductType, undefined];
  }
  // No type specified - return all items
  return [orderItems, undefined];
}

export default getOrderItemsAndReservationsByOrderId;
