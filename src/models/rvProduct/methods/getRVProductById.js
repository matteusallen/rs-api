// @flow
import type { RVProductType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getRVProductById(id: number | string, roleId: number): Promise<[?RVProductType, ?string]> {
  validateAction(MENU.RV_PRODUCTS, ACTIONS[MENU.RV_PRODUCTS].GET_RV_PRODUCT_BY_ID, roleId);
  const rvProduct = await this.findOne({ where: { id } });
  return [rvProduct, undefined];
}

export default getRVProductById;
