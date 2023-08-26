// @flow
import type { GroupType } from 'Models/group/types';
import { Group } from 'Models';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getGroupsByLeaderId(venueId: number | string, allowDeferred: boolean, groupLeaderId: string, roleId: number): Promise<[GroupType]> {
  validateAction(MENU.GROUPS, ACTIONS[MENU.GROUPS].GET_GROUPS_BY_LEADER_ID, roleId);
  return await Group.findAll({
    where: {
      venueId,
      ...(allowDeferred === undefined ? {} : { allowDeferred }),
      groupLeaderId,
      deletedAt: null
    }
  });
}

export default getGroupsByLeaderId;
