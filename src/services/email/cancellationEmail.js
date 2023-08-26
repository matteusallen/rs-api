import cancellationEmailTemplate from './reservationConfirmation/cancellationEmailTemplate';
import { ssPost } from 'Utils/ssNetworkRequests';
import { supportWebmaster } from 'Config/vars';
import logger from 'Config/winston';

async function cancellationEmail(order, email, refund, products) {
  try {
    const emailSubject = 'Your Open Stalls Order has been Cancelled';
    const config = {
      key: 'reservation-cancellation-email',
      message: {
        html: cancellationEmailTemplate(order, refund, products),
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
    if (response.error) throw Error(response.error);
    return response;
  } catch (error) {
    logger.error(`There was a problem sending the cancellation email: ${error.message}`);
  }
}

export default cancellationEmail;
