// @flow
import type { VenueType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getVenues(roleId: number): Promise<[VenueType]> {
  validateAction(MENU.VENUES, ACTIONS[MENU.VENUES].GET_VENUES, roleId);
  const venues = await this.findAll();
  return venues;
}

export default getVenues;
