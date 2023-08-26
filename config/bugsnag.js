const bugsnag = require('@bugsnag/js');
const bugsnagPluginExpress = require('@bugsnag/plugin-express');

const { DEPLOYMENT_ENV = 'local' } = process.env;

bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY,
  plugins: [bugsnagPluginExpress],
  enabledReleaseStages: ['production', 'staging', 'dev', 'pr_app'],
  releaseStage: DEPLOYMENT_ENV
});

const bugsnagMiddleware = bugsnag.getPlugin('express');

export default bugsnagMiddleware;
