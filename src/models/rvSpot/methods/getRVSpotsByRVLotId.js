// @flow
import { Op } from 'sequelize';

import type { RVSpotType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getRVSpotsByRVLotId(
  rvLotId: string | number,
  returnAvailableRVSpots: boolean,
  roleId: number
): Promise<[Array<RVSpotType> | void, string | void]> {
  validateAction(MENU.RV_SPOTS, ACTIONS[MENU.RV_SPOTS].GET_RV_SPOTS_BY_RV_LOT_ID, roleId);
  const { RVSpot } = this.sequelize.models;
  const where = {
    rvLotId,
    disabled: { [Op.is]: null }
  };
  if (!returnAvailableRVSpots) delete where.disabled;
  const rvSpots = await RVSpot.findAll({ where, order: [['id', 'ASC']] });
  return [rvSpots, undefined];
}

export default getRVSpotsByRVLotId;
