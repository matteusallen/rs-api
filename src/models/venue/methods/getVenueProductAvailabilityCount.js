// @flow
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Op } from 'sequelize';

import type { ProductAvailabilityType, ProductAvailabilityInputType } from '../types';

const moment = extendMoment(Moment);

type ProductAvailabilityReturnType = Promise<[Array<ProductAvailabilityType> | void, string | void]>;

async function getVenueProductAvailabilityCount(input: ProductAvailabilityInputType, roleId: number): ProductAvailabilityReturnType {
  try {
    const { Venue, Event } = this.sequelize.models;
    const { eventId, startDate, endDate, xRefTypeId, reservationId, includeCurrentReservation } = input;

    const models = xRefTypeId == 1 ? 'stallProducts' : 'rvProducts';
    const spaces = xRefTypeId == 1 ? 'stalls' : 'rvSpots';

    const checkingDates = Array.from(moment.range(moment.utc(startDate), moment.utc(endDate)).by('day')).map(day => day.format('YYYY-MM-DD'));
    checkingDates.pop();

    const event = await Event.findOne({
      where: { id: eventId },
      attributes: ['id', 'venueId', 'rvFlip', 'stallFlip'],
      include: [
        {
          association: models,
          attributes: ['id'],
          include: [{ association: spaces, attributes: ['id'], where: { disabled: { [Op.is]: null } } }]
        }
      ]
    });

    const [venueSpaceAvailabilityPerDay] = await Venue.getVenueSpacesAvailabilityByDay(
      {
        event,
        checkingDates,
        xRefTypeId,
        reservationId, //for update
        includeCurrentReservation
      },
      roleId
    );

    const eventProductAvailability = event[models].map(product => {
      const eventProductSpaces = product[spaces];
      const available = checkingDates.reduce((acc, curr) => {
        const dailyAvailable = eventProductSpaces.filter(space => venueSpaceAvailabilityPerDay[curr][space.id]);
        if (dailyAvailable.length < acc || acc === -1) {
          acc = dailyAvailable.length;
        }
        return acc;
      }, -1);
      return {
        productId: product.id,
        available
      };
    });

    return [eventProductAvailability, undefined];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return [undefined, error.message];
  }
}

export default getVenueProductAvailabilityCount;
