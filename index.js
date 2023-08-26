import chalk from 'chalk';
import app from 'Config/express';
import db from 'Config/db';
import logger from 'Config/winston';
import { port } from 'Config/vars';

const { NODE_ENV = 'development', DEPLOYMENT_ENV = 'local' } = process.env;
db.connect(err => {
  if (err) {
    logger.error(`Error connecting to database ${err.stack}`);
    process.exit(1);
  } else {
    logger.info(chalk.yellow('Connected to PostgreSQL DB'));
    app.listen({ port }, () => {
      logger.info(
        `${chalk.yellow('Server Ready.')} ${chalk.grey('Node Env:')} ${chalk.green(NODE_ENV)} ${chalk.grey('Deployment Env:')} ${chalk.green(DEPLOYMENT_ENV)}`
      );
    });
  }
});
