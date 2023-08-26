import { ORDER_HISTORY_CHANGE_TYPES } from '../../../../../constants/index';
import { getProductQty, getProductNights, getProductUnitPrice } from './newOrder';

export const isCancelling = history => {
  return history.changeType === ORDER_HISTORY_CHANGE_TYPES.orderCancellation;
};

export const getRowsCancellingOrder = (history, productType) => {
  const productrow = {};
  productrow[`${productType}Qty`] = -getProductQty(history.oldValues?.[productType]);
  productrow[`${productType}Nights`] = getProductNights(history.oldValues?.[productType]);
  productrow[`${productType}UnitPrice`] = getProductUnitPrice(history.oldValues?.[productType]);
  productrow[`${productType}Total`] = getProductTotal(history.oldValues?.[productType]);

  const fees = getFeesSum(history);
  productrow.roloFee = fees.roloFee === 0 ? '-' : fees.roloFee;
  productrow.stripeFee = fees.stripeFee === 0 ? '-' : fees.stripeFee;

  return [productrow];
};

const getFeesSum = history => {
  return history.orderHistoryPayments.reduce(
    (acc, curr) => {
      const payment = curr.payment;
      if (isCancellingRefundingFees(payment)) {
        acc.roloFee = -payment.originalPaymentServiceFee + acc.roloFee;
        acc.stripeFee = -payment.originalPaymentStripeFee + acc.stripeFee;
      }
      return acc;
    },
    { roloFee: 0, stripeFee: 0 }
  );
};

const isCancellingRefundingFees = payment => {
  return Math.abs(payment.amount) === payment.originalPaymentAmount;
};

export const getProductTotal = product => {
  if (!productHasData(product)) {
    return null;
  }
  const quantity = -getProductQty(product);
  const nights = product?.nightly ? getProductNights(product) : 1;
  const price = getProductUnitPrice(product);
  return quantity * nights * price;
};

export const productHasData = product => {
  return product?.quantity && product.price;
};

export const getAddOnsCancellingOrder = addOns => {
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
  addOnData[`${name}Total`] = getProductTotal(addOn);

  return addOnData;
};
