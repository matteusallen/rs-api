// @flow
import type { ReservationStatusType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getReservationStatusById(id: number | string, roleId: number): Promise<[?ReservationStatusType, ?string]> {
  validateAction(MENU.RESERVATION_STATUS, ACTIONS[MENU.RESERVATION_STATUS].GET_RESERVATION_STATUS_BY_ID, roleId);
  const reservationStatus = await this.findOne({ where: { id } });
  return [reservationStatus, undefined];
}

export default getReservationStatusById;
