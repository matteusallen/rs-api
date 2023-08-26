// @flow
import { Op } from 'sequelize';
import moment from 'moment-timezone';
import { reportHelpers, stringHelpers, formatDate, deepClone } from 'Utils';
import { transactionReportByDateDisclaimer, transactionReportDisclaimer, cashReportDisclaimer } from 'Constants';

import type { TransactionReportInputType } from '../types';
import { em } from '../../../utils/processReport';

async function getTransactionReport(input: TransactionReportInputType, request?: any = {}, roleId: number): Promise<any> {
  const usersObject = {};
  const { eventIds, start, end, venueTimeZone, venueId, stripeAccountType, users, userId } = input;
  const { User, Order, AddOn, AddOnProduct } = this.sequelize.models;
  const [allUsers] = await User.getUsers({ filterBy: users }, roleId);

  allUsers.forEach(user => {
    const { id, firstName, lastName } = user || {};
    if (user) usersObject[id] = { firstName, lastName };
  });

  const reportData = [];
  const tabSubTitles = {
    transaction: start && end ? transactionReportByDateDisclaimer : transactionReportDisclaimer,
    credit: start && end ? transactionReportByDateDisclaimer : transactionReportDisclaimer,
    cash: cashReportDisclaimer
  };

  const getOrdersData = async whereClause => {
    const orders = await Order.findAll({
      where: whereClause,
      attributes: ['id', 'userId', 'createdAt', 'platformFee', 'fee', 'eventId'],
      order: [['orderHistory', 'createdAt', 'ASC']],
      include: [
        {
          association: 'orderHistory',
          attributes: ['changeType', 'newValues', 'oldValues', 'paymentId', 'createdAt', 'isGroupOrder']
        },
        {
          where: { venueId },
          association: 'event',
          attributes: ['id', 'name']
        },
        {
          association: 'groupOrderBills',
          attributes: ['id', 'createdAt', 'note', 'amount']
        },
        {
          association: 'payments',
          attributes: ['id', 'createdAt', 'cardPayment', 'cardBrand', 'notes', 'amount'],
          include: [
            {
              association: 'payout',
              attributes: ['paidDate', 'amount']
            }
          ]
        },
        {
          association: 'orderItems',
          attributes: ['id', 'price', 'quantity'],
          include: [
            {
              association: 'addOnProduct',
              attributes: ['id', 'price'],
              include: [{ association: 'addOn', attributes: ['id', 'name'] }]
            },
            {
              association: 'reservation',
              attributes: ['id', 'xRefTypeId', 'startDate', 'endDate'],
              include: [
                { association: 'stallProduct', attributes: ['nightly', 'price'] },
                { association: 'rvProduct', attributes: ['nightly', 'price'] }
              ]
            }
          ]
        }
      ]
    });

    return orders;
  };

  const getOrderItemsData = (orderItems, addOnProducts, isNoRefund) => {
    const getAddOnsDefaults = () => {
      return addOnProducts.reduce((data, addOnProduct) => {
        data[`${addOnProduct.addOn?.name || addOnProduct?.name} Quantity`] = '-';
        data[`${addOnProduct.addOn?.name || addOnProduct?.name} Unit price`] = 0;
        data[`${addOnProduct.addOn?.name || addOnProduct?.name} Total price`] = 0;
        return data;
      }, {});
    };

    const orderItemsDataIntialValues = {
      'Stalls Quantity': '-',
      'Stalls Nights': '-',
      'Stalls Unit price': 0,
      'Stalls Total price': 0,
      'Spots Quantity': '-',
      'Spots Nights': '-',
      'Spots Unit price': 0,
      'Spots Total price': 0,
      ...getAddOnsDefaults(),
      'Sub total': 0
    };
    const orderItemsData = orderItems?.reduce((data, orderItem) => {
      if (orderItem.reservation) {
        const key = orderItem.reservation.xRefTypeId == 1 ? 'Stalls' : 'Spots';
        data[`${key} Quantity`] = orderItem.quantityDifference || '-';
        data[`${key} Nights`] = orderItem.numberOfNights || '-';
        data[`${key} Unit price`] = Number(orderItem.price) || '-';
        data[`${key} Total price`] = (!isNoRefund && Number(orderItem.totalPrice)) || '-';
        data['Sub total'] = isNoRefund ? '-' : data['Sub total'] + Number(orderItem.totalPrice) || 0;
      } else if (orderItem.addOnProduct) {
        const key = orderItem.addOnName;
        data[`${key} Quantity`] = orderItem.quantityDifference || '-';
        data[`${key} Unit price`] = Number(orderItem.price) || '-';
        data[`${key} Total price`] = (!isNoRefund && Number(orderItem.totalPrice)) || '-';
        data['Sub total'] = isNoRefund ? '-' : data['Sub total'] + Number(orderItem.totalPrice) || 0;
      }

      return data;
    }, orderItemsDataIntialValues);

    return orderItemsData;
  };

  const getSubTotalHeaders = eventAddOnProducts => {
    const subTotalsHeaders = [...Array(3), 'Stall total', ...Array(3), 'RV total'];
    const addOnSubTotalHeaders = eventAddOnProducts?.reduce((data, addOnProduct) => {
      data.push(...Array(2), `${addOnProduct.addOn?.name || addOnProduct.name} total`);
      return data;
    }, []);
    return [...subTotalsHeaders, ...addOnSubTotalHeaders, 'Sub total', ...Array(2), 'Grand Total'];
  };

  const getReport = async whereClause => {
    const ordersResponse = await getOrdersData(whereClause);

    if (!ordersResponse || !ordersResponse.length) {
      throw new Error('No records found');
    }

    const isStripeExpressAccount = stripeAccountType === 'express';
    let [eventOrVenueAddOnProducts] = whereClause.eventId
      ? await AddOnProduct.getAddOnProductsByEventId(ordersResponse[0].event?.id)
      : await AddOn.getAddOnsByVenueId(venueId);

    const initialEmptySubTotalsColumns = isStripeExpressAccount ? 8 : 7;

    const getDateDiff = (start, end) => {
      let a = moment(start),
        b = moment(end);
      return b.diff(a, 'days');
    };
    const getReportData = async () => {
      const subtotalHeaders = getSubTotalHeaders(eventOrVenueAddOnProducts);
      const transactionsInitialData = { transaction: [], credit: [], cash: [] };
      const transactionSubTotalHeaders = [...Array(initialEmptySubTotalsColumns), ...subtotalHeaders];
      const cashSubTotalHeaders = [...Array(7), ...subtotalHeaders];
      const creditSubTotalHeaders = !isStripeExpressAccount ? [...Array(7), ...subtotalHeaders] : ['Payout total', ...Array(7), ...subtotalHeaders];
      const transactionSubTotals = {};
      const creditSubTotals = {};
      const cashSubTotals = {};

      const transactionsData = ordersResponse.reduce((acc, order) => {
        const { id: orderId, platformFee, payments, event, fee, groupOrderBills, orderItems, userId } = order;
        const { name: eventName } = event;
        const paymentsObj = {};

        const getNumberOfNightsDifference = (oldValues, newValues, purchasedOrRefundedItem) => {
          const initialStartDate = moment(
            oldValues?.startDate || newValues?.startDate?.substring(0, 10) || purchasedOrRefundedItem?.reservation?.startDate?.substring(0, 10)
          ).format('YYYY-MM-DD');
          const initialEndDate = moment(
            oldValues?.endDate || newValues?.endDate?.substring(0, 10) || purchasedOrRefundedItem?.reservation?.endDate?.substring(0, 10)
          ).format('YYYY-MM-DD');
          const updatedStartDate = moment(newValues?.startDate?.substring(0, 10) || purchasedOrRefundedItem?.reservation?.startDate?.substring(0, 10)).format(
            'YYYY-MM-DD'
          );
          const updatedEndDate = moment(newValues?.endDate?.substring(0, 10) || purchasedOrRefundedItem?.reservation?.endDate).format('YYYY-MM-DD');
          const oldNumberOfNights = initialStartDate && initialEndDate ? getDateDiff(initialStartDate, initialEndDate) : 0;
          const newNumberOfNights = updatedStartDate && updatedEndDate ? getDateDiff(updatedStartDate, updatedEndDate) : 0;
          const numberOfNightsDifference = newNumberOfNights === oldNumberOfNights ? newNumberOfNights : newNumberOfNights - oldNumberOfNights;

          return numberOfNightsDifference || oldNumberOfNights;
        };

        const getDatesUpdated = (oldValues, newValues, purchasedOrRefundedItem) => {
          const initialStartDate = moment(
            oldValues?.startDate || newValues?.startDate?.substring(0, 10) || purchasedOrRefundedItem?.reservation?.startDate?.substring(0, 10)
          ).format('YYYY-MM-DD');
          const initialEndDate = moment(
            oldValues?.endDate || newValues?.endDate?.substring(0, 10) || purchasedOrRefundedItem?.reservation?.endDate?.substring(0, 10)
          ).format('YYYY-MM-DD');
          const updatedStartDate = moment(newValues?.startDate?.substring(0, 10) || purchasedOrRefundedItem?.reservation?.startDate?.substring(0, 10)).format(
            'YYYY-MM-DD'
          );
          const updatedEndDate = moment(newValues?.endDate?.substring(0, 10) || purchasedOrRefundedItem?.reservation?.endDate).format('YYYY-MM-DD');

          return updatedEndDate !== initialEndDate || updatedStartDate !== initialStartDate;
        };

        const getReducedQuantityAndNights = (orderHistorRecord, resType) => {
          const { oldValues, newValues } = orderHistorRecord;

          const hasStallQuantityDiff = oldValues?.stalls?.quantity !== newValues?.stalls?.quantity;
          const hasRvQuantityDiff = oldValues?.rvs?.quantity !== newValues?.rvs?.quantity;
          const oldStallsQuantity = oldValues.stalls?.quantity;
          const oldRvsQuantity = oldValues.rvs?.quantity;
          const currentStallsQuantity = newValues.stalls?.quantity;
          const currentRvsQuantity = newValues.rvs?.quantity;
          const stallsQuantityDifference = oldStallsQuantity && hasStallQuantityDiff ? currentStallsQuantity - oldStallsQuantity : 0;
          const rvsQuantityDifference = oldRvsQuantity && hasRvQuantityDiff ? currentRvsQuantity - oldRvsQuantity : 0;
          const purchasedOrRefundedStallsItem = orderItems.find(oi => oi.reservation?.id == newValues.stalls?.reservationId);
          const purchasedOrRefundedRvsItem = orderItems.find(oi => oi.reservation?.id == newValues.rvs?.reservationId);
          const hasDatesUpdated = getDatesUpdated(oldValues.stalls, newValues.stalls, purchasedOrRefundedStallsItem);
          const numberOfStallsNightsDifference = hasDatesUpdated
            ? getNumberOfNightsDifference(oldValues.stalls, newValues.stalls, purchasedOrRefundedStallsItem)
            : 0;
          const numberOfRvsNightsDifference = hasDatesUpdated ? getNumberOfNightsDifference(oldValues.rvs, newValues.rvs, purchasedOrRefundedRvsItem) : 0;
          const stallsQuantityAndNightsCheck =
            stallsQuantityDifference != 0 && numberOfStallsNightsDifference != 0 && (stallsQuantityDifference < 0 || numberOfStallsNightsDifference < 0);
          const rvsQuantityAndNightsCheck =
            rvsQuantityDifference != 0 && numberOfRvsNightsDifference != 0 && (rvsQuantityDifference < 0 || numberOfRvsNightsDifference < 0);

          return resType === 'stalls' ? stallsQuantityAndNightsCheck : rvsQuantityAndNightsCheck;
        };

        const orderHistory = [];
        order.orderHistory.forEach(oh => {
          const reducedStallQuantityAndNights = getReducedQuantityAndNights(oh, 'stalls');
          const reducedRvsQuantityAndNights = getReducedQuantityAndNights(oh, 'rvs');

          if (reducedStallQuantityAndNights || reducedRvsQuantityAndNights) {
            const newOh = deepClone(oh.dataValues);

            oh.hasBeenExtractedFrom = 'true';

            if (reducedStallQuantityAndNights) {
              newOh.hasBeenExtractedStalls = 'true';
              oh.newValues.stalls.startDate = oh.oldValues.stalls.startDate;
              oh.newValues.stalls.endDate = oh.oldValues.stalls.endDate;
            }
            if (reducedRvsQuantityAndNights) {
              newOh.hasBeenExtractedRvs = 'true';
              oh.newValues.rvs.startDate = oh.oldValues.rvs.startDate;
              oh.newValues.rvs.endDate = oh.oldValues.rvs.endDate;
            }

            orderHistory.push(oh);
            orderHistory.push(newOh);
          } else {
            orderHistory.push(oh);
          }
        });

        orderHistory.forEach(oh => {
          const { changeType, newValues, paymentId, createdAt, isGroupOrder, adminId, hasBeenExtractedStalls, hasBeenExtractedRvs, hasBeenExtractedFrom } = oh;
          const specialRefund = changeType === 'specialRefund';
          const orderCancellation = changeType === 'orderCancellation';
          const isAddOns = !!newValues?.addOns;
          const isReservationOrder = !!(newValues?.rvs || newValues?.stalls);
          const newOrderItemsArray = [];
          const slicedCreatedAt = new Date(createdAt).getTime().toString().slice(0, -4);
          const orderItemGroupId = `${slicedCreatedAt}:${adminId}:${paymentId}:${isGroupOrder}:${hasBeenExtractedStalls}:${hasBeenExtractedRvs}`;

          if (paymentsObj[orderItemGroupId] || changeType === 'assignmentChange') return;

          const linkedPayment = payments.find(({ id }) => id === paymentId);
          const linkedGroupOrderPayment = groupOrderBills.find(({ id }) => id === paymentId);
          const total = isGroupOrder ? linkedGroupOrderPayment?.amount : paymentId ? linkedPayment?.amount || 0 : 0;

          if ((isAddOns || isReservationOrder) && !paymentsObj[orderItemGroupId]) paymentsObj[orderItemGroupId] = true;

          const newOrderHistories = orderHistory.filter(
            ({ paymentId, createdAt, isGroupOrder, adminId, hasBeenExtractedStalls, hasBeenExtractedRvs }) =>
              `${new Date(createdAt)
                .getTime()
                .toString()
                .slice(0, -4)}:${adminId}:${paymentId}:${isGroupOrder}:${hasBeenExtractedStalls}:${hasBeenExtractedRvs}` === orderItemGroupId
          );

          newOrderHistories.forEach(({ oldValues, newValues }) => {
            if (isReservationOrder || isAddOns) {
              if (newValues.rvs) {
                const purchasedOrRefundedItem = orderItems.find(oi => oi.reservation?.id == newValues.rvs.reservationId);
                const oldQuantity = oldValues.rvs?.quantity;
                const currentQuantity = newValues.rvs.quantity;
                const quantityDifference = hasBeenExtractedRvs ? currentQuantity : currentQuantity - (oldQuantity || 0);
                const price = purchasedOrRefundedItem.reservation.rvProduct.price;
                const numberOfNightsDifference = getNumberOfNightsDifference(oldValues.rvs, newValues.rvs, purchasedOrRefundedItem);
                const nightlyMultiplier = purchasedOrRefundedItem.reservation.rvProduct.nightly ? numberOfNightsDifference || 1 : 1;
                const totalPrice = quantityDifference * price * nightlyMultiplier;

                const newOrderItem = {
                  quantityDifference,
                  numberOfNights: numberOfNightsDifference,
                  totalPrice,
                  price,
                  reservation: {
                    xRefTypeId: 3
                  }
                };
                newOrderItemsArray.push(newOrderItem);
              }

              if (newValues.stalls) {
                const purchasedOrRefundedItem = orderItems.find(oi => oi.reservation?.id == newValues.stalls.reservationId);
                const oldQuantity = oldValues.stalls?.quantity;
                const currentQuantity = newValues.stalls.quantity;
                const quantityDifference = hasBeenExtractedStalls ? currentQuantity : currentQuantity - (oldQuantity || 0);
                const price = purchasedOrRefundedItem.reservation.stallProduct.price;
                const numberOfNightsDifference = getNumberOfNightsDifference(oldValues.stalls, newValues.stalls, purchasedOrRefundedItem);
                const flatRateReducedNights = numberOfNightsDifference < 0 && !purchasedOrRefundedItem.reservation.stallProduct.nightly;
                const nightlyMultiplier = flatRateReducedNights
                  ? 0
                  : purchasedOrRefundedItem.reservation.stallProduct.nightly
                  ? numberOfNightsDifference || 1
                  : 1;
                const totalPrice = quantityDifference * price * nightlyMultiplier;

                const newOrderItem = {
                  quantityDifference,
                  numberOfNights: numberOfNightsDifference,
                  totalPrice,
                  price,
                  reservation: {
                    xRefTypeId: 1
                  }
                };
                newOrderItemsArray.push(newOrderItem);
              }

              if (newValues?.addOns) {
                const oldQuantity = oldValues.addOns?.quantity;
                const currentQuantity = newValues?.addOns.quantity;
                const quantityDifference = currentQuantity - (oldQuantity || 0);
                const purchasedOrRefundedItem = orderItems.find(oi => oi.id === newValues.orderItemId);
                const price = purchasedOrRefundedItem.addOnProduct?.price;
                const name = purchasedOrRefundedItem.addOnProduct?.addOn.name;
                const totalPrice = quantityDifference * price;

                const newOrderItem = {
                  quantityDifference,
                  totalPrice,
                  price,
                  addOnProduct: {},
                  addOnName: name
                };
                newOrderItemsArray.push(newOrderItem);
              }
            } else if (changeType === 'orderCancellation') {
              orderItems.forEach(oi => {
                let newOrderItem = {};
                const quantity = oi.quantity * -1;
                if (oi.reservation) {
                  if (oi.reservation.stallProduct) {
                    const numberOfStallNightsDifference = getNumberOfNightsDifference(oi.reservation._previousDataValues, oi.reservation);
                    const price = oi.reservation.stallProduct.price;
                    const nightlyMultiplier = oi.reservation.stallProduct.nightly ? numberOfStallNightsDifference || 1 : 1;
                    const totalPrice = quantity * price * nightlyMultiplier;
                    newOrderItem = {
                      quantityDifference: quantity,
                      numberOfNights: numberOfStallNightsDifference,
                      totalPrice,
                      price,
                      reservation: {
                        xRefTypeId: 1
                      }
                    };
                  }
                  if (oi.reservation.rvProduct) {
                    const numberOfRvNightsDifference = getNumberOfNightsDifference(oi.reservation._previousDataValues, oi.reservation);
                    const price = oi.reservation.rvProduct.price;
                    const nightlyMultiplier = oi.reservation.rvProduct.nightly ? numberOfRvNightsDifference || 1 : 1;
                    const totalPrice = quantity * price * nightlyMultiplier;
                    newOrderItem = {
                      quantityDifference: quantity,
                      numberOfNights: numberOfRvNightsDifference,
                      totalPrice,
                      price,
                      reservation: {
                        xRefTypeId: 3
                      }
                    };
                  }
                } else if (oi.addOnProduct) {
                  const price = oi.addOnProduct?.price;
                  const name = oi.addOnProduct?.addOn.name;
                  const totalPrice = quantity * price;

                  newOrderItem = {
                    quantityDifference: quantity,
                    totalPrice,
                    price,
                    addOnProduct: {},
                    addOnName: name
                  };
                }
                newOrderItemsArray.push(newOrderItem);
              });
            }
          });

          const orderItemsData = getOrderItemsData(newOrderItemsArray, eventOrVenueAddOnProducts || [], total == 0);
          let refundReason;
          if (total < 0) refundReason = isGroupOrder ? linkedGroupOrderPayment.note : linkedPayment.notes;
          else if (total == 0) refundReason = newValues?.noRefundReason;

          const transactionDate = moment(linkedGroupOrderPayment?.createdAt || linkedPayment?.createdAt || createdAt).format('MM/DD/YYYY');
          const payoutDate = isStripeExpressAccount
            ? linkedPayment?.payout?.paidDate
              ? moment(linkedPayment.payout.paidDate).format('MM/DD/YYYY')
              : '-'
            : '-';

          const getRefundReason = () => {
            if (specialRefund) return `Special Refund: ${refundReason}`;
            if (orderCancellation && total == 0) return 'Cancelled Reservation - No Refund.';
            if (orderCancellation) return `Cancelled Reservation: ${refundReason}`;
            if (total == 0) return refundReason ? `No Refund: ${refundReason}` : '-';
            return refundReason || '-';
          };

          const builtRefundReason = getRefundReason();
          let roloFee = '-';
          let stripeFee = '-';
          const subTotal = orderItemsData['Sub total'];
          const isCancelledWithRefund = total < 0 && orderCancellation;
          const cancelledRefundDiff = Number((total - subTotal).toFixed(2));

          const roloDiffExceedsFee = cancelledRefundDiff < Number(platformFee) * -1;
          const hasRoloFee = total > 0 && Number(platformFee);
          const hasStripeFee = total > 0 && Number(fee);

          if (hasRoloFee) {
            roloFee = Number(platformFee);
          } else if (isCancelledWithRefund && Number(platformFee)) {
            if (roloDiffExceedsFee || cancelledRefundDiff > total) {
              roloFee = Number(platformFee) * -1;
            } else {
              roloFee = cancelledRefundDiff;
            }
          }

          const cancelledRefundStripeDiff = Number((total - subTotal - Number(roloFee)).toFixed(2));
          const stripeDiffExceedsFee = cancelledRefundStripeDiff < Number(fee) * -1;

          if (linkedPayment?.cardPayment) {
            if (hasStripeFee) stripeFee = Number(fee);
            else if (isCancelledWithRefund) {
              if (stripeDiffExceedsFee || cancelledRefundStripeDiff > total) {
                stripeFee = Number(fee) * -1;
              } else {
                stripeFee = cancelledRefundStripeDiff;
              }
            }
          }

          const transaction = {
            'Order ID': orderId,
            'Payout date': payoutDate,
            'Trans. date': transactionDate,
            eventName: eventName,
            'Renter name': `${usersObject[userId]?.firstName || ''} ${usersObject[userId]?.lastName || ''}`,
            'Trans. type': !total ? '-' : linkedPayment?.cardPayment ? 'card' : 'cash/check',
            'Card brand': stringHelpers.upperFirst(linkedPayment?.cardBrand) || '-',
            'Refund Reason': builtRefundReason,
            ...orderItemsData,
            'ROLO fee': roloFee,
            'Stripe fee': stripeFee,
            Total: hasBeenExtractedStalls || hasBeenExtractedRvs || hasBeenExtractedFrom ? subTotal : total ? Number(total) : 0
          };

          if (specialRefund) transaction['Sub total'] = total ? Number(total) : 0;
          if (!isStripeExpressAccount) delete transaction['Payout date'];

          acc.transaction.push(transaction);
          const creditTransaction = !isStripeExpressAccount
            ? { ...transaction }
            : { ...transaction, 'Payout total': Number(linkedPayment?.payout?.amount / 100) };
          const cashTransaction = { ...transaction };

          if (linkedPayment?.cardPayment) {
            acc.credit.push(creditTransaction);

            if (!isStripeExpressAccount) {
              for (const column in creditTransaction) {
                if (Object.keys(creditTransaction).indexOf(column) === 0) {
                  creditSubTotals[column] = 'totalsRow';
                } else if (column.includes('Total') || column.includes('total')) {
                  if (isNaN(Number(creditTransaction[column]))) return;
                  creditSubTotals[column] = isNaN(Number(creditSubTotals[column]) + Number(creditTransaction[column]))
                    ? Number(creditTransaction[column])
                    : Number(creditSubTotals[column]) + Number(creditTransaction[column]);
                } else {
                  creditSubTotals[column] = '';
                }
              }
            }
          }

          if (!linkedPayment?.cardPayment && total) {
            transaction['Payout date'] && delete cashTransaction['Payout date'];
            delete cashTransaction['Stripe Fee'];
            acc.cash.push(cashTransaction);
          }

          for (const column in transaction) {
            if (Object.keys(transaction).indexOf(column) === 0) {
              transactionSubTotals[column] = 'totalsRow';
            } else if (column.includes('Total') || column.includes('total')) {
              const totalsColumn = isNaN(Number(transaction[column])) ? 0 : Number(transaction[column]);

              transactionSubTotals[column] = isNaN(Number(transactionSubTotals[column]) + totalsColumn)
                ? totalsColumn
                : Number(transactionSubTotals[column]) + totalsColumn;
            } else {
              transactionSubTotals[column] = '';
            }
          }

          for (const column in cashTransaction) {
            if (!linkedPayment?.cardPayment) {
              if (Object.keys(cashTransaction).indexOf(column) === 0) {
                cashSubTotals[column] = 'totalsRow';
              } else if (column.includes('Total') || column.includes('total')) {
                if (isNaN(Number(cashTransaction[column]))) return;
                cashSubTotals[column] = isNaN(Number(cashSubTotals[column]) + Number(cashTransaction[column]))
                  ? Number(cashTransaction[column])
                  : Number(cashSubTotals[column]) + Number(cashTransaction[column]);
              } else {
                cashSubTotals[column] = '';
              }
            }
          }
        });
        return acc;
      }, transactionsInitialData);

      transactionsData.transaction.push(transactionSubTotalHeaders, transactionSubTotals);
      !transactionsData.cash.length ? delete transactionsData.cash : transactionsData.cash.push(cashSubTotalHeaders, cashSubTotals);

      if (transactionsData.credit.length && isStripeExpressAccount) {
        transactionsData.credit?.sort((a, b) => (a['Payout date'] > b['Payout date'] ? 1 : -1));

        const creditTransactionGroups = transactionsData.credit.reduce((acc, transaction) => {
          const payoutDate = transaction['Payout date'];

          if (!acc[payoutDate]) {
            acc[payoutDate] = {
              transactions: [],
              subTotals: { 'Payout total': !isNaN(transaction['Payout total']) ? transaction['Payout total'] : '-' }
            };
          }

          delete transaction['Payout total'];
          acc[payoutDate].transactions.push(transaction);

          for (const column in transaction) {
            if (column.includes('Total') || column.includes('total')) {
              if (!isNaN(Number(transaction[column]))) {
                acc[payoutDate].subTotals[column] = Number(acc[payoutDate].subTotals[column]) + Number(transaction[column]) || Number(transaction[column]);
              } else {
                acc[payoutDate].subTotals[column] = '-';
              }
            } else if (!column.includes('Order ID')) {
              acc[payoutDate].subTotals[column] = '';
            }
          }

          return acc;
        }, {});

        transactionsData.credit = [];
        let groupsCount = Object.keys(creditTransactionGroups).length;
        for (const group in creditTransactionGroups) {
          const transactions = creditTransactionGroups[group].transactions.sort((a, b) => (a['Trans. date'] > b['Trans. date'] ? 1 : -1));
          const subTotals = creditTransactionGroups[group].subTotals || '-';
          subTotals['Payout date'] = 'totalsRow';
          transactionsData.credit.push(...transactions, creditSubTotalHeaders, subTotals, !--groupsCount ? ['divider-top'] : ['group-divider']);
        }
      } else if (!transactionsData.credit.length) {
        delete transactionsData.credit;
      } else {
        transactionsData.credit.push(creditSubTotalHeaders, creditSubTotals);
      }

      return transactionsData;
    };

    const report = await getReportData();

    return report;
  };

  const cleanAddOnHeaders = dirtyHeaders => {
    return dirtyHeaders.reduce((cleanHeaders, header) => {
      if (header.includes(' Quantity')) {
        cleanHeaders.push(header.replace(' Quantity', ''));
      } else if (header.includes('Nights')) {
        cleanHeaders.push('Nights');
      } else if (header.includes('Unit price')) {
        cleanHeaders.push('Unit price');
      } else if (header.includes('Total price')) {
        cleanHeaders.push('Total price');
      } else {
        cleanHeaders.push(header);
      }

      return cleanHeaders;
    }, []);
  };

  const addToReportData = (report, startDate, endDate) => {
    for (const sheet in report) {
      const sheetTitle =
        startDate && endDate
          ? `Reporting period: ${formatDate.toUsDateWithSlash(startDate)} - ${formatDate.toUsDateWithSlash(endDate)}`
          : `${report[sheet][0]?.eventName}`;
      if (report[sheet].length) {
        var dataRows = report[sheet].reduce((rows, row) => {
          rows.push(Object.values(row));
          return rows;
        }, []);

        const sheetNamePrefix = sheet === 'transaction' ? 'Trans' : stringHelpers.upperFirst(sheet);
        const sheetName = startDate && endDate ? `${stringHelpers.upperFirst(sheet)} Report` : `${sheetNamePrefix}-${report[sheet][0].eventName}`;

        const sheetHeaders = cleanAddOnHeaders(Object.keys(report[sheet][0]));

        const reportSheet = {
          data: dataRows,
          headerLabels: [sheetHeaders],
          title: sheetTitle,
          subTitle: tabSubTitles[sheet],
          sheetName: sheetName,
          sheetTitle: `${stringHelpers.upperFirst(sheet)} Report`
        };

        reportData.push(reportSheet);
      }
    }
  };

  if (eventIds?.length) {
    for (const eventId of eventIds) {
      const whereClause = { eventId };
      const report = await getReport(whereClause);
      addToReportData(report);
    }
  } else if (start && end) {
    const whereClause = { createdAt: { [Op.between]: [moment(start).tz(venueTimeZone).startOf('day'), moment(end).tz(venueTimeZone).endOf('day')] } };
    const report = await getReport(whereClause);
    addToReportData(report, start, end);
  } else throw new Error('Invalid request');

  if (reportData.length >= Number(process.env.MAX_ROWS_FOR_DOWNLOAD) && request) {
    const user = await User.getUser({ id: userId });
    em.emit('processReport', request, user.payload);
    return [undefined, true];
  }

  const transactionWordbook = await reportHelpers.populateTemplate(
    reportData,
    'src/assets/transaction-report-template.xlsx',
    'Transaction Report',
    1,
    9,
    false,
    '',
    15
  );
  return [transactionWordbook, false];
}

export default getTransactionReport;
