// @flow
import { Op } from 'sequelize';
import { MENU } from '../../../constants/menuOptions';
import { ACTIONS } from '../../../constants/actions';
import { validateAction } from 'Utils';
import { PRODUCT_XREF_TYPES } from '../../../constants/productXrefTypes';
import { RESERVATION_STATUS } from '../../../constants/reservationStatus';

async function booked(rvProductId: number, roleId: number) {
  validateAction(MENU.RV_PRODUCTS, ACTIONS[MENU.RV_PRODUCTS].HAS_ORDERS, roleId);
  try {
    const { Reservation } = this.sequelize.models;
    const existingReservation = await Reservation.findOne({
      where: {
        xProductId: rvProductId,
        xRefTypeId: PRODUCT_XREF_TYPES.RVS,
        statusId: { [Op.not]: RESERVATION_STATUS.canceled }
      }
    });

    return [!!existingReservation, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default booked;
