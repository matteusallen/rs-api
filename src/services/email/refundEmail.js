import getReservationConfirmationTemplate from './reservationConfirmation/confirmationEmailTemplate';
import { ssPost } from 'Utils/ssNetworkRequests';
import { supportWebmaster } from 'Config/vars';

async function refundEmail({ order, user, payment, subtotal, rvs, stalls, addOns, receiptLineItems: lineItems }) {
  try {
    const { email } = user;
    const { event } = order;
    const { venue } = event;
    const emailSubject = 'Your Open Stalls Refund Confirmation';
    const config = {
      key: 'reservation-refund-email',
      message: {
        html: getReservationConfirmationTemplate({
          venue,
          event,
          order,
          payment,
          isUpdatedReservation: true,
          isRefund: true,
          subtotal,
          rvs,
          stalls,
          addOns,
          lineItems
        }),
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
    return {
      error: `There was a problem sending the refund email: ${error}`,
      success: false
    };
  }
}

export default refundEmail;
