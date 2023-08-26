export const ProductXRefTypes = {
  ADD_ON_PRODUCT: 'AddOnProduct',
  RESERVATION: 'Reservation',
  RV_PRODUCT: 'RVProduct',
  STALL_PRODUCT: 'StallProduct'
};

export const ProductXRefTypeMap = {
  1: ProductXRefTypes.STALL_PRODUCT,
  2: ProductXRefTypes.ADD_ON_PRODUCT,
  3: ProductXRefTypes.RV_PRODUCT,
  4: ProductXRefTypes.RESERVATION
};

export const isStallProduct = xrefTypeId => ProductXRefTypeMap[xrefTypeId] === ProductXRefTypes.STALL_PRODUCT;
export const isRvProduct = xrefTypeId => ProductXRefTypeMap[xrefTypeId] === ProductXRefTypes.RV_PRODUCT;
export const isAddOnProduct = xrefTypeId => ProductXRefTypeMap[xrefTypeId] === ProductXRefTypes.ADD_ON_PRODUCT;
export const isReservation = xrefTypeId => ProductXRefTypeMap[xrefTypeId] === ProductXRefTypes.RESERVATION;

export default {
  isAddOnProduct,
  isReservation,
  isRvProduct,
  isStallProduct,
  ProductXRefTypes,
  ProductXRefTypeMap
};
