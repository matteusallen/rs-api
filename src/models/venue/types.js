// @flow
import type { UserOrderByType, UserType } from 'Models/user/types';
import type { BuildingType } from 'Models/building/types';
import type { RVLotType } from 'Models/rvLot/types';
import type { StallType } from 'Models/stall/types';
import type { RVSpotType } from 'Models/rvSpot/types';
import type { AddOnType } from 'Models/addOn/types';

export type VenueType = {|
  addOns: [AddOnType],
  buildings: [BuildingType],
  city: string,
  createdAt: string,
  events: [Event],
  id: number,
  name: string,
  phone: string,
  state: string,
  street: string,
  street2: string,
  timeZone: string,
  updatedAt: string,
  users(orderBy: UserOrderByType): [UserType],
  zip: string,
  description: string
|};

export type VenueUpsertType = {|
  error: ?string,
  success: boolean,
  venue: ?VenueType
|};

export type ProductAvailabilityInputType = {|
  endDate: string,
  eventId?: number,
  venueId?: number,
  startDate: string,
  xRefTypeId?: number,
  reservationId?: number,
  includeCurrentReservation?: boolean
|};

export type ProductAvailabilityType = {|
  available: number,
  productId: number | string
|};

export type SpaceAvailabilityType = {|
  availableSpaces: [StallType] | [RVSpotType],
  building?: BuildingType,
  rvLot?: RVLotType
|};

export type SpaceAvailabilityInputType = {|
  endDate: string,
  productId: number | string,
  reservationId: number | string,
  startDate: string,
  xRefTypeId?: number,
  includeCurrentReservation: number
|};

export type SpaceAvailabilityReturnType = Promise<[Array<SpaceAvailabilityType> | void, string | void]>;
