// @flow
const jwt = require('jwt-simple');
const moment = require('moment');

const { jwtExpiration, jwtSecret } = require('../config/vars');

function generateToken(
  id: string | number,
  resetToken: boolean = false
): {
  resetPasswordToken: string,
  resetPasswordTokenExpirationDate: Date | number
} {
  const now = new Date();
  const expiration = resetToken ? 1800 : jwtExpiration;
  const tokenExpirationDate = resetToken ? moment(now).add(expiration, 'seconds') : moment(moment(now).add(expiration, 'seconds')).unix();
  const payload = {
    exp: tokenExpirationDate,
    iat: moment().unix(),
    id
  };
  if (resetToken) {
    return {
      resetPasswordToken: jwt.encode(payload, jwtSecret),
      resetPasswordTokenExpirationDate: tokenExpirationDate
    };
  }
  return jwt.encode(payload, jwtSecret);
}

export default generateToken;
