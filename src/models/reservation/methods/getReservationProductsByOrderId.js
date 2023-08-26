// @flow
import type { ReservationType } from '../types';
import { productXRefTypeHelper } from 'Utils';

/**
 * Gets product info for each reservation in an order
 * @param orderId
 * @returns Reservation associated with an Order id
 * */
async function getReservationProductsByOrderId(orderId: number): Promise<[?Array<ReservationType>, string | void]> {
  try {
    const { StallProduct, RVProduct, Order } = this.sequelize.models;

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          association: 'orderItems',
          include: [{ association: 'reservation' }]
        }
      ]
    });

    if (!order) {
      // No order found
      return [[], undefined];
    }

    const models = {
      // $FlowIgnore
      1: StallProduct,
      // $FlowIgnore
      3: RVProduct
    };

    const reservations = await Promise.all(
      order.orderItems
        .reduce((sum, orderItem) => {
          if (orderItem && orderItem.xRefTypeId === 4) {
            return [...sum, orderItem];
          }
          return sum;
        }, [])
        .map(async orderItem => {
          if (!orderItem.reservation) return null;
          const { xRefTypeId } = orderItem.reservation;
          const model = models[xRefTypeId];

          if (model) {
            // Apply include by specific product type requested
            const key = productXRefTypeHelper.ProductXRefTypeMap[xRefTypeId];
            const reservation = { ...orderItem.reservation.dataValues };

            if (key === productXRefTypeHelper.ProductXRefTypes.RV_PRODUCT) {
              const rvInfo = await model.findOne({ where: { id: reservation.xProductId } });
              reservation['rvInfo'] = rvInfo;
            } else {
              const stallInfo = await model.findOne({ where: { id: reservation.xProductId } });
              reservation['stallInfo'] = stallInfo;
            }
            return reservation;
          }
        })
    );
    const reservationsForOrderId = reservations.filter(reservation => {
      return !!reservation;
    });
    return [reservationsForOrderId, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getReservationProductsByOrderId;
