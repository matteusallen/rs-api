import { getNightsDiff } from './reducedQuantityReducedNights';
import { getProductQty, getProductUnitPrice } from './newOrder';

export const NightsWereUpdated = (history, productType) => {
  if (!hasNightsData(history, productType)) {
    return false;
  }

  const nightsDiff = getNightsDiff(history, productType);
  const isUpdatingNights = nightsDiff !== 0;

  return isUpdatingNights;
};

const hasNightsData = ({ oldValues, newValues }, productType) => {
  const oldProduct = oldValues[productType];
  const newProduct = newValues[productType];

  const hasOldData = oldProduct?.startDate && oldProduct?.endDate;
  const hasNewData = newProduct?.startDate && newProduct?.endDate;

  return !!(hasOldData && hasNewData);
};

export const getRowsNightsWereUpdated = (history, productType) => {
  const productrow = {};
  productrow[`${productType}Qty`] = getProductQty(history.oldValues?.[productType]);
  productrow[`${productType}Nights`] = getNightsDiff(history, productType);
  productrow[`${productType}UnitPrice`] = getProductUnitPrice(history.newValues?.[productType]);
  productrow[`${productType}Total`] = getTotal(history, productType);

  return [productrow];
};

const getTotal = (history, productType) => {
  const product = history.newValues?.[productType];
  const quantity = getProductQty(history.oldValues?.[productType]);
  const nights = product?.nightly ? getNightsDiff(history, productType) : 0;
  const price = getProductUnitPrice(history.newValues?.[productType]);
  return quantity * nights * price;
};
