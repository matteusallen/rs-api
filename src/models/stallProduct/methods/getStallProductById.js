// @flow
import type { StallProductType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getStallProductById(id: number | string, roleId: number): Promise<[?StallProductType, ?string]> {
  validateAction(MENU.STALL_PRODUCTS, ACTIONS[MENU.STALL_PRODUCTS].GET_STALL_PRODUCT_BY_ID, roleId);
  const stallProduct = await this.findOne({ where: { id } });
  return [stallProduct, undefined];
}

export default getStallProductById;
