import { StallProduct, RVProduct, Order, User, Payment } from 'Models';
import { ADD_ON_PRODUCT_X_REF_TYPE_ID, STRIPE_ACCOUNT_TYPE, RESERVATION_X_REF_TYPE_ID } from 'Constants';
import logger from 'Config/winston';
import { getMultipaymentCosts, transformCashPaymentInput, TOTAL_TO_CARD, TOTAL_TO_CASH, checkAvailability } from '../models/order/helpers';

export const isLast4DistinctAndLessThan5 = (payments = []) => {
  const lookUpLastFour = {};
  if (!payments.length) return true;
  for (let payment of payments) {
    if (payment.last4 in lookUpLastFour || !payment.cardPayment) continue;
    else lookUpLastFour[payment.last4] = payment.last4;
  }
  if (Object.keys(lookUpLastFour).length <= 5) return true;
  return false;
};

export const confirmOrderAvailability = async (params = {}) => {
  const { event, orderItems = [], oldOrderItems = [], roleId } = params;

  const input = [];
  for (const orderItem of oldOrderItems) {
    if (orderItem.xRefTypeId === RESERVATION_X_REF_TYPE_ID) {
      const existingRefType = orderItem.reservation.xRefTypeId;

      const matchedItems = orderItems.filter(oi => +oi.xRefTypeId === +existingRefType);
      if (matchedItems && matchedItems.length) {
        input.push({
          xRefTypeId: existingRefType,
          reservationId: orderItem.reservation.id
        });
      }
    }
  }

  const stallOrderItem = orderItems.find(orderItem => parseInt(orderItem.xRefTypeId) === 1);
  const rvOrderItem = orderItems.find(orderItem => parseInt(orderItem.xRefTypeId) === 3);

  const stallReservation = stallOrderItem ? input.find(oi => +oi.xRefTypeId === +stallOrderItem.xRefTypeId) : null;
  const stallReservationId = stallReservation ? stallReservation.reservationId : null;
  const rvReservation = rvOrderItem ? input.find(oi => +oi.xRefTypeId === +rvOrderItem.xRefTypeId) : null;
  const rvReservationId = rvReservation ? rvReservation.reservationId : null;

  //check if its an addon
  if (orderItems.length > 1 || orderItems.findIndex(orderItem => orderItem.xRefTypeId !== ADD_ON_PRODUCT_X_REF_TYPE_ID)) {
    await checkAvailability(Order, StallProduct, RVProduct, orderItems, event.id, stallReservationId || rvReservationId, roleId);
  }
};

export const calculateDifferenceInQuantity = (ordersItems = [], existingOrderItems = []) => {
  const newOrderItems = ordersItems.map(orderItem => {
    let quantity = 0;
    existingOrderItems.forEach(oi => {
      quantity = oi.quantity - orderItem.quantity;
      quantity = Math.abs(quantity) > 0 ? Math.abs(quantity) : orderItem.quantity;
    });
    return { ...orderItem, quantity };
  });

  return newOrderItems;
};

const settlePayment = async (adminId, postedPayment, paymentInput, orderId, costs, venue) => {
  const payment = {
    adminId,
    ssChargeId: postedPayment ? postedPayment.chargeId : null,
    cardPayment: paymentInput.useCard ? true : false,
    cardBrand: postedPayment && postedPayment.paymentDetails && postedPayment.paymentDetails.card ? postedPayment.paymentDetails.card.brand : null,
    last4: postedPayment && postedPayment.paymentDetails && postedPayment.paymentDetails.card ? postedPayment.paymentDetails.card.last4 : null,
    ssRefundId: null,
    orderId,
    amount: Number(costs.total.toFixed(2)),
    success: true,
    stripeAccountType: venue.stripeAccountType,
    serviceFee: costs.serviceFee,
    stripeFee: paymentInput.useCard ? Number(costs.stripeFee.toFixed(2)) : 0
  };

  const [postedPaymentAdded, postPaymentError] = await Payment.addPayment(payment);

  if (postPaymentError) throw postPaymentError;

  logger.info('Charge info added in OS');

  return postedPaymentAdded;
};

export const payWithStripe = async params => {
  const { currentCost, ssGlobalId, venue, paymentInput, adminId, orderId, applyPlatformFeeOnUpdate, multipaymentInput } = params;

  try {
    let postedPayment, postPaymentError;
    let postedCardPayment, postCardPaymentError;
    let postedCashPayment = null;
    let cardCosts;
    let cashCosts;

    if (multipaymentInput.isMultipayment) {
      cardCosts = getMultipaymentCosts(currentCost, multipaymentInput, TOTAL_TO_CARD);
      cashCosts = getMultipaymentCosts(currentCost, multipaymentInput, TOTAL_TO_CASH);
    }

    const stripeFee = STRIPE_ACCOUNT_TYPE.standard === venue.stripeAccountType ? 0 : currentCost.stripeFee;

    if (paymentInput.useCard) {
      const paymentInputWithTotalAndUser = {
        ssGlobalId: ssGlobalId,
        amount: Math.round(multipaymentInput.isMultipayment ? cardCosts.total * 100 : currentCost.total * 100), // amount needs to be in smallest form of currency (pennies),
        application_fee_amount: Math.round((stripeFee + (applyPlatformFeeOnUpdate ? venue.platformFee : 0)) * 100),
        transfer_data: {
          destination: venue.stripeAccount
        },
        ...paymentInput,
        stripeAccountType: venue.stripeAccountType
      };
      const user = await User.findOne({ where: { id: adminId }, attributes: ['roleId'] });
      if (!user) throw Error('Admin user not found!');

      const isRenter = user.dataValues.roleId === 3 ? 'true' : 'false';

      const response = await Payment.postPayment(paymentInputWithTotalAndUser, isRenter);

      if (multipaymentInput.isMultipayment) {
        [postedCardPayment, postCardPaymentError] = response;
      } else {
        [postedPayment, postPaymentError] = response;
      }

      let err;

      if (postPaymentError || postCardPaymentError) {
        err = Error('stripe error');
        err.description = postPaymentError || postCardPaymentError || 'failed payment';
        return multipaymentInput.isMultipayment ? [true, undefined, undefined, err] : [false, undefined, err];
      }
    }

    if (multipaymentInput.isMultipayment) {
      const postedMultiCardPayment = await settlePayment(adminId, postedCardPayment, paymentInput, orderId, cardCosts, venue);
      const cashPaymentInput = transformCashPaymentInput(paymentInput);
      const postedMultiCashPayment = await settlePayment(adminId, postedCashPayment, cashPaymentInput, orderId, cashCosts, venue);

      return [true, postedMultiCardPayment, postedMultiCashPayment, undefined];
    } else {
      const postedUniquePayment = await settlePayment(adminId, postedPayment, paymentInput, orderId, currentCost, venue);

      return [false, postedUniquePayment, undefined];
    }
  } catch (error) {
    if (multipaymentInput.isMultipayment) {
      return [true, undefined, undefined, error];
    }

    return [false, undefined, error];
  }
};

export const isLast4Unique = (arr = []) => {
  const lookUpLast4 = {},
    lookUpChargeId = {};
  let isUnique = true;

  if (arr.length == 0) return !isUnique;
  for (let refund of arr) {
    if (lookUpChargeId[refund['ssChargeId']]) {
      isUnique = false;
      break;
    }
    lookUpChargeId[refund['ssChargeId']] = refund['ssChargeId'];
    lookUpLast4[refund['last4']] = refund['last4'];
  }
  return isUnique;
};

export const getCostInput = (orderItems, newOrderItems) => {
  const input = [];

  for (const orderItem of orderItems) {
    if (orderItem.xRefTypeId === RESERVATION_X_REF_TYPE_ID) {
      const existingOrderXRefTypeId = orderItem.reservation.xRefTypeId;

      const productMatch = newOrderItems.filter(oi => +oi.xRefTypeId === existingOrderXRefTypeId);

      if (productMatch && productMatch.length)
        input.push({
          xProductId: orderItem.reservation.xProductId,
          xRefTypeId: existingOrderXRefTypeId,
          quantity: orderItem.quantity,
          startDate: orderItem?.reservation?.startDate,
          endDate: orderItem?.reservation?.endDate
        });
    } else {
      const productMatch = newOrderItems.filter(oi => oi.xRefTypeId === orderItem.xRefTypeId);
      if (productMatch && productMatch.length)
        input.push({
          xProductId: orderItem.xProductId,
          xRefTypeId: orderItem.xRefTypeId,
          quantity: orderItem.quantity
        });
    }
  }
  return input.length > 0 ? input : newOrderItems;
};

export default {
  isLast4DistinctAndLessThan5,
  confirmOrderAvailability,
  calculateDifferenceInQuantity,
  isLast4Unique,
  payWithStripe
};
