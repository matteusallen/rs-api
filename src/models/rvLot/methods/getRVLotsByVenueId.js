// @flow
import type { RVLotType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getRVLotsByVenueId(venueId: number | string, roleId: number): Promise<[?RVLotType, ?string]> {
  validateAction(MENU.RV_LOTS, ACTIONS[MENU.RV_LOTS].GET_RV_LOTS_BY_VENUE_ID, roleId);
  const rvLots = await this.findAll({ where: { venueId } });
  return [rvLots, undefined];
}

export default getRVLotsByVenueId;
