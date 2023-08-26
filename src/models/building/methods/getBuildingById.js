// @flow
import type { BuildingType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getBuildingById(buildingId: number, roleId: number): Promise<[BuildingType | void, string | void]> {
  validateAction(MENU.BUILDINGS, ACTIONS[MENU.BUILDINGS].GET_BUILDING_BY_ID, roleId);
  const building = await this.findOne({ where: { id: buildingId } });
  return [building, undefined];
}

export default getBuildingById;
