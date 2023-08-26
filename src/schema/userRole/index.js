// @flow
import type { UserRoleType } from 'Models/userRole/types';
import { UserRole } from 'Models';

const getUserRoles = async (): Promise<Array<UserRoleType>> => {
  return await UserRole.findAll();
};

const Query = {
  userRoles: getUserRoles
};

const resolvers = {
  Query,
  // $FlowIgnore
  UserRole: {}
};

export default resolvers;
