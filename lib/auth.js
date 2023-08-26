/* eslint-disable flowtype/no-weak-types */
// @flow
import { VENUE_ADMIN, RESERVATION_ADMIN, OPS, RENTER, SUPER_ADMIN, GROUP_LEADER } from 'Constants';
import type { ContextType } from '../types/context';

type NextType = (root: any, args: any, context: ContextType, info: any) => any;
type ReturnErrorOrNextType = Error | NextType;

export const isAuthenticated = (next: NextType) => (root: any, args: any, context: ContextType, info: any): ReturnErrorOrNextType => {
  if (!context.user.token) {
    throw new Error('Unauthenticated!');
  }
  return next(root, args, context, info);
};

export const validateRole = (roleIds: Array<number>) => (next: NextType) => (root: any, args: any, context: ContextType, info: any): ReturnErrorOrNextType => {
  const matchesRole = roleIds.filter(roleId => context.user.roleId === roleId)[0];
  if (!matchesRole) {
    throw new Error('User does not have permission!');
  }
  return next(root, args, context, info);
};

export const venueAdmin = (cb: any) => isAuthenticated(validateRole([VENUE_ADMIN])(cb));

export const admin = (cb: any) => isAuthenticated(validateRole([VENUE_ADMIN, RESERVATION_ADMIN])(cb));

export const ops = (cb: any) => isAuthenticated(validateRole([OPS])(cb));

export const renter = (cb: any) => isAuthenticated(validateRole([RENTER])(cb));

export const adminOrOps = (cb: any) => isAuthenticated(validateRole([VENUE_ADMIN, RESERVATION_ADMIN, OPS])(cb));

export const superAdmin = (cb: any) => isAuthenticated(validateRole([SUPER_ADMIN])(cb));

export const groupLeader = (cb: any) => isAuthenticated(validateRole([GROUP_LEADER])(cb));

export const adminAndGroupLeader = (cb: any) => isAuthenticated(validateRole([VENUE_ADMIN, RESERVATION_ADMIN, GROUP_LEADER])(cb));

export const adminOrOpsOrGroupLeader = (cb: any) => isAuthenticated(validateRole([VENUE_ADMIN, RESERVATION_ADMIN, OPS, GROUP_LEADER])(cb));

export default {
  isAuthenticated,
  validateRole,
  venueAdmin,
  admin,
  ops,
  renter,
  adminOrOps,
  superAdmin,
  groupLeader,
  adminAndGroupLeader
};
