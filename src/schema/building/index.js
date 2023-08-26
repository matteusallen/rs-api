// @flow
import type { VenueType } from 'Models/venue/types';
import type { BuildingType } from 'Models/building/types';
import type { StallType, StallOptionsType } from 'Models/stall/types';
import { Venue, Stall } from 'Models';
import type { ContextType } from 'Types/context';

const resolvers = {
  Building: {
    async venue(parent: BuildingType): Promise<VenueType> {
      const [venue] = await Venue.getVenueById(parent.venueId);
      return venue;
    },
    async stalls(parent: BuildingType, options: StallOptionsType, context: ContextType): Promise<Array<StallType>> {
      const [stalls] = await Stall.getStallsByBuildingId(parent.id, null, options, context?.user?.roleId);
      return stalls;
    },
    async availableStalls(parent: BuildingType, _: {}, context: ContextType): Promise<Array<StallType>> {
      const [stalls] = await Stall.getStallsByBuildingId(parent.id, true, null, context?.user?.roleId);
      return stalls;
    }
  }
};

export default resolvers;
