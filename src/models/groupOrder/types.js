// @flow

export type GroupOrderType = {|
  id: number,
  groupId: number | string,
  groupCode: string,
  last4: string,
  orderId: number | string,
  createdAt: Date,
  updatedAt: Date
|};
