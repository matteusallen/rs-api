const path = require('path');

module.exports = {
  appSrc: path.resolve('src'),
  build: path.resolve('build'),
  cache: path.resolve('src/cache'),
  config: path.resolve('src/config'),
  constants: path.resolve('src/constants'),
  cronJobs: path.resolve('src/cronJobs'),
  db: path.resolve('src/db'),
  env: path.resolve('.env'),
  entry: path.resolve('src/index.js'),
  helpers: path.resolve('src/helpers'),
  lib: path.resolve('src/lib'),
  models: path.resolve('src/models'),
  routes: path.resolve('src/routes'),
  schema: path.resolve('src/schema'),
  services: path.resolve('src/services'),
  tests: path.resolve('test'),
  types: path.resolve('src/types'),
  utils: path.resolve('src/utils')
};
