// @flow
import moment from 'moment';

import type { ResetPasswordTokenExpiredType } from '../types';

async function checkResetPasswordTokenExpired(resetToken: string): Promise<ResetPasswordTokenExpiredType> {
  try {
    const res = await this.findOne({ where: { ['resetPasswordToken']: resetToken } });
    if (!res) {
      return {
        error: null,
        expired: true
      };
    }
    return {
      error: null,
      expired: moment(res.resetPasswordTokenExpirationDate).isSameOrBefore()
    };
  } catch (error) {
    return {
      error,
      expired: false
    };
  }
}

export default checkResetPasswordTokenExpired;
