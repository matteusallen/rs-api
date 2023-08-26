// @flow
import type { ReservationSpaceType } from '../types';

type CreateReservationSpaceType = {|
  reservationId: number | string,
  spaceId: number | string
|};

async function createReservationSpace(input: CreateReservationSpaceType, transaction: {}): Promise<[?ReservationSpaceType, ?string]> {
  const newReservationSpace = await this.create(input, { transaction });
  return newReservationSpace;
}

export default createReservationSpace;
