// @flow
import type { ResetPasswordReturnType, ForgotPasswordInputType } from '../types';

import forgotPasswordEmail from 'Services/email/forgotPassword/forgotPasswordEmail';

async function forgotPassword(input: ForgotPasswordInputType): Promise<ResetPasswordReturnType> {
  const { email } = input;
  try {
    const [ssUser] = await this.getSSUserFields({ email });
    if (!ssUser || !ssUser[0]) {
      // eslint-disable-next-line
      console.warn('Could not find user with provided email in forgotPassword');
      // We don't want to send a failure message back to client, as it's a security risk
      return { error: null, success: true };
    }
    const localUser = await this.findOne({ where: { ssGlobalId: ssUser[0].globalId } });
    const tokenResponse = await this.createResetPasswordToken(localUser);
    if (!tokenResponse.success) throw Error(tokenResponse.error);
    const { user } = tokenResponse;
    const emailResponse = await forgotPasswordEmail({
      email,
      name: ssUser[0].firstName,
      resetPasswordToken: user.resetPasswordToken
    });
    return emailResponse;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Error in forgotPassword: ${error}`);
    // We don't want to send a failure message back to client, as it's a security risk
    return { error: null, success: true };
  }
}

export default forgotPassword;
