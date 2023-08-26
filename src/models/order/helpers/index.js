import Bugsnag from '@bugsnag/js';
import { STRIPE_ACCOUNT_TYPE, ERROR_MESSAGES } from 'Constants';
import logger from 'Config/winston';
import moment from 'moment';

export const TOTAL_TO_CARD = 'totalToCard';
export const TOTAL_TO_CASH = 'totalToCash';

export const checkAvailability = async (Order, StallProduct, RVProduct, orderItems, eventId, reservationId, isRenter, roleId) => {
  const [stallAvailabilityMessage, stallAvailabilityError] = await Order.findAvailabilityError(
    StallProduct,
    1,
    eventId,
    orderItems,
    reservationId,
    isRenter,
    roleId
  );
  const [rvAvailabilityMessage, rvAvailabilityError] = await Order.findAvailabilityError(RVProduct, 3, eventId, orderItems, reservationId, isRenter, roleId);

  if (
    rvAvailabilityMessage === ERROR_MESSAGES.INSUFFICIENT_AVAILABLE_SPACE_COUNT('RV', isRenter) &&
    stallAvailabilityMessage === ERROR_MESSAGES.INSUFFICIENT_AVAILABLE_SPACE_COUNT('Stall', isRenter)
  ) {
    throw Error(ERROR_MESSAGES.INSUFFICIENT_AVAILABLE_SPACE_COUNT('Stall and RV', isRenter));
  } else if (
    rvAvailabilityMessage === ERROR_MESSAGES.INSUFFICIENT_PRODUCT_QUANTITY('RV', isRenter) &&
    stallAvailabilityMessage === ERROR_MESSAGES.INSUFFICIENT_PRODUCT_QUANTITY('Stall', isRenter)
  ) {
    throw Error(ERROR_MESSAGES.INSUFFICIENT_PRODUCT_QUANTITY('Stall and RV', isRenter));
  } else if (
    rvAvailabilityMessage === ERROR_MESSAGES.UNAVAILABLE_PRODUCT_ASSIGNMENT('RV', isRenter) &&
    stallAvailabilityMessage === ERROR_MESSAGES.UNAVAILABLE_PRODUCT_ASSIGNMENT('Stall', isRenter)
  ) {
    throw Error(ERROR_MESSAGES.UNAVAILABLE_PRODUCT_ASSIGNMENT('Stall and RV', isRenter));
  } else if (stallAvailabilityMessage || stallAvailabilityError || rvAvailabilityMessage || rvAvailabilityError) {
    const errorMesssage = [stallAvailabilityMessage, stallAvailabilityError, rvAvailabilityMessage, rvAvailabilityError].join(' ');
    throw Error(errorMesssage);
  }
};

export const getEvent = async (Event, eventId) =>
  await Event.findOne({
    where: { id: eventId },
    include: [{ association: 'venue' }]
  });

export const getCosts = async (Order, useCard, orderItems, isNonUSCard, roleId) => {
  const costs = await Order.orderCosts(
    {
      useCard: useCard,
      selectedOrderItems: orderItems,
      isNonUSCard: isNonUSCard
    },
    roleId
  );

  logger.info(`Order Costs calculated to be ${costs.total}`);

  return costs;
};

export const upsertUser = async (User, userInput, venueId, transaction, roleId) => {
  const [upsertedUser, upsertedUserError] = await User.upsertUser({ ...userInput, venueId }, { transaction }, roleId);

  if (upsertedUserError) {
    throw Error(upsertedUserError);
  }

  logger.info('New user created for this reservation');

  return upsertedUser;
};

export const settlePayment = async (costs, paymentInput, upsertedUser, User, adminId, Payment, event, isRenter) => {
  if (paymentInput.useCard && costs.total) {
    const stripeFee = STRIPE_ACCOUNT_TYPE.standard === event.venue.stripeAccountType ? 0 : costs.stripeFee;
    const paymentInputWithTotalAndUser = {
      ssGlobalId: upsertedUser.ssGlobalId,
      amount: Math.round(costs.total * 100), // amount needs to be in smallest form of currency (pennies),
      application_fee_amount: Math.round((stripeFee + costs.serviceFee) * 100),
      transfer_data: {
        destination: event.venue.stripeAccount
      },
      ...paymentInput,
      stripeAccountType: event.venue.stripeAccountType
    };

    // Don't need transaction here as it is just looking at success from shared services
    const [postedPayment, postPaymentError] = await Payment.postPayment(paymentInputWithTotalAndUser, isRenter);

    if (postPaymentError) {
      const err = Error('stripe error');
      err.description = postPaymentError || 'failed payment';
      throw err;
    }

    logger.info('Payment successfully posted through ROLOSS');

    return postedPayment;
  }

  return null;
};

export const groupSaveRenterPayment = async (paymentInput, upsertedUser, User, adminId, Payment, event) => {
  if (paymentInput.useCard) {
    const paymentInputWithTotalAndUser = {
      ssGlobalId: upsertedUser.ssGlobalId,
      transfer_data: {
        destination: event.venue.stripeAccount
      },
      ...paymentInput,
      stripeAccountType: event.venue.stripeAccountType,
      renterGroup: true
    };

    // Don't need transaction here as it is just looking at success from shared services
    const [saveCard, saveCardError] = await Payment.saveCard(paymentInputWithTotalAndUser);

    if (saveCardError) {
      const err = Error('stripe error');
      err.description = saveCardError || 'failed payment';
      throw err;
    }

    return saveCard;
  }

  return null;
};

export const createPayment = async (adminId, postedPayment, paymentInput, orderId, costs, Payment, event, orderInput) => {
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
    stripeAccountType: event.venue.stripeAccountType,
    serviceFee: costs.serviceFee,
    stripeFee: paymentInput.useCard ? Number(costs.stripeFee.toFixed(2)) : 0
  };

  const [paymentResponse, paymentError] = await Payment.addPayment(payment);

  if (paymentError) {
    logger.error('PAYMENT CREATION ERROR', paymentError);
    // eslint-disable-next-line flowtype/no-types-missing-file-annotation
    Bugsnag.notify(new Error(paymentError), function (e: any) {
      e.setUser(orderInput.userId);
      e.context = `eventId ${orderInput.eventId}`;
    });
  }

  logger.info('Payment info added in OS');

  return paymentResponse;
};

export const getMultipaymentCosts = (costs, multipayment, type) => {
  const subtotal = +multipayment[type];
  const stripeFee = type === TOTAL_TO_CARD ? costs.stripeFee : 0;
  const serviceFee = type === TOTAL_TO_CARD ? (costs.serviceFee ? costs.serviceFee : 0) : 0;
  const discount = type === TOTAL_TO_CARD ? (costs.discount ? costs.discount : 0) : 0;

  if (type === TOTAL_TO_CARD) {
    if (subtotal < +stripeFee.toFixed(2)) {
      throw 'The amount entered is less than mandatory credit transaction fees';
    }
  }

  return {
    ...costs,
    subtotal,
    stripeFee,
    serviceFee,
    discount,
    total: subtotal
  };
};

export const transformCashPaymentInput = paymentInput => ({
  ...paymentInput,
  selectedCard: null,
  useCard: false
});

export const settleMultiPayment = async (costs, paymentInput, upsertedUser, User, adminId, Payment, event, multipayment, isRenter) => {
  const cardCosts = getMultipaymentCosts(costs, multipayment, TOTAL_TO_CARD);
  const postedCardPayment = await settlePayment(cardCosts, paymentInput, upsertedUser, User, adminId, Payment, event, isRenter);

  const cashCosts = getMultipaymentCosts(costs, multipayment, TOTAL_TO_CASH);
  const cashPaymentInput = transformCashPaymentInput(paymentInput);
  const postedCashPayment = await settlePayment(cashCosts, cashPaymentInput, upsertedUser, User, adminId, Payment, event, isRenter);

  return {
    postedCardPayment,
    postedCashPayment
  };
};

export const createMultiPayment = async (
  adminId,
  postedCardPayment,
  postedCashPayment,
  paymentInput,
  newOrderId,
  costs,
  Payment,
  event,
  orderInput,
  multipayment
) => {
  const cardCosts = getMultipaymentCosts(costs, multipayment, TOTAL_TO_CARD);
  const cardPaymentResponse = await createPayment(adminId, postedCardPayment, paymentInput, newOrderId, cardCosts, Payment, event, orderInput);

  const cashCosts = getMultipaymentCosts(costs, multipayment, TOTAL_TO_CASH);
  const cashPaymentInput = transformCashPaymentInput(paymentInput);
  const cashPaymentResponse = await createPayment(adminId, postedCashPayment, cashPaymentInput, newOrderId, cashCosts, Payment, event, orderInput);

  return {
    cardPaymentResponse,
    cashPaymentResponse
  };
};

export const checkMinNights = (dates, minNights) => {
  if (dates.startDate && dates.endDate) {
    const selectedNights = dates.endDate.diff(dates.startDate, 'days');
    const isBelowMin = selectedNights < minNights;
    return isBelowMin;
  }
};

export const checkMinNightsInProducts = async (orderItems, StallProduct, RVProduct) => {
  for (const orderItem of orderItems) {
    // orderCheckout and groupOrderCheckout send same value but different
    // type, the reason of this == instead of ===
    if (orderItem.xRefTypeId == '1') {
      const stallProduct = await StallProduct.findOne({ where: { id: orderItem.xProductId } });
      const dates = {
        startDate: moment(orderItem.startDate),
        endDate: moment(orderItem.endDate)
      };
      const isBelowMinNights = checkMinNights(dates, stallProduct.minNights);

      if (isBelowMinNights) {
        throw Error(ERROR_MESSAGES.SELECTED_DATES_BELOW_MIN_NIGHTS);
      }
    } else if (orderItem.xRefTypeId == '3') {
      const rvProduct = await RVProduct.findOne({ where: { id: orderItem.xProductId } });
      const dates = {
        startDate: moment(orderItem.startDate),
        endDate: moment(orderItem.endDate)
      };
      const isBelowMinNights = checkMinNights(dates, rvProduct.minNights);

      if (isBelowMinNights) {
        throw Error(ERROR_MESSAGES.SELECTED_DATES_BELOW_MIN_NIGHTS);
      }
    }
  }
};
