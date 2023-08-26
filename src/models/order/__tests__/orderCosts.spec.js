import { Order } from 'Models';
import { orderCost1, orderCost2, orderCost3, orderCost5, orderCost6 } from 'Tests/__fixtures__';

describe('When testing orderCosts method', () => {
  describe.each`
    title               | input               | expected
    ${orderCost1.title} | ${orderCost1.input} | ${orderCost1.output}
    ${orderCost2.title} | ${orderCost2.input} | ${orderCost2.output}
  `('with input: $input', ({ input, expected, title }) => {
    it(`should ${title}`, async () => {
      const res = await Order.orderCosts(input, 1);
      expect(res).toMatchObject(expected);
    });
  });

  it(`should ${orderCost3.title}`, async () => {
    //TODO: we may want to consider throwing a mismatch error
    const res = await Order.orderCosts(orderCost3.input, 1);
    expect(res).not.toMatchObject(orderCost3.output);
  });

  it(`should ${orderCost5.title}`, async () => {
    const res = await Order.orderCosts(orderCost5.input, 1);
    expect(res).toMatchObject(orderCost5.output);
  });

  it(`should ${orderCost6.title}`, async () => {
    const res = await Order.orderCosts(orderCost6.input, 1);
    expect(res).toMatchObject(orderCost6.output);
  });
});
