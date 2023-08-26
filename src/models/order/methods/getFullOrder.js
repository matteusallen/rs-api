// @flow

import type { OrderType } from '../types';
import { productXRefTypeHelper } from 'Utils';

async function getFullOrder(orderId: number): Promise<[OrderType | void, string | void]> {
  try {
    const { StallProduct, RVProduct, AddOnProduct } = this.sequelize.models;

    const order = await this.findOne({
      where: { id: orderId },
      include: [
        { association: 'orderItems', include: [{ association: 'reservation' }, { association: 'addOnProduct' }] },
        { association: 'event', include: [{ association: 'venue' }] },
        { association: 'payments' },
        { association: 'groupOrder' },
        { association: 'groupOrderBills' }
      ]
    });

    const models = {
      // $FlowIgnore
      1: StallProduct,
      // $FlowIgnore
      3: RVProduct
    };

    await Promise.all(
      order.orderItems.map(async orderItem => {
        if (productXRefTypeHelper.isAddOnProduct(orderItem.xRefTypeId)) {
          const product = await AddOnProduct.findOne({
            where: { id: orderItem.xProductId },
            include: [{ association: 'addOn' }]
          });

          orderItem.addOnProduct = product;

          return orderItem;
        } else {
          const xRefTypeId = orderItem.reservation.xRefTypeId;
          const model = models[xRefTypeId];
          const key = productXRefTypeHelper.ProductXRefTypeMap[xRefTypeId];
          const include = key === productXRefTypeHelper.ProductXRefTypes.RV_PRODUCT ? [{ association: 'rvLot' }] : [];

          const product = await model.findOne({ where: { id: orderItem.reservation.xProductId }, include });

          const reservation = { ...orderItem.reservation.dataValues };
          reservation[key] = product;
          orderItem.reservation = reservation;

          return orderItem;
        }
      })
    );

    return [order, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getFullOrder;
