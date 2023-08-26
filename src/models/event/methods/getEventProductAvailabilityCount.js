// @flow
import { Op } from 'sequelize';
import type { ProductAvailabilityType, ProductAvailabilityInputType } from 'Models/venue/types';

async function getEventProductAvailabilityCount(
  input: ProductAvailabilityInputType,
  roleId: number
): Promise<[Array<ProductAvailabilityType> | void, string | void]> {
  try {
    const { Event, Venue } = this.sequelize.models;
    const { eventId, startDate, endDate, xRefTypeId, venueId, reservationId, includeCurrentReservation } = input;

    const events = await Event.findAll({
      attributes: ['startDate', 'endDate'],
      where: {
        venueId,
        [Op.or]: {
          startDate: { [Op.between]: [startDate, endDate] },
          endDate: { [Op.between]: [startDate, endDate] },
          [Op.and]: {
            startDate: { [Op.lte]: startDate },
            endDate: { [Op.gte]: endDate }
          }
        }
      }
    });

    const startDates = [];
    const endDates = [];
    for (const event of events) {
      startDates.push(new Date(event.startDate));
      endDates.push(new Date(event.endDate));
    }

    var minStartDate = new Date(Math.min.apply(null, startDates));
    var maxEndDate = new Date(Math.max.apply(null, endDates));

    const [availability] = await Venue.getVenueProductAvailabilityCount(
      {
        eventId,
        startDate: minStartDate,
        endDate: maxEndDate,
        xRefTypeId,
        reservationId,
        includeCurrentReservation
      },
      roleId
    );

    return [availability, undefined];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return [undefined, error.message];
  }
}

export default getEventProductAvailabilityCount;
