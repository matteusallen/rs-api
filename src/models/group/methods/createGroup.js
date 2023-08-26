// @flow
import type { GroupType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction, generateGroupCode } from 'Utils';

async function createGroup(input: GroupType, venueId: number, roleId: number): Promise<GroupType> {
  validateAction(MENU.GROUPS, ACTIONS[MENU.GROUPS].CREATE_GROUP, roleId);
  const transaction = await this.sequelize.transaction();

  try {
    const code = generateGroupCode(input.name, venueId);

    const payload = {
      ...input,
      code,
      venueId,
      allowDeferred: true
    };

    const newGroup = await this.create(payload, { returning: true, transaction });
    await transaction.commit();

    return newGroup;
  } catch (error) {
    await transaction.rollback();
    // eslint-disable-next-line no-console
    console.log(error);
    if (error.message.toLowerCase().includes('validation')) throw new Error('Group name is already taken, please choose another');
    throw new Error(`There was a problem creating the group. ${error}`);
  }
}

export default createGroup;
