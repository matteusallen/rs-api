// @flow
import { ACTIONS, MENU, GROUP_LEADER } from 'Constants';
import { validateAction } from 'Utils';

async function getGroupLeaders(venueId: string, roleId: number) {
  validateAction(MENU.USERS, ACTIONS[MENU.USERS].GET_GROUP_LEADERS, roleId);
  try {
    const { UserVenue, User } = this.sequelize.models;

    const groupLeaderArr = await UserVenue.findAll({
      where: {
        venueId
      },
      include: [
        {
          model: User,
          as: 'user',
          where: { roleId: GROUP_LEADER },
          attributes: ['id', 'ssGlobalId']
        }
      ]
    });

    const groupLeaderObj = {};
    for (const groupLeader of groupLeaderArr) {
      groupLeaderObj[groupLeader.user.ssGlobalId] = { id: groupLeader.user.id, ssGlobalId: groupLeader.user.ssGlobalId };
    }

    const groupLeaderArrayObj: any = Object.values(groupLeaderObj);
    const groupLeaderSSIds = groupLeaderArrayObj.map(item => item.ssGlobalId);

    const [ssUsers, error] = await this.getSSUserFields({
      globalId: groupLeaderSSIds
    });

    const localUsers = ssUsers.map(async user => {
      return {
        ...user,
        id: groupLeaderObj[user.globalId].id
      };
    });

    if (error) {
      throw new Error('Error getting group leaders');
    }

    return [localUsers, null];
  } catch (error) {
    return [null, error];
  }
}

export default getGroupLeaders;
