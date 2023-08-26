// @flow
import type { ProductQuestionType } from 'Models/productQuestion/types';

export type RVProductType = {|
  createdAt: Date,
  endDate: Date,
  eventId: string | number,
  id: string | number,
  price: number,
  startDate: Date,
  updatedAt: Date
|};

export type RVProductInputType = {|
  endDate: Date,
  eventId: string | number,
  id?: string | number,
  price: number,
  rvSpots: [number],
  startDate: Date,
  questions?: [ProductQuestionType],
  minNights?: number
|};

export type RVProductAvailabilityInputType = {|
  endDate: string,
  eventId: number,
  startDate: string,
  includeCurrentReservation?: boolean
|};
