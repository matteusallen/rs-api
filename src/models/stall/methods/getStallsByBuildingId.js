// @flow
import { Op } from 'sequelize';

import type { StallOptionsType, StallType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getStallsByBuildingId(
  buildingId: string | number,
  returnAvailableStalls: boolean,
  options?: StallOptionsType,
  roleId: number
): Promise<[Array<StallType> | void, string | void]> {
  validateAction(MENU.STALLS, ACTIONS[MENU.STALLS].GET_STALLS_BY_BUILDING_ID, roleId);
  const filterBy = options ? options.filterBy : {};
  const { Stall } = this.sequelize.models;
  const where = {
    buildingId,
    ...filterBy,
    disabled: { [Op.is]: null }
  };

  if (!returnAvailableStalls) delete where.disabled;
  const stalls = await Stall.findAll({ where });
  return [stalls, undefined];
}

export default getStallsByBuildingId;
