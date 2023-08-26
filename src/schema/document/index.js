// @flow
import type { VenueType } from 'Models/venue/types';
import type { DocumentType } from 'Models/document/types';
import { Venue } from 'Models';

const resolvers = {
  Document: {
    async venue(parent: DocumentType): Promise<VenueType> {
      const [venue] = await Venue.getVenueById(parent.venueId);
      return venue;
    }
  }
};

export default resolvers;
