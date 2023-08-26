// @flow
import type { GroupType } from 'Models/group/types';
import { Group, GroupOrder } from 'Models';

async function getGroupByOrderId(orderId: number | string): Promise<GroupType | null> {
  const groupOrder = await GroupOrder.findOne({ where: { orderId } });

  if (!groupOrder) return null;

  const group = await Group.findOne({
    where: {
      id: groupOrder.groupId
    }
  });

  group.last4 = groupOrder.last4;
  return group;
}

export default getGroupByOrderId;
