import fetch from 'node-fetch';
import db, { Order, Payment } from 'Models';
import { order1, cancelOrder1, cancelOrder2, cancelOrder3, paymentInput, ssPostPaymentResponse } from 'Tests/__fixtures__';
jest.mock('node-fetch', () => jest.fn());

describe('When testing cancel order method', () => {
  it(`should ${cancelOrder1.title}`, async () => {
    //create an order
    const parentTransaction = await db.sequelize.transaction();
    const [order, createOrderError] = await Order.createOrder(order1.input, order1.cost, parentTransaction, 1);
    await parentTransaction.commit();
    expect(order).toMatchObject(order1.output);
    expect(createOrderError).toBeUndefined();

    //cancel newly created order
    cancelOrder1.input.orderId = order.toJSON().id;
    const [updatedOrder, errorMessage] = await Order.cancel(cancelOrder1.input, cancelOrder1.adminId, null, 1);

    expect(errorMessage).toBeUndefined();

    const cancelDateTime = updatedOrder.toJSON().canceled;
    expect(cancelDateTime).not.toBeNull();
    expect(Date.parse(cancelDateTime.toISOString())).toBeLessThan(Date.parse(new Date().toISOString()));
  });

  it(`should ${cancelOrder2.title}`, async () => {
    const [, errorMessage] = await Order.cancel(cancelOrder2.input, cancelOrder2.adminId, null, 1);
    expect(errorMessage).toBe('order not found');
  });

  it(`should ${cancelOrder3.title}`, async () => {
    //create an order
    let parentTransaction = await db.sequelize.transaction();
    const [order, createOrderError] = await Order.createOrder(order1.input, order1.cost, parentTransaction, 1);
    await parentTransaction.commit();
    expect(order).toMatchObject(order1.output);
    expect(createOrderError).toBeUndefined();

    const orderId = order.toJSON().id;

    //create payment record
    parentTransaction = await db.sequelize.transaction();
    paymentInput.orderId = orderId;
    const [payment, addPaymentError] = await Payment.addPayment(paymentInput, parentTransaction);
    await parentTransaction.commit();
    expect(payment.ssChargeId).toEqual(paymentInput.ssChargeId);
    expect(addPaymentError).toBeNull();

    const response = Promise.resolve(ssPostPaymentResponse);
    fetch.mockImplementation(() => response);

    //cancel newly created order
    cancelOrder3.input.orderId = orderId;
    cancelOrder3.input.refundInformation[0].orderId = orderId;
    const [updatedOrder, errorMessage] = await Order.cancel(cancelOrder3.input, cancelOrder3.adminId, 1, 1);

    //cancelation assertions
    expect(errorMessage).toBeUndefined();
    const cancelDateTime = updatedOrder.toJSON().canceled;
    expect(cancelDateTime).not.toBeNull();
    expect(Date.parse(cancelDateTime.toISOString())).toBeLessThan(Date.parse(new Date().toISOString()));
  });
});
