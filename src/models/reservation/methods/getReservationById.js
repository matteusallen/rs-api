// @flow
import type { ReservationType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getReservationById(id: number | string, roleId: number): Promise<[?ReservationType, ?string]> {
  validateAction(MENU.RESERVATIONS, ACTIONS[MENU.RESERVATIONS].GET_RESERVATION_BY_ID, roleId);
  const reservation = await this.findOne({ where: { id } });
  return [reservation, undefined];
}

export default getReservationById;
