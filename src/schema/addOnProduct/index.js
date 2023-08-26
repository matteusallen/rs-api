// @flow
import type { EventType } from 'Models/event/types';
import type { AddOnProductType } from 'Models/addOnProduct/types';
import type { AddOnType } from 'Models/addOn/types';
import type { ContextType } from 'Types/context';
import { Event, AddOn, AddOnProduct } from 'Models';

const resolvers = {
  AddOnProduct: {
    async event(parent: AddOnProductType, _: {}, context: ContextType): Promise<EventType> {
      const [event] = await Event.getEventById(parent.eventId, context?.user?.roleId);
      return event;
    },
    async addOn(parent: AddOnProductType, _: {}, context: ContextType): Promise<AddOnType> {
      const [addOn] = await AddOn.getAddOnById(parent.addOnId, context?.user?.roleId);
      return addOn;
    },
    async booked(parent: AddOnProductType, _: {}, context: ContextType) {
      return await AddOnProduct.booked(parent.id, parent.eventId, context?.user?.roleId);
    }
  }
};

export default resolvers;
