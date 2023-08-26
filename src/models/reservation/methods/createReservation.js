// @flow
import moment from 'moment';
import logger from 'Config/winston';

import type { ReservationType } from '../types';

type CreateReservationType = {|
  assignments: Array<number | string>,
  endDate: Date,
  startDate: Date,
  statusId: number | string,
  xProductId: number | string,
  xRefTypeId: number | string
|};

async function createReservation(input: CreateReservationType, config: {}): Promise<[?ReservationType, ?string]> {
  const { ReservationSpace } = this.sequelize.models;
  const localConfig = config ? { ...config } : {};
  try {
    const { assignments, endDate, startDate, statusId, xProductId, xRefTypeId } = input;
    const reservationInput = {
      endDate: moment.utc(endDate).format('YYYY-MM-DD'),
      startDate: moment.utc(startDate).format('YYYY-MM-DD'),
      statusId,
      xProductId,
      xRefTypeId
    };

    const newReservation = await this.create(reservationInput, { transaction: { ...localConfig } });

    if (assignments && assignments.length) {
      Promise.all(
        assignments.map(async assignment => {
          const reservationSpaceInput = { reservationId: newReservation.id, spaceId: assignment };
          await ReservationSpace.createReservationSpace(reservationSpaceInput, config);
        })
      );
    }

    return [newReservation, undefined];
  } catch (error) {
    logger.error(`createReservation error: ${error.message}`);
    return [undefined, error.message];
  }
}

export default createReservation;
