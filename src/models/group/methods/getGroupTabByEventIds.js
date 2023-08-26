// @flow
import { Op } from 'sequelize';
import { formatDate, stringHelpers } from 'Utils';
import logger from 'Config/winston';
import { GroupOrder, Order, Reservation, Payment, AddOnProduct, User, StallProduct, RVProduct, GroupOrderBill } from 'Models';
import { STALL_PRODUCT_X_REF_TYPE_ID, RESERVATION_X_REF_TYPE_ID } from 'Constants';

async function getGroupTabByEventIds(groupId: number, eventIds: []): Promise<[{}, number, number, number]> {
  try {
    const groupOrders = await GroupOrder.findAll({ where: { groupId, deletedAt: null }, attributes: ['orderId'] });
    const orderIds = groupOrders.map(groupOrder => groupOrder.orderId);
    const orders = await Order.findAll({
      where: { id: { [Op.in]: orderIds } },
      include: [
        { association: 'event', where: { id: { [Op.in]: eventIds } } },
        { association: 'orderItems', where: { orderId: { [Op.in]: orderIds } } }
      ]
    });

    let exportData = {},
      totalDueToVenue = 0,
      totalFees = 0;

    for (const order of orders) {
      if (!exportData[order.id]) {
        exportData[order.id] = [];
      }

      const { payload } = await User.getUser({ id: order.userId });
      const reservationName = `${stringHelpers.upperFirst(payload.lastName)}, ${stringHelpers.upperFirst(payload.firstName)}`;
      const groupOrderBills = await GroupOrderBill.findAll({ where: { orderId: order.id } });
      const payments = await Payment.findAll({ where: { orderId: order.id } });
      const total = groupOrderBills.reduce((curr, val) => curr + val.amount, 0);

      const paid = payments.reduce((acc, curr) => {
        if (curr.amount > 0) return acc + curr.amount;
        return acc;
      }, 0);

      const refunded = payments.reduce((acc, curr) => {
        if (curr.amount < 0 && !!curr.ssRefundId) {
          return acc + curr.amount;
        }
        return acc;
      }, 0);
      const unpaid = total - paid;

      const eventName = order.event.name;

      for (const orderItem of order.orderItems) {
        if (orderItem.xRefTypeId === RESERVATION_X_REF_TYPE_ID) {
          const reservation = await Reservation.findOne({
            where: { id: orderItem.xProductId },
            attributes: ['startDate', 'endDate', 'xRefTypeId', 'xProductId']
          });
          const { xProductId } = reservation;
          const product =
            reservation.xRefTypeId === 3 ? await RVProduct.findOne({ where: { id: xProductId } }) : await StallProduct.findOne({ where: { id: xProductId } });
          const { nightly, price } = product;
          const numberOfNights = formatDate.getNumberOfNights(reservation.startDate, reservation.endDate);
          const cost = nightly ? orderItem.quantity * price * numberOfNights : orderItem.quantity * price;

          exportData[order.id].push({
            orderId: order.id,
            eventName,
            reservationName,
            rate: `$${price.toFixed(2)}${nightly ? ' (per night)' : ' (flat rate)'}`,
            quantity: orderItem.quantity,
            type: reservation.xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID ? 'Stall' : 'Spot',
            cost: `$ ${cost.toFixed(2)}`,
            numberOfNights,
            paid: `$ ${paid.toFixed(2)}`,
            unpaid: unpaid < 0 ? `${0.0}` : `$ ${unpaid.toFixed(2)}`,
            refunded: `$ ${refunded.toFixed(2)}`
          });
          totalDueToVenue += cost;
        } else {
          //addOns
          const addOnProduct = await AddOnProduct.findOne({
            where: { id: orderItem.xProductId },
            include: [{ association: 'addOn', attributes: ['name'] }],
            attributes: ['price']
          });
          const cost = orderItem.quantity * addOnProduct.price;
          exportData[order.id].push({
            orderId: order.id,
            eventName,
            reservationName,
            type: addOnProduct.addOn.name,
            rate: `$ ${Number(addOnProduct.price).toFixed(2)}`,
            cost: `$ ${cost.toFixed(2)}`,
            quantity: orderItem.quantity,
            numberOfNights: '-',
            paid: `$ ${paid.toFixed(2)}`,
            unpaid: unpaid < 0 ? `${0.0}` : `$ ${unpaid.toFixed(2)}`,
            refunded: `$ ${refunded.toFixed(2)}`
          });
          totalDueToVenue += cost;
        }
      }

      //push fee data
      exportData[order.id].push({
        orderId: order.id,
        eventName,
        reservationName,
        cost: `$ ${order.platformFee.toFixed(2)}`,
        type: 'Fee',
        rate: '-',
        quantity: '-',
        numberOfNights: '-',
        paid: '-',
        unpaid: '-',
        refunded: '-'
      });
      totalFees += order.platformFee;

      //push line total data
      exportData[order.id].push({
        orderId: '',
        eventName: '',
        reservationName: '',
        cost: `$ ${total.toFixed(2)}`,
        type: '',
        rate: '',
        quantity: '',
        numberOfNights: 'Total',
        paid: '-',
        unpaid: '-',
        refunded: '-'
      });
    }

    const grandTotal = totalDueToVenue + totalFees;

    return [exportData, totalDueToVenue, totalFees, grandTotal];
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export default getGroupTabByEventIds;
