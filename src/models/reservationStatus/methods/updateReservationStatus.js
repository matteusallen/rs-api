// @flow
import type { ReservationType } from 'Models/reservation/types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

type ReservationStatusUpdateType = {|
  orderItemId: number,
  statusId: number
|};

async function updateReservationStatus(
  input: ReservationStatusUpdateType,
  transaction: {} = {},
  roleId: number
): Promise<[Array<ReservationType> | null, string | null]> {
  validateAction(MENU.RESERVATION_STATUS, ACTIONS[MENU.RESERVATION_STATUS].UPDATE_RESERVATION_STATUS, roleId);
  try {
    const { ReservationStatus, OrderItem, Reservation, ReservationSpace, Stall } = this.sequelize.models;
    const { orderItemId, statusId } = input;
    const orderItem = await OrderItem.findOne({
      where: { id: orderItemId },
      include: [{ association: 'reservation' }]
    });
    const xRefTypeId = orderItem.reservation.xRefTypeId;
    const space = xRefTypeId === 1 ? 'stall' : 'rvSpot';

    const reservation = await Reservation.findOne({
      where: { id: orderItem.reservation.id },
      include: [{ association: 'reservationSpaces', include: [{ association: space }] }]
    });

    reservation.statusId = statusId;
    await reservation.save({ transaction });

    if (space === 'stall' && reservation.reservationSpaces && !!reservation.reservationSpaces.length) {
      let newStallStatus = null;
      const status = await ReservationStatus.findByPk(statusId);
      switch (status.name) {
        case 'checked in':
          newStallStatus = 'occupied';
          break;
        case 'departed':
          newStallStatus = 'dirty';
          break;
        case 'canceled':
          await ReservationSpace.updateReservationSpaces(reservation.id, [], transaction, roleId);
          break;
      }
      if (newStallStatus) {
        const promises = reservation.reservationSpaces.map(async space => {
          const stall = await Stall.findOne({
            where: {
              id: space.stall.id
            }
          });
          stall.status = newStallStatus;
          await stall.save({ transaction });
        });
        await Promise.all(promises);
      }
    } else if (space === 'rvSpot' && reservation.reservationSpaces && !!reservation.reservationSpaces.length && statusId === 4) {
      await ReservationSpace.updateReservationSpaces(reservation.id, [], transaction, roleId);
    }

    return [reservation, null];
  } catch (error) {
    return [null, error];
  }
}

export default updateReservationStatus;
