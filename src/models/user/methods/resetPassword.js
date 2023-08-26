// @flow
import moment from 'moment';

import type { ResetPasswordReturnType, ResetPasswordInputType } from '../types';

const jwt = require('jwt-simple');

const { jwtSecret } = require('../../../config/vars');

import { ssPost } from 'Utils/ssNetworkRequests';

async function resetPassword(input: ResetPasswordInputType): Promise<ResetPasswordReturnType> {
  try {
    const { resetPasswordToken, password } = input;
    const { id } = jwt.decode(resetPasswordToken, jwtSecret);
    const user = await this.findOne({ where: { id } });

    if (!user) return { success: false, error: 'Could not find user' };

    if (!user.resetPasswordToken || user.resetPasswordToken !== resetPasswordToken || moment(user.resetPasswordTokenExpirationDate).isSameOrBefore()) {
      return { success: false, error: 'Invalid token' };
    }

    const { data: passwordHash } = await ssPost('/auth/create-hash', { password });
    await this.update({ password: passwordHash, resetPasswordToken: null, resetPasswordTokenExpirationDate: null }, { where: { id } });
    return {
      success: true,
      error: null
    };
  } catch (error) {
    let errorMessage;
    switch (`${error}`) {
      case 'Error: Token expired':
        errorMessage = 'The reset password link has expired';
        break;
      default:
        errorMessage = `There was a problem reseting the password: ${error}`;
    }

    return { success: false, error: errorMessage };
  }
}

export default resetPassword;
