import { TRANSACTION_TYPES, PRODUCTS_TYPES } from '../../../../constants/index';
import { isNewOrder, isNewProduct } from './cases/newOrder';
import { isChangingProduct } from './cases/changedProduct';
import { isReducingQtyAndReducingNights } from './cases/reducedQuantityReducedNights';
import { isReducingQtyAndExtendingNights } from './cases/reducedQuantityExtendedNights';
import { isIncreasingQtyAndExtendingNights } from './cases/increasedQuantityExtendedNights';
import { isIncreasingQtyAndReducingNights } from './cases/increasedQuantityReducedNights';
import { quantityWasUpdated } from './cases/updatedQuantity';
import { NightsWereUpdated } from './cases/updatedNights';
import { isMultiRefund } from './cases/multiRefund';
import { isNonPaymentEdit } from './cases/nonPaymentEdit';
import { isCancelling } from './cases/cancelledOrder';
import { isCancellingNoRefund } from './cases/cancelledOrderNoRefund';
import { isGroupOrder } from './cases/groupOrder';
import { isSpecialRefund } from './cases/specialRefund';
import { isNoRefund } from './cases/noRefund';
import { isMultiPayment } from './cases/multiPayment';

export const getProductsTransactionType = history => {
  const stallsType = getTransactionType(history, PRODUCTS_TYPES.STALLS);
  const rvsType = getTransactionType(history, PRODUCTS_TYPES.RVS);
  const addOnsType = getTransactionType(history, PRODUCTS_TYPES.ADDONS);

  return [stallsType, rvsType, addOnsType];
};

// The order of the validations is important
export const getTransactionType = (history, productType, ignoreBaseTransactions) => {
  if (isGroupOrder(history)) {
    return TRANSACTION_TYPES.GROUP_ORDER;
  }
  if (isSpecialRefund(history)) {
    return TRANSACTION_TYPES.SPECIAL_REFUND;
  }
  if (!ignoreBaseTransactions && isNoRefund(history)) {
    return TRANSACTION_TYPES.NO_REFUND;
  }
  if (!ignoreBaseTransactions && isMultiPayment(history)) {
    return TRANSACTION_TYPES.MULTI_PAYMENT;
  }
  if (isNewOrder(history)) {
    return TRANSACTION_TYPES.NEW_ORDER;
  }
  if (isNewProduct(history, productType)) {
    return TRANSACTION_TYPES.NEW_ORDER;
  }
  if (!ignoreBaseTransactions && isMultiRefund(history)) {
    return TRANSACTION_TYPES.MULTI_REFUND;
  }
  if (isCancellingNoRefund(history)) {
    return TRANSACTION_TYPES.CANCELLED_ORDER_NO_REFUND;
  }
  if (isCancelling(history)) {
    return TRANSACTION_TYPES.CANCELLED_ORDER;
  }
  if (isChangingProduct(history, productType)) {
    return TRANSACTION_TYPES.CHANGED_PRODUCT;
  }
  if (isReducingQtyAndReducingNights(history, productType)) {
    return TRANSACTION_TYPES.REDUCED_QUANTITY_REDUCED_NIGHTS;
  }
  if (isReducingQtyAndExtendingNights(history, productType)) {
    return TRANSACTION_TYPES.REDUCED_QUANTITY_EXTENDED_NIGHTS;
  }
  if (isIncreasingQtyAndExtendingNights(history, productType)) {
    return TRANSACTION_TYPES.INCREASED_QUANTITY_EXTENDED_NIGHTS;
  }
  if (isIncreasingQtyAndReducingNights(history, productType)) {
    return TRANSACTION_TYPES.INCREASED_QUANTITY_REDUCED_NIGHTS;
  }
  if (quantityWasUpdated(history, productType)) {
    return TRANSACTION_TYPES.QUANTITY_UPDATED;
  }
  if (NightsWereUpdated(history, productType)) {
    return TRANSACTION_TYPES.NIGHTS_UPDATED;
  }
  if (isNonPaymentEdit(history, productType)) {
    return TRANSACTION_TYPES.NON_PAYMENT_EDIT;
  }
};
