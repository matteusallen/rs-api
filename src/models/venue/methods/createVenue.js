//@flow
import type { VenueType } from '../types';
import { Venue } from 'Models';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function createVenue(input: VenueType, transaction: {}, roleId: number): Promise<VenueType> {
  validateAction(MENU.VENUES, ACTIONS[MENU.VENUES].CREATE_VENUE, roleId);
  return await Venue.create({ ...input, includeStripeFee: true }, { transaction });
}

export default createVenue;
