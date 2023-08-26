// @flow
import { ACTIONS, MENU } from 'Constants';
import { validateAction, generateGroupCode } from 'Utils';

async function refreshCode(id: string | number, venueId: number, roleId: number) {
  validateAction(MENU.GROUPS, ACTIONS[MENU.GROUPS].REFRESH_CODE, roleId);
  const transaction = await this.sequelize.transaction();

  try {
    const group = await this.findOne({ where: { id, venueId } });
    const code = generateGroupCode(group.name, venueId);

    group.code = code;
    group.save();

    return code;
  } catch (error) {
    await transaction.rollback();
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
}

export default refreshCode;
