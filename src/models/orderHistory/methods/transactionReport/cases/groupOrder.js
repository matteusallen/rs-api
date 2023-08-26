import { getProductQty, getProductNights, getProductUnitPrice, getProductTotal } from './newOrder';

export const isGroupOrder = history => {
  return history.changeType === 'groupOrder';
};

export const getRowsForGroupOrder = (history, productType) => {
  const productrow = {};
  productrow[`${productType}Qty`] = getProductQty(history.newValues?.[productType]);
  productrow[`${productType}Nights`] = getProductNights(history.newValues?.[productType]);
  productrow[`${productType}UnitPrice`] = getProductUnitPrice(history.newValues?.[productType]);
  productrow[`${productType}Total`] = getProductTotal(history.newValues?.[productType]);

  return [productrow];
};
