// @flow
import type { StallProductType } from '../types';

async function getStallProductsByEventId(eventId: string | number): Promise<[Array<StallProductType> | void, string | void]> {
  const { StallProduct } = this.sequelize.models;
  const stallProducts = await StallProduct.findAll({ where: { eventId } });

  return [stallProducts, undefined];
}

export default getStallProductsByEventId;
