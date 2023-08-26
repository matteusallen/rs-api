// @flow
import type { StallType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getStallsByStallProductId(stallProductId: number | string, roleId: number): Promise<[Array<StallType> | void, string | void]> {
  validateAction(MENU.STALLS, ACTIONS[MENU.STALLS].GET_STALLS_BY_STALL_PRODUCT_ID, roleId);
  const { StallProduct } = this.sequelize.models;
  const stallProduct = await StallProduct.findOne({
    where: { id: stallProductId },
    include: [{ association: 'stalls' }]
  });
  return [stallProduct.stalls, undefined];
}

export default getStallsByStallProductId;
