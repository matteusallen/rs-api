// @flow
import { STALL_PRODUCT_X_REF_TYPE_ID } from 'Constants';
import moment from 'moment';

type UpdateQuantityByReservationType = {|
  reservationId: number | string,
  quantity: number | string
|};

async function updateQuantityByReservationId(reservation: UpdateQuantityByReservationType, transaction: {}): Promise<void> {
  const { reservationId, quantity } = reservation;
  const { StallProduct, RVProduct, Reservation } = this.sequelize.models;
  const reservationRecord = await Reservation.findOne({ where: { id: reservationId } });

  let model = reservationRecord.xRefTypeId == STALL_PRODUCT_X_REF_TYPE_ID ? StallProduct : RVProduct;

  const product = await model.findOne({ where: { id: reservationRecord.xProductId } });

  let price = product?.nightly
    ? product?.price * moment(reservationRecord.endDate).diff(moment(reservationRecord.startDate), 'days') * +quantity
    : product?.price * +quantity;
  await this.update({ quantity, price }, { where: { xProductId: reservationId }, transaction });
}

export default updateQuantityByReservationId;
