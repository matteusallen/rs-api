// @flow
import type { AddOnProductType } from 'Models/addOnProduct/types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getAddOnProductById(id: number | string, roleId: number): Promise<[?AddOnProductType, ?string]> {
  validateAction(MENU.ADDON_PRODUCTS, ACTIONS[MENU.ADDON_PRODUCTS].GET_ADDON_PRODUCT_BY_ID, roleId);
  const addOnProduct = await this.findOne({ where: { id } });
  return [addOnProduct, undefined];
}

export default getAddOnProductById;
