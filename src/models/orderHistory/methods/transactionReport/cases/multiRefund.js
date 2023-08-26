import { getTransactionType } from '../transactionTypeSelector';
import { getEmptyRow } from '../baseRow';

export const isMultiRefund = history => {
  const { orderHistoryPayments } = history;

  if (!orderHistoryPayments?.length) {
    return false;
  }

  const has2OrMorePayments = orderHistoryPayments.length > 1;
  const paymentsAreRefund = orderHistoryPayments.every(OHpayment => !!OHpayment.payment.ssRefundId);
  return has2OrMorePayments && paymentsAreRefund;
};

export const getMultiRefundRows = (history, productType, getProductRows) => {
  const transactionType = getTransactionType(history, productType, true);
  const productRows = getProductRows(history, transactionType, productType);
  const rows = getRowsWithProductData(history, productRows, productType);
  return rows;
};

const getRowsWithProductData = ({ orderHistoryPayments }, productRows, productType) => {
  const lengthDiff = orderHistoryPayments.length - productRows.length;

  const rows = orderHistoryPayments.map((ohPayment, index) => {
    const productIndex = index - lengthDiff;
    const product = productExists(productRows, productIndex) ? productRows[productIndex] : getEmptyRow(productType);
    product.total = ohPayment.payment.amount;
    return product;
  });
  return rows;
};

const productExists = (productRows, productIndex) => {
  return typeof productRows[productIndex] !== 'undefined';
};
