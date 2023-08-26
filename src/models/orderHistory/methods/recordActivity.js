// @flow
import type { RecordActivityType } from 'Models/orderHistory/types';
import { OrderHistoryPayments } from 'Models';

async function recordActivity(input: RecordActivityType, transaction: {}): Promise<void> {
  const {
    dataValues: { id }
  } = await this.create(input, { transaction });
  if (input.paymentId) await OrderHistoryPayments.create({ orderHistoryId: id, paymentId: input.paymentId, isGroupOrder: false }, { transaction });
}

export default recordActivity;
