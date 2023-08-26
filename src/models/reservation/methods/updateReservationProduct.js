// @flow
type UpdateReservationProductType = {
  reservationId: number | String,
  xProductId: number
};

async function updateReservationProduct(input: UpdateReservationProductType, transaction: {}): Promise<void> {
  const { reservationId, xProductId } = input;
  const updateProductInput = { xProductId };
  await this.update(updateProductInput, { where: { id: reservationId }, transaction });
}

export default updateReservationProduct;
