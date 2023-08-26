// @flow
import type { ReservationStatusType } from 'Models/reservationStatus/types';
import { ReservationStatus } from 'Models';
import { admin } from 'Lib/auth';

const getReservationStatuses = async (): Promise<Array<ReservationStatusType>> => {
  return await ReservationStatus.findAll();
};

const Query = {
  reservationStatuses: admin(getReservationStatuses)
};

const resolvers = {
  Query
};

export default resolvers;
