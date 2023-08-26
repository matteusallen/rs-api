import db, { Order } from 'Models';
import { order1 } from 'Tests/__fixtures__';

describe('When testing get full order method', () => {
  it(`should get order by id with 'orderItems', 'event', 'payments' fields present`, async () => {
    //create order
    const parentTransaction = await db.sequelize.transaction();
    const [orderData] = await Order.createOrder(order1.input, order1.cost, parentTransaction, 1);
    await parentTransaction.commit();
    const order = orderData.toJSON();

    //get newly created order
    const [res, errorMessage] = await Order.getFullOrder(order.id);

    expect(errorMessage).toBeUndefined();
    expect(res).toHaveProperty('orderItems', 'event', 'payments');
    expect(Object.keys(res.event).length).toBeGreaterThan(0);
  });
});
