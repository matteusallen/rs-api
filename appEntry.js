const path = require('path');
const fs = require('fs');
const v8 = require('v8');

// eslint-disable-next-line no-console
console.log(v8.getHeapStatistics());

const { DEPLOYMENT_ENV } = process.env;

if (fs.existsSync(path.resolve('.env')) && fs.existsSync(path.resolve('.env.example')) && DEPLOYMENT_ENV === 'local-newrelic') {
  require('dotenv-safe').config({
    allowEmptyValues: true,
    path: path.resolve('.env'),
    sample: path.resolve('.env.example')
  });
}

if (DEPLOYMENT_ENV !== 'local' && DEPLOYMENT_ENV !== 'pr_app') {
  // eslint-disable-next-line node/no-extraneous-require
  global.newrelic = require('newrelic'); // Expose the agent in the global scope
  global.newrelicApolloPlugin = require('@newrelic/apollo-server-plugin');
  global.newrelicFormatter = require('@newrelic/winston-enricher'); // Expose the formatter in the global scope
}

require('./build/api.bundle');
