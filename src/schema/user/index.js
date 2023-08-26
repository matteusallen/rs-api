// @flow
import type { UserType, UserQueryType, CreatePasswordParamType, CreatePasswordReturnType } from 'Models/user/types';
import { User, UserRole, Venue, Order } from 'Models';
import { admin, adminAndGroupLeader } from 'Lib/auth';
import { unallowedActionsByroles } from 'Constants';
import type { ContextType } from 'Types/context';

const getUser = async (_: {}, query: UserQueryType): Promise<UserType> => {
  const user = await User.getUser(query);

  if (user?.payload) {
    user.payload.unallowedActions = unallowedActionsByroles[`${user.payload.roleId}`];
  }

  return user;
};

const getUsers = async (_: {}, options, context: ContextType): Promise<Array<UserType>> => {
  const [users] = await User.getUsers(options, context?.user?.roleId);
  return users;
};

const getGroupLeaders = async (_?: boolean, __?: any, context: ContextType): Promise<Array<UserType>> => {
  const [users] = await User.getGroupLeaders(context.venue.id, context?.user?.roleId);

  return users;
};

const checkResetPasswordTokenExpired = (_: {}, query: { token: string }) => User.checkResetPasswordTokenExpired(query.token);

const logIn = async (_: {}, { input }: { input: {} }) => {
  return await User.logIn(input);
};

const logOut = (_: {}, { input }: { input: {} }) => User.logOut(input).then(res => res);

const register = (_: {}, { input }: { input: {} }) => User.register(input);

const forgotPassword = (_: {}, { input }: { input: {} }) => User.forgotPassword(input);

const resetPassword = (_: {}, { input }: { input: {} }) => User.resetPassword(input);

const upsertUser = async (_: {}, { input }: { input: {} }, context: ContextType) => {
  const [user, error] = await User.upsertUser(input, null, context?.user?.roleId);
  if (error) return { success: false, error };
  return {
    success: true,
    ssGlobalId: user.ssGlobalId,
    id: user.id
  };
};

const createPassword = async (_: void, { input }: CreatePasswordParamType): Promise<CreatePasswordReturnType> => {
  const [, error] = await User.createPassword(input);
  return error ? { success: false, error } : { success: true, error: null };
};

export const getFullName = (parent: UserType): string => {
  const { firstName, lastName } = parent;
  if (!firstName || !lastName) return '';
  return `${firstName} ${lastName}`;
};

const Query = {
  user: getUser,
  users: adminAndGroupLeader(getUsers),
  groupLeaders: adminAndGroupLeader(getGroupLeaders),
  checkResetPasswordTokenExpired: checkResetPasswordTokenExpired
};

const Mutation = {
  logIn,
  logOut,
  register,
  forgotPassword,
  resetPassword,
  upsertUser: admin(upsertUser),
  createPassword
};

const resolvers = {
  Query,
  Mutation,
  User: {
    fullName: getFullName,
    venues(parent: UserType): {} {
      return Venue.getVenuesByUserId(parent.id);
    },
    async savedCreditCards(parent: UserType, _: {}, context: ContextType): {} {
      const venue = parent.venueId || context.venue.id ? await Venue.getVenueById(parent.venueId || context.venue.id) : [];
      return User.getUserCreditCards(parent.ssGlobalId, venue, context?.user?.roleId);
    },
    async orders(parent: UserType): {} {
      return await Order.getOrdersByUserId(parent.id, parent.roleId);
    },
    async role(parent: UserType): {} {
      return await UserRole.getUserRoleById(parent.roleId);
    }
  }
};

export default resolvers;
