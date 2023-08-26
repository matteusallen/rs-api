import morgan from 'morgan';
import logger from './winston';

// TODO: Look in to advanced tokens with Morgan
// const registerTokens = () => {
//   morgan.token('graphql-query', req => `GraphQL ${req.body.query}`);
//   morgan.token('origin', req => `${req.protocol}://${req.get('host')}`);
// };
//
// registerTokens();

// const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms :origin\n:graphql-query', { stream: logger.stream });
const morganMiddleware = morgan('common', { stream: logger.stream });

export default morganMiddleware;
