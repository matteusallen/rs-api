// @flow
import type { VenueType } from 'Models/venue/types';
import type { AddOnType } from 'Models/addOn/types';
import { Venue } from 'Models';

const resolvers = {
  AddOn: {
    async venue(parent: AddOnType): Promise<VenueType> {
      const [venue] = await Venue.getVenueById(parent.venueId);
      return venue;
    }
  }
};

export default resolvers;
