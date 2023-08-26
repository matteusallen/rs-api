// @flow
import type { EventType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getFilteredEventsByVenueId(venueId: number, options: any, roleId: number): Promise<[Array<EventType> | void, string | void]> {
  validateAction(MENU.EVENTS, ACTIONS[MENU.EVENTS].GET_FILTERED_EVENTS_BY_VENUE_ID, roleId);
  options.filterBy = { ...options.filterBy, venueId };
  return await this.getEvents(options, roleId);
}

export default getFilteredEventsByVenueId;
