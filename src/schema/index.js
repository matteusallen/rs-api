/* eslint-disable import/max-dependencies */
import getUserFromToken from 'Lib/getUserFromToken';
import userResolvers from './user';
import userRoleResolvers from './userRole';
import venueResolvers from './venue';
import eventResolvers from './event';
import buildingResolvers from './building';
import stallResolvers from './stall';
import reservationResolvers from './reservation';
import addOnResolvers from './addOn';
import paymentResolvers from './payment';
import reservationStatusResolvers from './reservationStatus';
import orderResolvers from './order';
import orderItemResolvers from './orderItem';
import stallProductResolvers from './stallProduct';
import rvProductResolvers from './rvProduct';
import addOnProductResolvers from './addOnProduct';
import rvLotResolvers from './rvLot';
import rvSpotResolvers from './rvSpot';
import documentResolvers from './document';
import updateEventAndProductInfo from './superAdmin';
import groupResolvers from './group';
import groupOrderResolvers from './groupOrder';

const path = require('path');
const { mergeResolvers } = require('@graphql-tools/merge');
const { importSchema } = require('graphql-import');
const depthLimit = require('graphql-depth-limit');
const { GraphQLDate, GraphQLDateTime, GraphQLTime } = require('graphql-iso-date');

const schema = importSchema(path.resolve(`src/schema/schema.graphql`));

const customScalars = {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime
};

const resolvers = mergeResolvers([
  customScalars,
  userResolvers,
  userRoleResolvers,
  venueResolvers,
  eventResolvers,
  buildingResolvers,
  stallResolvers,
  reservationResolvers,
  addOnResolvers,
  paymentResolvers,
  reservationStatusResolvers,
  orderResolvers,
  orderItemResolvers,
  stallProductResolvers,
  rvProductResolvers,
  addOnProductResolvers,
  rvLotResolvers,
  rvSpotResolvers,
  documentResolvers,
  updateEventAndProductInfo,
  groupResolvers,
  groupOrderResolvers
]);

const apolloSchema = {
  typeDefs: [schema],
  resolvers,
  context: async ({ req }) => getUserFromToken(req),
  validationRules: [depthLimit(6)],
  tracing: true
};

export default apolloSchema;
