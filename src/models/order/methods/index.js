/* eslint-disable import/max-dependencies */
import createOrder from './createOrder';
import findAvailabilityError from './findAvailabilityError';
import orderCosts from './orderCosts';
import calculateProductDiscount from './calculateProductDiscount';
import groupOrderCheckout from './groupOrderCheckout';
import orderCheckout from './orderCheckout';
import sendConfirmationEmail from './sendConfirmationEmail';
import sendChargeEmail from './sendChargeEmail';
import sendRefundEmail from './sendRefundEmail';
import getFullOrder from './getFullOrder';
import getOrderById from './getOrderById';
import getOrders from './getOrders';
import getOrderFilterOptions from './getOrderFilterOptions';
import sortOrders from './sortOrders';
import updateOrder from './updateOrder';
import getOrdersByEventId from './getOrdersByEventId';
import getOrdersByUserId from './getOrdersByUserId';
import sendAssignmentsSmsByOrderIds from './sendAssignmentsSmsByOrderIds';
import sendCustomSmsByOrderIds from './sendCustomSmsByOrderIds';
import getDetailsSMSCount from './getDetailsSMSCount';
import cancel from './cancel';
import getConfirmationEmailData from './getConfirmationEmailData';
import getChargeEmailData from './getChargeEmailData';
import getNextOrderByXRefTypeId from './getNextOrderByXRefTypeId';
import getOrderUpdatePricingDifferences from './getOrderUpdatePricingDifferences';
import getOrderByStall from './getOrderByStall';
import createOrderRecordActivity from './createOrderRecordActivity';
import sendCancellationEmail from './sendCancellationEmail';
import getOrderCostFee from './getOrderCostFee';
import calculateDiscountFromAlteredDate from './calculateDiscountFromAAlteredDate';
import setIsVisited from './setIsVisited';

export default {
  createOrder,
  findAvailabilityError,
  getDetailsSMSCount,
  getOrderUpdatePricingDifferences,
  orderCosts,
  calculateProductDiscount,
  orderCheckout,
  groupOrderCheckout,
  sendConfirmationEmail,
  sendChargeEmail,
  sendRefundEmail,
  getFullOrder,
  getOrderById,
  getOrders,
  getOrderFilterOptions,
  sortOrders,
  updateOrder,
  getOrdersByEventId,
  getOrdersByUserId,
  sendAssignmentsSmsByOrderIds,
  sendCustomSmsByOrderIds,
  cancel,
  getConfirmationEmailData,
  getChargeEmailData,
  getNextOrderByXRefTypeId,
  getOrderByStall,
  createOrderRecordActivity,
  sendCancellationEmail,
  getOrderCostFee,
  calculateDiscountFromAlteredDate,
  setIsVisited
};
