// @flow
import type { ProductQuestionAnswerInput } from 'Models/productQuestionAnswer/types';

export type OrderItemType = {|
  id: number | string,
  orderId: number | string,
  price: number,
  quantity: number,
  xProductId: number | string,
  xRefTypeId: number | string
|};

export type OrderItemInputType = {|
  id?: number | string,
  assignments?: Array<number | string>,
  endDate?: Date,
  orderId: number | string,
  price: number,
  quantity: number,
  startDate?: Date,
  statusId?: number | string,
  xProductId: number | string,
  xRefTypeId: number | string,
  productQuestionAnswers?: Array<ProductQuestionAnswerInput>
|};

export type OrderItemUpdateType = {|
  id: number | string,
  quantity: number | string
|};

export type OrderUpdateInputType = {|
  addOns?: Array<OrderItemUpdateType>,
  rvs?: Array<OrderItemUpdateType>,
  stalls?: Array<OrderItemUpdateType>
|};

type OrderUpdateDeltaType = {|
  id: number | string,
  name?: number | string,
  newPrice: number,
  originalPrice: number,
  priceDelta: number,
  quantityDelta: number,
  stripeFee?: number,
  unitName?: string
|};

export type OrderUpdateDifferencesType = {|
  addOns?: Array<OrderUpdateDeltaType>,
  error?: string,
  rvs?: Array<OrderUpdateDeltaType>,
  stalls?: Array<OrderUpdateDeltaType>,
  transactionFee?: number | string
|};
