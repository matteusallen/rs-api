// @flow
import { Op } from 'sequelize';
import moment from 'moment';

import type { SMSByReservationsInputType, SMSReturnType } from '../types';
import customSMS from 'Services/notification/sms';

async function sendDetailsSMS(input: SMSByReservationsInputType): Promise<SMSReturnType> {
  try {
    const { User } = this.sequelize.models;
    const { reservationIds } = input;
    const reservations = await this.findAll({
      where: { id: { [Op.in]: reservationIds } },
      include: [{ association: 'addOns' }, { association: 'stalls' }, { association: 'event', include: [{ association: 'venue' }] }]
    });

    const messageConfigPromises = reservations
      .reduce(
        (sum, r) =>
          (r.assignmentConfirmed && new Date(r.assignmentConfirmed) >= new Date(r.updatedAt)) || r.stalls.length >= r.stallQuantity ? sum : [...sum, r],
        []
      )
      .map(async reservation => {
        const stallNames = reservation.stalls.map(stall => stall.name);

        const renter = await User.getUser({ id: reservation.renterId }).then(result => result.payload);
        let addOnSection = '';

        if (reservation.addOns.length > 0) {
          addOnSection = reservation.addOns.map(addOn => {
            const { priceType, ReservationAddOn, unitName, name } = addOn;
            const { quantity } = ReservationAddOn;
            const plural = quantity > 1 ? 's' : '';
            return `with ${quantity} ${priceType === 'perUnit' ? `${unitName + plural} of ${name}` : `${name + plural}`} `;
          });
        }
        // eslint-disable-next-line prettier/prettier
        const body = `${renter.firstName}, thank you for using Open Stalls for stall reservations at ${reservation.event.venue.name}. You have been assigned ${
          stallNames.length > 1 ? 'stalls' : 'stall'
        } ${stallNames.join(', ')} ${addOnSection}for ${moment(reservation.startDate).format('M/D/YY')} through ${moment(reservation.endDate).format(
          'M/D/YY'
        )}.`;

        return {
          id: reservation.id,
          to: renter.phone,
          from: process.env.TWILIO_MESSAGING_SERVICE_SID,
          body
        };
      });
    const messageConfigs = await Promise.all(messageConfigPromises);
    const response = await customSMS(messageConfigs);

    const reservationUpdatePromises = response.successfulIds.map(async successfulId => {
      await this.update({ assignmentConfirmed: Date.now() }, { where: { id: successfulId } });
    });

    await Promise.all(reservationUpdatePromises);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error
    };
  }
}

export default sendDetailsSMS;
