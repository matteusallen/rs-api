// @flow
import type { EventType } from 'Models/event/types';
import type { RVProductType, RVProductAvailabilityInputType } from 'Models/rvProduct/types';
import type { RVLotType } from 'Models/rvLot/types';
import type { RVSpotType } from 'Models/rvSpot/types';
import type { ProductAvailabilityType, SpaceAvailabilityInputType, SpaceAvailabilityReturnType } from 'Models/venue/types';
import type { ContextType } from 'Types/context';
import { isAuthenticated } from 'Lib/auth';
import { Event, RVSpot, RVProduct, RVLot } from 'Models';

const getRVProductAvailability = async (
  _: {},
  { input }: { input: RVProductAvailabilityInputType },
  context: ContextType
): Promise<Array<ProductAvailabilityType>> => {
  const [availableRVProducts] = await RVProduct.getAvailability(input, context?.user?.roleId);
  return availableRVProducts;
};

const getRVSpotAvailability = async (
  _: {},
  { input }: { input: SpaceAvailabilityInputType },
  context
): Promise<{ availability: SpaceAvailabilityReturnType }> => {
  const [availability] = await RVProduct.getAvailableSpaces(input, context?.user?.roleId);
  return availability;
};

const Query = {
  rvProductAvailability: isAuthenticated(getRVProductAvailability),
  rvSpotAvailability: isAuthenticated(getRVSpotAvailability)
};

const resolvers = {
  Query,
  RVProduct: {
    async event(parent: RVProductType, _: {}, context: ContextType): Promise<EventType> {
      const [event] = await Event.getEventById(parent.eventId, context?.user?.roleId);
      return event;
    },
    async rvLot(parent: RVSpotType, _: {}, context: ContextType): Promise<RVLotType> {
      const [rvLot] = await RVLot.getRVLotById(parent.rvLotId, context?.user?.roleId);
      return rvLot;
    },
    async rvSpots(parent: RVProductType, _: {}, context: ContextType): Promise<Array<RVSpotType>> {
      const [rvSpots] = await RVSpot.getRVSpotsByRVProductId(parent.id, context?.user?.roleId);
      return rvSpots;
    },
    async booked(parent: RVProductType, _: {}, context: ContextType): Promise<Boolean> {
      const [booked] = await RVProduct.booked(parent.id, context?.user?.roleId);
      return booked;
    },
    async assignedSpots(parent: RVProductType, _: {}, context: ContextType): Promise<Boolean> {
      const [assignedSpots] = await RVProduct.getAssignedSpots(parent.id, context?.user?.roleId);
      return assignedSpots;
    }
  }
};

export default resolvers;
