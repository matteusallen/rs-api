import db, { Order } from 'Models';
import { order1 } from 'Tests/__fixtures__';

describe('When testing update order isVisited column', () => {
  it(`should ${order1.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order1.input, order1.cost, parentTransaction, 1);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;

    //update isVisited
    const res = await Order.setIsVisited(orderId);

    expect(res).toBe(true);
  });
});
