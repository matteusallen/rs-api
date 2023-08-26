// @flow
import type { EventOrderSearchType } from '../types';
import logger from 'Config/winston';
import { Order, Reservation } from 'Models';
import { STALL_PRODUCT_X_REF_TYPE_ID, RV_PRODUCT_X_REF_TYPE_ID } from 'Constants';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function searchEventsWithOrderAvailability(name: string, venueId: number, limit?: number, roleId: number): Promise<[EventOrderSearchType]> {
  validateAction(MENU.EVENTS, ACTIONS[MENU.EVENTS].SEARCH_EVENTS_WITH_ORDER_AVAILABILITY, roleId);
  try {
    const eventsWithOrderAvailability: any = [];
    const events = await this.fuzzySearchEventsByNameOrCity({ name, venueId, searchAll: true, limit }, roleId);
    for (const event of events) {
      let hasStallRes = false;
      let hasRVRes = false;
      const orders = await Order.findAll({
        where: { eventId: event.id, canceled: null },
        attributes: ['id', 'createdAt'],
        include: [
          {
            association: 'orderItems',
            attributes: ['id', 'xProductId', 'quantity'],
            include: []
          }
        ]
      });

      for (const order of orders) {
        if (!hasStallRes || !hasRVRes) {
          for (const orderItem of order.orderItems) {
            if (orderItem.addOnProduct && orderItem.quantity > 0) {
              hasStallRes = true;
              break;
            }
            const reservation = await Reservation.findOne({
              where: { id: orderItem.xProductId },
              include: []
            });
            if (reservation?.xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID) hasStallRes = true;
            else if (reservation?.xRefTypeId === RV_PRODUCT_X_REF_TYPE_ID) hasRVRes = true;
          }
        }
      }

      const { id, startDate, endDate, name } = event;
      eventsWithOrderAvailability.push({ id, startDate, endDate, name, hasStallRes, hasRVRes });
    }

    return eventsWithOrderAvailability;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
}

export default searchEventsWithOrderAvailability;
