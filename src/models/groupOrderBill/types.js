// @flow

export type GroupOrderBillType = {|
  id: number,
  orderId: number | string,
  amount: number,
  isRefund: Boolean,
  note?: string,
  adminId: number | string,
  createdAt: Date,
  updatedAt: Date
|};
