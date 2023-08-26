// @flow

export type PaymentType = {|
  adminId: number | string,
  amount: number,
  cardBrand: ?string,
  cardPayment: boolean,
  createdAt: Date,
  id: number | string,
  last4: ?string,
  notes: string,
  orderId: ?number,
  serviceFee: number,
  stripeFee: number,
  reservationId: number | string,
  ssChargeId: ?string,
  ssRefundId: ?string,
  success: boolean
|};

export type PaymentUpsertInputType = {|
  adminId?: number,
  amount: number,
  cardBrand?: string,
  cardPayment: boolean,
  createdAt: string,
  id: number,
  last4?: string,
  notes?: string,
  reservationId: number,
  ssChargeId?: number,
  serviceFee?: number,
  stripeFee: number,
  ssRefundId?: number,
  success: boolean,
  updatedAt: string,
  stripeAccountType: string
|};

export type TransactionReportInputType = {|
  users: Array<string | number>,
  stripeAccountType: string | number,
  adminId: Array<string | number>,
  venueTimeZone: string,
  venueId?: string | number,
  userId: string | number,
  eventIds?: Array<string | number>,
  end?: Date,
  start?: Date
|};

export type ReconciliationReportInputType = {|
  adminIds: Array<string | number>,
  eventIds: Array<string | number>,
  venueId: string | number,
  userId: string | number,
  venueTimeZone: string,
  end: Date,
  start: Date
|};
