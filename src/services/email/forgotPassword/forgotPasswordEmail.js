import getForgotPasswordTemplate from './forgotPasswordTemplate';
import { ssPost } from 'Utils/ssNetworkRequests';
import { supportWebmaster } from 'Config/vars';

async function forgotPasswordEmail({ email, name, resetPasswordToken }) {
  const config = {
    key: 'reset-pw-email',
    message: {
      html: getForgotPasswordTemplate(resetPasswordToken),
      subject: 'Open Stalls - Password Reset Request',
      from_email: supportWebmaster,
      from_name: 'Open Stalls',
      to: [
        {
          email,
          name,
          type: 'to'
        }
      ],
      headers: {
        'Reply-To': supportWebmaster
      },
      async: false
    }
  };
  return await ssPost('/email/send', { config });
}

export default forgotPasswordEmail;
