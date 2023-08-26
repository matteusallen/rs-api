import moment from 'moment';
import 'moment-timezone';
import { ORDER_HISTORY_CHANGE_TYPES } from '../../../../constants/index';
import { isNoRefund } from './cases/noRefund';

export const getBaseRow = history => {
  const timeZone = history.order.event.venue ? history.order.event.venue.timeZone : null;
  const baseUTCDate = moment.tz(history.createdAt, 'UTC');
  const transactionDate = timeZone ? baseUTCDate.tz(timeZone) : moment(baseUTCDate).local();

  const row = {
    orderId: history.orderId,
    transactionDate: transactionDate.format('MM-DD-YYYY hh:mm:ss A'),
    adminName: history.adminName,
    event: history.order.event.name,
    renterName: history.renterName,
    ...getPaymentData(history)
  };

  return row;
};

const getPaymentData = history => {
  const payment = history.orderHistoryPayments[0]?.payment;
  return payment ? getDataFromPayment(payment, history) : getNonPaymentData(history);
};

const getDataFromPayment = (payment, history) => {
  return {
    transactionType: getTransactionType(payment, history),
    isRefund: isRefund(payment),
    cardBrand: getCardBrand(payment, history),
    refundReason: getRefundReason(payment, history),
    ...getFees(payment),
    total: getTotal(payment, history),
    ...getPayoutData(payment.payout),
    stripeAccountType: payment.stripeAccountType || ''
  };
};

const getTransactionType = (payment, history) => {
  let transactionType = payment.cardPayment == true ? 'Card' : 'Cash';

  if (isRefund(payment)) {
    transactionType = `Refund - ${transactionType}`;
  }
  if (payment.isGroupOrder && !history.isSettled) {
    transactionType = 'Deferred';
  }
  if (isNoRefund(history)) {
    transactionType = '-';
  }
  return transactionType;
};

const isRefund = payment => {
  return !!(payment.ssRefundId || payment.amount < 0);
};

const getCardBrand = (payment, history) => {
  return isNoRefund(history) ? '-' : payment.cardBrand;
};

const getRefundReason = (payment, history) => {
  let refundReason = isRefund(payment) ? payment.notes : '-';
  refundReason = isSpecialRefund(history.changeType) ? `Special Refund: ${refundReason}` : refundReason;
  refundReason = payment.isGroupOrder ? '' : refundReason;
  return refundReason;
};

const isSpecialRefund = changeType => {
  return changeType === ORDER_HISTORY_CHANGE_TYPES.specialRefund;
};

const getFees = payment => {
  const roloFee = payment.serviceFee || '-';
  const stripeFee = payment.stripeFee || '-';
  return { roloFee, stripeFee };
};

const getTotal = (payment, history) => {
  return isNoRefund(history) ? '-' : payment.amount;
};

const getPayoutData = payout => {
  return payout
    ? {
        stripePayoutId: payout.stripePayoutId,
        amount: payout.amount / 100,
        paidDate: moment(payout.paidDate).format('MM-DD-YYYY hh:mm:ss')
      }
    : {};
};

const getNonPaymentData = history => {
  const transactionType = isCancelledWithNoRefund(history) ? '-' : 'Non payment edit';
  return {
    transactionType,
    isRefund: false,
    cardBrand: '-',
    refundReason: isCancelledWithNoRefund(history) ? 'NO REFUND: Cancelled' : '-',
    roloFee: '-',
    stripeFee: '-',
    total: '-'
  };
};

const isCancelledWithNoRefund = history => {
  return history.changeType === ORDER_HISTORY_CHANGE_TYPES.orderCancellation;
};

export const getEmptyRow = productType => {
  const productrow = {};
  productrow[`${productType}Qty`] = null;
  productrow[`${productType}Nights`] = null;
  productrow[`${productType}UnitPrice`] = null;
  productrow[`${productType}Total`] = null;
  return productrow;
};
