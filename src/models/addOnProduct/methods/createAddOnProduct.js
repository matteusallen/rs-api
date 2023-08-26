// @flow
import type { AddOnProductType, AddOnProductInputType } from 'Models/addOnProduct/types';

async function createAddOnProduct(input: AddOnProductInputType): Promise<[AddOnProductType | void, string | void]> {
  try {
    const newAddOnProduct = this.upsert(input);
    return [newAddOnProduct, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default createAddOnProduct;
