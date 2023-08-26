// @flow
import type { EventAndProductsInfoInputType } from 'Models/event/types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function updateAddOnProductInfo(inputs: [EventAndProductsInfoInputType], transaction: {}, roleId: number) {
  validateAction(MENU.ADDONS, ACTIONS[MENU.ADDONS].UPDATE_ADDON_INFO, roleId);
  for (const input of inputs) {
    try {
      const { id, name, description } = input;
      const addOn = await this.findOne({ where: { id } });
      addOn.name = name || addOn.name;
      addOn.description = description || addOn.description;
      await addOn.save({ transaction });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      continue;
    }
  }
}

export default updateAddOnProductInfo;
