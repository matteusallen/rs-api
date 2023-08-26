// @flow
import type { GroupType } from '../types';
import { GroupOrder } from 'Models';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getGroupById(id: string | number, roleId: number): Promise<GroupType | void> {
  validateAction(MENU.GROUPS, ACTIONS[MENU.GROUPS].GET_GROUP_BY_ID, roleId);
  const group = await this.findOne({ where: { id, deletedAt: null } });
  const groupOrders = await GroupOrder.getOrdersByGroupId(id, roleId);

  const activeGroupOrders = groupOrders.filter(groupOrder => groupOrder.deletedAt === null);

  group.orders = activeGroupOrders;
  return group;
}

export default getGroupById;
