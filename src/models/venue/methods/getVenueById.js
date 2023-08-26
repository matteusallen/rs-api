// @flow
import type { VenueType } from '../types';

async function getVenueById(venueId: number | string): Promise<[VenueType | void, string | void]> {
  const venue = await this.findOne({ where: { id: venueId } });
  return [venue, undefined];
}

export default getVenueById;
