import { productDiscount1 } from 'Tests/__fixtures__';
import { Order } from 'Models';

//TODO: more test cases

describe('When testing product discounts order method', () => {
  it(`should ${productDiscount1.title}`, async () => {
    let discountAmount = 0;
    const discount = await Order.calculateProductDiscount(
      productDiscount1.input.xRefTypeId,
      productDiscount1.input.xProductId,
      productDiscount1.input.startDate,
      productDiscount1.input.endDtate,
      productDiscount1.input.price,
      productDiscount1.input.quantity
    );
    expect(discount.amount).toEqual(discountAmount);
  });
});
