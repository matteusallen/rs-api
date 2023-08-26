// @flow
import type { ReservationType } from '../types';
import { productXRefTypeHelper } from 'Utils';

/**
 * If no productTypeFilter (second param) provided, all reservations will be returned.
 * If filter is provided, extra associations are added to the query
 * @param orderId
 * @param productTypeFilter - (optional) - Either 'RVProduct' or 'StallProduct' from ProductXRefType.
 * Anything other values are ignored
 * @returns Reservation associated with an Order id
 * */
async function getReservationsByOrderId(orderId: number, productTypeFilter?: 'StallProduct' | 'RVProduct'): Promise<[?Array<ReservationType>, string | void]> {
  try {
    const { StallProduct, RVProduct, Order } = this.sequelize.models;

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          association: 'orderItems',
          include: [{ association: 'reservation', include: [{ association: 'reservationSpaces' }] }]
        },
        { association: 'event', include: [{ association: 'venue' }] }
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

    const event = order.event;
    const venue = event.venue;

    const reservations = await Promise.all(
      order.orderItems
        .reduce((sum, orderItem) => {
          if (orderItem && orderItem.xRefTypeId === 4) {
            // If productTypeFilter supplied, apply it now.
            if (!!productTypeFilter && orderItem.reservation) {
              const { xRefTypeId } = orderItem.reservation;
              const key = productXRefTypeHelper.ProductXRefTypeMap[xRefTypeId];
              const include = key === productTypeFilter;
              if (include) {
                return [...sum, orderItem];
              }
              return sum;
            }
            // Otherwise, return all reservations if no filter specified
            return [...sum, orderItem];
          }
          return sum;
        }, [])
        .map(async orderItem => {
          if (!orderItem.reservation) return null;
          const { xRefTypeId } = orderItem.reservation;
          const model = models[xRefTypeId];
          let include = [];
          if (model) {
            // Apply include by specific product type requested
            const key = productXRefTypeHelper.ProductXRefTypeMap[xRefTypeId];
            const space = key === productXRefTypeHelper.ProductXRefTypes.RV_PRODUCT ? 'rvSpot' : 'stall';
            const container = key === productXRefTypeHelper.ProductXRefTypes.RV_PRODUCT ? 'rvLot' : 'building';
            include = [
              {
                association: 'reservationSpaces',
                include: [{ association: space, include: [{ association: container }] }]
              }
            ];

            const assignmentInfo = await this.findOne({ where: { id: orderItem.reservation.id }, include });
            const reservation = { ...orderItem.reservation.dataValues };
            reservation['assignmentInfo'] = assignmentInfo;
            reservation.venue = venue;
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

export default getReservationsByOrderId;
