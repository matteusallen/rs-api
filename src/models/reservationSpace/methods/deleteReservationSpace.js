// @flow
type DeleteReservationSpaceType = {|
  reservationId: number | string,
  spaceId: number | string
|};

async function deleteReservationSpace(input: DeleteReservationSpaceType, transaction: {}): Promise<void> {
  const { reservationId, spaceId } = input;
  await this.destroy({ where: { reservationId, spaceId }, transaction });
}

export default deleteReservationSpace;
