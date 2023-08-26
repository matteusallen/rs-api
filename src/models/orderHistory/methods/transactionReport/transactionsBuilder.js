import { getBaseRow, getEmptyRow } from './baseRow';
import { getProductsTransactionType } from './transactionTypeSelector';
import { getProductRows } from './productRows';
import { getAddOnRows } from './addOnRows';
import { PRODUCTS_TYPES, TRANSACTIONS_WITH_2_ROWS, TRANSACTION_TYPES } from '../../../../constants/index';

export const getTransactions = histories => {
  const transactionRows = histories.reduce((acc, history) => {
    const data = getRowsInHistory(history);
    return [...acc, ...data];
  }, []);

  return transactionRows.sort((a, b) => a.orderId - b.orderId);
};

export const getRowsInHistory = history => {
  const baseRow = getBaseRow(history);
  const rows = getWholeRows(history, baseRow);

  return rows;
};

const getWholeRows = (history, baseRow) => {
  const [stallsType, rvsType, addOnsType] = getProductsTransactionType(history);
  const stallRows = getProductRows(history, stallsType, PRODUCTS_TYPES.STALLS);
  const rvRows = getProductRows(history, rvsType, PRODUCTS_TYPES.RVS);
  const addOnRows = getAddOnRows(history, addOnsType);

  const numberOfRows = getNumberOfRows(stallRows, rvRows, addOnRows);
  const rows = [];

  for (let i = 0; i < numberOfRows; i++) {
    const isLastRow = checkLastRow(stallsType, i, numberOfRows);
    const row = getWholeRow(stallRows, rvRows, stallsType, rvsType, addOnRows, i, baseRow, isLastRow, numberOfRows);
    rows.push(row);
  }

  return rows;
};

const getNumberOfRows = (stallRows, rvRows, addOnRows) => {
  return Math.max(stallRows.length, rvRows.length, addOnRows.length);
};

const checkLastRow = (stallsType, index, numberOfRows) => {
  if (stallsType === TRANSACTION_TYPES.MULTI_PAYMENT && index === numberOfRows - 3) {
    return true;
  }
  if (stallsType !== TRANSACTION_TYPES.MULTI_PAYMENT && index === numberOfRows - 1) {
    return true;
  }
  return false;
};

const getWholeRow = (stallRows, rvRows, stallsType, rvsType, addOnRows, index, baseRow, isLastRow, numberOfRows) => {
  const [stallData, rvData, addOnData] = getProductsData(numberOfRows, stallRows, rvRows, addOnRows, index, isLastRow);
  const subtotal = getSubtotal(stallData, rvData, addOnData, stallsType, baseRow);
  const [roloFee, stripeFee, total] = getAdditionalValues(stallsType, rvsType, index, baseRow);

  return {
    ...baseRow,
    subtotal,
    roloFee,
    stripeFee,
    total,
    ...stallData,
    ...rvData,
    ...addOnData
  };
};

const getProductsData = (numberOfRows, stallRows, rvRows, addOnRows, index, isLastRow) => {
  const stallDiff = numberOfRows - stallRows.length;
  const rvDiff = numberOfRows - rvRows.length;

  const stallData = stallRows[index - stallDiff] ?? getEmptyRow(PRODUCTS_TYPES.STALLS);
  const rvData = rvRows[index - rvDiff] ?? getEmptyRow(PRODUCTS_TYPES.RVS);
  const addOnData = isLastRow ? addOnRows[0] : null;

  return [stallData, rvData, addOnData];
};

const getSubtotal = (stallData, rvData, addOnData, stallsType, baseRow) => {
  if (stallsType === TRANSACTION_TYPES.CANCELLED_ORDER_NO_REFUND) {
    return '-';
  }
  if (stallsType === TRANSACTION_TYPES.NO_REFUND) {
    return '-';
  }
  if (stallsType === TRANSACTION_TYPES.SPECIAL_REFUND) {
    return baseRow.total;
  }

  const addOnTotal = getAddOnsTotal(addOnData);
  const subtotal = stallData?.stallsTotal + (rvData?.rvsTotal ?? 0) + addOnTotal;
  return subtotal === 0 ? '-' : subtotal;
};

const getAddOnsTotal = addOnData => {
  if (!addOnData?.addOnNames) {
    return 0;
  }
  const { addOnNames } = addOnData;
  const total = addOnNames.reduce((acc, name) => {
    const currentAddOnTotal = addOnData[`${name}Total`];
    acc = acc + currentAddOnTotal;
    return acc;
  }, 0);

  return total;
};

const getAdditionalValues = (stallsType, rvsType, index, baseRow) => {
  const has2Rows = is2RowsTransaction(stallsType, rvsType);
  if (index === 0 && has2Rows) {
    return ['-', '-', '-'];
  }
  return [baseRow.roloFee, baseRow.stripeFee, baseRow.total];
};

const is2RowsTransaction = (stallsType, rvsType) => {
  const stallHas2Rows = TRANSACTIONS_WITH_2_ROWS.includes(stallsType);
  const rvsHas2Rows = TRANSACTIONS_WITH_2_ROWS.includes(rvsType);
  return stallHas2Rows || rvsHas2Rows;
};
