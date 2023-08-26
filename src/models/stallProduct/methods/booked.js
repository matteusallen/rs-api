// @flow
import { Op } from 'sequelize';
import { MENU } from '../../../constants/menuOptions';
import { ACTIONS } from '../../../constants/actions';
import { validateAction } from 'Utils';
import { PRODUCT_XREF_TYPES } from '../../../constants/productXrefTypes';
import { RESERVATION_STATUS } from '../../../constants/reservationStatus';

async function booked(stallProductId: number, roleId: number) {
  validateAction(MENU.STALL_PRODUCTS, ACTIONS[MENU.STALL_PRODUCTS].HAS_ORDERS, roleId);
  try {
    const { Reservation } = this.sequelize.models;
    const existingReservation = await Reservation.findOne({
      where: {
        xProductId: stallProductId,
        xRefTypeId: PRODUCT_XREF_TYPES.STALLS,
        statusId: { [Op.not]: RESERVATION_STATUS.canceled }
      }
    });

    return [!!existingReservation, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default booked;
