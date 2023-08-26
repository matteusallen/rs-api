// @flow
import type { UpsertUserReturnType, UpsertUserInputType } from '../types';
import { ssPost } from 'Utils/ssNetworkRequests';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function upsertUser(input: UpsertUserInputType, config: {}, roleId: number): Promise<[UpsertUserReturnType | void, string | void]> {
  validateAction(MENU.USERS, ACTIONS[MENU.USERS].UPSERT_USER, roleId);
  try {
    const { UserVenue } = this.sequelize.models;
    const localConfig = config ? config : {};
    const { id, venueId, roleId } = input;
    if (id) {
      const localUser = await this.findOne({ where: { id } });
      const updatedInput = { ...input, globalId: localUser.ssGlobalId };
      delete updatedInput.id;
      delete updatedInput.roleId;
      delete updatedInput.venueId;
      updatedInput.firstName = input.firstName ? input.firstName.trim().toLowerCase() : '';
      updatedInput.lastName = input.lastName ? input.lastName.trim().toLowerCase() : '';
      updatedInput.email = input.email ? input.email.trim().toLowerCase() : '';
      await ssPost('/user/update', updatedInput);
      const updatedLocalUser = await localUser.update({ roleId }, localConfig);
      if (venueId) {
        await UserVenue.upsertUserVenue({ ssGlobalId: updatedLocalUser.ssGlobalId, venueId, id: updatedLocalUser.id }, localConfig);
      }
      return [updatedLocalUser, undefined];
    }

    const [createdUser, createdUserError] = await this.createUser(input);
    if (createdUserError) throw Error(createdUserError);
    return [createdUser, undefined];
  } catch (error) {
    return [undefined, `There was a problem upserting the user. ${error}`];
  }
}

export default upsertUser;
