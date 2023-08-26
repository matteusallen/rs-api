// @flow
import { Op } from 'sequelize';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import Bugsnag from '@bugsnag/js';
import { STALL_PRODUCT_X_REF_TYPE_ID, RESERVATION_X_REF_TYPE_ID } from 'Constants';

import type { EventType } from 'Models/event/types';

const moment = extendMoment(Moment);

type VenueSpacesAvailabilityByDayInputType = {|
  checkingDates: Array<string>,
  event: EventType,
  xRefTypeId: number,
  reservationId?: number,
  includeCurrentReservation?: boolean
|};

type VenueSpaceAvailabilityReturnType = Promise<[{ [string]: { [string]: boolean } } | void, string | void]>;

async function getVenueSpacesAvailabilityByDay(input: VenueSpacesAvailabilityByDayInputType, roleId: number): VenueSpaceAvailabilityReturnType {
  try {
    const { Reservation, Stall, RVSpot, StallProductStall, RVProductRVSpot } = this.sequelize.models;
    const { event, checkingDates, xRefTypeId, reservationId, includeCurrentReservation } = input;
    const model = xRefTypeId == STALL_PRODUCT_X_REF_TYPE_ID ? 'stallProduct' : 'rvProduct';
    const spaces = xRefTypeId == STALL_PRODUCT_X_REF_TYPE_ID ? 'stalls' : 'rvSpots';
    const spaceModel = xRefTypeId == STALL_PRODUCT_X_REF_TYPE_ID ? Stall : RVSpot;
    const getSpacesFunction = xRefTypeId == STALL_PRODUCT_X_REF_TYPE_ID ? 'getStallsByVenueId' : 'getRVSpotsByVenueId';

    const [venueSpaces] = await spaceModel[getSpacesFunction](event.venueId, {}, roleId);
    const venueSpaceIdsObject = venueSpaces.reduce((acc, curr) => {
      acc[curr.id] = curr.disabled ? false : true;
      return acc;
    }, {});

    const whereClause = {
      id: { [Op.not]: null },
      xRefTypeId,
      [Op.or]: {
        startDate: { [Op.between]: [checkingDates[0], checkingDates[checkingDates.length - 1]] },
        endDate: { [Op.between]: [checkingDates[0], checkingDates[checkingDates.length - 1]] },
        [Op.and]: {
          startDate: { [Op.lte]: checkingDates[0] },
          endDate: { [Op.gte]: checkingDates[checkingDates.length - 1] }
        }
      }
    };

    if (reservationId && includeCurrentReservation) {
      //for update order
      whereClause.id = { [Op.not]: reservationId };
    }
    const reservations = await Reservation.findAll({
      where: whereClause,
      include: [
        {
          association: model,
          attributes: ['id']
        },
        {
          association: 'orderItem',
          attributes: ['id', 'xProductId', 'xRefTypeId', 'quantity'],
          where: {
            xProductId: { [Op.col]: 'Reservation.id' },
            xRefTypeId: RESERVATION_X_REF_TYPE_ID
          },
          include: [
            {
              association: 'order',
              attributes: ['id'],
              where: { successor: null, canceled: null },
              include: [
                {
                  association: 'event',
                  attributes: ['id'],
                  where: { venueId: event.venueId }
                }
              ]
            }
          ]
        }
      ]
    });

    const venueSpaceAvailabilityPerDay = checkingDates.reduce((acc, curr) => {
      acc[curr] = { ...venueSpaceIdsObject };
      return acc;
    }, {});

    const overBooked = {};
    const reservationQuantities = reservations.reduce((acc, curr) => acc + curr.orderItem.quantity, 0);

    for (const reservation of reservations) {
      const stallsOrSpots =
        xRefTypeId == STALL_PRODUCT_X_REF_TYPE_ID
          ? await StallProductStall.findAll({
              attributes: [['stallId', 'id']],
              where: {
                stallProductId: reservation[model].id
              }
            })
          : await RVProductRVSpot.findAll({
              attributes: [['rvSpotId', 'id']],
              where: {
                rvProductId: reservation[model].id
              }
            });

      reservation[model][spaces] = stallsOrSpots;

      const reservationDates = Array.from(moment.range(moment(reservation.startDate), moment(reservation.endDate)).by('day')).map(day =>
        day.format('YYYY-MM-DD')
      );
      reservationDates.pop();

      const sharedDates = reservationDates.filter(value => checkingDates.includes(value));
      if (!sharedDates.length) continue;

      const reservationSpaceProductSpaces = reservation[model][spaces];

      sharedDates.map(sharedDate => {
        const isFlippingEnabled = xRefTypeId == STALL_PRODUCT_X_REF_TYPE_ID ? event.stallFlip : event.rvFlip;
        if (reservationSpaceProductSpaces.length === reservationQuantities && !isFlippingEnabled) {
          for (let i = 0; i < reservationSpaceProductSpaces.length; i++) {
            venueSpaceAvailabilityPerDay[sharedDate][reservationSpaceProductSpaces[i].id] = false;
          }
          return [venueSpaceAvailabilityPerDay, undefined];
        }

        let { quantity: reservationSpaceQuantity } = reservation.orderItem;
        const spacesStillAvailable = reservationSpaceProductSpaces.filter(reservationSpaceProductSpace => {
          return venueSpaceAvailabilityPerDay[sharedDate][reservationSpaceProductSpace.id];
        });
        if (!spacesStillAvailable.length || reservationSpaceQuantity > spacesStillAvailable.length) {
          spacesStillAvailable.map(spaceId => (venueSpaceAvailabilityPerDay[sharedDate][spaceId] = false));
          // so each reservation only gets reported to bugsnag once
          if (!overBooked[reservation.id]) {
            overBooked[reservation.id] = {
              // $FlowIgnore
              [model]: reservation[model].id,
              date: sharedDate
            };
          }
          return null;
        }
        while (reservationSpaceQuantity > 0) {
          for (let i = 0; i < reservationSpaceProductSpaces.length; i++) {
            if (reservationSpaceQuantity <= 0) break;
            if (venueSpaceAvailabilityPerDay[sharedDate][reservationSpaceProductSpaces[i].id]) {
              venueSpaceAvailabilityPerDay[sharedDate][reservationSpaceProductSpaces[i].id] = false;
              reservationSpaceQuantity--;
            }
          }
        }
      });
    }

    if (Object.keys(overBooked).length) {
      Object.keys(overBooked).map(reservationId => {
        Bugsnag.notify('Availability Overbooked Error', function (e: { context: string }) {
          e.context = `PRODUCT OVERBOOKING: ID:${overBooked[reservationId][model]} on ${overBooked[reservationId].date} for reservation ${reservationId}`;
        });
      });
    }

    return [venueSpaceAvailabilityPerDay, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default getVenueSpacesAvailabilityByDay;
