import { hasQtyAndNightsData, getQuantityDiff, getNightsDiff, getFirstRow, getSecondRow } from './reducedQuantityReducedNights';

export const isReducingQtyAndExtendingNights = (history, productType) => {
  if (!hasQtyAndNightsData(history, productType)) {
    return false;
  }
  const quantityDiff = getQuantityDiff(history, productType);
  const isReducingQty = quantityDiff < 0;

  const nightsDiff = getNightsDiff(history, productType);
  const isExtendingNights = nightsDiff > 0;

  return isReducingQty && isExtendingNights;
};

export const getRowsReducingQtyAndExtendingNights = (history, productType) => {
  const firstRow = getFirstRow(history, productType);
  const secondRow = getSecondRow(history, productType);
  return [firstRow, secondRow];
};
