import { getTransactionType } from '../transactionTypeSelector';
import { getEmptyRow } from '../baseRow';

export const isMultiPayment = history => {
  const { orderHistoryPayments } = history;

  if (!orderHistoryPayments?.length) {
    return false;
  }

  const [cardHistoryPayment, cashHistoryPayment] = getCardAndCashPayments(history);
  const isSplitPayment = !!cardHistoryPayment && !!cashHistoryPayment;
  const paymentsAreRefund = orderHistoryPayments.some(OHpayment => !!OHpayment.payment.ssRefundId || OHpayment.payment.amount < 0);
  return isSplitPayment && !paymentsAreRefund;
};

const getCardAndCashPayments = history => {
  let cardHistoryPayment = null;
  let cashHistoryPayment = null;

  const has2Payments = history.orderHistoryPayments.length === 2;
  if (has2Payments) {
    cardHistoryPayment = history.orderHistoryPayments.find(ohp => ohp.payment.cardPayment);
    cashHistoryPayment = history.orderHistoryPayments.find(ohp => !ohp.payment.cardPayment);
  }

  return [cardHistoryPayment, cashHistoryPayment];
};

export const getMultiPaymentRows = (history, productType, getProductRows) => {
  const transactionType = getTransactionType(history, productType, true);
  const productRows = getProductRows(history, transactionType, productType);
  updateOriginalRows(productRows);

  const [cardHistoryPayment, cashHistoryPayment] = getCardAndCashPayments(history);
  const cardRow = getCardRow(productType, cardHistoryPayment);
  const cashRow = getCashRow(productType, cashHistoryPayment);
  const rows = [...productRows, cardRow, cashRow];
  return rows;
};

const updateOriginalRows = rows => {
  rows.map(row => {
    row.transactionType = 'Multi Payment';
    row.cardBrand = '';
    row.subtotal = null;
    row.stripeFee = '-';
    row.roloFee = '-';
    row.total = null;
    return row;
  });
};

const getCardRow = (productType, historyPayment) => {
  const productRow = { ...getEmptyRow(productType), ...getPaymentValues(historyPayment) };
  productRow.transactionType = 'Multi Payment: Card';
  return productRow;
};

const getCashRow = (productType, historyPayment) => {
  const productRow = { ...getEmptyRow(productType), ...getPaymentValues(historyPayment) };
  productRow.transactionType = 'Multi Payment: Cash';
  return productRow;
};

const getPaymentValues = ({ payment }) => {
  let { amount, stripeFee, serviceFee, cardBrand } = payment;

  cardBrand = cardBrand ?? '';
  const subtotal = amount - stripeFee - serviceFee;
  stripeFee = stripeFee === 0 ? '-' : stripeFee;
  const roloFee = serviceFee === 0 ? '-' : serviceFee;
  const total = amount;

  return { cardBrand, subtotal, stripeFee, roloFee, total };
};
