// @flow
import type { OrderItemType, OrderItemInputType } from '../types';
import { PRODUCT_XREF_TYPES } from 'Constants';

async function createOrderItem(input: OrderItemInputType, config: {}, roleId: number): Promise<[?OrderItemType, ?string]> {
  const { Reservation, ReservationSpace } = this.sequelize.models;
  const localConfig = config ? { ...config } : {};
  try {
    let newReservation = undefined;
    if (parseInt(input.xRefTypeId) === PRODUCT_XREF_TYPES.STALLS || parseInt(input.xRefTypeId) === PRODUCT_XREF_TYPES.RVS) {
      const { startDate, endDate, statusId, xProductId, xRefTypeId, assignments } = input;
      let newReservationError = undefined;
      const newReservationInput = { startDate, endDate, statusId, xProductId, xRefTypeId };

      [newReservation, newReservationError] = await Reservation.createReservation(newReservationInput, localConfig);
      if (newReservationError) throw Error(newReservationError);

      if (!!assignments && assignments.length) {
        const [, updatedSpacesError] = await ReservationSpace.updateReservationSpaces(newReservation.id, assignments, localConfig, roleId);
        if (updatedSpacesError) throw Error(updatedSpacesError);
      }
    }

    const orderItemInput = {
      orderId: input.orderId,
      xProductId: newReservation ? newReservation.id : input.xProductId,
      xRefTypeId: newReservation ? PRODUCT_XREF_TYPES.RESERVATIONS : input.xRefTypeId,
      price: input.price,
      quantity: input.quantity
    };
    const newOrderItem = await this.create(orderItemInput, { transaction: { ...localConfig } });

    return [newOrderItem, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default createOrderItem;
