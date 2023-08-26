import db, { Order } from 'Models';
import { order1, order2, order3, order4, order5 } from 'Tests/__fixtures__';

describe('When testing createOrder method', () => {
  describe.each`
    title           | input           | cost           | expected
    ${order1.title} | ${order1.input} | ${order1.cost} | ${order1.output}
    ${order2.title} | ${order2.input} | ${order2.cost} | ${order2.output}
    ${order3.title} | ${order3.input} | ${order3.cost} | ${order3.output}
    ${order4.title} | ${order4.input} | ${order4.cost} | ${order4.output}
    ${order5.title} | ${order5.input} | ${order5.cost} | ${order5.output}
  `('with input: $input', ({ input, cost, expected, title }) => {
    it(`should ${title}`, async () => {
      const parentTransaction = await db.sequelize.transaction();
      const [res, errorMessage] = await Order.createOrder(input, cost, parentTransaction, 1);
      await parentTransaction.commit();
      if (errorMessage) expect(errorMessage).toBe(expected);
      else {
        expect(errorMessage).toBeUndefined();
        expect(res).toMatchObject(expected);
      }
    });
  });
});
