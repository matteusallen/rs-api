// @flow
import { Op } from 'sequelize';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { STALL_PRODUCT_X_REF_TYPE_ID } from 'Constants';

import type { SpaceAvailabilityInputType, SpaceAvailabilityReturnType } from '../types';

const moment = extendMoment(Moment);

async function getAvailableSpaces(input: SpaceAvailabilityInputType): SpaceAvailabilityReturnType {
  try {
    let availableProductSpaceIds = [];
    const { Reservation, StallProduct, Stall, RVProduct, RVSpot, Event } = this.sequelize.models;
    const { xRefTypeId, productId, startDate, endDate, reservationId, includeCurrentReservation } = input;
    const isStalls = xRefTypeId == STALL_PRODUCT_X_REF_TYPE_ID;

    const checkingDates = Array.from(moment.range(moment.utc(startDate), moment.utc(endDate)).by('day')).map(day => day.format('YYYY-MM-DD'));
    checkingDates.pop();

    const model = isStalls ? StallProduct : RVProduct;
    const spaces = isStalls ? 'stalls' : 'rvSpots';
    const spaceModel = isStalls ? Stall : RVSpot;
    const spaceContainer = isStalls ? 'building' : 'rvLot';

    const product = await model.findOne({
      where: { id: productId },
      include: [{ association: spaces, where: { disabled: { [Op.is]: null } } }]
    });

    const event = await Event.findOne({ where: { id: product.eventId }, attributes: ['rvFlip', 'stallFlip', 'startDate', 'endDate'] });

    const isFlippingEnabled = isStalls ? event.stallFlip : event.rvFlip;

    if (!isFlippingEnabled) {
      const whereClause = {
        id: { [Op.not]: null },
        xRefTypeId,
        [Op.or]: {
          startDate: { [Op.between]: [event.startDate, event.endDate] },
          endDate: { [Op.between]: [event.startDate, event.endDate] },
          [Op.and]: {
            startDate: { [Op.lte]: event.startDate },
            endDate: { [Op.gte]: event.endDate }
          }
        }
      };

      if (reservationId && includeCurrentReservation) {
        //for update order
        whereClause.id = { [Op.not]: reservationId };
      }
      const productReservations = await Reservation.findAll({
        where: whereClause,
        include: [{ association: 'reservationSpaces', attributes: ['spaceId'] }],
        attributes: ['id']
      });

      const productReservationsSpaces = [];
      productReservations.forEach(productReservation => {
        productReservation.reservationSpaces.forEach(rs => productReservationsSpaces.push(rs.spaceId));
      });

      const productSpaces = isStalls ? product.stalls.map(p => p.id) : product.rvSpots.map(p => p.id);

      availableProductSpaceIds = productSpaces.filter(id => !productReservationsSpaces.includes(id));
    } else {
      const productSpaceIds = product[spaces].map(space => space.id);
      const whereClause = {
        id: { [Op.not]: null },
        [Op.or]: {
          startDate: { [Op.between]: [startDate, endDate] },
          endDate: { [Op.between]: [startDate, endDate] },
          [Op.and]: {
            startDate: { [Op.lte]: startDate },
            endDate: { [Op.gte]: endDate }
          }
        },
        xRefTypeId
      };

      if (reservationId) {
        whereClause.id = { [Op.not]: reservationId };
      }

      const reservations = await Reservation.findAll({
        where: whereClause,
        include: [{ association: 'reservationSpaces', where: { spaceId: { [Op.in]: productSpaceIds } } }]
      });

      const reservedProductSpaceIds = reservations.reduce((acc, curr) => {
        // check if reservation dates overlap and add them if so
        const currDates = Array.from(moment.range(curr.startDate, curr.endDate).by('day')).map(day => day.format('YYYY-MM-DD'));
        currDates.pop();
        const sharedDates = currDates.filter(value => checkingDates.includes(value));
        if (sharedDates.length) {
          const reservationSpaceSpaceIds = curr.reservationSpaces.map(reservationSpace => reservationSpace.spaceId);
          acc.push(...reservationSpaceSpaceIds);
        }
        return acc;
      }, []);

      availableProductSpaceIds = productSpaceIds.filter(productSpaceIds => !reservedProductSpaceIds.includes(productSpaceIds));
    }

    const availableSpaces = await spaceModel.findAll({
      where: { id: { [Op.in]: availableProductSpaceIds } },
      include: [{ association: spaceContainer }]
    });

    const availability = availableSpaces.reduce((acc, curr) => {
      const index = acc.findIndex(spaceContainerAvailability => spaceContainerAvailability[spaceContainer].id === curr[spaceContainer].id);
      if (index > -1) {
        acc[index].availableSpaces.push(curr);
      } else {
        // $FlowIgnore
        acc.push({ [spaceContainer]: curr[spaceContainer], availableSpaces: [curr] });
      }
      return acc;
    }, []);

    return [availability, undefined];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return [undefined, error];
  }
}

export default getAvailableSpaces;
