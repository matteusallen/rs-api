//@flow
import type { EventType } from 'Models/event/types';
import type { VenueType } from 'Models/venue/types';
import type { StallProductType } from 'Models/stallProduct/types';
import type { RVProductType } from 'Models/rvProduct/types';
import type { AddOnProductType } from 'Models/addOnProduct/types';
import type { DocumentType } from 'Models/document/types';
import type { OrderType } from 'Models/order/types';
import type { OptionsType } from 'Models/user/types';
import type { ContextType } from 'Types/context';
import { STALL_PRODUCT_X_REF_TYPE_ID, RV_PRODUCT_X_REF_TYPE_ID, RENTER } from 'Constants';
import { Event, StallProduct, RVProduct, AddOnProduct, Venue, Document, Order, ProductQuestion } from 'Models';
import { admin } from 'Lib/auth';

const getAllEvents = async (_?: string, options?: OptionsType, context: ContextType) => {
  return await Event.getEvents(options, context?.user?.roleId || RENTER);
};

const searchEventsByNameOrCity = async (_?: string, { input }: { input: { name: string, limit: number, offset?: number } }, context: ContextType) => {
  return await Event.fuzzySearchEventsByNameOrCity(input, context?.user?.roleId);
};

const searchEventsWithOrderAvailability = async (_?: string, { name, limit }: { name: string, limit?: number }, context: ContextType) => {
  return await Event.searchEventsWithOrderAvailability(name, context.venue.id, limit, context?.user?.roleId);
};

const getEventById = async (_?: string, { id }: { id: string | number }, context: ContextType) => {
  const [event] = await Event.getEventById(id, context?.user?.roleId);
  return event;
};

const getEventsByGroupId = async (_?: string, { groupId }: { groupId: number }, context: ContextType) => {
  const events = await Event.getEventsByGroupId(groupId, context?.user?.roleId);
  return events;
};

const createEvent = async (_, { input }, context: ContextType) => {
  return await Event.createEvent(input, context.venue.id, context?.user?.roleId);
};

const editEvent = async (_, { input }, context: ContextType) => {
  return await Event.editEvent(input, context?.user?.roleId);
};

const Query = {
  event: getEventById,
  events: getAllEvents,
  groupEvents: getEventsByGroupId,
  searchEvents: searchEventsByNameOrCity,
  searchEventsWithOrderCheck: searchEventsWithOrderAvailability
};

const Mutation = {
  createEvent: admin(createEvent),
  editEvent: admin(editEvent)
};

const resolvers = {
  Query,
  Mutation,
  Event: {
    async venue(parent: EventType): Promise<VenueType> {
      const [venue] = await Venue.getVenueById(parent.venueId);
      return venue;
    },
    async orders(parent: EventType, _: {}, context: ContextType): Promise<Array<OrderType>> {
      const [orders] = await Order.getOrdersByEventId(parent.id, context?.user?.roleId);
      return orders;
    },
    async stallProducts(parent: EventType, _: {}, context: ContextType): Promise<Array<StallProductType>> {
      const [stallProducts] = await StallProduct.getStallProductsByEventId(parent.id, context?.user?.roleId);
      return stallProducts;
    },
    async rvProducts(parent: EventType, _: {}, context: ContextType): Promise<Array<RVProductType>> {
      const [rvProducts] = await RVProduct.getRVProductsByEventId(parent.id, context?.user?.roleId);
      return rvProducts;
    },
    async addOnProducts(parent: EventType, _: {}, context: ContextType): Promise<Array<AddOnProductType>> {
      const [addOnProducts] = await AddOnProduct.getAddOnProductsByEventId(parent.id, context?.user?.roleId);
      return addOnProducts;
    },
    async venueAgreement(parent: EventType, _: {}, context: ContextType): Promise<DocumentType> {
      const [venueAgreement] = await Document.getDocuments({ id: parent.venueAgreementDocumentId }, context?.user?.roleId);
      return venueAgreement[0];
    },
    async venueMap(parent: EventType, _: {}, context: ContextType): Promise<DocumentType | null> {
      if (!parent.venueMapDocumentId) return null;
      const [venueMap] = await Document.getDocuments({ id: parent.venueMapDocumentId }, context?.user?.roleId);
      return venueMap[0];
    },
    async rvSoldOut(parent: RVProductType, _: {}, context: ContextType): Promise<boolean> {
      const [soldOut] = await Event.isProductSoldOut({ eventId: parent.id, productType: 'rvProduct' }, context?.user?.roleId || RENTER);
      return soldOut;
    },
    async rvQuestions(parent: EventType): Promise<Array<AddOnProductType>> {
      const rvQuestions = await ProductQuestion.getProductQuestionsByEventId({ eventId: parent.id, productXRefType: RV_PRODUCT_X_REF_TYPE_ID });
      return rvQuestions;
    },
    async stallSoldOut(parent: RVProductType, _: {}, context: ContextType): Promise<boolean> {
      const [soldOut] = await Event.isProductSoldOut({ eventId: parent.id, productType: 'stallProduct' }, context?.user?.roleId || RENTER);
      return soldOut;
    },
    async stallQuestions(parent: EventType): Promise<Array<AddOnProductType>> {
      const stallQuestions = await ProductQuestion.getProductQuestionsByEventId({ eventId: parent.id, productXRefType: STALL_PRODUCT_X_REF_TYPE_ID });
      return stallQuestions;
    },
    async hasOrder(parent: RVProductType): Promise<boolean> {
      return await Event.doesEventHaveOrder(parent.id);
    },
    async hasStallRes(parent: StallProductType): Promise<boolean> {
      return await Event.doesEventHaveStallRes(parent.id);
    },
    async hasRVRes(parent: RVProductType): Promise<boolean> {
      return await Event.doesEventHaveRVRes(parent.id);
    }
  },
  EventSearch: {
    async stallProducts(parent: EventType): Promise<Array<StallProductType>> {
      const [stallProducts] = await StallProduct.getStallProductsByEventId(parent.id);
      return stallProducts;
    },
    async rvProducts(parent: EventType): Promise<Array<RVProductType>> {
      const [rvProducts] = await RVProduct.getRVProductsByEventId(parent.id);
      return rvProducts;
    },
    async rvSoldOut(parent: RVProductType, _: {}, context: ContextType): Promise<boolean> {
      const [soldOut] = await Event.isProductSoldOut({ eventId: parent.id, productType: 'rvProduct' }, context?.user?.roleId || RENTER);
      return soldOut;
    },
    async stallSoldOut(parent: RVProductType, _: {}, context: ContextType): Promise<boolean> {
      const [soldOut] = await Event.isProductSoldOut({ eventId: parent.id, productType: 'stallProduct' }, context?.user?.roleId || RENTER);
      return soldOut;
    }
  }
};

export default resolvers;
