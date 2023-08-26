// @flow
import type { AddOnProductType } from '../types';

async function getAddOnProductsByEventId(eventId: string | number): Promise<[Array<AddOnProductType> | void, string | void]> {
  const { AddOnProduct } = this.sequelize.models;
  const addOnProducts = await AddOnProduct.findAll({ where: { eventId }, include: [{ association: 'addOn', attributes: ['id', 'name'] }] });

  return [addOnProducts, undefined];
}

export default getAddOnProductsByEventId;
