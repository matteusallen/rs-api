import { getProductUnitPrice, getProductQty, getProductNights } from './newOrder';
import { getNumberOfNights } from '../../../../../utils/formatDate';

export const isReducingQtyAndReducingNights = (history, productType) => {
  if (!hasQtyAndNightsData(history, productType)) {
    return false;
  }
  const quantityDiff = getQuantityDiff(history, productType);
  const isReducingQty = quantityDiff < 0;

  const nightsDiff = getNightsDiff(history, productType);
  const isReducingNights = nightsDiff < 0;

  return isReducingQty && isReducingNights;
};

export const hasQtyAndNightsData = ({ oldValues, newValues }, productType) => {
  const oldProduct = oldValues[productType];
  const newProduct = newValues[productType];

  const hasOldData = oldProduct?.quantity && oldProduct.startDate && oldProduct.endDate;
  const hasNewData = newProduct?.quantity && newProduct.startDate && newProduct.endDate;

  return !!(hasOldData && hasNewData);
};

export const getQuantityDiff = ({ oldValues, newValues }, productType) => {
  const oldQuantity = oldValues[productType].quantity;
  const newQuantity = newValues[productType].quantity;
  return newQuantity - oldQuantity;
};

export const getNightsDiff = ({ oldValues, newValues }, productType) => {
  const oldStartDate = oldValues[productType].startDate;
  const oldEndDate = oldValues[productType].endDate;
  const oldNumberOfNights = getNumberOfNights(oldStartDate, oldEndDate);

  const newStartDate = newValues[productType].startDate;
  const newEndDate = newValues[productType].endDate;
  const newNumberOfNights = getNumberOfNights(newStartDate, newEndDate);

  return newNumberOfNights - oldNumberOfNights;
};

export const getRowsReducingQtyAndReducingNights = (history, productType) => {
  const firstRow = getFirstRow(history, productType);
  const secondRow = getSecondRow(history, productType);
  return [firstRow, secondRow];
};

export const getFirstRow = (history, productType) => {
  const firstRow = {};
  firstRow[`${productType}Qty`] = getQuantityDiff(history, productType);
  firstRow[`${productType}Nights`] = getProductNights(history.oldValues?.[productType]);
  firstRow[`${productType}UnitPrice`] = getProductUnitPrice(history.newValues?.[productType]);
  firstRow[`${productType}Total`] = getProductTotalFirstRow(history, productType);
  return firstRow;
};

const getProductTotalFirstRow = (history, productType) => {
  const product = history.newValues?.[productType];
  const quantity = getQuantityDiff(history, productType);
  const nights = product?.nightly ? getProductNights(history.oldValues?.[productType]) : 1;
  const price = getProductUnitPrice(history.newValues?.[productType]);
  return quantity * nights * price;
};

export const getSecondRow = (history, productType) => {
  const secondRow = {};
  secondRow[`${productType}Qty`] = getProductQty(history.newValues?.[productType]);
  secondRow[`${productType}Nights`] = getNightsDiff(history, productType);
  secondRow[`${productType}UnitPrice`] = getProductUnitPrice(history.newValues?.[productType]);
  secondRow[`${productType}Total`] = getProductTotalSecondRow(history, productType);
  return secondRow;
};

export const getProductTotalSecondRow = (history, productType) => {
  const product = history.newValues?.[productType];
  const quantity = getProductQty(history.newValues?.[productType]);
  const nights = product?.nightly ? getNightsDiff(history, productType) : 0;
  const price = getProductUnitPrice(history.newValues?.[productType]);
  return quantity * nights * price;
};
