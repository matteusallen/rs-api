// @flow

import { GroupOrder, Order } from 'Models';
import { Op } from 'sequelize';
import logger from 'Config/winston';
import type { EventType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getEventsByGroupId(groupId: number, roleId: number): Promise<[EventType]> {
  validateAction(MENU.EVENTS, ACTIONS[MENU.EVENTS].GET_EVENTS_BY_GROUP_ID, roleId);
  try {
    const groupOrders = await GroupOrder.findAll({ where: { groupId, deletedAt: null }, attributes: ['orderId'] });
    const orderIds = groupOrders.map(groupOrder => groupOrder.orderId);
    const orders = await Order.findAll({ where: { id: { [Op.in]: orderIds } } });
    const eventIdsObj = {};
    orders.forEach(order => {
      eventIdsObj[order.eventId] = true;
    });
    const eventIds = Object.keys(eventIdsObj);
    const events = await this.findAll({ where: { id: { [Op.in]: eventIds } }, attributes: ['id', 'name', 'startDate', 'endDate'] });
    return events;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
}

export default getEventsByGroupId;
