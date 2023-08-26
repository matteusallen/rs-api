import fetch from 'node-fetch';

import db, { Order, OrderHistory, ReservationSpace, OrderItem, Payment, GroupOrder, Group, GroupOrderBill, OrderHistoryPayments } from 'Models';
import { order1, order2, getOrder1, getOrder2, ssPostUserResponse } from 'Tests/__fixtures__';

jest.mock('node-fetch', () => jest.fn());

describe('When testing get orders method', () => {
  it(`should ${getOrder1.title}`, async () => {
    //create orders
    let parentTransaction = await db.sequelize.transaction();
    await Order.createOrder(order1.input, order1.cost, parentTransaction, 1);
    await parentTransaction.commit();
    parentTransaction = await db.sequelize.transaction();
    await Order.createOrder(order2.input, order2.cost, parentTransaction, 1);
    await parentTransaction.commit();

    //get newly created orders
    const [res, errorMessage] = await Order.getOrders(getOrder1.input.venueId, {}, getOrder1.input.extras, 1);

    expect(errorMessage).toBeUndefined();
    expect(res.count).toEqual(getOrder1.output.count);
  });

  it(`should ${getOrder2.title}`, async () => {
    //create the main order
    let parentTransaction = await db.sequelize.transaction();
    await Order.createOrder(order1.input, order1.cost, parentTransaction, 1);
    await parentTransaction.commit();

    //creating a second order to be sure the filter works
    parentTransaction = await db.sequelize.transaction();
    await Order.createOrder(order2.input, order2.cost, parentTransaction, 1);
    await parentTransaction.commit();

    //create reservation space for the stall used in the filter
    parentTransaction = await db.sequelize.transaction();
    await ReservationSpace.createReservationSpace({ reservationId: 1, spaceId: 1 }, parentTransaction);
    await parentTransaction.commit();

    //get newly created orders
    const [res, errorMessage] = await Order.getOrders(getOrder2.input.venueId, {}, getOrder2.input.extras, 1);

    expect(errorMessage).toBeUndefined();
    expect(res.count).toEqual(getOrder2.output.count);
  });

  beforeEach(async () => {
    await Payment.destroy({ where: {}, restartIdentity: true });
    await OrderItem.destroy({ where: {}, restartIdentity: true });
    await OrderHistoryPayments.destroy({ where: {}, restartIdentity: true });
    await OrderHistory.destroy({ where: {}, restartIdentity: true });
    await GroupOrder.destroy({ where: {}, restartIdentity: true });
    await GroupOrderBill.destroy({ where: {}, restartIdentity: true });
    await Group.destroy({ where: {}, restartIdentity: true });
    await Order.destroy({ where: {}, restartIdentity: true });
  });

  beforeAll(() => {
    const response = Promise.resolve(ssPostUserResponse);
    fetch.mockImplementation(() => response);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
