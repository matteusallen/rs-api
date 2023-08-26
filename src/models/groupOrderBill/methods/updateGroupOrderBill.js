// @flow
import { GroupOrderBill } from 'Models';

type UpdateGroupOrderBillAmount = {|
  amount: number,
  adminId: number,
  orderId: number | string,
  isRefund: boolean,
  note: string
|};

async function updateGroupOrderBill(input: UpdateGroupOrderBillAmount, transaction: {}) {
  const { orderId, isRefund, note } = input;
  const existingGroupOrderBill = await GroupOrderBill.findOne({ where: { orderId, isRefund } });
  const newNote = [existingGroupOrderBill.note || '', note].join();

  //there can only be one refund and one charge record per order
  const [isUpdateDone, updatedGroupOrderBill] = await GroupOrderBill.update(
    { ...input, note: newNote },
    { where: { orderId, isRefund }, transaction, returning: true }
  );

  if (!isUpdateDone) throw Error('Unable to update group order bill');

  return updatedGroupOrderBill[0];
}

export default updateGroupOrderBill;
