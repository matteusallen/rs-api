// @flow

export type RecordActivitiesType = {|
  orderId: number | string,
  adminId: number,
  orderItemId?: number | string,
  paymentIds?: [number],
  changeType: string,
  oldValue: string,
  newValue: string,
  isGroupOrder: boolean,
  noRefundReason?: string
|};

export type RecordActivityType = {|
  orderId: number | string,
  adminId: number,
  orderItemId?: number | string,
  paymentId?: number,
  changeType: string,
  oldValue: string,
  newValue: string,
  isGroupOrder: boolean,
  noRefundReason?: string
|};
