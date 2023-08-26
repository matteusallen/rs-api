import fetch from 'node-fetch';

import { Order, Payment } from 'Models';
import { orderCheckout1, orderCheckout2, orderCheckout4, ssPostPaymentResponse } from 'Tests/__fixtures__';

jest.mock('node-fetch', () => jest.fn());

const ONE_PAYMENT = 1;
const TWO_PAYMENTS = 2;

describe('When testing order checkout method', () => {
  it(`should ${orderCheckout1.title}`, async () => {
    const [order, errorMessage] = await Order.orderCheckout(orderCheckout1.input, 1, 1);
    const payments = await Payment.findAll({ where: { orderId: order.id } });

    expect(errorMessage).toBeUndefined();
    expect(order).toBeDefined();
    expect(payments.length).toBe(ONE_PAYMENT);
    expect(fetch).toHaveBeenCalledTimes(2); //upsertUser and postPayment
  });

  it(`should ${orderCheckout2.title}`, async () => {
    const [order, error] = await Order.orderCheckout(orderCheckout2.input, 1, 1);

    expect(error.message).toContain(orderCheckout2.output);
    expect(order).toBeUndefined();
  });

  it(`should ${orderCheckout4.title}`, async () => {
    const [order, errorMessage] = await Order.orderCheckout(orderCheckout4.input, 1, 1);
    const payments = await Payment.findAll({ where: { orderId: order.id } });

    expect(errorMessage).toBeUndefined();
    expect(order).toBeDefined();
    // Two payments for the order, one is card and the other is cash
    expect(payments.length).toBe(TWO_PAYMENTS);
  });

  beforeAll(() => {
    const response = Promise.resolve(ssPostPaymentResponse);
    fetch.mockImplementation(() => response);
  });
});
