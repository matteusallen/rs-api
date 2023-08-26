// @flow
import type { UserType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getFilteredUsersByVenueId(venueId: number, options: { filterBy: {} } = {}, roleId: number): Promise<[Array<UserType>, void]> {
  validateAction(MENU.USERS, ACTIONS[MENU.USERS].GET_FILTERED_USERS_BY_VENUE_ID, roleId);
  const { UserVenue, User } = this.sequelize.models;
  const userIds = await UserVenue.findAll({
    attributes: ['userId'],
    where: { venueId }
  }).then(res => res.map(item => item.dataValues.userId));

  const optionsFilterByCopy = JSON.parse(JSON.stringify(options.filterBy || {}));
  options.filterBy = Object.assign(optionsFilterByCopy, { id: userIds });
  const [users] = await User.getUsers(options, roleId);
  return [users, undefined];
}

export default getFilteredUsersByVenueId;
