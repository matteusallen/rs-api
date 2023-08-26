// @flow

import type { PaymentType } from '../types';

async function getPayments(orderId: number): Promise<[PaymentType | void, string | void]> {
  try {
    const payments = await this.findAll({
      where: {
        orderId,
        success: [true, false]
      }
    });
    return [payments, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getPayments;
