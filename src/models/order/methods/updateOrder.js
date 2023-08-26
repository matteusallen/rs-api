// @flow
import logger from 'Config/winston';
import {
  ORDER_HISTORY_CHANGE_TYPES,
  STALL_PRODUCT_X_REF_TYPE_ID,
  RV_PRODUCT_X_REF_TYPE_ID,
  RESERVATION_X_REF_TYPE_ID,
  ERROR_MESSAGES,
  ACTIONS,
  MENU
} from 'Constants';
import type { RefundInputType, GroupOrderPaymentInputType, NoRefundInputType } from 'Models/order/types';
import { isLast4DistinctAndLessThan5, confirmOrderAvailability, getCostInput } from 'Utils/orderUtils';
import { payWithStripe } from '../../../utils/orderUtils';
import { getStripeFee } from 'Utils/stripeFeeUtils';
import { formatDate, validateAction } from 'Utils';
import { isAfter, isSame, toDbDate } from '../../../utils/formatDate';
import { StallProduct, RVProduct, AddOnProduct } from 'Models';
import type { Multipayment } from './orderCheckout';
import moment from 'moment';

const UPDATE_TYPE_ADD = 'add';
const UPDATE_TYPE_DELETE = 'delete';
const UPDATE_QUANTITY_TYPE = 'updateQuantity';
const UPDATE_DATES_TYPE = 'updateDates';
const CHANGE_PRODUCT_TYPE = 'changeProduct';
const ADD_RESERVATION_TYPE = 'addReservationProduct';

type UpdateOrderInputType = {|
  orderId: number,
  reservations: [],
  addOns: [],
  adminNotes?: string,
  assignments: [],
  orderItemsArray: [],
  refundInformation: [RefundInputType],
  refundPayment: boolean,
  productQuestionAnswers: [],
  groupOrderPayment: GroupOrderPaymentInputType,
  noRefund?: NoRefundInputType,
  multipaymentInput?: Multipayment
|};

function checkForValidityOfDates(reservations = [], event = {}) {
  const errors = [];

  for (let reservation of reservations) {
    const { startDate, endDate } = reservation;

    if (isSame(toDbDate(startDate), toDbDate(endDate))) {
      errors.push(ERROR_MESSAGES.CHECKIN_CHECKOUT_SAME_DATE);
    }

    if (isAfter(toDbDate(endDate), toDbDate(event.endDate))) {
      errors.push(ERROR_MESSAGES.CHECKOUT_AFTER_EVENT_DATE);
    }
  }

  if (errors.length) {
    return [undefined, errors];
  }

  return [true, undefined];
}

async function updateAddOns(addOn: any, existingOrder: any, OrderItem: any, transaction: {}, noRefundReason?: string, orderId?: any): Promise<any> {
  try {
    let oldValues = {},
      newValues = {};

    const { type, orderItemId } = addOn;

    const existingOrderItem = existingOrder.orderItems.find(o => o.id === +orderItemId);
    if (!existingOrderItem && type === UPDATE_TYPE_ADD) {
      //create addon order item
      const addOnProduct = await AddOnProduct.findOne({ where: { id: addOn.xProductId } });
      const input = {
        orderId,
        xProductId: addOn.xProductId,
        xRefTypeId: 2,
        quantity: addOn.quantity,
        price: addOnProduct.price * addOn.quantity
      };
      const newOrderItem = await OrderItem.create(input, transaction);
      newValues = { ...newValues.addOns, quantity: +addOn.quantity };
      newValues.orderItemId = +newOrderItem.id;
      newValues.noRefundReason = noRefundReason;
      return { oldValues, newValues };
    }

    if (type == UPDATE_QUANTITY_TYPE) {
      await OrderItem.updateQuantityById(addOn, transaction);
      newValues = { ...newValues.addOns, quantity: +addOn.quantity };
      oldValues = { ...oldValues.addOns, quantity: +existingOrderItem.quantity };
    }

    newValues.orderItemId = +orderItemId;
    oldValues.orderItemId = +existingOrderItem.id;
    //store no refund reason
    newValues.noRefundReason = noRefundReason;

    return { oldValues, newValues };
  } catch (error) {
    logger.error(`updateAddOns: ${error.message}`);
    throw error;
  }
}

async function updateReservations(
  input: [],
  existingOrder: any,
  OrderItem: any,
  Reservation: any,
  transaction: {},
  noRefundReason?: string,
  orderId: number,
  assignments: [],
  roleId: number
): Promise<any> {
  try {
    const oldValues = {},
      newValues = {},
      oldProductChangeValues = {},
      newProductChangeValues = {};

    for (const reservation of input) {
      const { type, reservationId } = reservation;
      const existingOrderItem = existingOrder.orderItems.find(o => o.xProductId == +reservationId);

      if (!existingOrderItem && ADD_RESERVATION_TYPE) {
        const product =
          reservation.xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID
            ? await StallProduct.findOne({
                where: { id: reservation.xProductId }
              })
            : await RVProduct.findOne({
                where: { id: reservation.xProductId }
              });
        let price = product.nightly
          ? product.price * moment(reservation.endDate).diff(moment(reservation.startDate), 'days') * reservation.quantity
          : product.price * reservation.quantity;
        reservation.assignments = assignments.map(assign => {
          if (!assign['reservationID']) {
            return assign.spaceId;
          }
        });
        const newItemInput = {
          orderId,
          xRefTypeId: reservation.xRefTypeId,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          xProductId: product.id,
          assignments: reservation.assignments,
          quantity: reservation.quantity,
          price
        };
        const [oi, oiError] = await OrderItem.createOrderItem(newItemInput, transaction, roleId);
        if (oiError) throw Error(oiError);

        reservation['reservationId'] = oi.xProductId;
        if (reservation.xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID) {
          //stall updates
          newValues.stalls = {
            ...newValues.stalls,
            xProductId: reservation.xProductId,
            quantity: reservation.quantity,
            startDate: formatDate.toDbDate(reservation.startDate),
            endDate: formatDate.toDbDate(reservation.endDate),
            reservationId: oi.xProductId
          };
        } else {
          newValues.rvs = {
            ...newValues.rvs,
            xProductId: reservation.xProductId,
            quantity: +reservation.quantity,
            startDate: formatDate.toDbDate(reservation.startDate),
            endDate: formatDate.toDbDate(reservation.endDate),
            reservationId: oi.xProductId
          };
        }
      }

      if (type == CHANGE_PRODUCT_TYPE) {
        const reservationProductInput = { reservationId: +reservationId, xProductId: reservation.xProductId };
        await Promise.all([
          Reservation.updateReservationProduct(reservationProductInput, transaction),
          Reservation.updateReservationDates(reservation, transaction),
          OrderItem.updateOrderItem({ reservation, xRefTypeId: RESERVATION_X_REF_TYPE_ID }, transaction)
        ]);
      }

      if (type == UPDATE_QUANTITY_TYPE) {
        await OrderItem.updateQuantityByReservationId(reservation, transaction);
      }

      if (type == UPDATE_DATES_TYPE) {
        await Reservation.updateReservationDates(reservation, transaction);
      }

      const existingReservation = existingOrderItem?.reservation;

      if (existingReservation) {
        if (existingReservation?.xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID) {
          //stall updates
          if (type === CHANGE_PRODUCT_TYPE) {
            //only applies to product change
            newProductChangeValues.stalls = {
              ...newProductChangeValues.stalls,
              xProductId: reservation.xProductId || existingReservation.xProductId,
              startDate: formatDate.toDbDate(reservation.startDate) || existingReservation.startDate,
              endDate: formatDate.toDbDate(reservation.endDate) || existingReservation.endDate,
              quantity: +reservation.quantity || existingOrderItem.quantity,
              reservationId: +reservationId
            };
            oldProductChangeValues.stalls = {
              ...oldProductChangeValues.stalls,
              xProductId: existingReservation.xProductId,
              startDate: existingReservation.startDate,
              endDate: existingReservation.endDate,
              quantity: existingOrderItem.quantity,
              reservationId: +reservationId
            };
          } else {
            newValues.stalls = {
              ...newValues.stalls,
              xProductId: reservation.xProductId || existingReservation.xProductId,
              quantity: reservation.quantity || existingReservation.quantity,
              startDate: formatDate.toDbDate(reservation.startDate) || existingReservation.startDate,
              endDate: formatDate.toDbDate(reservation.endDate) || existingReservation.endDate,
              reservationId: +reservationId
            };
            oldValues.stalls = {
              ...oldValues.stalls,
              xProductId: existingReservation.xProductId,
              quantity: existingOrderItem.quantity || +reservation.quantity,
              startDate: existingReservation.startDate || formatDate.toDbDate(reservation.startDate),
              endDate: existingReservation.endDate || formatDate.toDbDate(reservation.endDate),
              reservationId: +existingOrderItem.reservation.id || +reservationId
            };
          }
        } else {
          //rvs updates
          if (type === CHANGE_PRODUCT_TYPE) {
            //only applies to rv product change
            newProductChangeValues.rvs = {
              xProductId: reservation.xProductId || existingReservation.xProductId,
              startDate: formatDate.toDbDate(reservation.startDate) || existingReservation.startDate,
              endDate: formatDate.toDbDate(reservation.endDate) || existingReservation.endDate,
              quantity: reservation.quantity || existingOrderItem.quantity,
              reservationId: +reservationId
            };
            oldProductChangeValues.rvs = {
              xProductId: existingReservation.xProductId,
              startDate: existingReservation.startDate,
              endDate: existingReservation.endDate,
              quantity: existingOrderItem.quantity,
              reservationId: +reservationId
            };
          } else {
            newValues.rvs = {
              ...newValues.rvs,
              xProductId: reservation.xProductId || existingReservation.xProductId,
              quantity: +reservation.quantity || existingReservation.quantity,
              startDate: formatDate.toDbDate(reservation.startDate) || existingReservation.startDate,
              endDate: formatDate.toDbDate(reservation.endDate) || existingReservation.endDate,
              reservationId: +reservationId
            };
            oldValues.rvs = {
              ...oldValues.rvs,
              xProductId: existingReservation.xProductId,
              quantity: existingOrderItem.quantity || +reservation.quantity,
              startDate: existingReservation.startDate || formatDate.toDbDate(reservation.startDate),
              endDate: existingReservation.endDate || formatDate.toDbDate(reservation.endDate),
              reservationId: +reservationId
            };
          }
        }
      }
    }
    //store no refund reason
    if (Object.keys(newValues).length && noRefundReason) {
      newValues.noRefundReason = noRefundReason;
    }

    if (Object.keys(newProductChangeValues).length && noRefundReason) {
      newProductChangeValues.noRefundReason = noRefundReason;
    }

    return { reservationChange: { oldValues, newValues }, productChange: { oldValues: oldProductChangeValues, newValues: newProductChangeValues } };
  } catch (error) {
    logger.error(`updateReservations: ${error.message}`);
    throw error;
  }
}

async function updateAssignments(input: [], existingOrder: any, ReservationSpace: any, transaction: {}): Promise<any> {
  try {
    const oldValues = { stallsAssignments: [], rvAssignments: [] },
      newValues = { stallsAssignments: [], rvAssignments: [] };

    for (const assignment of input) {
      const { type, reservationId } = assignment;
      const existingOrderItem = existingOrder.orderItems.find(o => o.xProductId === +reservationId);

      if (!existingOrderItem) continue;

      const existingReservation = existingOrderItem.reservation;

      if (type == UPDATE_TYPE_ADD) {
        await ReservationSpace.createReservationSpace(assignment, transaction);

        if (existingReservation.xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID) {
          newValues.stallsAssignments.push(assignment.spaceId);
        } else {
          newValues.rvAssignments.push(assignment.spaceId);
        }
      }

      if (type == UPDATE_TYPE_DELETE) {
        await ReservationSpace.deleteReservationSpace(assignment, transaction);

        if (existingReservation && existingReservation.xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID) {
          oldValues.stallsAssignments.push(assignment.spaceId);
        } else {
          oldValues.rvAssignments.push(assignment.spaceId);
        }
      }
    }
  } catch (error) {
    logger.error(`updateAssignments: ${error.message}`);
    throw error;
  }
}

async function updateOrder(input: UpdateOrderInputType, adminId: number, venueId: number, roleId: number): Promise<[boolean | void, string | void]> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].UPDATE_ORDER, roleId);

  const { Order, OrderItem, OrderHistory, Event, Reservation, ReservationSpace, Payment, GroupOrderBill, ProductQuestionAnswer, User } = this.sequelize.models;
  const {
    orderId,
    reservations,
    assignments,
    orderItemsArray,
    addOns,
    refundPayment,
    noRefund,
    refundInformation,
    groupOrderPayment,
    adminNotes,
    productQuestionAnswers,
    paymentInput = {}, // add to schema
    multipaymentInput
  } = input;

  if (adminNotes) validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].ADMIN_NOTES, roleId);

  const transaction = await this.sequelize.transaction();
  let activities = {},
    refundResponses = [];
  let newOrderItemsArray = [],
    groupOrderBill = {},
    refundError,
    noRefundReason,
    postPaymentError,
    oldCost = {},
    newCost = {},
    currentCost = {};

  let postedPayment;
  let postedCardPayment;
  let postedCashPayment;
  let postedMultiPaymentError;

  if (!adminId) throw new Error('Permission denied!');

  try {
    const existingOrder = await this.findOne({
      where: { id: orderId },
      include: [
        {
          association: 'orderItems',
          include: [
            {
              association: 'reservation'
            }
          ]
        },
        { association: 'event', include: [{ association: 'venue' }] },
        { association: 'user', attributes: ['ssGlobalId'] },
        { association: 'payments' }
      ]
    });
    if (!existingOrder) throw Error('Order not found!');

    const event = existingOrder?.event;

    // check for reservation dates validity
    const [, errors] = checkForValidityOfDates(reservations, event);
    if (errors) throw new Error('Date selection is not valid');

    const { venue } = await Event.findOne({
      where: { id: event.id },
      include: [{ association: 'venue' }]
    });

    if (groupOrderPayment) {
      if (groupOrderPayment.isRefund && !groupOrderPayment.amount && String(groupOrderPayment.notes).trim()) {
        //group order zero dollar refund ajustments with notes
        const updateInput = { orderId, adminId, note: groupOrderPayment.notes, isRefund: groupOrderPayment.isRefund };
        groupOrderBill = await GroupOrderBill.updateGroupOrderBill(updateInput, transaction);
      } else if (groupOrderPayment.isRefund && groupOrderPayment.amount) {
        //group order ajustments with refunds
        const input = {
          orderId,
          amount: groupOrderPayment.amount,
          isRefund: true,
          note: groupOrderPayment.notes,
          adminId
        };
        groupOrderBill = await GroupOrderBill.createGroupOrderBill(input, transaction);
        logger.info('GroupOrderBill refund was processed');
      } else if (!groupOrderPayment.isRefund && !!orderItemsArray) {
        //group order ajustments with charge, zero or more
        newOrderItemsArray = [...orderItemsArray];

        confirmOrderAvailability({ event, orderItems: newOrderItemsArray, oldOrderItems: existingOrder.orderItems, roleId });
        logger.info('Availability check passed!');

        let applyFeePerProduct = false,
          applyPlatformFeeOnUpdate = false;

        oldCost = await this.orderCosts(
          {
            useCard: false,
            selectedOrderItems: getCostInput(existingOrder.orderItems, newOrderItemsArray),
            applyFeePerProduct,
            applyPlatformFeeOnUpdate
          },
          roleId
        );

        newCost = await this.orderCosts(
          {
            useCard: false,
            selectedOrderItems: newOrderItemsArray,
            applyFeePerProduct,
            applyPlatformFeeOnUpdate
          },
          roleId
        );

        const reservationsDeletingProducts = reservations.filter(({ type, quantity }) => type === 'updateQuantity' && quantity === 0);

        if (reservationsDeletingProducts.length) {
          let costsFromDeletedProducts = 0;

          reservationsDeletingProducts.forEach(({ reservationId }) => {
            const orderItem = existingOrder.orderItems.find(
              orderItem => orderItem.reservation && parseInt(orderItem.reservation.id) === parseInt(reservationId)
            );

            if (orderItem) {
              costsFromDeletedProducts += orderItem.price;
            }
          });

          oldCost.total += costsFromDeletedProducts;
        }

        const deletedAddons = addOns.filter(({ type, quantity }) => type === 'updateQuantity' && quantity === 0);

        if (deletedAddons.length) {
          let costsFromDeletedAddons = 0;

          deletedAddons.forEach(({ orderItemId }) => {
            const orderItem = existingOrder.orderItems.find(orderItem => parseInt(orderItem.id) === parseInt(orderItemId));

            if (orderItem) {
              costsFromDeletedAddons += orderItem.price;
            }
          });

          oldCost.total += costsFromDeletedAddons;
        }

        const total = Math.abs(newCost.total - oldCost.total);

        const input = {
          orderId,
          amount: total,
          isRefund: false,
          note: groupOrderPayment.notes,
          adminId
        };

        groupOrderBill = total ? await GroupOrderBill.createGroupOrderBill(input, transaction) : { id: -1 }; //to exclude zero dollar changes;
        logger.info('Group order bill charge was processed!');
      }
    } else if (refundPayment) {
      //changes with card refunds
      [refundResponses, refundError] = await Payment.refund(venueId, adminId, refundInformation, transaction, false, orderId, roleId);
      if (refundError) throw Error(refundError);
      logger.info('Refund processed');
    } else if (noRefund && noRefund.notes) {
      //changes with card but refund was ignored
      noRefundReason = `NO REFUND: ${noRefund.notes}`;

      const refundTransaction = {
        adminId,
        ssChargeId: null,
        cardPayment: false,
        cardBrand: null,
        last4: null,
        ssRefundId: null,
        orderId,
        // $FlowFixMe
        amount: -Math.abs(Number(noRefund.amount).toFixed(2)),
        notes: noRefundReason,
        success: false,
        stripeAccountType: ''
      };

      const [payment, paymentError] = await Payment.addPayment(refundTransaction, transaction);
      if (paymentError) throw new Error(paymentError);
      refundResponses = [payment];
      logger.info('No Refund processed');
    } else if (paymentInput && !!orderItemsArray) {
      validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].ADDITIONAL_ORDER_PAYMENT, roleId);
      //cash or card charge changes for zero or more dollar amount
      //check to make sure we do not already have more than 5 cards on file for the order
      const paymentInformation = [...existingOrder.payments, paymentInput];
      if (!isLast4DistinctAndLessThan5(paymentInformation)) {
        throw Error('Order already has 5 cards registered');
      }

      newOrderItemsArray = [...orderItemsArray];
      //check to see if we have enough inventory if update involve stall
      confirmOrderAvailability({ event, orderItems: newOrderItemsArray, oldOrderItems: existingOrder.orderItems, roleId });
      logger.info('Availability check passed!');

      //discounts from changes dates
      const discountsFromChangedDates = await this.calculateDiscountFromAlteredDate(
        getCostInput(existingOrder.orderItems, newOrderItemsArray),
        newOrderItemsArray
      );

      let applyFeePerProduct = false,
        applyPlatformFeeOnUpdate = false;

      oldCost = await this.orderCosts(
        {
          useCard: paymentInput.useCard,
          selectedOrderItems: getCostInput(existingOrder.orderItems, newOrderItemsArray),
          isNonUSCard: paymentInput.isNonUSCard,
          applyPlatformFeeOnUpdate,
          applyFeePerProduct
        },
        roleId
      );

      newCost = await this.orderCosts(
        {
          useCard: paymentInput.useCard,
          selectedOrderItems: newOrderItemsArray,
          isNonUSCard: paymentInput.isNonUSCard,
          applyFeePerProduct,
          applyPlatformFeeOnUpdate
        },
        roleId
      );

      const addedRes =
        !existingOrder.orderItems.some(oi => oi.xRefTypeId === (STALL_PRODUCT_X_REF_TYPE_ID || RV_PRODUCT_X_REF_TYPE_ID)) &&
        reservations.some(res => res.type === 'addReservationProduct');

      currentCost.total = Math.abs(newCost.total - oldCost.total) + discountsFromChangedDates;

      currentCost.stripeFee = getStripeFee(
        currentCost.total,
        applyPlatformFeeOnUpdate || addedRes ? venue.dataValues.platformFee : 0,
        paymentInput.useCard,
        paymentInput.isNonUSCard
      );

      currentCost = {
        ...currentCost,
        total: currentCost.total + (paymentInput.useCard ? currentCost.stripeFee : 0) + (addedRes ? venue.dataValues.platformFee : 0)
      };

      const stripeInput = {
        orderId: existingOrder.id,
        currentCost,
        adminId,
        ssGlobalId: existingOrder.user.ssGlobalId,
        venue: venue.dataValues,
        paymentInput,
        multipaymentInput
      };
      const [isMultipayment, ...rest] = currentCost.total ? await payWithStripe(stripeInput) : [{ id: -1 }, undefined]; //to exclude zero dollar payments

      if (isMultipayment) {
        [postedCardPayment, postedCashPayment, postedMultiPaymentError] = rest;
        if (postedMultiPaymentError) throw postedMultiPaymentError;
      } else {
        [postedPayment, postPaymentError] = rest;
        if (postPaymentError) throw postPaymentError;
      }

      logger.info('Payment successfully posted through ROLOSS');
    }

    let paymentIds = groupOrderBill && groupOrderBill.id ? [groupOrderBill.id] : [];
    paymentIds = refundResponses.length ? refundResponses.map(refundResponse => refundResponse.id) : paymentIds;

    let paymentResIds = null;

    if (multipaymentInput && multipaymentInput.isMultipayment && postedCardPayment && postedCashPayment) {
      paymentResIds = [postedCardPayment.id, postedCashPayment.id];
    }

    if (postedPayment) {
      paymentResIds = [postedPayment.id];
    }

    paymentIds = paymentResIds ? paymentResIds : paymentIds;

    const isGroupOrder = groupOrderPayment ? true : false;

    let rvs = null,
      oldRvs = null,
      stalls = null,
      oldStalls = null,
      currentAddons = [],
      oldAddons = [],
      newNoRefundReason = '';

    if (reservations.length) {
      const { reservationChange, productChange } = await updateReservations(
        reservations,
        existingOrder,
        OrderItem,
        Reservation,
        transaction,
        noRefundReason,
        orderId,
        assignments,
        roleId
      );
      const resChangeValues = Object.keys(reservationChange.newValues);
      const changekeysResChange = resChangeValues.length;
      const hasRvsResChange = resChangeValues.includes('rvs');
      const hasStallsResChange = resChangeValues.includes('stalls');

      if (changekeysResChange) {
        if (reservationChange.newValues.noRefundReason) newNoRefundReason = reservationChange.newValues.noRefundReason;

        if (hasRvsResChange) {
          rvs = { ...reservationChange.newValues.rvs };
          oldRvs = { ...reservationChange.oldValues.rvs };
        }
        if (hasStallsResChange) {
          stalls = { ...reservationChange.newValues.stalls };
          oldStalls = { ...reservationChange.oldValues.stalls };
        }
      }

      const productChangeValues = Object.keys(productChange.newValues);
      const changekeysProdChange = productChangeValues.length;
      const hasRvsProdChange = productChangeValues.includes('rvs');
      const hasStallsProdChange = productChangeValues.includes('stalls');

      if (changekeysProdChange) {
        if (productChange.newValues.noRefundReason) newNoRefundReason = productChange.newValues.noRefundReason;
        if (hasRvsProdChange) {
          rvs = { ...productChange.newValues.rvs };
          oldRvs = { ...productChange.oldValues.rvs };
        }

        if (hasStallsProdChange) {
          stalls = { ...productChange.newValues.stalls };
          oldStalls = { ...productChange.oldValues.stalls };
        }
      }
    }

    if (assignments.length) {
      await updateAssignments(assignments, existingOrder, ReservationSpace, transaction);
    }

    if (addOns.length) {
      for (const addOn of addOns) {
        const addOnChanges = await updateAddOns(addOn, existingOrder, OrderItem, transaction, noRefundReason, orderId);
        currentAddons.push(addOnChanges.newValues);
        if (Object.keys(addOnChanges.oldValues).length) oldAddons.push(addOnChanges.oldValues);
      }
    }

    for (const productQuestionAnswer of productQuestionAnswers || []) {
      await ProductQuestionAnswer.updateProductQuestionAnswer(productQuestionAnswer, transaction);
    }

    //update total
    await this.update({ total: existingOrder.total, adminNotes }, { where: { id: orderId }, transaction });
    logger.info('Order timestamp updated');

    if (rvs) {
      rvs.quantity = rvs.quantity === undefined ? 0 : rvs.quantity;
    }

    if (stalls) {
      stalls.quantity = stalls.quantity === undefined ? 0 : stalls.quantity;
    }

    activities = {
      orderId,
      adminId,
      changeType: ORDER_HISTORY_CHANGE_TYPES.orderChange,
      oldValues: {
        // $FlowIgnore
        ...(oldRvs && { rvs: oldRvs }),
        // $FlowIgnore
        ...(oldStalls && { stalls: oldStalls }),
        // $FlowIgnore
        ...(oldAddons.length && { addOns: oldAddons })
      },
      newValues: {
        // $FlowIgnore
        discount: currentCost.discount || 0,
        // $FlowIgnore
        ...(rvs && { rvs: rvs }),
        // $FlowIgnore
        ...(stalls && { stalls: stalls }),
        // $FlowIgnore
        ...(currentAddons.length && { addOns: currentAddons }),
        // $FlowIgnore
        ...(newNoRefundReason && { noRefundReason: newNoRefundReason })
      },
      paymentIds,
      isGroupOrder
    };

    if (Object.keys(activities.newValues).length > 1) {
      //log all activities
      await OrderHistory.recordActivities([activities], transaction);
      logger.info('Update activity recorded');
    }

    transaction.afterCommit(async () => {
      if (refundResponses.length && refundPayment) {
        const updatedOrder = await this.findOne({
          where: { id: orderId },
          include: [{ association: 'user' }]
        });

        const [, emailError] = await this.sendRefundEmail({
          order: updatedOrder,
          payment: refundResponses
        });
        if (emailError) logger.error(emailError); //no need to reverse refund if email fail to send.
        logger.info('Refund emails sent');
      }

      if (!(noRefund && noRefund.notes) && ((groupOrderPayment && !groupOrderPayment.isRefund) || paymentInput) && !postPaymentError) {
        const updatedOrder = await this.findOne({
          where: { id: orderId },
          include: [{ association: 'user' }]
        });

        const user = await User.getUser({ id: updatedOrder.userId });
        Order.sendChargeEmail(updatedOrder, { userInput: user.payload }, reservations, newCost, currentCost.total, currentCost.stripeFee);
      }

      if (noRefund && noRefund.notes) {
        const updatedOrder = await this.findOne({
          where: { id: orderId },
          include: [{ association: 'user' }]
        });

        const user = await User.getUser({ id: updatedOrder.userId });
        Order.sendChargeEmail(updatedOrder, { userInput: user.payload }, reservations, newCost, currentCost.total, currentCost.stripeFee);
      }
    });

    await transaction.commit();
    logger.info('Update order commited');

    return [existingOrder, undefined];
  } catch (error) {
    logger.error(`Failed to update order ${orderId}, ${error.message}`);
    // eslint-disable-next-line no-console
    console.log(error);
    await transaction.rollback();
    return [undefined, error.message];
  }
}

export default updateOrder;
