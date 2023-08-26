// @flow

import type { ProductAvailabilityInputType, SpaceAvailabilityReturnType } from 'Models/venue/types';
import { STALL_PRODUCT_X_REF_TYPE_ID } from 'Constants';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getAvailability(input: ProductAvailabilityInputType, roleId: number): SpaceAvailabilityReturnType {
  validateAction(MENU.STALL_PRODUCTS, ACTIONS[MENU.STALL_PRODUCTS].GET_AVAILABILITY, roleId);
  try {
    let availability;
    const { Event, Venue } = this.sequelize.models;
    const { eventId, startDate, endDate, reservationId, includeCurrentReservation = true } = input;
    const event = await Event.findOne({ where: { id: eventId }, attributes: ['stallFlip', 'startDate', 'endDate', 'venueId'] });

    if (!event) throw new Error('invalid event id');

    const { stallFlip, startDate: eventStartDate, endDate: eventEndDate, venueId } = event && event.toJSON();

    if (stallFlip) {
      [availability] = await Venue.getVenueProductAvailabilityCount(
        {
          eventId,
          startDate,
          endDate,
          xRefTypeId: STALL_PRODUCT_X_REF_TYPE_ID,
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
          xRefTypeId: STALL_PRODUCT_X_REF_TYPE_ID,
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
