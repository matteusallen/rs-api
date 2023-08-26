import { getProductQty, getProductNights, getProductUnitPrice, productHasData } from './newOrder';

export const isChangingProduct = (history, productType) => {
  if (!hasProductData(history, productType)) {
    return false;
  }

  const oldProductId = history.oldValues[productType].xProductId;
  const newProductId = history.newValues[productType].xProductId;
  const productWasChanged = oldProductId !== +newProductId;

  return productWasChanged;
};

const hasProductData = ({ oldValues, newValues }, productType) => {
  const oldProduct = oldValues[productType];
  const newProduct = newValues[productType];

  const hasOldData = oldProduct?.xProductId;
  const hasNewData = newProduct?.xProductId;

  return !!(hasOldData && hasNewData);
};

export const getRowsChangingProduct = (history, productType) => {
  const firstRow = getFirstRow(history, productType);
  const secondRow = getSecondRow(history, productType);
  return [firstRow, secondRow];
};

const getFirstRow = (history, productType) => {
  const firstRow = {};
  firstRow[`${productType}Qty`] = -getProductQty(history.oldValues?.[productType]);
  firstRow[`${productType}Nights`] = getProductNights(history.oldValues?.[productType]);
  firstRow[`${productType}UnitPrice`] = getProductUnitPrice(history.oldValues?.[productType]);
  firstRow[`${productType}Total`] = getProductTotal(history.oldValues?.[productType], true);
  return firstRow;
};

const getProductTotal = (product, qtyInNegative) => {
  if (!productHasData(product)) {
    return null;
  }
  const quantity = qtyInNegative ? -getProductQty(product) : getProductQty(product);
  const nights = product?.nightly ? getProductNights(product) : 1;
  const price = getProductUnitPrice(product);
  return quantity * nights * price;
};

const getSecondRow = (history, productType) => {
  const secondRow = {};
  secondRow[`${productType}Qty`] = getProductQty(history.newValues?.[productType]);
  secondRow[`${productType}Nights`] = getProductNights(history.newValues?.[productType]);
  secondRow[`${productType}UnitPrice`] = getProductUnitPrice(history.newValues?.[productType]);
  secondRow[`${productType}Total`] = getProductTotal(history.newValues?.[productType]);

  return secondRow;
};
