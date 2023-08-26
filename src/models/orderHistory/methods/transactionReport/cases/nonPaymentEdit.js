import { getEmptyRow } from '../baseRow';
import { getNightsDiff } from './reducedQuantityReducedNights';

export const isNonPaymentEdit = (history, productType) => {
  const { oldValues, newValues } = history;
  const oldQuantity = oldValues[productType]?.quantity;
  const newQuantity = newValues[productType]?.quantity;
  const isSameQuantity = oldQuantity === newQuantity;

  if (!hasNightsData(history, productType)) {
    return false;
  }

  const nightsDiff = getNightsDiff(history, productType);
  const isSameNumberOfNights = nightsDiff === 0;

  return isSameQuantity && isSameNumberOfNights;
};

const hasNightsData = ({ oldValues, newValues }, productType) => {
  const oldProduct = oldValues[productType];
  const newProduct = newValues[productType];

  const hasOldData = oldProduct?.startDate && oldProduct?.endDate;
  const hasNewData = newProduct?.startDate && newProduct?.endDate;

  return !!(hasOldData && hasNewData);
};

export const getRowsNonPaymentEdit = productType => {
  const productrow = getEmptyRow(productType);
  return [productrow];
};
