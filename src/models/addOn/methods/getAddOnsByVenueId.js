// @flow
import type { AddOnType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getAddOnsByVenueId(venueId: number, roleId: number): Promise<[?AddOnType, ?string]> {
  validateAction(MENU.ADDONS, ACTIONS[MENU.ADDONS].GET_ADDONS_BY_VENUE_ID, roleId);
  const addOns = await this.findAll({ where: { venueId } });
  return [addOns, undefined];
}

export default getAddOnsByVenueId;
