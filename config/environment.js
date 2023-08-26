const { NODE_ENV } = process.env;
let environment;

switch (NODE_ENV) {
  case 'production':
    environment = 'production';
    break;
  case 'development':
    environment = 'development';
    break;
  default:
    environment = 'development';
}

module.exports = environment;
