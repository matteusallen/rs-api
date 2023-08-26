// @flow
import type { RVSpotType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getRVSpotsByRVProductId(rvProductId: number | string, roleId: number): Promise<[Array<RVSpotType> | void, string | void]> {
  validateAction(MENU.RV_SPOTS, ACTIONS[MENU.RV_SPOTS].GET_RV_SPOTS_BY_RV_PRODUCT_ID, roleId);
  const rvSpots = await this.findAll({
    include: [
      {
        association: 'rvProducts',
        where: { id: rvProductId }
      }
    ]
  });
  return [rvSpots, undefined];
}

export default getRVSpotsByRVProductId;
