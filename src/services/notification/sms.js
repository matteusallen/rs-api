import { ssPost } from 'Utils/ssNetworkRequests';

async function sms(messagesConfig) {
  try {
    const config = {
      twilioSid: process.env.TWILIO_SID,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN
    };
    return await ssPost('/twilio/send-sms', { config, messagesConfig });
  } catch (error) {
    return {
      error: `There was a problem sending the sms message(s): ${error}`,
      success: false
    };
  }
}

export default sms;
