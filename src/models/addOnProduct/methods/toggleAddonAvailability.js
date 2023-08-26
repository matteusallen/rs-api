// @flow
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function toggleAddonAvailability(addOnId: number | string, roleId: number) {
  validateAction(MENU.ADDONS, ACTIONS[MENU.ADDONS].TOGGLE_ADDON_AVAILABILITY, roleId);

  const addOnProduct = await this.findOne({ where: { id: addOnId } });
  addOnProduct.disabled = !addOnProduct.disabled;
  await addOnProduct.save();

  return addOnProduct;
}

export default toggleAddonAvailability;
