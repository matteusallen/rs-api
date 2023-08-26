// @flow
import type { GroupOrderType } from '../types';
import { GroupOrder, Group } from 'Models';

async function createGroupOrder(input: GroupOrderType, transaction: {}): Promise<void> {
  const { groupId, groupCode } = input;
  const group = await Group.findOne({ where: { id: groupId, allowDeferred: true } });
  if (!group) throw Error('Either group does not exist or is not accepting deferred payment.');

  if (groupCode && group.code !== String(groupCode).trim().toUpperCase()) throw Error('Invalid group code');

  await GroupOrder.create(input, { transaction });
}

export default createGroupOrder;
