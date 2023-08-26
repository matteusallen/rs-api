// @flow
import moment from 'moment';

import type { LoginInputType, LoginPayloadType } from '../types';
import { ssPost } from 'Utils/ssNetworkRequests';
import { unallowedActionsByroles } from 'Constants';

const { jwtExpiration, jwtSecret } = require('../../../config/vars');

async function logIn(input: LoginInputType): Promise<LoginPayloadType> {
  try {
    const { email, password } = input;
    const { payload: user } = await this.getUser({ email });

    const payload = {
      password,
      hash: user ? user.password : '',
      id: user ? user.id : '',
      secret: jwtSecret,
      expiration: jwtExpiration
    };

    const { data: response } = await ssPost('/auth/login', payload);

    if (response.success) {
      // save to local database lastLogin, token, & token expiration
      const tokenExpirationDate = moment().add(jwtExpiration, 'minutes').toDate();
      const userWithToken = await this.update(
        { token: response.token, tokenExpirationDate, lastLogin: moment().toDate() },
        { where: { id: user.id }, returning: true }
        // eslint-disable-next-line
      ).then(([_, res]) => res[0]);
      const originalUserWithtoken = { ...user };
      originalUserWithtoken.token = userWithToken.token;
      originalUserWithtoken.tokenExpirationDate = userWithToken.tokenExpirationDate;
      originalUserWithtoken.unallowedActions = unallowedActionsByroles[`${user.roleId}`];

      return {
        user: originalUserWithtoken,
        auth: response
      };
    }

    return {
      user: null,
      auth: response
    };
  } catch (error) {
    return {
      user: null,
      auth: {
        authorized: false,
        error
      }
    };
  }
}

export default logIn;
