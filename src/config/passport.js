import { User } from 'Models';
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { jwtSecret } = require('./vars');

const jwtOptions = {
  secretOrKey: jwtSecret,
  /*
  DOCS: https://www.npmjs.com/package/passport-jwt#included-extractors
  This will try to extract the JWT token from the header "Authorization Bearer token"
  and then will try to extract from QueryString ?accessToken=token
  */
  jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme('Bearer'), ExtractJwt.fromUrlQueryParameter('accessToken')])
};

const jwt = async (payload, done) => {
  try {
    const user = await User.getUser(payload.sub);

    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
