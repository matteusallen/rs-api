// @flow
import { formatDate } from 'Utils';

type UpdateReservationDatesType = {|
  reservationId: number | string,
  endDate: Date,
  startDate: Date
|};

async function updateReservationDates(input: UpdateReservationDatesType, transaction: {}): Promise<void> {
  const { reservationId, startDate, endDate } = input;
  const reservationDates = {
    startDate: formatDate.toDbDate(startDate),
    endDate: formatDate.toDbDate(endDate)
  };

  await this.update(reservationDates, { where: { id: reservationId }, transaction });
}

export default updateReservationDates;
