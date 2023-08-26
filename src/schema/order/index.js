// @flow
import { UserInputError } from 'apollo-server-express';
import userCache from 'Cache/user';
import type {
  RefundInputType,
  AssignmentsSMSInputType,
  SMSReturnType,
  SMSCountInputType,
  SMSCountType,
  OrderType,
  SMSOrderItemsInputType
} from 'Models/order/types';
import type { EventType } from 'Models/event/types';
import type { OrderItemType } from 'Models/orderItem/types';
import type { UserType } from 'Models/user/types';
import type { PaymentType } from 'Models/payment/types';
import type { ContextType } from 'Types/context';
import { productXRefTypeHelper } from 'Utils';
import { STALL_PRODUCT_X_REF_TYPE_ID, RV_PRODUCT_X_REF_TYPE_ID, VENUE_ADMIN, RESERVATION_ADMIN, GROUP_LEADER, RENTER } from 'Constants';
import temporaryCache from 'Utils/temporaryCache';
import { Order, Event, UserVenue, OrderItem, Payment, Group, GroupOrderBill, OrderHistory, ProductQuestionAnswer } from 'Models';
import { admin, adminAndGroupLeader, isAuthenticated } from 'Lib/auth';
import { getFullName } from '../user';

const Bugsnag = require('@bugsnag/js');

const getOrder = async (_: {}, { id }, context: ContextType): Promise<any> => {
  if (!id) return;

  const whereStatement = await getWhereByRole(id, context.user);
  const order = await Order.findOne({ where: whereStatement, include: [{ association: 'payments' }] });

  if (!order) {
    throw new UserInputError(`Order not found for this user. Order Id: ${id}`);
  }

  order.isEditable = isEditable(order, context.user);
  order.group = await Group.getGroupByOrderId(order.id);
  const groupPayments = await GroupOrderBill.findAll({
    where: { orderId: id }
  });
  order.groupPayments = groupPayments;

  if (order.group) {
    order.groupOrderLast4 = order.group.last4;
  }

  return order;
};

const getWhereByRole = async (orderId, user) => {
  if ([VENUE_ADMIN, RESERVATION_ADMIN, GROUP_LEADER].includes(user?.roleId)) {
    return getAdminFilter(orderId, user);
  }

  if ([RENTER].includes(user?.roleId)) {
    return { id: orderId, userId: user?.id };
  }
};

const getAdminFilter = async (orderId, user) => {
  const userId = user?.id;
  const venues = await getVenues(userId);
  const eventIds = await getEventIds(venues);

  return { id: orderId, eventId: eventIds };
};

const getVenues = async userId => {
  const venues = await UserVenue.findAll({
    attributes: ['venueId'],
    where: { userId }
  });

  return venues;
};

const getEventIds = async venues => {
  let eventIds = [];

  await Promise.all(
    venues.map(async venue => {
      const currentVenueEvents = await Event.findAll({
        attributes: ['id'],
        where: { venueId: venue.venueId }
      });

      const currentVenueEventsIds = currentVenueEvents.map(event => event.id);
      eventIds = [...eventIds, ...currentVenueEventsIds];
    })
  );

  return eventIds;
};

const isEditable = (order, user) => {
  const isGroupLeader = user.roleId === GROUP_LEADER;
  const isSettled = order.payments.length > 0;
  return !isGroupLeader || !isSettled;
};

const getOrderHistory = async (_: {}, { id }, context: ContextType): Promise<{}> => {
  const orderHistory = await OrderHistory.getOrderHistoryDetails(id, context?.user?.roleId);
  return orderHistory;
};

const getOrders = async (_: {}, { input }, context: ContextType): {} => {
  const venueId = context.venue.id;
  const { filterBy, orderBy, limit, offset, checkInOnly, checkOutOnly } = input;
  const [ordersReturn, orderError] = await Order.getOrders(
    venueId,
    context.user,
    {
      filterBy,
      orderBy,
      limit,
      offset,
      checkInOnly,
      checkOutOnly
    },
    context?.user?.roleId
  );
  const { orders, count, checkingInCount, checkingOutCount } = ordersReturn;

  if (orderError) return { success: false, error: orderError };
  for (let order of orders) {
    if (order.user) {
      userCache.user.prime(order.user.id, order.user);
    }
  }

  return { success: true, orders, count, checkingInCount, checkingOutCount };
};

const orderCosts = async (_: {}, { input }, context: ContextType) => {
  const costs = await Order.orderCosts(input, context?.user?.roleId);
  return costs;
};

const orderCostsFee = (_: {}, { input }, context: ContextType) => {
  const costs = Order.getOrderCostFee(input, context?.user?.roleId);
  return { fee: costs };
};

const orderUpdatePricingDiffs = async (_: {}, { input }, context: ContextType) => {
  const venueId = context.venue.id;
  const { orderId, updatedOrder } = input;
  const [pricingDiffs, pricingDiffsError] = await Order.getOrderUpdatePricingDifferences(orderId, updatedOrder, venueId, context?.user?.roleId);
  if (pricingDiffsError) {
    Bugsnag.notify(new Error(pricingDiffsError));
    return { success: false, error: pricingDiffsError };
  }
  const { addOns, rvs, stalls, transactionFee } = pricingDiffs;
  return {
    success: true,
    transactionFee,
    error: null,
    addOns,
    rvs,
    stalls
  };
};

const checkoutGroup = async (_: {}, { input }, context: ContextType): {} => {
  const adminId = +context.user.id;
  const [order, orderError] = await Order.groupOrderCheckout(input, adminId, context?.user?.roleId);

  if (orderError) {
    const errorMessage =
      orderError.message || 'There was an issue processing your order. Please try again and if the problem persists, contact support@rodeologistics.co';

    return {
      order: null,
      success: false,
      error: errorMessage
    };
  }

  await Order.sendConfirmationEmail(order, input, false, context?.user?.roleId);

  return {
    order,
    success: true,
    error: null
  };
};

const checkout = async (_: {}, { input }, context: ContextType): {} => {
  const adminId = +context.user.id;
  const [order, orderError] = await Order.orderCheckout(input, adminId, context?.user?.roleId);

  if (orderError) {
    let errorMessage =
      orderError.message || 'There was an issue processing your order. Please try again and if the problem persists, contact support@rodeologistics.co';

    if (errorMessage == 'stripe error') {
      const descriptionError = JSON.parse(orderError.description)?.error;
      errorMessage = orderError.description.includes('Duplicate order')
        ? descriptionError
        : `Your payment method could not be processed. ${
            descriptionError || orderError.description || ''
          } Please contact your financial institution and try again or enter a different payment method.`;
    }

    return {
      order: null,
      success: false,
      error: errorMessage
    };
  }

  await Order.sendConfirmationEmail(order, input, false, context?.user?.roleId);

  return {
    order,
    success: true,
    error: null
  };
};

const refund = async (_: {}, { input }: { input: [RefundInputType] }, context: ContextType) => {
  const adminId = context.user.id;
  const venueId = context.venue.id;
  const [refunds, refundError] = await Payment.refund(venueId, adminId, input, null, true, input[0].orderId, context?.user?.roleId);
  if (refundError) {
    // eslint-disable-next-line flowtype/no-weak-types
    Bugsnag.notify(new Error(refundError), function (e: any) {
      e.context = `${refundError} orderId ${input[0].orderId}`;
    });
    return {
      success: false,
      error: refundError
    };
  }
  return {
    refunds,
    success: true
  };
};

const updateOrder = async (_: {}, { input }, context: ContextType) => {
  const adminId = +context.user.id;
  const venueId = +context.venue.id;
  const [newOrder, orderUpdateError] = await Order.updateOrder(input, adminId, venueId, context?.user?.roleId);
  if (orderUpdateError) {
    // eslint-disable-next-line flowtype/no-weak-types
    Bugsnag.notify(new Error(orderUpdateError.message), function (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
      // eslint-disable-next-line no-console
      console.log('orderUpdateError', orderUpdateError);
    });
    return {
      success: false,
      error: orderUpdateError
    };
  }
  return {
    order: newOrder,
    success: true
  };
};

const reservationAssignmentSMSCounts = async (_: {}, { input }: { input: SMSCountInputType }, context: ContextType): Promise<SMSCountType> => {
  const type = input.reservationType === 'stalls' ? productXRefTypeHelper.ProductXRefTypes.STALL_PRODUCT : productXRefTypeHelper.ProductXRefTypes.RV_PRODUCT;
  const [smsCounts] = await Order.getDetailsSMSCount(input, type, context?.user?.roleId);
  return smsCounts;
};

const reservationDetailsSMS = async (_: {}, { input }: { input: AssignmentsSMSInputType }, context: ContextType): Promise<SMSReturnType> => {
  const type = input.reservationType === 'stalls' ? productXRefTypeHelper.ProductXRefTypes.STALL_PRODUCT : productXRefTypeHelper.ProductXRefTypes.RV_PRODUCT;
  const [response, error] = await Order.sendAssignmentsSmsByOrderIds(input, type, context?.user?.roleId);
  if (error) {
    Bugsnag.notify(new Error(error));
  }
  return { success: !!response, error: error };
};

const customSMSWithOrders = async (_: {}, { input }: { input: SMSOrderItemsInputType }, context: ContextType): Promise<SMSReturnType> => {
  return await Order.sendCustomSmsByOrderIds(input, context?.user?.roleId);
};

const cancelOrder = async (_: {}, { input }, context: ContextType) => {
  const adminId = +context.user.id;
  const venueId = +context.venue.id;
  const [canceledOrder, cancelOrderError] = await Order.cancel(input, adminId, venueId, context?.user?.roleId);
  if (cancelOrderError) {
    return {
      success: false,
      error: cancelOrderError
    };
  }

  return {
    success: true,
    error: null,
    order: canceledOrder
  };
};

const setIsVisited = async (_?: string, { id }: { id: string | number }, context: ContextType) => {
  return await Order.setIsVisited(id, context?.user?.roleId);
};

const Query = {
  // $FlowIgnore
  orderCosts: isAuthenticated(orderCosts),
  // $FlowIgnore
  orderCostsFee: isAuthenticated(orderCostsFee),
  // $FlowIgnore
  order: isAuthenticated(getOrder),
  // $FlowIgnore
  orders: isAuthenticated(getOrders),
  // $FlowIgnore
  orderHistory: isAuthenticated(getOrderHistory),
  // $FlowIgnore
  reservationAssignmentSMSCounts: admin(reservationAssignmentSMSCounts),
  // $FlowIgnore
  orderUpdatePricingDiffs: isAuthenticated(orderUpdatePricingDiffs)
};

const Mutation = {
  // $FlowIgnore
  checkoutGroup: isAuthenticated(checkoutGroup),
  // $FlowIgnore
  checkout: isAuthenticated(checkout),
  // $FlowIgnore
  refund: admin(refund),
  // $FlowIgnore
  updateOrder: adminAndGroupLeader(updateOrder),
  // $FlowIgnore
  reservationDetailsSMS: admin(reservationDetailsSMS),
  // $FlowIgnore
  customSMSWithOrders: admin(customSMSWithOrders),
  // $FlowIgnore
  cancelOrder: adminAndGroupLeader(cancelOrder),
  // $FlowIgnore
  setIsVisited: adminAndGroupLeader(setIsVisited)
};

const resolvers = {
  Query,
  Mutation,
  Order: {
    async user(parent: OrderType): UserType {
      const keys = JSON.stringify({ id: parent.userId });
      const loadFn = () => userCache.user.load(keys);
      const clearFn = () => userCache.user.clearAll();
      // $FlowIgnore
      const { payload: user } = await temporaryCache(loadFn, clearFn, 10000, 'order user');
      user.fullName = getFullName(user);
      // $FlowIgnore
      return user;
    },
    async stallQuestionAnswers(parent: OrderType): Promise<EventType> {
      const { id: orderId, eventId } = parent;
      const stallAnswers = await ProductQuestionAnswer.getProductQuestionAnswerByOrderId({ orderId, eventId, productXRefType: STALL_PRODUCT_X_REF_TYPE_ID });
      return stallAnswers;
    },
    async rvQuestionAnswers(parent: OrderType): Promise<EventType> {
      const { id: orderId, eventId } = parent;
      const rvAnswers = await ProductQuestionAnswer.getProductQuestionAnswerByOrderId({ orderId, eventId, productXRefType: RV_PRODUCT_X_REF_TYPE_ID });
      return rvAnswers;
    },
    async event(parent: OrderType, _: {}, context: ContextType): Promise<EventType> {
      const [event] = await Event.getEventById(parent.eventId, context?.user?.roleId);
      return event;
    },
    async orderItems(parent: OrderType): Promise<Array<OrderItemType>> {
      const [orderItems] = await OrderItem.getOrderItemsByOrderId(parent.id);
      return orderItems;
    },
    async orderHistory(parent: OrderType, _: {}, context: ContextType): Promise<Array<OrderItemType>> {
      return await OrderHistory.getOrderHistoryDetails(parent.id, context?.user?.roleId);
    },
    async payments(parent: OrderType): Promise<Array<PaymentType>> {
      const [payments] = await Payment.getPayments(parent.id);
      return payments;
    },
    async successorOrder(parent: OrderType, _: {}, context: ContextType): Promise<?OrderType> {
      if (parent.successor) {
        const [order] = await Order.getOrderById(parent.successor, context?.user?.roleId);
        return order;
      }
      return null;
    }
  }
};

export default resolvers;
