// @flow
import type { GroupType } from 'Models/group/types';
import { Group } from 'Models';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getGroups(venueId: number | string, allowDeferred: boolean, roleId: number): Promise<[GroupType]> {
  validateAction(MENU.GROUPS, ACTIONS[MENU.GROUPS].GET_GROUPS, roleId);
  const groups = await Group.findAll({
    where: {
      venueId,
      ...(allowDeferred === undefined ? {} : { allowDeferred }),
      deletedAt: null
    }
  });

  return groups;
}

export default getGroups;
