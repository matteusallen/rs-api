// @flow
import type { PaymentUpsertInputType, PaymentType } from '../types';

async function addPayment(input: PaymentUpsertInputType, transaction?: {}): Promise<[?PaymentType, ?string]> {
  try {
    const upsertedTransaction = await this.create(input, { transaction });
    return [upsertedTransaction, null];
  } catch (error) {
    return [null, error.message];
  }
}

export default addPayment;
