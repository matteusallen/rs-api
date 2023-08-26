// @flow
import type { VenueType } from 'Models/venue/types';
import type { RVProductType, RVProductInputType } from 'Models/rvProduct/types';
import type { StallProductType, StallProductInputType } from 'Models/stallProduct/types';
import type { AddOnProductInputType } from 'Models/addOnProduct/types';
import type { DocumentType } from 'Models/document/types';

export type EventOrderSearchType = {|
  startDate: string,
  endDate: string,
  id?: number,
  name: string,
  hasOrder: boolean,
  hasStallRes: boolean,
  hasRVRes: boolean
|};

export type EventSearchType = {|
  startDate: string,
  endDate: string,
  closeDate: string,
  openDate: string,
  id?: number,
  name: string,
  city: string,
  state: string,
  phone: string,
  venueId?: number
|};

export type EventType = {|
  assignedStalls: Array<{|
    objectId: string,
    omittedStallIds: Array<number>
  |}>,
  checkInTime: string,
  checkOutTime: string,
  closeDate: Date,
  openDate: Date,
  createdAt: string,
  description: string,
  endDate: string,
  id?: number,
  name: string,
  rvProducts?: Array<RVProductType>,
  stallProducts?: Array<StallProductType>,
  startDate: string,
  updatedAt: string,
  venue: VenueType,
  venueMapDocument?: DocumentType,
  venueMapDocumentId?: string | number,
  venueAgreementDocument: DocumentType,
  venueAgreementDocumentId: string | number,
  venueId?: number,
  stallFlip?: boolean,
  rvFlip?: boolean,
  renterGroupCodeMode: string
|};

export type ProductSelloutInputType = {|
  eventId: string | number,
  productType: string
|};

export type EventUpsertType = {|
  error: ?string,
  event: ?EventType,
  success: boolean
|};

export type EventInputType = {|
  addOnProducts: [AddOnProductInputType],
  checkInTime: string,
  checkOutTime: string,
  closeDate: string,
  endDate: string,
  id?: string | number,
  name: string,
  openDate: string,
  rvProducts: [RVProductInputType],
  stallProducts: [StallProductInputType],
  startDate: string,
  venueMapDocumentId?: string | number,
  venueAgreementDocumentId: string | number,
  stallFlip?: boolean,
  rvFlip?: boolean,
  renterGroupCodeMode: string,
  description: string
|};

export type EventAndProductsInfoInputType = {|
  description: string,
  id: string | number,
  name: string
|};
