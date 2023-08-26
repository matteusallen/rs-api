// @flow
import type { GroupOrderType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getOrdersByGroupId(groupId: number | string, roleId: number): Promise<[GroupOrderType]> {
  validateAction(MENU.GROUP_ORDERS, ACTIONS[MENU.GROUP_ORDERS].GET_ORDERS_BY_GROUP_ID, roleId);
  const groupOrders = await this.findAll({ where: { groupId } });
  return groupOrders;
}

export default getOrdersByGroupId;
