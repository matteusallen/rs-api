import { Op } from 'sequelize';
import moment from 'moment-timezone';
import { OrderHistory, OrderItem, StallProduct, RVProduct, User, Payment } from 'Models';
import { ADD_ON_PRODUCT_X_REF_TYPE_ID, ORDER_HISTORY_CHANGE_TYPES } from '../../../../constants/index';

export const getQuery = async ({ eventIds, start, end, venueTimeZone, venueId }, roleId) => {
  try {
    const orderItems = await getOrderItems();
    const stallProducts = await StallProduct.findAll();
    const rvProducts = await RVProduct.findAll();
    const orderHistoryData = await getOrderHistoryData(eventIds, start, end, venueTimeZone, venueId);
    const users = await getUsers(orderHistoryData, roleId);
    const payments = await Payment.findAll();
    const groupOrdersToSkip = new Set();
    const cancelledOrderIds = [];
    const processedHistoryData = [];

    orderHistoryData.forEach(history => {
      if (history.order.canceled) {
        cancelledOrderIds.push(history.order.id);
      }

      if (groupOrdersToSkip.has(history.orderId) && history.orderHistoryPayments[0]?.isGroupOrder) {
        return;
      }

      const [groupHistory, isGroupCancelled] = getGroupHistory(history, orderHistoryData, groupOrdersToSkip);
      if (isGroupCancelled) {
        return;
      }
      if (groupHistory) {
        fillUsersData(groupHistory, users);
        fillAddOnsData(groupHistory, orderItems);
        fillStallsData(groupHistory, stallProducts);
        fillRvsData(groupHistory, rvProducts);
        processedHistoryData.push(groupHistory);
        return;
      }

      fillUsersData(history, users);
      fillAddOnsData(history, orderItems);
      fillStallsData(history, stallProducts);
      fillRvsData(history, rvProducts);
      fillPaymentForCancelledOrders(history, payments);
      processedHistoryData.push(history);
    });
    return [processedHistoryData, cancelledOrderIds];
  } catch (error) {
    return error.message;
  }
};

const getOrderItems = async () => {
  const orderItems = await OrderItem.findAll({
    where: { xRefTypeId: ADD_ON_PRODUCT_X_REF_TYPE_ID },
    include: [
      {
        association: 'addOnProduct',
        attributes: ['id', 'price'],
        include: [{ association: 'addOn', attributes: ['name'] }]
      }
    ]
  });

  return orderItems;
};

const getOrderHistoryData = async (eventIds, start, end, venueTimeZone, venueId) => {
  const whereClause = getWhereClause(eventIds, start, end, venueTimeZone, venueId);
  const orderHistoryData = await OrderHistory.findAll({
    where: whereClause,
    attributes: ['id', 'orderId', 'adminId', 'changeType', 'oldValues', 'newValues', 'createdAt'],
    include: [
      {
        association: 'order',
        attributes: ['id', 'userId', 'platformFee', 'canceled'],
        include: [
          { association: 'event', attributes: ['name'], include: [{ association: 'venue', attributes: ['stripeAccountType', 'timeZone'] }] },
          { association: 'groupOrderBills', attributes: ['amount', 'isRefund'] }
        ]
      },
      {
        association: 'orderHistoryPayments',
        attributes: ['id', 'isGroupOrder'],
        include: [
          {
            association: 'payment',
            attributes: [
              'id',
              'ssChargeId',
              'ssRefundId',
              'cardPayment',
              'cardBrand',
              'notes',
              'amount',
              'serviceFee',
              'stripeFee',
              'stripeAccountType',
              'orderId',
              'success'
            ],
            include: [
              {
                association: 'payout',
                attributes: ['stripePayoutId', 'paidDate', 'amount']
              }
            ]
          }
        ]
      }
    ]
  });
  return orderHistoryData;
};

const getWhereClause = (eventIds, start, end, venueTimeZone, venueId) => {
  let whereClause = {};
  whereClause['$order.event.venueId$'] = +venueId;
  if (eventIds?.length) {
    whereClause['$order.event.id$'] = { [Op.in]: eventIds };
  }
  if (start && end) {
    whereClause.createdAt = { [Op.between]: [moment(start).tz(venueTimeZone).startOf('day'), moment(end).tz(venueTimeZone).endOf('day')] };
  }
  return whereClause;
};

const getUsers = async (orderHistoryData, roleId) => {
  const userIdSet = orderHistoryData.reduce((userIds, orderHistory) => {
    userIds.add(orderHistory.adminId);
    userIds.add(orderHistory.order.userId);
    return userIds;
  }, new Set());

  const userIdArray = Array.from(userIdSet);

  const [users] = await User.getUsers({ filterBy: { id: userIdArray } }, roleId);
  return users;
};

const fillUsersData = (history, users) => {
  history.adminName = getUserName(users, history.adminId);
  history.renterName = getUserName(users, history.order.userId);
  history.dataValues.adminName = getUserName(users, history.adminId);
  history.dataValues.renterName = getUserName(users, history.order.userId);
};

const getUserName = (users, userId) => {
  const user = users.find(user => user.id === userId);
  return user ? `${user.firstName} ${user.lastName}` : '-';
};

const fillAddOnsData = (history, orderItems) => {
  const newValuesAddOns = history.newValues?.addOns || history.newValues?.addons;
  if (newValuesAddOns) {
    const addOnsArray = Array.isArray(newValuesAddOns) ? newValuesAddOns : [newValuesAddOns];
    addOnsArray.forEach(async addOn => {
      const orderItem = orderItems.find(oi => oi.id === addOn.orderItemId);
      const addOnProduct = orderItem.addOnProduct;
      addOn.price = +addOnProduct.price;
      addOn.name = addOnProduct.addOn.name;
    });
  }
  const oldValuesAddOns = history.oldValues?.addOns || history.oldValues?.addons;
  if (oldValuesAddOns) {
    const addOnsArray = Array.isArray(oldValuesAddOns) ? oldValuesAddOns : [oldValuesAddOns];
    addOnsArray.forEach(async addOn => {
      const orderItem = orderItems.find(oi => oi.id === addOn.orderItemId);
      const addOnProduct = orderItem.addOnProduct;
      addOn.price = +addOnProduct.price;
      addOn.name = addOnProduct.addOn.name;
    });
  }
};

const fillStallsData = (history, stallProducts) => {
  if (history.newValues?.stalls?.xProductId) {
    const stall = stallProducts.find(stall => stall.id === +history.newValues.stalls.xProductId);
    history.newValues.stalls.price = stall.price;
    history.newValues.stalls.nightly = stall.nightly;
  }
  if (history.oldValues?.stalls?.xProductId) {
    const stall = stallProducts.find(stall => stall.id === +history.oldValues.stalls.xProductId);
    history.oldValues.stalls.price = stall.price;
    history.oldValues.stalls.nightly = stall.nightly;
  }
};

const fillRvsData = (history, rvProducts) => {
  if (history.newValues?.rvs?.xProductId) {
    const rv = rvProducts.find(rv => rv.id === +history.newValues.rvs.xProductId);
    history.newValues.rvs.price = rv.price;
    history.newValues.rvs.nightly = rv.nightly;
  }
  if (history.oldValues?.rvs?.xProductId) {
    const rv = rvProducts.find(rv => rv.id === +history.oldValues.rvs.xProductId);
    history.oldValues.rvs.price = rv.price;
    history.oldValues.rvs.nightly = rv.nightly;
  }
};

const fillPaymentForCancelledOrders = (history, payments) => {
  if (history.changeType !== ORDER_HISTORY_CHANGE_TYPES.orderCancellation) {
    return;
  }

  history.orderHistoryPayments.forEach(ohp => {
    if (isNoRefund(ohp)) {
      return;
    }

    let originalPayment = payments.find(p => p.ssChargeId === ohp.payment?.ssChargeId && !p.ssRefundId);

    if (!ohp.payment?.cardPayment) {
      originalPayment = payments.find(p => p.id !== ohp.payment?.id && p.orderId === ohp.payment?.orderId && -p.amount === ohp.payment?.amount);
    }

    ohp.payment.originalPaymentAmount = originalPayment?.amount;
    ohp.payment.originalPaymentServiceFee = originalPayment?.serviceFee;
    ohp.payment.originalPaymentStripeFee = originalPayment?.stripeFee;
  });
};

const isNoRefund = orderHistoryPayment => {
  // No refunds are created with success = false
  return !orderHistoryPayment.payment?.success;
};

const getGroupHistory = (history, orderHistoryData, groupOrdersToSkip) => {
  if (!isGroupHistory(history)) {
    return [null];
  }
  groupOrdersToSkip.add(history.order?.id);
  const orderHistories = getOrderHistories(orderHistoryData, history.order?.id);
  orderHistories.sort((a, b) => a.id - b.id);
  const isGroupCancelled = orderHistories.some(oh => oh.changeType === ORDER_HISTORY_CHANGE_TYPES.orderCancellation);
  if (isGroupCancelled) {
    return [null, isGroupCancelled];
  }
  const groupHistory = buildGroupHistory(orderHistories);
  return [groupHistory];
};

const isGroupHistory = history => {
  return history.order.groupOrderBills.length > 0 && history.orderHistoryPayments[0]?.isGroupOrder;
};

const getOrderHistories = (orderHistoryData, orderId) => {
  return orderHistoryData.filter(oh => oh.order.id === orderId && oh.orderHistoryPayments.some(ohp => ohp.isGroupOrder));
};

const buildGroupHistory = orderHistories => {
  const lastHistory = orderHistories[orderHistories.length - 1];
  const orderId = lastHistory.orderId;
  const settlementHistory = orderHistories.find(oh => oh.orderHistoryPayments[0]?.payment?.orderId === orderId);
  const isSettled = !!settlementHistory;

  const groupHistory = getBaseGroupHistory(lastHistory, isSettled);
  groupHistory.orderHistoryPayments = getOrderHistoryPayments(lastHistory, settlementHistory);
  groupHistory.newValues = getProducts(orderHistories);

  return groupHistory;
};

const getBaseGroupHistory = (lastHistory, isSettled) => {
  return {
    orderId: lastHistory.orderId,
    adminId: lastHistory.adminId,
    order: {
      userId: lastHistory.order.userId,
      event: {
        name: lastHistory.order.event.name,
        venue: {
          stripeAccountType: lastHistory.order.event.venue.stripeAccountType
        }
      }
    },
    changeType: 'groupOrder',
    createdAt: lastHistory.createdAt,
    dataValues: {},
    isSettled
  };
};

const getOrderHistoryPayments = (lastHistory, settlementHistory) => {
  const [amount, stripeFee, cardPayment, cardBrand, stripeAccountType, payout] = getPaymentInfo(lastHistory, settlementHistory);

  return [
    {
      payment: {
        isGroupOrder: true,
        serviceFee: lastHistory.order.platformFee,
        cardPayment,
        isRefund: false,
        cardBrand,
        refundReason: '',
        amount,
        stripeFee,
        stripeAccountType,
        payout
      }
    }
  ];
};

const getPaymentInfo = (lastHistory, settlementHistory) => {
  const payment = settlementHistory?.orderHistoryPayments[0]?.payment;
  const amount = settlementHistory ? payment.amount : getGroupOrderBillSum(lastHistory);

  const cardPayment = payment?.cardPayment ?? false;
  const cardBrand = payment?.cardBrand ?? '-';
  const stripeAccountType = payment?.stripeAccountType ?? '-';

  return [amount, payment?.stripeFee, cardPayment, cardBrand, stripeAccountType, payment?.payout];
};

const getGroupOrderBillSum = lastHistory => {
  return lastHistory.order.groupOrderBills.reduce((acc, oh) => acc + oh.amount, 0);
};

const getProducts = orderHistories => {
  let stalls = {};
  let rvs = {};
  let addOns = [];
  orderHistories.forEach(oh => {
    const currentStalls = oh.newValues?.stalls ?? {};
    const currentRvs = oh.newValues?.rvs ?? {};
    const currentAddOns = oh.newValues?.addOns ?? [];

    stalls = { ...stalls, ...currentStalls };
    rvs = { ...rvs, ...currentRvs };
    addOns = getAddOnsForGroupOrders(currentAddOns, addOns);
  });

  return {
    stalls,
    rvs,
    addOns
  };
};

const getAddOnsForGroupOrders = (currentAddOns, addOns) => {
  currentAddOns.forEach(addOn => {
    const selected = addOns.find(a => a.orderItemId === addOn.orderItemId);
    if (selected) {
      selected.quantity = addOn.quantity;
      return;
    }
    addOns.push(addOn);
  });

  return addOns;
};
