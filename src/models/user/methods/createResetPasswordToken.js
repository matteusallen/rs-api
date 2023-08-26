// @flow
import type { UserType } from '../types';

import generateToken from 'Lib/generateToken';

type CreatePasswordResetTokenReturnType = {|
  error?: string,
  success: boolean,
  user?: UserType
|};

async function createResetPasswordToken(
  // eslint-disable-next-line flowtype/no-weak-types
  user: any,
  config: {}
): Promise<CreatePasswordResetTokenReturnType> {
  try {
    const localConfig = config ? { ...config, returning: true } : { returning: true };
    const { resetPasswordToken, resetPasswordTokenExpirationDate } = generateToken(user.id, true);

    const updatedUser = await user.update({ resetPasswordToken, resetPasswordTokenExpirationDate }, localConfig);
    return { user: updatedUser, success: true };
  } catch (error) {
    return { error, success: false };
  }
}

export default createResetPasswordToken;
