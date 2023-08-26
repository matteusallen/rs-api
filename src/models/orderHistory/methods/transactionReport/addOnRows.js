import { TRANSACTION_TYPES } from '../../../../constants/index';
import { getProductQty, getProductUnitPrice, getProductTotal } from './cases/newOrder';
import { getAddOnsCancellingOrder } from './cases/cancelledOrder';
import { getAddOnsCancellingOrderNoRefund } from './cases/cancelledOrderNoRefund';
import { updateAddOnsTotals } from './cases/noRefund';

export const getAddOnRows = (history, transactionType) => {
  if (transactionType === TRANSACTION_TYPES.NEW_ORDER) {
    const addOnrow = getNewOrderAddOns(history.newValues.addOns);
    return [addOnrow];
  }
  if (transactionType === TRANSACTION_TYPES.CANCELLED_ORDER_NO_REFUND) {
    const addOnrow = getAddOnsCancellingOrderNoRefund(history.oldValues.addons);
    return [addOnrow];
  }
  if (transactionType === TRANSACTION_TYPES.CANCELLED_ORDER) {
    const addOnrow = getAddOnsCancellingOrder(history.oldValues.addons || history.oldValues.addOns);
    return [addOnrow];
  }
  if (transactionType === TRANSACTION_TYPES.NO_REFUND) {
    const addOnrow = getAddOns(history);
    updateAddOnsTotals(addOnrow);
    return [addOnrow];
  }
  if (transactionType === TRANSACTION_TYPES.NO_REFUND) {
    const addOnrow = getAddOns(history);
    updateAddOnsTotals(addOnrow);
    return [addOnrow];
  }
  if (transactionType === TRANSACTION_TYPES.NO_REFUND) {
    const addOnrow = getAddOns(history);
    updateAddOnsTotals(addOnrow);
    return [addOnrow];
  }

  const addOnrow = getAddOns(history);
  return [addOnrow];
};

const getNewOrderAddOns = addOns => {
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
  addOnData[`${name}Qty`] = getProductQty(addOn);
  addOnData[`${name}UnitPrice`] = getProductUnitPrice(addOn);
  addOnData[`${name}Total`] = getProductTotal(addOn);

  return addOnData;
};

const getAddOns = history => {
  const { addOns } = history.newValues;
  let addOnsData = {};
  let addOnNames = [];

  if (!addOns) {
    return addOnsData;
  }

  const addOnsArray = Array.isArray(addOns) ? addOns : [addOns];

  addOnsArray.forEach(addOn => {
    addOnNames = [...addOnNames, addOn.name];
    addOnsData = {
      ...addOnsData,
      ...getAddOnDataNotNewOrder(history, addOn),
      addOnNames
    };
  });

  return addOnsData;
};

const getAddOnDataNotNewOrder = (history, addOn) => {
  const { name } = addOn;
  const addOnData = {};
  addOnData[`${name}Qty`] = getAddOnQtyNotNewOrder(history, addOn);
  addOnData[`${name}UnitPrice`] = getProductUnitPrice(addOn);
  addOnData[`${name}Total`] = getAddOnTotalNotNewOrder(history, addOn);

  return addOnData;
};

const getAddOnQtyNotNewOrder = (history, addOn) => {
  const oldAddOns = history.oldValues?.addOns ?? [];
  const oldAddOnsArray = Array.isArray(oldAddOns) ? oldAddOns : [oldAddOns];
  const previousqty = oldAddOnsArray.find(a => a.orderItemId === addOn.orderItemId)?.quantity ?? 0;
  return addOn.quantity - previousqty;
};

export const getAddOnTotalNotNewOrder = (history, addOn) => {
  if (!hasData(addOn)) {
    return null;
  }
  const quantity = getAddOnQtyNotNewOrder(history, addOn);
  const price = getProductUnitPrice(addOn);
  return quantity * price;
};

const hasData = addOn => {
  return addOn?.quantity && addOn.price;
};
