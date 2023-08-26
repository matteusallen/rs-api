import getReservationConfirmationTemplate from './confirmationEmailTemplate';
import { ssPost } from 'Utils/ssNetworkRequests';
import { supportWebmaster } from 'Config/vars';
import getDocuments from '../../../models/document/methods/getDocuments';

async function reservationConfirmation(args, roleId) {
  const { user } = args;
  const [venueMaps] = await getDocuments(
    { venueId: args.order.event.dataValues.venueId, typeId: '2', id: args.order.event.dataValues.venueMapDocumentId },
    roleId
  );
  args.venueMapUrl = venueMaps.length === 1 ? venueMaps[0].url.split('?')[0] : null;

  try {
    const { userInput } = user;
    const { email } = userInput;
    const isUpdateConfirmation = args.isUpdatedReservation || false;
    const emailSubject = isUpdateConfirmation ? 'Your Updated Open Stalls Reservation Confirmation' : 'Your Open Stalls Reservation Confirmation';

    const config = {
      key: 'new-reservation-email',
      message: {
        html: getReservationConfirmationTemplate(args),
        subject: emailSubject,
        from_email: supportWebmaster,
        from_name: 'Open Stalls',
        to: [
          {
            email,
            type: 'to'
          }
        ],
        headers: {
          'Reply-To': supportWebmaster
        },
        async: false
      }
    };

    const response = await ssPost('/email/send', { config });
    return response;
  } catch (error) {
    return {
      error: `There was a problem sending the confirmation email: ${error}`,
      success: false
    };
  }
}

export default reservationConfirmation;
