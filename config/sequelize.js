const path = require('path');
require('dotenv-safe').config({
  allowEmptyValues: true,
  path: path.resolve('.env'),
  sample: path.resolve('.env.example')
});

const isTesting = process.env.NODE_ENV === 'test';

const baseConfig = {
  dialect: 'postgres',
  port: process.env.SQL_PORT,
  protocol: 'postgres',
  connectionTimeout: 0,
  logging: isTesting ? false : () => Boolean(process.env.SEQUELIZE_LOG),
  retry: { max: 1 },
  pool: {
    max: 70,
    min: 0,
    idle: 200000,
    acquire: 200000
  },
  dialectOptions: {
    encrypt: true,
    connectTimeout: 300000
  }
};

const prodSequelizeConfig = Object.assign({}, baseConfig, {
  use_env_variable: 'DATABASE_URL',
  logging: false,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true
    }
  }
});

const prodPGConnectionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

const devConfig = Object.assign({}, baseConfig, {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  host: process.env.SQL_HOST
});

const testConfig = Object.assign({}, baseConfig, {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE_TEST,
  host: process.env.SQL_HOST
});

module.exports = {
  development: devConfig,
  test: testConfig,
  productionPG: prodPGConnectionConfig,
  production: prodSequelizeConfig
};
