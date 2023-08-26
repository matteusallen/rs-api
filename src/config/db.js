const { Client } = require('pg');

const env = process.env.NODE_ENV || 'development';
const config = require('./sequelize');

const connectionArgs = [];
if (env !== 'production') {
  connectionArgs.push(config[env]);
} else {
  connectionArgs.push(config.productionPG);
}

const client = new Client(...connectionArgs);

module.exports = client;
