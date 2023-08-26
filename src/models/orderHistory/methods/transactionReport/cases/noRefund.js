import { getTransactionType } from '../transactionTypeSelector';

export const isNoRefund = history => {
  const { newValues } = history;

  if (!newValues) {
    return false;
  }
  const { addOns } = newValues;
  const hasReasonInAddOns = addOns && Array.isArray(addOns) && addOns.length > 0 && 'noRefundReason' in addOns[0];

  return 'noRefundReason' in newValues || hasReasonInAddOns;
};

export const getNoRefundRows = (history, productType, getProductRows) => {
  const transactionType = getTransactionType(history, productType, true);
  const productRows = getProductRows(history, transactionType, productType);
  const rows = updateTotals(productRows, productType);
  return rows;
};

const updateTotals = (productRows, productType) => {
  productRows.map(row => {
    row[`${productType}Total`] = '-';
  });
  return productRows;
};

export const updateAddOnsTotals = addOnrow => {
  if (!addOnrow?.addOnNames) {
    return;
  }
  addOnrow.addOnNames.forEach(addOn => {
    addOnrow[`${addOn}Total`] = '-';
  });
};
