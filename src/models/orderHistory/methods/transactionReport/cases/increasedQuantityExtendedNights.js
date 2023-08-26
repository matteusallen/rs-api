import { hasQtyAndNightsData, getQuantityDiff, getNightsDiff } from './reducedQuantityReducedNights';
import { getProductUnitPrice, getProductNights, getProductQty } from './newOrder';

export const isIncreasingQtyAndExtendingNights = (history, productType) => {
  if (!hasQtyAndNightsData(history, productType)) {
    return false;
  }
  const quantityDiff = getQuantityDiff(history, productType);
  const isIncreasingQty = quantityDiff > 0;

  const nightsDiff = getNightsDiff(history, productType);
  const isExtendingNights = nightsDiff > 0;

  return isIncreasingQty && isExtendingNights;
};

export const getRowsIncreasingQtyAndExtendingNights = (history, productType) => {
  const firstRow = getFirstRow(history, productType);
  const secondRow = getSecondRow(history, productType);
  return [firstRow, secondRow];
};

export const getFirstRow = (history, productType) => {
  const firstRow = {};
  firstRow[`${productType}Qty`] = getProductQtyFirstRow(history, productType);
  firstRow[`${productType}Nights`] = getProductNights(history.newValues?.[productType]);
  firstRow[`${productType}UnitPrice`] = getProductUnitPrice(history.newValues?.[productType]);
  firstRow[`${productType}Total`] = getProductTotalFirstRow(history, productType);
  return firstRow;
};

const getProductQtyFirstRow = (history, productType) => {
  const { oldValues, newValues } = history;
  const oldQuantity = oldValues[productType].quantity;
  const newQuantity = newValues[productType].quantity;
  const quantityDiff = newQuantity - oldQuantity;
  return quantityDiff;
};

const getProductTotalFirstRow = (history, productType) => {
  const product = history.newValues?.[productType];
  const quantity = getProductQtyFirstRow(history, productType);
  const nights = product?.nightly ? getProductNights(history.newValues?.[productType]) : 1;
  const price = getProductUnitPrice(history.newValues?.[productType]);
  return quantity * nights * price;
};

export const getSecondRow = (history, productType) => {
  const secondRow = {};
  secondRow[`${productType}Qty`] = getProductQty(history.oldValues?.[productType]);
  secondRow[`${productType}Nights`] = getNightsDiff(history, productType);
  secondRow[`${productType}UnitPrice`] = getProductUnitPrice(history.newValues?.[productType]);
  secondRow[`${productType}Total`] = getProductTotalSecondRow(history, productType);
  return secondRow;
};

const getProductTotalSecondRow = (history, productType) => {
  const product = history.newValues?.[productType];
  const quantity = getProductQty(history.oldValues?.[productType]);
  const nights = product?.nightly ? getNightsDiff(history, productType) : 0;
  const price = getProductUnitPrice(history.newValues?.[productType]);
  return quantity * nights * price;
};
