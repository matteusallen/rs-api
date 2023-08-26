// @flow
import type { OrderUpdateDifferencesType, OrderUpdateInputType } from 'Models/orderItem/types';

import { productXRefTypeHelper, validateAction } from 'Utils';
import { getStripeFee } from 'Utils/stripeFeeUtils';
import { ACTIONS, MENU } from 'Constants';
/**
 * Calculates the cost differences by changing an existing Order (by order id)
 * Does not actually make the charge, but returns a preview to client.
 *
 * Currently there can be one RV and one Stall product per reservation
 * But this method will support calculating multiple products per reservation
 *
 * @param orderId - Existing order
 * @param updatedOrder - Changes to existing order
 * @returns {Promise<[{transactionFee: number, addOns: [], rvs: [], stalls: []}, undefined]|[undefined, *]>}
 */
async function getOrderUpdatePricingDifferences(
  orderId: number,
  updatedOrder: OrderUpdateInputType,
  venueId: string,
  roleId: number
): Promise<[OrderUpdateDifferencesType | void, string | void]> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].GET_ORDER_UPDATE_PRICING_DIFFERENCES, roleId);
  try {
    // Get the original order
    const { AddOnProduct, OrderItem, Payment, Reservation, Venue } = this.sequelize.models;

    const [originalOrderItems, getOrderItemsError] = await OrderItem.getOrderItemsByOrderId(orderId);
    if (getOrderItemsError) {
      // eslint-disable-next-line no-console
      console.error(getOrderItemsError);
      throw `Error getOrderItemsByOrderId - ${orderId}`;
    }

    // Was the original order cash or CC?
    let useCard = false;
    const [originalPayment, originalPaymentError] = await Payment.getPayments(orderId);
    if (originalPaymentError) {
      // Non-fatal
      // eslint-disable-next-line no-console
      console.error(originalPaymentError);
    } else if (!originalPayment || originalPayment.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(`No payment information found for orderId: ${orderId}`);
    } else {
      useCard = originalPayment[0].cardPayment;
    }

    // Calc and return pricing differences
    const addOnsDiffs = [];
    const rvDiffs = [];
    const stallDiffs = [];
    let transactionFee: number = 0;
    const [venue] = await Venue.getVenueById(venueId);

    await Promise.all(
      originalOrderItems.map(async orderItem => {
        if (productXRefTypeHelper.isAddOnProduct(orderItem.xRefTypeId)) {
          const product = await AddOnProduct.findOne({
            where: { id: orderItem.xProductId },
            include: [{ association: 'addOn' }]
          });

          const addOnUpdates = updatedOrder.addOns || [];

          await Promise.all(
            addOnUpdates.map(async addOnUpdate => {
              const id = Number(addOnUpdate.id);
              const quantity = Number(addOnUpdate.quantity);
              if (id === orderItem.xProductId && quantity !== orderItem.quantity) {
                const newPrice = quantity * product.price;
                const priceDelta = newPrice - orderItem.price;
                const stripeFee = getStripeFee(priceDelta, venue.platformFee, useCard, false);
                const total = newPrice > 0 ? newPrice + stripeFee : 0;
                transactionFee += Number(stripeFee);

                const addOnProduct = product.addOn;
                addOnsDiffs.push({
                  id,
                  quantityDelta: quantity - orderItem.quantity,
                  name: addOnProduct.name,
                  unitName: addOnProduct.unitName,
                  originalPrice: orderItem.price,
                  newPrice: total,
                  priceDelta,
                  stripeFee
                });
              }
              return addOnUpdate;
            })
          );
          return orderItem;
        } else if (productXRefTypeHelper.isReservation(orderItem.xRefTypeId)) {
          const [reservationProducts, getReservationProductsError] = await Reservation.getReservationProductsByOrderId(orderId);
          if (getReservationProductsError) throw getReservationProductsError;

          const rvUpdates = updatedOrder.rvs || [];
          const stallUpdates = updatedOrder.stalls || [];

          await Promise.all(
            reservationProducts.map(async reservationProduct => {
              const isStalls = productXRefTypeHelper.isStallProduct(reservationProduct.xRefTypeId);
              const productInfoProp = isStalls ? 'stallInfo' : 'rvInfo';
              const productInfo = reservationProduct[productInfoProp];
              const requestedUpdates = isStalls ? stallUpdates : rvUpdates;
              const resultCollection = isStalls ? stallDiffs : rvDiffs;

              if (reservationProduct.id === orderItem.xProductId && !!productInfo && requestedUpdates) {
                requestedUpdates.map(updateItem => {
                  if (updateItem.quantity !== orderItem.quantity) {
                    // We currently do not allow price changes on stalls and RVs
                    // However, still returning info for other order edit changes
                    resultCollection.push({
                      id: Number(productInfo.id),
                      quantityDelta: updateItem.quantity - orderItem.quantity,
                      name: productInfo.name,
                      originalPrice: orderItem.price,
                      newPrice: orderItem.price,
                      stripeFee: 0,
                      priceDelta: 0
                    });
                  }
                });
              }
            })
          );
          return orderItem;
        } else {
          return orderItem;
        }
      })
    );
    // const delay = (milliseconds) => new Promise((resolve) => setTimeout(() => resolve(), milliseconds))
    // await delay(5000)
    return [{ transactionFee, addOns: addOnsDiffs, rvs: rvDiffs, stalls: stallDiffs }, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getOrderUpdatePricingDifferences;
