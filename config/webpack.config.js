const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');
const paths = require('./paths');
const mode = require('./environment');

const { NODE_ENV, DEPLOYMENT_ENV } = process.env;

const config = {
  entry: {
    api: paths.entry
  },
  output: {
    path: paths.build,
    filename: '[name].bundle.js'
  },
  target: 'node12.18',
  mode,
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.mj', '.mjs'],
    alias: {
      Cache: paths.cache,
      Config: paths.config,
      Constants: paths.constants,
      CronJobs: paths.cronJobs,
      Db: paths.db,
      Helpers: paths.helpers,
      Lib: paths.lib,
      Models: paths.models,
      Routes: paths.routes,
      Schema: paths.schema,
      Services: paths.services,
      Types: paths.types,
      Tests: paths.tests,
      Utils: paths.utils
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mj|mjs)$/i,
        include: paths.appSrc,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime'],
            sourceType: 'unambiguous',
            presets: ['@babel/preset-env', '@babel/preset-flow', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(ts|tsx)$/i,
        use: 'ts-loader',
        include: paths.appSrc,
        exclude: /node_modules/
      },
      {
        test: /\.(graphql|gql)$/i,
        include: paths.appSrc,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  plugins: []
};

if (NODE_ENV === 'development' || DEPLOYMENT_ENV === 'local') {
  config.plugins.push(new Dotenv({ path: paths.env }));
}

module.exports = config;
