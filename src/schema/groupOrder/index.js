// @flow
import { GroupOrder } from 'Models';
import { admin } from 'Lib/auth';
import type { ContextType } from 'Types/context';

const getOrdersByGroupId = async (_?: string, { groupId }: { groupId: string | number }, context: ContextType) => {
  const groupOrders = await GroupOrder.getOrdersByGroupId(groupId, context?.user?.roleId);
  return groupOrders;
};

const Query = {
  // $FlowIgnore
  getOrdersByGroupId: admin(getOrdersByGroupId)
};

const resolvers = {
  Query
};

export default resolvers;
