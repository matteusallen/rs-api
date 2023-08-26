// @flow
import { STALL_PRODUCT_X_REF_TYPE_ID, RESERVATION_X_REF_TYPE_ID } from 'Constants';
import moment from 'moment';

type updatePriceByProductTypeInput = {|
  reservation: any,
  addOnProductId: number | string,
  addOnQuantity: number,
  xRefTypeId: number | string,
  xProductId: number | string
|};

async function updateOrderItem(input: updatePriceByProductTypeInput, transaction: {}): Promise<void> {
  const { xProductId: addOnProductId, addOnQuantity, xRefTypeId, reservation } = input;
  const { AddOnProduct, StallProduct, RVProduct } = this.sequelize.models;

  let model = xRefTypeId !== RESERVATION_X_REF_TYPE_ID ? AddOnProduct : StallProduct;
  model = reservation && reservation.xRefTypeId == STALL_PRODUCT_X_REF_TYPE_ID ? model : RVProduct;

  const product = await model.findOne({ where: { id: addOnProductId || reservation.xProductId } });
  let price = product.nightly
    ? product.price * moment(reservation.endDate).diff(moment(reservation.startDate), 'days') * reservation.quantity
    : product.price * reservation.quantity;
  const [isDone] = await this.update(
    { price: price, quantity: addOnQuantity || reservation.quantity },
    { where: { xProductId: addOnProductId || reservation.reservationId }, transaction }
  );

  if (!isDone) throw Error('Unable to update product price');
}

export default updateOrderItem;
