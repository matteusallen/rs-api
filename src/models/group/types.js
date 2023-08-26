// @flow

export type GroupType = {|
  id: number,
  name: string,
  last4: string,
  contactName: string,
  email: string,
  phone: string,
  groupLeaderId: number
|};

export type ValidateGroupCodeType = {|
  code: string
|};

export type GroupByUniqueTextType = {|
  name: string,
  venueId: number
|};
