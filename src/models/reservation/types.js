// @flow
import type { StallProductType } from 'Models/stallProduct/types';
import type { RVProductType } from 'Models/rvProduct/types';

export type ReservationType = {|
  assignmentConfirmed: Date,
  createdAt: string,
  endDate: string,
  eventId: number | string,
  id: number,
  rvProduct?: RVProductType,
  stallProduct?: StallProductType,
  startDate: string,
  statusId: number | string,
  updatedAt: string,
  venue: { name: string },
  xProductId: number | string,
  xRefTypeId: number | string
|};

export type SMSByReservationsInputType = {|
  body: string,
  reservationIds: Array<number>
|};

export type SMSReturnType = {|
  error: ?string,
  success: boolean
|};
