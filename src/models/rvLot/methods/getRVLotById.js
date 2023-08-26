// @flow
import type { RVLotType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getRVLotById(id: number | string, roleId: number): Promise<[?RVLotType, ?string]> {
  validateAction(MENU.RV_LOTS, ACTIONS[MENU.RV_LOTS].GET_RV_LOT_BY_ID, roleId);
  const rvLot = await this.findOne({ where: { id } });
  return [rvLot, undefined];
}

export default getRVLotById;
