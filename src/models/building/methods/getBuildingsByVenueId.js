// @flow
import type { BuildingType } from 'Models/building/types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getBuildingsByVenueId(venueId: number, _: {}, roleId: number): Promise<[Array<BuildingType> | void, string | void]> {
  validateAction(MENU.BUILDINGS, ACTIONS[MENU.BUILDINGS].GET_BUILDINGS_BY_VENUE_ID, roleId);
  const { Building } = this.sequelize.models;
  const buildings = await Building.findAll({ where: { venueId } });

  return [buildings, undefined];
}

export default getBuildingsByVenueId;
