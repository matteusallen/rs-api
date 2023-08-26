import { ORDER_HISTORY_CHANGE_TYPES } from '../../../../../constants/index';
import { getProductQty, getProductNights, getProductUnitPrice } from './newOrder';

export const isCancellingNoRefund = history => {
  return history.changeType === ORDER_HISTORY_CHANGE_TYPES.orderCancellation && history.orderHistoryPayments.length === 0;
};

export const getRowsCancellingOrderNoRefund = (history, productType) => {
  const productrow = {};
  productrow[`${productType}Qty`] = -getProductQty(history.oldValues?.[productType]);
  productrow[`${productType}Nights`] = getProductNights(history.oldValues?.[productType]);
  productrow[`${productType}UnitPrice`] = getProductUnitPrice(history.oldValues?.[productType]);
  productrow[`${productType}Total`] = '-';

  return [productrow];
};

export const productHasData = product => {
  return product?.quantity && product.price;
};

export const getAddOnsCancellingOrderNoRefund = addOns => {
  if (!addOns) {
    return {};
  }

  let addOnsData = {};
  let addOnNames = [];
  const addOnsArray = Array.isArray(addOns) ? addOns : [addOns];

  addOnsArray.forEach(addOn => {
    addOnNames = [...addOnNames, addOn.name];
    addOnsData = {
      ...addOnsData,
      ...getAddOnData(addOn),
      addOnNames
    };
  });

  return addOnsData;
};

const getAddOnData = addOn => {
  const { name } = addOn;
  const addOnData = {};
  addOnData[`${name}Qty`] = -getProductQty(addOn);
  addOnData[`${name}UnitPrice`] = getProductUnitPrice(addOn);
  addOnData[`${name}Total`] = '-';

  return addOnData;
};
