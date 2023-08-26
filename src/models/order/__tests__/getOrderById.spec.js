import db, { Order } from 'Models';
import { order1 } from 'Tests/__fixtures__';

describe('When testing get order by id method', () => {
  it(`should get order by valid id`, async () => {
    //create order
    const parentTransaction = await db.sequelize.transaction();
    const [orderData] = await Order.createOrder(order1.input, order1.cost, parentTransaction, 1);
    await parentTransaction.commit();
    const order = orderData.toJSON();

    //get newly created order
    const [res, errorMessage] = await Order.getOrderById(order.id, 1);

    expect(errorMessage).toBeUndefined();
    expect(res.toJSON()).toMatchObject(order);
  });
});
