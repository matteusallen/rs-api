// @flow
import type { AddOnType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getAddOnById(addOnId: number | string, roleId: number): Promise<[AddOnType | void, string | void]> {
  validateAction(MENU.ADDONS, ACTIONS[MENU.ADDONS].GET_ADDON_BY_ID, roleId);
  const addOn = await this.findOne({ where: { id: addOnId } });
  return [addOn, undefined];
}

export default getAddOnById;
