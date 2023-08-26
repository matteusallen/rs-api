import moment from 'moment';
import { ADD_ON_PRODUCT_X_REF_TYPE_ID, ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getOrders(venueId, user, { checkInOnly, checkOutOnly, ...filters }, roleId) {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].GET_ORDERS, roleId);
  try {
    const { User, ReservationSpace, Group, Payment } = this.sequelize.models;
    const [filterOptionsWithUsers, filterOptionsError] = await this.getOrderFilterOptions(venueId, user, filters, roleId);

    if (filterOptionsError) throw Error(filterOptionsError);
    const { users: filteredOrderUsers, ...filterOptions } = filterOptionsWithUsers;
    filterOptions.order = filters.orderBy.split('_')[0] === 'createdAt' ? [filters.orderBy.split('_')] : [['updatedAt', 'DESC']];

    let filteredOrders = await this.findAll(filterOptions);

    // if no reservation status specified, exclude canceled orders
    if (!filters.filterBy.reservationStatus) {
      filteredOrders = filteredOrders.filter(order => {
        return !order.canceled;
      });
    }

    const neededUsers = [];

    const userMap = filteredOrderUsers.reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {});

    const filteredOrdersWithFullRenter = [];

    for (const order of filteredOrders) {
      order.user = userMap[order.userId];

      if (!order.user) {
        neededUsers.push(order.userId);
      }

      order.group = await Group.getGroupByOrderId(order.id);
      if (order.group) {
        const groupPayment = await Payment.findOne({
          where: { orderId: order.id },
          attributes: ['id']
        });
        order.isGroupOrderPaymentSettled = groupPayment ? true : false;
      }

      filteredOrdersWithFullRenter.push(order);
    }

    if (neededUsers.length > 0) {
      const [users] = await User.getUsers({ filterBy: { id: neededUsers } }, roleId);
      const userMap = users.reduce((prev, curr) => {
        prev[curr.id] = curr;
        return prev;
      }, {});

      filteredOrdersWithFullRenter.map(order => {
        order.user = userMap[order.userId];
      });
    }

    let filteredOrdersWithFullRenterAndAssignmentStatus = filteredOrdersWithFullRenter;

    if (filters.filterBy && filters.filterBy.spacesNeedAssignment && !filters.filterBy.allSpacesAssigned) {
      filteredOrdersWithFullRenterAndAssignmentStatus = await filteredOrdersWithFullRenter.reduce(async (acc, curr) => {
        const resolvedAcc = await acc;
        let needsAssignment = false;
        for (const orderItem of curr.orderItems) {
          if (orderItem.reservation && !needsAssignment) {
            const reservationSpaces = await ReservationSpace.findAll({
              where: { reservationId: orderItem.reservation.id }
            });
            if (orderItem.xRefTypeId != ADD_ON_PRODUCT_X_REF_TYPE_ID) {
              orderItem.quantity > reservationSpaces.length ? (needsAssignment = true) : (needsAssignment = false);
            }
          }
        }
        if (needsAssignment) resolvedAcc.push(curr);
        return resolvedAcc;
      }, []);
    }

    if (filters.filterBy && filters.filterBy.allSpacesAssigned && !filters.filterBy.spacesNeedAssignment) {
      filteredOrdersWithFullRenterAndAssignmentStatus = await filteredOrdersWithFullRenter.reduce(async (acc, curr) => {
        const resolvedAcc = await acc;
        let allSpacesAssigned = true;
        for (const orderItem of curr.orderItems) {
          if (orderItem.reservation && allSpacesAssigned) {
            const reservationSpaces = await ReservationSpace.findAll({
              where: { reservationId: orderItem.reservation.id }
            });
            orderItem.quantity === reservationSpaces.length ? (allSpacesAssigned = true) : (allSpacesAssigned = false);
          }
        }
        if (allSpacesAssigned) resolvedAcc.push(curr);
        return resolvedAcc;
      }, []);
    }

    const [userKey, direction] = filters.orderBy.split('_');
    const sortedFilteredOrdersWithFullRenter =
      userKey === 'updatedAt' || userKey === 'createdAt'
        ? filteredOrdersWithFullRenterAndAssignmentStatus
        : this.sortOrders(filteredOrdersWithFullRenterAndAssignmentStatus, userKey, direction);
    const { limit = 25, offset = 1 } = filters;
    const sortedFilteredLimitedOrdersWithFullRenter = sortedFilteredOrdersWithFullRenter.slice((offset - 1) * limit, limit * offset);

    const getCheckingInOrOutOrders = date => {
      const subset = sortedFilteredOrdersWithFullRenter.filter(order => {
        const { orderItems } = order;
        for (const orderItem of orderItems) {
          const { reservation } = orderItem;
          if (!reservation) return;
          const targetDate = moment(reservation[date]).utc().format('YYYY-MM-DD');
          const startDate = moment(filters.filterBy.startDate).utc().format('YYYY-MM-DD');
          const endDate = moment(filters.filterBy.endDate).utc().format('YYYY-MM-DD');
          const checkInValid = moment(targetDate).isBetween(startDate, endDate, 'day', []);
          if (!checkInValid) {
            return false;
          }
          return true;
        }
      });

      return subset;
    };

    const checkingInOrders = getCheckingInOrOutOrders('startDate');
    const checkingOutOrders = getCheckingInOrOutOrders('endDate');

    const getOrders = () => {
      if (checkInOnly && !checkOutOnly) {
        return checkingInOrders;
      } else if (checkOutOnly && !checkInOnly) {
        return checkingOutOrders;
      } else {
        return sortedFilteredLimitedOrdersWithFullRenter;
      }
    };

    // get users that appear on more than one order
    const getRepeatUsers = eventUsers => {
      return eventUsers.filter((v, i) => eventUsers.indexOf(v) !== i);
    };

    // mark orders that share users
    const markOrdersByRecurringUsers = orders => {
      const uniqueEventIds = [...new Set(orders.map(order => order.event.id))];

      // check each event to see if user id's occur more than once and then update particular order
      uniqueEventIds.forEach(event => {
        const eventOrders = orders.filter(order => order.event.id === event);
        const usersWithMultipleOrders = getRepeatUsers(eventOrders.map(order => order.userId));

        eventOrders.forEach(order => {
          if (usersWithMultipleOrders.includes(order.userId)) {
            return (orders.find(o => o.id === order.id)['multipleOrders'] = true);
          }
        });
      });
      return orders;
    };

    const getOrdersReturn = {
      orders: markOrdersByRecurringUsers(getOrders()),
      count: sortedFilteredOrdersWithFullRenter.length,
      checkingInCount: checkingInOrders.length,
      checkingOutCount: checkingOutOrders.length
    };
    return [getOrdersReturn, undefined];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return [undefined, error.message];
  }
}

export default getOrders;
