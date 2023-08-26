const Sequelize = require('sequelize');

import _AddOn from './addOn';
import _AddOnProduct from './addOnProduct';
import _Building from './building';
import _Document from './document';
import _DocumentType from './documentType';
import _Event from './event';
import _EventQuestions from './eventQuestions';
import _Notification from './notification';
import _NotificationRequest from './notificationRequest';
import _Order from './order';
import _OrderItem from './orderItem';
import _Payment from './payment';
import _Payout from './payout';
import _ProductQuestion from './productQuestion';
import _ProductQuestionAnswer from './productQuestionAnswer';
import _ProductXRefType from './productXRefType';
import _Reservation from './reservation';
import _ReservationSpace from './reservationSpace';
import _ReservationStatus from './reservationStatus';
import _RVLot from './rvLot';
import _RVProduct from './rvProduct';
import _RVProductRVSpot from './rvProductRVSpot';
import _RVSpot from './rvSpot';
import _Stall from './stall';
import _StallProduct from './stallProduct';
import _StallProductStall from './stallProductStall';
import _User from './user';
import _UserRole from './userRole';
import _UserVenue from './userVenue';
import _Venue from './venue';
import _Group from './group';
import _GroupOrder from './groupOrder';
import _GroupOrderBill from './groupOrderBill';
import _OrderHistory from './orderHistory';
import _ProductDiscount from './productDiscount';
import _OrderHistoryPayments from './orderHistoryPayments';

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/max-dependencies
const config = require('../config/sequelize')[env];

const sequelizeArgs = [];

if (env !== 'production') {
  sequelizeArgs.push(config.database, config.user, config.password, config);
} else {
  const { use_env_variable, ...sqlConfig } = config;
  const url = process.env[use_env_variable];
  sequelizeArgs.push(url, sqlConfig);
}

const sequelize = new Sequelize(...sequelizeArgs);
const db = {};

const models = [
  _AddOn,
  _AddOnProduct,
  _Building,
  _Document,
  _DocumentType,
  _Event,
  _EventQuestions,
  _Notification,
  _NotificationRequest,
  _Order,
  _OrderItem,
  _Payment,
  _Payout,
  _ProductQuestion,
  _ProductQuestionAnswer,
  _ProductXRefType,
  _Reservation,
  _ReservationSpace,
  _ReservationStatus,
  _RVLot,
  _RVProduct,
  _RVProductRVSpot,
  _RVSpot,
  _Stall,
  _StallProduct,
  _StallProductStall,
  _User,
  _UserRole,
  _UserVenue,
  _Venue,
  _Group,
  _GroupOrder,
  _GroupOrderBill,
  _OrderHistory,
  _ProductDiscount,
  _OrderHistoryPayments
];

models.forEach(bindSequelize => {
  const model = bindSequelize(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

export const AddOn = db['AddOn'];
export const AddOnProduct = db['AddOnProduct'];
export const Building = db['Building'];
export const Document = db['Document'];
export const DocumentType = db['DocumentType'];
export const Event = db['Event'];
export const EventQuestions = db['EventQuestions'];
export const Notification = db['Notification'];
export const NotificationRequest = db['NotificationRequest'];
export const Order = db['Order'];
export const OrderItem = db['OrderItem'];
export const Payment = db['Payment'];
export const Payout = db['Payout'];
export const ProductQuestion = db['ProductQuestion'];
export const ProductQuestionAnswer = db['ProductQuestionAnswer'];
export const ProductXRefType = db['ProductXRefType'];
export const Reservation = db['Reservation'];
export const ReservationSpace = db['ReservationSpace'];
export const ReservationStatus = db['ReservationStatus'];
export const RVLot = db['RVLot'];
export const RVProduct = db['RVProduct'];
export const RVProductRVSpot = db['RVProductRVSpot'];
export const RVSpot = db['RVSpot'];
export const Stall = db['Stall'];
export const StallProduct = db['StallProduct'];
export const StallProductStall = db['StallProductStall'];
export const User = db['User'];
export const UserRole = db['UserRole'];
export const UserVenue = db['UserVenue'];
export const Venue = db['Venue'];
export const Group = db['Group'];
export const GroupOrder = db['GroupOrder'];
export const GroupOrderBill = db['GroupOrderBill'];
export const OrderHistory = db['OrderHistory'];
export const ProductDiscount = db['ProductDiscount'];
export const OrderHistoryPayments = db['OrderHistoryPayments'];

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
