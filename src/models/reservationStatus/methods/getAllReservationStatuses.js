// @flow
import type { ReservationStatusType } from '../types';

/**
 * Example:
 * {"1":"reserved","2":"checked in","3":"departed","4":"cancelled"}
 */
async function getAllReservationStatuses(): Promise<[?ReservationStatusType, ?string]> {
  const reservationStatus = await this.findAll();
  return [reservationStatus, undefined];
}

export default getAllReservationStatuses;
