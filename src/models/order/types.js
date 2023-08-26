// @flow
import type { OrderItemType } from 'Models/orderItem/types';
import type { EventType } from 'Models/event/types';
import type { GroupOrderType } from 'Models/groupOrder/types';
import type { GroupOrderBillType } from 'Models/groupOrderBill/types';
import type { PaymentType } from 'Models/payment/types';

export type OrderType = {|
  canceled: string,
  event: EventType,
  eventId: number | string,
  fee: number,
  id: number | string,
  notes: string,
  adminNotes: string,
  orderItems?: Array<OrderItemType>,
  payments: PaymentType[],
  successor: number,
  total: number,
  discount: number,
  userId: number | string,
  groupOrder: GroupOrderType,
  groupOrderBills: Array<GroupOrderBillType>
|};

export type RefundInputType = {|
  amount: number,
  cardBrand: string,
  cardPayment: boolean,
  last4: string,
  notes: string,
  orderId: number,
  ssChargeId: string,
  success: boolean,
  userId: string
|};

export type NoRefundInputType = {|
  notes: string,
  amount: number
|};

export type GroupOrderPaymentInputType = {|
  amount: number,
  notes: string,
  isRefund: boolean
|};

export type SMSOrderItemsInputType = {|
  body: string,
  orderIds: Array<number>
|};

export type SMSCountInputType = {|
  orderIds: Array<number>,
  reservationType: string
|};

export type SMSReturnType = {|
  error: ?string,
  success: boolean
|};

export type SMSCountType = {|
  assignmentsAlreadySent: number,
  noSpacesAssigned: number,
  ordersToBeSentAssignment: Array<number | string>,
  productTypeNotPurchased: number
|};

export type AssignmentsByOrderIdsSMSType = {|
  orderIds: [string]
|};

export type AssignmentsSMSInputType = {|
  orderIds: [string],
  reservationType: string
|};
