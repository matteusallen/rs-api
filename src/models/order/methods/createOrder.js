// @flow
import type { OrderType } from '../types';
import type { OrderItemInputType } from 'Models/orderItem/types';
import type { ProductQuestionAnswerInput } from 'Models/productQuestionAnswer/types';
import type { OrderCostsReturnType } from './orderCosts';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

type CreateOrderInputType = {|
  eventId: number | string,
  fee: number,
  notes: string,
  adminNotes: string,
  orderItems: Array<OrderItemInputType>,
  platformFee: number,
  total: number,
  discount: number,
  userId: number | string,
  productQuestionAnswers?: Array<ProductQuestionAnswerInput>
|};

type CreateOrderType = {|
  eventId: number | string,
  fee: number,
  notes: string,
  adminNotes: string,
  orderItems?: Array<OrderItemInputType>,
  platformFee: number,
  total: number,
  discount: number,
  userId: number | string,
  productQuestionAnswers?: Array<ProductQuestionAnswerInput>
|};

/**
 * Note: For 3rd argument, this method assumes, AND requires an existing db transaction
 * @param input
 * @param costs
 * @param parentTransaction - a sequelize.transaction() object
 */

async function createOrder(input: CreateOrderInputType, costs: OrderCostsReturnType, parentTransaction: {}, roleId: number): Promise<[?OrderType, ?string]> {
  const { OrderItem, ProductQuestionAnswer } = this.sequelize.models;

  try {
    if (input.adminNotes) validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].ADMIN_NOTES, roleId);

    const orderInput: CreateOrderType = { ...input };
    delete orderInput.orderItems;
    delete orderInput.productQuestionAnswers;
    orderInput.fee = costs.stripeFee && Number((Math.round(costs.stripeFee * 100) / 100).toFixed(2));
    orderInput.platformFee = costs.serviceFee;
    orderInput.total = costs.total && Number(costs.total.toFixed(2));
    orderInput.discount = costs.discount && Number(costs.discount.toFixed(2));

    const newOrder = await this.create(orderInput, { transaction: { ...parentTransaction } });
    const orderId = newOrder.id;

    for (const answer of input.productQuestionAnswers || []) {
      const productAnswerInput = { orderId, questionId: answer.questionId, answer: answer.answer };
      await ProductQuestionAnswer.createProductQuestionAnswer(productAnswerInput, parentTransaction);
    }

    await Promise.all(
      input.orderItems.map(async orderItem => {
        const itemCost = costs.orderItemsCostsWithDetails.find(item => item.xRefTypeId === orderItem.xRefTypeId && item.xProductId === orderItem.xProductId);
        const orderItemInput = {
          ...orderItem,
          // $FlowFixMe
          price: itemCost.orderItemCost,
          orderId
        };

        const [, orderItemsError] = await OrderItem.createOrderItem(orderItemInput, parentTransaction, roleId);
        if (orderItemsError) throw Error(orderItemsError);
      })
    );

    newOrder.serviceFee = costs.serviceFee || 0;
    return [newOrder, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default createOrder;
