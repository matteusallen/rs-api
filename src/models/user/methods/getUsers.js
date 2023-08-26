// @flow
import type { UserType, OptionsType } from '../types';
import { Op } from 'sequelize';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getUsers(options?: OptionsType, roleId: number): Promise<[Array<UserType> | void, string | void]> {
  validateAction(MENU.USERS, ACTIONS[MENU.USERS].GET_USERS, roleId);
  try {
    const { ssUserFilterOptions, userFilterOptions } = this.getUserFilterOptions(options);

    if (!options?.filterBy || options.filterBy.id) {
      const localUsers = await this.findAll(userFilterOptions).then(res => res.map(user => user.dataValues));

      const localUsersMap = localUsers.reduce((prev, user) => {
        prev[user.ssGlobalId] = user;
        return prev;
      }, {});
      const localUserGlobalIds = Object.keys(localUsersMap);

      if (Object.keys(userFilterOptions.where).length) {
        ssUserFilterOptions.globalId = localUserGlobalIds;
      }

      const [ssUsers, error] = await this.getSSUserFields(ssUserFilterOptions);
      if (error) throw Error(error);

      const fullOrderedLimitedUsers = ssUsers.map(ssUser => {
        return Object.assign({}, ssUser, localUsersMap[ssUser.globalId]);
      });
      return [fullOrderedLimitedUsers, undefined];
    }
    const [ssUsers, error] = await this.getSSUserFields(ssUserFilterOptions);
    if (error) throw Error(error);

    userFilterOptions.where.ssGlobalId = { [Op.in]: ssUsers.map(user => user.globalId) }; // only find local users that match with ssUsers found

    const localUsers = await this.findAll(userFilterOptions).then(res => res.map(user => user.dataValues));
    const localUsersMap = {};
    localUsers.forEach(user => (localUsersMap[user.ssGlobalId] = { id: user.id, ssGlobalId: user.ssGlobalId }));

    const localUserssGlobalIds = Object.keys(localUsersMap);
    const filteredUsers = ssUsers.filter(user => localUserssGlobalIds.includes(user.globalId));
    const fullOrderedLimitedUsers = filteredUsers.map(ssUser => Object.assign({}, ssUser, localUsersMap[ssUser.globalId]));

    return [fullOrderedLimitedUsers, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getUsers;
