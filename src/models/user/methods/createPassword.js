//@flow
import jwt from 'jwt-simple';
import type { CreatePasswordInputType, CreatePasswordReturnType } from '../types';
import { ssNetworkRequests } from 'Utils';
import { jwtSecret } from 'Config/vars';

async function createPassword({ token, password }: CreatePasswordInputType): Promise<[CreatePasswordReturnType | void, string | void]> {
  try {
    const { ssPost } = ssNetworkRequests;
    const { id } = jwt.decode(token, jwtSecret);

    const [localUser, { data: passwordHash }] = await Promise.all([this.findOne({ where: { id } }), ssPost('/auth/create-hash', { password })]);

    localUser.resetPasswordToken = null;
    localUser.resetPasswordTokenExpirationDate = null;
    localUser.password = passwordHash;
    await localUser.save();

    return [localUser, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default createPassword;
