// @flow
import type { EventType } from 'Models/event/types';
import type { StallProductType } from 'Models/stallProduct/types';
import type { StallType } from 'Models/stall/types';
import type { ProductAvailabilityInputType, ProductAvailabilityType, SpaceAvailabilityInputType, SpaceAvailabilityReturnType } from 'Models/venue/types';
import type { ContextType } from 'Types/context';
import { isAuthenticated } from 'Lib/auth';
import { Event, Stall, StallProduct } from 'Models';

const getStallProductAvailability = async (
  _: {},
  { input }: { input: ProductAvailabilityInputType },
  context: ContextType
): Promise<Array<ProductAvailabilityType>> => {
  const [availableStalls] = await StallProduct.getAvailability(input, context?.user?.roleId);
  return availableStalls;
};

const getStallAvailability = async (
  _: {},
  { input }: { input: SpaceAvailabilityInputType },
  context
): Promise<{ availability: SpaceAvailabilityReturnType }> => {
  const [availability] = await StallProduct.getAvailableSpaces(input, context?.user?.roleId);
  return availability;
};

const Query = {
  stallProductAvailability: isAuthenticated(getStallProductAvailability),
  stallAvailability: isAuthenticated(getStallAvailability)
};

const resolvers = {
  Query,
  StallProduct: {
    async event(parent: StallProductType, _: {}, context: ContextType): Promise<EventType> {
      const [event] = await Event.getEventById(parent.eventId, context?.user?.roleId);
      return event;
    },
    async stalls(parent: StallProductType, _: {}, context: ContextType): Promise<Array<StallType>> {
      const [stalls] = await Stall.getStallsByStallProductId(parent.id, context?.user?.roleId);
      return stalls;
    },
    async booked(parent: StallProductType, _: {}, context: ContextType): Promise<Boolean> {
      const [booked] = await StallProduct.booked(parent.id, context?.user?.roleId);
      return booked;
    }
  }
};

export default resolvers;
