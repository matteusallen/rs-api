// @flow
import type { RVProductType } from '../types';

async function getRVProductsByEventId(eventId: string | number): Promise<[Array<RVProductType> | void, string | void]> {
  const { RVProduct } = this.sequelize.models;
  const rvProducts = await RVProduct.findAll({ where: { eventId } });

  return [rvProducts, undefined];
}

export default getRVProductsByEventId;
