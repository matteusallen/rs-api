import newChargeEmailTemplate from './newChargeEmailTemplate';
import { ssPost } from 'Utils/ssNetworkRequests';
import { supportWebmaster } from 'Config/vars';
import getDocuments from '../../../models/document/methods/getDocuments';

async function updateConfirmationEmail(args, roleId) {
  const { user } = args;
  let venueMaps = [];

  if (args.order?.event?.dataValues?.venueId && args.order?.event?.dataValues?.venueMapDocumentId) {
    [venueMaps] = await getDocuments({ venueId: args.order.event.dataValues.venueId, typeId: '2', id: args.order.event.dataValues.venueMapDocumentId }, roleId);
  }

  args.venueMapUrl = venueMaps.length === 1 ? venueMaps[0].url.split('?')[0] : null;

  try {
    const { userInput } = user;
    const { email } = userInput;
    const emailSubject = 'Your Updated Open Stalls Reservation Confirmation';

    const config = {
      key: 'new-charge-email',
      message: {
        html: newChargeEmailTemplate(args),
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
      error: `There was a problem sending the update reservation confirmation email: ${error}`,
      success: false
    };
  }
}

export default updateConfirmationEmail;
