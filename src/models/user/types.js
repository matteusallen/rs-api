// @flow
export type UserOrderByType =
  | 'firstName_ASC'
  | 'firstName_DESC'
  | 'lastName_ASC'
  | 'lastName_DESC'
  | 'email_ASC'
  | 'email_DESC'
  | 'createdAt_DESC'
  | 'createdAt_ASC';

export type LoginInputType = {|
  email: string,
  password: string
|};

export type ForgotPasswordInputType = {|
  email: string
|};

export type ResetPasswordInputType = {|
  password: string,
  resetPasswordToken: string
|};

export type AuthPayloadType = {|
  authorized: boolean,
  error?: string,
  token?: string
|};

export type LoginPayloadType = {|
  auth: AuthPayloadType,
  user: ?UserType
|};

export type UpsertUserReturnType = {|
  error?: string,
  ssGlobalId?: string,
  success: boolean,
  userId?: number | string
|};

export type UpsertUserInputType = {|
  city?: string,
  email: string,
  firstName: string,
  id?: number,
  lastName: string,
  password?: string,
  phone: string,
  roleId?: number,
  ssGlobalId?: string,
  state?: string,
  street?: string,
  street2?: string,
  venueId?: string,
  zip?: string
|};

export type UserType = {|
  city: string,
  email: string,
  firstName: string,
  id: number | string,
  lastName: string,
  phone: string,
  resetPasswordToken: string,
  resetPasswordTokenExpirationDate: Date | number,
  roleId: number,
  ssGlobalId: string,
  state: string,
  street: string,
  street2: string,
  zip: string,
  venueId?: string,
  unallowedActions: {}
|};

export type UserQueryType = {|
  email?: string,
  id?: number,
  token?: string,
  venueId?: string
|};

export type SSUserInputType = {|
  email?: string,
  phone?: string,
  firstName?: string,
  fullName?: string,
  globalId?: string,
  lastName?: string
|};

export type SSUserReturnType = {|
  error: ?string,
  user: ?UserType
|};

export type ResetPasswordReturnType = {|
  error: ?string,
  success: boolean
|};

type FilterKeyType = 'firstName' | 'lastName' | 'email' | 'fullName' | 'role';

export type OptionsType = {|
  filterBy?: {
    id?: Array<number>,
    [key: FilterKeyType]: string,
    roleId?: Array<string | number>
  },
  limit?: number,
  offset?: number,
  orderBy?: string
|};

export type ResetPasswordTokenExpiredType = {|
  error: ?string,
  expired: boolean
|};

export type CreatePasswordInputType = {|
  password: string,
  token: string
|};

export type CreatePasswordParamType = {|
  input: CreatePasswordInputType
|};

export type CreatePasswordReturnType = {|
  error: ?string,
  success: boolean
|};
