// @flow
import { Group } from 'Models';
import { admin, groupLeader, adminAndGroupLeader } from 'Lib/auth';
import type { ContextType } from 'Types/context';
import type { ValidateGroupCodeType, GroupByUniqueTextType } from 'Models/group/types';

const getGroups = async (_?: boolean, { allowDeferred }: { allowDeferred: boolean }, context: ContextType) => {
  return await Group.getGroups(context.venue.id, allowDeferred, context?.user?.roleId);
};

const getGroupsByLeaderId = async (_?: boolean, { allowDeferred, groupLeaderId }: { allowDeferred: boolean, groupLeaderId: string }, context: ContextType) => {
  return await Group.getGroupsByLeaderId(context.venue.id, allowDeferred, groupLeaderId, context?.user?.roleId);
};

const getGroupById = async (_?: string, { id }: { id: string | number }, context: ContextType) => {
  return await Group.getGroupById(id, context?.user?.roleId);
};

const getGroupByUniqueText = async (_?: {}, { input }: { input: GroupByUniqueTextType }) => {
  return await Group.getGroupByUniqueText(input);
};

const createGroup = async (_, { input }, context: ContextType) => {
  return await Group.createGroup(input, context.venue.id, context?.user?.roleId);
};

const updateGroup = async (_, { input }, context: ContextType) => {
  return await Group.updateGroup(input, context?.user?.roleId);
};

const deleteGroup = async (_?: string, { id }: { id: string | number }, context: ContextType) => {
  return await Group.deleteGroup(id, context?.user?.roleId);
};

const refreshCode = async (_, { id }: { id: string | number }, context: ContextType) => {
  return await Group.refreshCode(id, context.venue.id, context?.user?.roleId);
};

const validateCode = async (_?: {}, { input }: { input: ValidateGroupCodeType }) => {
  return await Group.validateCode(input);
};

const Query = {
  // $FlowIgnore
  group: getGroupById,
  groups: adminAndGroupLeader(getGroups),
  groupLeaderGroups: groupLeader(getGroupsByLeaderId)
};

const Mutation = {
  createGroup: admin(createGroup),
  deleteGroup: admin(deleteGroup),
  updateGroup: admin(updateGroup),
  refreshCode: admin(refreshCode),
  validateCode: validateCode,
  groupUniqueText: getGroupByUniqueText
};

const resolvers = {
  Query,
  Mutation
};

export default resolvers;
