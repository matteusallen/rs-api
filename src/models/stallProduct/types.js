// @flow
import type { StallType } from 'Models/stall/types';
import type { ProductQuestionType } from 'Models/productQuestion/types';

export type StallProductType = {|
  createdAt: Date,
  description: string,
  endDate: Date,
  eventId: string | number,
  id: string | number,
  name: string,
  price: number,
  stalls: Array<StallType>,
  startDate: Date,
  updatedAt: Date
|};

export type StallProductInputType = {|
  description: string,
  endDate: Date,
  eventId: string | number,
  id?: string | number,
  name: string,
  price: number,
  stalls: Array<number>,
  startDate: Date,
  questions?: [ProductQuestionType],
  minNights?: number
|};
