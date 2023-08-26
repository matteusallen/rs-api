// @flow
import type { GroupType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function updateGroup(input: GroupType, roleId: number): Promise<GroupType> {
  validateAction(MENU.GROUPS, ACTIONS[MENU.GROUPS].UPDATE_GROUP, roleId);
  try {
    const { id, name, contactName, email, phone, groupLeaderId } = input;
    const group = await this.findOne({ where: { id } });

    if (!group) throw new Error('Group not found');

    group.name = name || group.name;
    group.contactName = contactName || null;
    group.email = email || null;
    group.phone = phone || null;
    group.groupLeaderId = groupLeaderId || null;

    await group.save();
    return group;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error('Unable to update group');
  }
}

export default updateGroup;
