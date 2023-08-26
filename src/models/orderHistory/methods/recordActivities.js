// @flow
import { OrderHistoryPayments } from 'Models';

async function recordActivities(input: any, transaction?: {}): Promise<void> {
  for (const activity of input) {
    let records = [];
    const { paymentIds, isGroupOrder } = activity;
    const {
      dataValues: { id }
    } = await this.create(activity, { transaction });
    for (const paymentId of paymentIds) {
      if (paymentId !== -1) {
        //to exclude zero dollar payments
        records.push({ orderHistoryId: id, paymentId, isGroupOrder });
      }
    }

    records.length ? await OrderHistoryPayments.bulkCreate(records, { transaction }) : null;
  }
}

export default recordActivities;
