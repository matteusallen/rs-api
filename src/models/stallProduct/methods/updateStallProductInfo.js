// @flow
import type { EventAndProductsInfoInputType } from 'Models/event/types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function updateStallProductInfo(inputs: [EventAndProductsInfoInputType], transaction: {}, roleId: number) {
  validateAction(MENU.STALL_PRODUCTS, ACTIONS[MENU.STALL_PRODUCTS].UPDATE_STALL_PRODUCT_INFO, roleId);
  for (const input of inputs) {
    try {
      const { id, name, description } = input;
      const stallProduct = await this.findOne({ where: { id } });
      stallProduct.name = name || stallProduct.name;
      stallProduct.description = description || stallProduct.description;
      await stallProduct.save({ transaction });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      continue;
    }
  }
}

export default updateStallProductInfo;
