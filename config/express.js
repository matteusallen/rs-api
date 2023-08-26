/* global newrelic newrelicApolloPlugin */
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import apolloSchema from 'Schema/index';
import bugsnagMiddleware from 'Config/bugsnag';
import logger from 'Config/winston';
import morganMiddleware from 'Config/morgan';
import { isNewRelicInjected, knownDomains } from 'Config/vars';
import admin from 'Routes/admin';
import notificationRoutes from 'Routes/notifications';
import ops from 'Routes/ops';
import webhooks from 'Routes/webhooks';

const { NODE_ENV = 'development', DEPLOYMENT_ENV = 'local' } = process.env;

function initializeNewRelic() {
  try {
    // NOTE: instruments express _after_ the agent has been loaded, global injection to allow with WebPack bundled app
    if (isNewRelicInjected) {
      newrelic.instrumentLoadedModule('express', express);
      apolloSchema.plugins = [newrelicApolloPlugin];
    }
  } catch (err) {
    logger.error('New Relic initialization error:', err);
  }
}

function corsOptionsDelegate(req, callback) {
  const origin = req.header('Origin');
  if (
    DEPLOYMENT_ENV === 'dev' ||
    DEPLOYMENT_ENV === 'pr_app' ||
    (NODE_ENV === 'development' && !origin) ||
    (DEPLOYMENT_ENV === 'staging' && !origin) || //to allow cypress tests
    knownDomains.indexOf(origin) !== -1 ||
    req.originalUrl.includes('/admin/reports/download') ||
    req.originalUrl.includes('/admin/stripe-payouts')
  ) {
    callback(null, true);
  } else {
    const errorMessage = 'Not allowed by CORS.';
    logger.error(errorMessage);
    logger.info(`Domains recognized by CORS: ${knownDomains}`);
    logger.info(`Request Origin: ${origin}`);
    callback(new Error(errorMessage));
  }
}

function applyMiddlewares(app) {
  app.use(morganMiddleware);
  app.use(bugsnagMiddleware.requestHandler);
  app.use('*', (req, res, next) => {
    logger.info(`Request Origin - ${req.protocol}://${req.get('host')}`);
    next();
  });
  app.use('*', cors(corsOptionsDelegate));
  app.use(bugsnagMiddleware.errorHandler);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  const apolloServer = new ApolloServer(apolloSchema);
  apolloServer.applyMiddleware({ app });
}

function bindRestRoutes(app) {
  const routes = [admin, notificationRoutes, ops, webhooks];
  routes.forEach(route => {
    route(app);
  });
}

initializeNewRelic();
const app = express();
applyMiddlewares(app);
bindRestRoutes(app);

export default app;
