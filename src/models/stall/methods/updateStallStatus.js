// @flow
import type { StallType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

type UpdateStallStatusType = {|
  id: number,
  status: string
|};

async function updateStallStatus(input: UpdateStallStatusType, roleId: number): Promise<StallType> {
  validateAction(MENU.STALLS, ACTIONS[MENU.STALLS].UPDATE_STALL_STATUS, roleId);
  const { id, status } = input;
  const stall = await this.findOne({ where: { id } });
  stall.status = status;
  await stall.save();
  return stall;
}

export default updateStallStatus;
