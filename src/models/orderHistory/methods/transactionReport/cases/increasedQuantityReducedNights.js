import { hasQtyAndNightsData, getQuantityDiff, getNightsDiff } from './reducedQuantityReducedNights';
import { getFirstRow, getSecondRow } from './increasedQuantityExtendedNights';

export const isIncreasingQtyAndReducingNights = (history, productType) => {
  if (!hasQtyAndNightsData(history, productType)) {
    return false;
  }
  const quantityDiff = getQuantityDiff(history, productType);
  const isIncreasingQty = quantityDiff > 0;

  const nightsDiff = getNightsDiff(history, productType);
  const isReducingNights = nightsDiff < 0;

  return isIncreasingQty && isReducingNights;
};

export const getRowsIncreasingQtyAndReducingNights = (history, productType) => {
  const firstRow = getFirstRow(history, productType);
  const secondRow = getSecondRow(history, productType);
  return [firstRow, secondRow];
};
