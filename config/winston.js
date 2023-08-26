/* global newrelicFormatter */
import winston from 'winston';
import { isNewRelicInjected } from 'Config/vars';

const { DEPLOYMENT_ENV = 'local' } = process.env;

const loggerConfig = {
  level: 'http',
  format: winston.format.combine(winston.format.simple(), winston.format.colorize()),
  defaultMeta: { service: 'open-stalls-api' },
  transports: [
    new winston.transports.Console({
      name: 'console-logs',
      level: 'http',
      format: winston.format.combine(winston.format.simple(), winston.format.colorize()),
      colorize: true,
      showLevel: true,
      handleExceptions: true,
      json: true,
      humanReadableUnhandledException: true
    })
  ]
};

if (isNewRelicInjected) {
  loggerConfig.format = winston.format.combine(winston.format.simple(), winston.format.colorize(), newrelicFormatter());
}

const logger = winston.createLogger(loggerConfig);

// local log files for debugging, TODO: should probably set up a second transport layer for hosted environments with S3
if (DEPLOYMENT_ENV === 'local') {
  logger.add(
    new winston.transports.File({
      name: 'info-file',
      level: 'info',
      showLevel: true,
      filename: 'info.log'
    }),
    new winston.transports.File({
      name: 'error-file',
      level: 'error',
      showLevel: true,
      filename: 'errors.log'
    })
  );
}

logger.stream = {
  write: message => {
    logger.info(message);
  }
};

export default logger;
