import db, { Order, OrderHistory, OrderItem, Payment, GroupOrder, Group, GroupOrderBill, OrderHistoryPayments } from 'Models';
import { order1, order2, getOrder1 } from 'Tests/__fixtures__';

describe('When testing get orders by event id method', () => {
  it(`should getOrdersByEventId`, async () => {
    //create orders
    let parentTransaction = await db.sequelize.transaction();
    await Order.createOrder(order1.input, order1.cost, parentTransaction, 1);
    await parentTransaction.commit();
    parentTransaction = await db.sequelize.transaction();
    await Order.createOrder(order2.input, order2.cost, parentTransaction, 1);
    await parentTransaction.commit();

    //get newly created orders
    const [res, errorMessage] = await Order.getOrdersByEventId(1);

    expect(errorMessage).toBeUndefined();
    expect(res.length).toEqual(getOrder1.output.count);
  });

  beforeEach(async () => {
    await Payment.destroy({ where: {}, restartIdentity: true });
    await OrderItem.destroy({ where: {}, restartIdentity: true });
    await OrderHistoryPayments.destroy({ where: {}, restartIdentity: true });
    await OrderHistory.destroy({ where: {}, restartIdentity: true });
    await GroupOrder.destroy({ where: {}, restartIdentity: true });
    await Group.destroy({ where: {}, restartIdentity: true });
    await GroupOrderBill.destroy({ where: {}, restartIdentity: true });
    await Order.destroy({ where: {}, restartIdentity: true });
  });
});
