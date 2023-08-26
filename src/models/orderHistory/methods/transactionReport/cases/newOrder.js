import { getNumberOfNights } from '../../../../../utils/formatDate';
import { isEmpty } from 'lodash';

export const isNewOrder = history => {
  const hasNewValues = history.newValues?.rvs || history.newValues?.stalls || history.newValues?.addOns;
  const hasOldValues = history.oldValues?.rvs || history.oldValues?.stalls || history.oldValues?.addOns;

  return hasNewValues && !hasOldValues;
};

export const isNewProduct = (history, productType) => {
  const hasNewValues = !!history.newValues?.[productType];
  const oldProductObject = history.oldValues?.[productType];
  const oldProductIsEmpty = typeof oldProductObject === 'object' && oldProductObject !== null && isEmpty(oldProductObject);
  return hasNewValues && oldProductIsEmpty;
};

export const getNewOrderRows = (history, productType) => {
  const productRow = {};
  productRow[`${productType}Qty`] = getProductQty(history.newValues?.[productType]);
  productRow[`${productType}Nights`] = getProductNights(history.newValues?.[productType]);
  productRow[`${productType}UnitPrice`] = getProductUnitPrice(history.newValues?.[productType]);
  productRow[`${productType}Total`] = getProductTotal(history.newValues?.[productType]);

  return [productRow];
};

export const getProductQty = product => {
  return product?.quantity ?? null;
};

export const getProductNights = product => {
  const { startDate, endDate } = product || {};
  return startDate && endDate ? getNumberOfNights(startDate, endDate) : null;
};

export const getProductUnitPrice = product => {
  return product?.price ?? null;
};

export const getProductTotal = product => {
  if (!productHasData(product)) {
    return null;
  }
  const quantity = getProductQty(product);
  const nights = product?.nightly ? getProductNights(product) : 1;
  const price = getProductUnitPrice(product);
  return quantity * nights * price;
};

export const productHasData = product => {
  return product?.quantity && product.price;
};
