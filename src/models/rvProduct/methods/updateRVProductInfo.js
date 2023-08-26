// @flow
import type { EventAndProductsInfoInputType } from 'Models/event/types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function updateRVProductInfo(inputs: [EventAndProductsInfoInputType], transaction: {}, roleId: number) {
  validateAction(MENU.RV_PRODUCTS, ACTIONS[MENU.RV_PRODUCTS].UPDATE_RV_PRODUCT_INFO, roleId);
  for (const input of inputs) {
    try {
      const { id, name, description } = input;
      const rvProduct = await this.findOne({ where: { id } });
      rvProduct.name = name || rvProduct.name;
      rvProduct.description = description || rvProduct.description;
      await rvProduct.save({ transaction });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      continue;
    }
  }
}

export default updateRVProductInfo;
