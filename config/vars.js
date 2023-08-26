const path = require('path');

require('dotenv-safe').config({
  allowEmptyValues: true,
  path: path.resolve('.env'),
  sample: path.resolve('.env.example')
});

const knownDomains = process.env.KNOWNDOMAINS ? process.env.KNOWNDOMAINS.split(',') : ['http://localhost:3000', 'http://localhost:5000'];
const supportWebmaster = process.env?.SUPPORT_WEBMASTER || 'support@rodeologistics.co';
const isNewRelicInjected = typeof newrelic !== 'undefined' && typeof newrelicApolloPlugin !== 'undefined' && typeof newrelicFormatter !== 'undefined';

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  ssURL: process.env.API_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION_MINUTES,
  knownDomains,
  supportWebmaster,
  isNewRelicInjected
};
