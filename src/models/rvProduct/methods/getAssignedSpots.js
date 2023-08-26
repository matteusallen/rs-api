// @flow
import { Op } from 'sequelize';
import { MENU } from '../../../constants/menuOptions';
import { ACTIONS } from '../../../constants/actions';
import { validateAction } from 'Utils';
import { PRODUCT_XREF_TYPES } from '../../../constants/productXrefTypes';
import { RESERVATION_STATUS } from '../../../constants/reservationStatus';

async function getAssignedSpots(rvProductId: number, roleId: number) {
  validateAction(MENU.RV_PRODUCTS, ACTIONS[MENU.RV_PRODUCTS].GET_ASSIGNED_SPOTS, roleId);
  try {
    let rvSpotIds = [];
    const { Reservation } = this.sequelize.models;
    const reservationsWithAssignments = await Reservation.findAll({
      where: {
        xProductId: rvProductId,
        xRefTypeId: PRODUCT_XREF_TYPES.RVS,
        statusId: { [Op.not]: RESERVATION_STATUS.canceled }
      },
      include: [
        {
          association: 'reservationSpaces',
          include: [{ association: 'rvSpot' }]
        }
      ]
    });

    reservationsWithAssignments.forEach(reservation => {
      const reservationRvSpotIds = reservation.reservationSpaces.map(space => {
        return space.rvSpot.id;
      });
      rvSpotIds = [...rvSpotIds, ...reservationRvSpotIds];
    });

    return [rvSpotIds, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getAssignedSpots;
