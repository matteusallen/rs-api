// @flow
import type { ReservationSpaceType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getReservationSpaces(
  xRefTypeId: number | string,
  reservationId: number | string,
  roleId: number
): Promise<[?Array<ReservationSpaceType>, ?string]> {
  validateAction(MENU.RESERVATION_SPACES, ACTIONS[MENU.RESERVATION_SPACES].GET_RESERVATION_SPACES, roleId);
  const { Stall, RVSpot } = this.sequelize.models;
  const reservationSpaces = await this.findAll({ where: { reservationId } });
  const reservationSpacesIds = reservationSpaces.map(reservationSpace => reservationSpace.spaceId);

  if (parseInt(xRefTypeId) === 1) {
    const [stalls] = await Stall.getStallsById(reservationSpacesIds);
    return [stalls, undefined];
  }

  if (parseInt(xRefTypeId) === 3) {
    const [rvSpots] = await RVSpot.getRVSpotsById(reservationSpacesIds);
    return [rvSpots, undefined];
  }
  return [undefined, 'unrecognized product type'];
}

export default getReservationSpaces;
