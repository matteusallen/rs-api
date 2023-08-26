// @flow
import { Op } from 'sequelize';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { STALL_PRODUCT_X_REF_TYPE_ID, RV_PRODUCT_X_REF_TYPE_ID } from '../../../constants/index';

import type { ProductSelloutInputType } from '../types';

const moment = extendMoment(Moment);
async function isProductSoldOut(input: ProductSelloutInputType, roleId: number): Promise<[?boolean, ?string]> {
  try {
    const { Venue, Event } = this.sequelize.models;
    const { eventId, productType } = input;

    const models = productType === 'stallProduct' ? 'stallProducts' : 'rvProducts';
    const spaces = productType === 'stallProduct' ? 'stalls' : 'rvSpots';

    const event = await Event.findOne({
      where: { id: eventId },
      attributes: ['id', 'venueId', 'startDate', 'endDate', 'openDate', 'closeDate', 'rvFlip', 'stallFlip'],
      include: [
        {
          association: models,
          attributes: ['id'],
          include: [
            {
              association: spaces,
              where: { disabled: { [Op.is]: null } },
              attributes: ['id']
            }
          ]
        }
      ]
    });
    const { startDate, endDate, openDate, closeDate } = event;

    const openDateUTC = moment.utc(openDate).format('YYYY-MM-DD');
    const closeDateUTC = moment.utc(closeDate).format('YYYY-MM-DD');

    if (!moment().isBetween(openDateUTC, closeDateUTC, 'day', [])) return [true, undefined];
    if (!event[models].length) return [true, undefined];

    const startCheckDate = moment().isAfter(moment.utc(startDate)) ? moment().format('YYYY-MM-DD') : startDate;

    const checkingDates = Array.from(moment.range(moment.utc(startCheckDate), moment.utc(endDate)).by('day')).map(day => day.format('YYYY-MM-DD'));
    checkingDates.pop();
    const [venueSpaceAvailabilityPerDay] = await Venue.getVenueSpacesAvailabilityByDay(
      {
        checkingDates,
        event,
        xRefTypeId: productType === 'stallProduct' ? STALL_PRODUCT_X_REF_TYPE_ID : RV_PRODUCT_X_REF_TYPE_ID
      },
      roleId
    );

    const eventProductAvailability = event[models].map(product => {
      const eventProductSpaces = product[spaces];
      const availableEachDay = checkingDates.map(date => {
        const dailyAvailable = eventProductSpaces.filter(space => {
          return venueSpaceAvailabilityPerDay[date][space.id];
        });
        return dailyAvailable.length;
      });
      const max = Math.max(...availableEachDay);
      return { productId: product.id, maxLeft: max };
    });
    const anySpacesLeft = eventProductAvailability.filter(availableForProduct => availableForProduct.maxLeft > 0);
    return [!anySpacesLeft.length, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default isProductSoldOut;
