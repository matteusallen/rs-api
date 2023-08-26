import { TRANSACTION_TYPES } from '../../../../constants/index';
import { getEmptyRow } from './baseRow';
import { getNewOrderRows } from './cases/newOrder';
import { getRowsChangingProduct } from './cases/changedProduct';
import { getRowsReducingQtyAndReducingNights } from './cases/reducedQuantityReducedNights';
import { getRowsReducingQtyAndExtendingNights } from './cases/reducedQuantityExtendedNights';
import { getRowsIncreasingQtyAndExtendingNights } from './cases/increasedQuantityExtendedNights';
import { getRowsIncreasingQtyAndReducingNights } from './cases/increasedQuantityReducedNights';
import { getRowsQuantityWasUpdated } from './cases/updatedQuantity';
import { getRowsNightsWereUpdated } from './cases/updatedNights';
import { getMultiRefundRows } from './cases/multiRefund';
import { getRowsNonPaymentEdit } from './cases/nonPaymentEdit';
import { getRowsCancellingOrder } from './cases/cancelledOrder';
import { getRowsCancellingOrderNoRefund } from './cases/cancelledOrderNoRefund';
import { getRowsForGroupOrder } from './cases/groupOrder';
import { getNoRefundRows } from './cases/noRefund';
import { getMultiPaymentRows } from './cases/multiPayment';

export const getProductRows = (history, transactionType, productType) => {
  if (transactionType === TRANSACTION_TYPES.NEW_ORDER) {
    return getNewOrderRows(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.CHANGED_PRODUCT) {
    return getRowsChangingProduct(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.REDUCED_QUANTITY_REDUCED_NIGHTS) {
    return getRowsReducingQtyAndReducingNights(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.REDUCED_QUANTITY_EXTENDED_NIGHTS) {
    return getRowsReducingQtyAndExtendingNights(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.INCREASED_QUANTITY_EXTENDED_NIGHTS) {
    return getRowsIncreasingQtyAndExtendingNights(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.INCREASED_QUANTITY_REDUCED_NIGHTS) {
    return getRowsIncreasingQtyAndReducingNights(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.QUANTITY_UPDATED) {
    return getRowsQuantityWasUpdated(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.NIGHTS_UPDATED) {
    return getRowsNightsWereUpdated(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.MULTI_REFUND) {
    return getMultiRefundRows(history, productType, getProductRows);
  }
  if (transactionType === TRANSACTION_TYPES.NON_PAYMENT_EDIT) {
    return getRowsNonPaymentEdit(productType);
  }
  if (transactionType === TRANSACTION_TYPES.CANCELLED_ORDER) {
    return getRowsCancellingOrder(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.CANCELLED_ORDER_NO_REFUND) {
    return getRowsCancellingOrderNoRefund(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.GROUP_ORDER) {
    return getRowsForGroupOrder(history, productType);
  }
  if (transactionType === TRANSACTION_TYPES.NO_REFUND) {
    return getNoRefundRows(history, productType, getProductRows);
  }
  if (transactionType === TRANSACTION_TYPES.MULTI_PAYMENT) {
    return getMultiPaymentRows(history, productType, getProductRows);
  }

  const productrow = getEmptyRow(productType);
  return [productrow];
};
