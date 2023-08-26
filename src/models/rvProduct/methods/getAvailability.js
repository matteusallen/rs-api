// @flow

import type { ProductAvailabilityInputType, SpaceAvailabilityReturnType } from 'Models/venue/types';
import { RV_PRODUCT_X_REF_TYPE_ID, ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getAvailability(input: ProductAvailabilityInputType, roleId: number): SpaceAvailabilityReturnType {
  validateAction(MENU.RV_PRODUCTS, ACTIONS[MENU.RV_PRODUCTS].GET_AVAILABILITY, roleId);

  try {
    let availability;
    const { Event, Venue } = this.sequelize.models;
    const { eventId, startDate, endDate, reservationId, includeCurrentReservation = true } = input;
    const event = await Event.findOne({ where: { id: eventId }, attributes: ['rvFlip', 'startDate', 'endDate', 'venueId'] });

    if (!event) throw new Error('invalid event id');

    const { rvFlip, startDate: eventStartDate, endDate: eventEndDate, venueId } = event && event.toJSON();

    if (rvFlip) {
      [availability] = await Venue.getVenueProductAvailabilityCount(
        {
          eventId,
          startDate,
          endDate,
          xRefTypeId: RV_PRODUCT_X_REF_TYPE_ID,
          reservationId,
          includeCurrentReservation
        },
        roleId
      );
    } else {
      [availability] = await Event.getEventProductAvailabilityCount(
        {
          eventId,
          startDate: eventStartDate,
          endDate: eventEndDate,
          xRefTypeId: RV_PRODUCT_X_REF_TYPE_ID,
          venueId,
          reservationId,
          includeCurrentReservation
        },
        roleId
      );
    }

    return [availability, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default getAvailability;
