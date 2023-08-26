import { getProductNights, getProductUnitPrice, productHasData } from './newOrder';

export const quantityWasUpdated = (history, productType) => {
  const { oldValues, newValues } = history;
  const oldQuantity = oldValues[productType]?.quantity ?? 0;
  const newQuantity = newValues[productType]?.quantity;

  if (!newQuantity && newQuantity !== 0) {
    return false;
  }

  return oldQuantity !== newQuantity;
};

export const getRowsQuantityWasUpdated = (history, productType) => {
  const productrow = {};
  productrow[`${productType}Qty`] = quantityUpdatedGetQuantity(history, productType);
  productrow[`${productType}Nights`] = getProductNights(history.newValues?.[productType]);
  productrow[`${productType}UnitPrice`] = getProductUnitPrice(history.newValues?.[productType]);
  productrow[`${productType}Total`] = quantityUpdatedGetProductTotal(history, productType);

  return [productrow];
};

const quantityUpdatedGetQuantity = ({ oldValues, newValues }, product) => {
  const oldQuantity = oldValues[product].quantity;
  const newQuantity = newValues[product].quantity;

  return newQuantity - oldQuantity;
};

const quantityUpdatedGetProductTotal = (history, productType) => {
  const product = history.newValues?.[productType];
  if (!productHasData(product)) {
    return null;
  }
  const quantity = quantityUpdatedGetQuantity(history, productType);
  const nights = product?.nightly ? getProductNights(product) : 1;
  const price = getProductUnitPrice(product);
  return quantity * nights * price;
};
