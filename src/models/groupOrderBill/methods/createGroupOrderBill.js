// @flow
import type { GroupOrderBillType } from '../types';
import { GroupOrderBill } from 'Models';

async function createGroupOrderBill(input: GroupOrderBillType, transaction: {}): Promise<GroupOrderBillType> {
  return await GroupOrderBill.create(input, { transaction });
}

export default createGroupOrderBill;
