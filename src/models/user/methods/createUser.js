// @flow
import type { UpsertUserReturnType, UpsertUserInputType } from '../types';
import adminCreatedAccountEmail from 'Services/email/adminCreatedAccountEmail';
import { randomPasswordHash } from 'Helpers';
import { ssPost } from 'Utils/ssNetworkRequests';
import validateCreateUserInput from './validateCreateUserInput';
import { VENUE_ADMIN } from 'Constants';

async function createUser(input: UpsertUserInputType, config: {}): Promise<[UpsertUserReturnType | void, string | void]> {
  try {
    const { UserVenue } = this.sequelize.models;
    const localConfig = config ? config : {};
    const { venueId, roleId } = input;

    const errorMessage = validateCreateUserInput(input, VENUE_ADMIN);
    if (errorMessage) throw Error(errorMessage);

    const email = input.email.trim().toLowerCase();
    const firstName = input.firstName.trim().toLowerCase();
    const lastName = input.lastName.trim().toLowerCase();
    const phone = input.phone.trim();
    const cleanInput = { ...input, email, firstName, lastName, phone };

    const newUser = await ssPost('/user/new', cleanInput).then(({ data }) => data);
    if (!newUser.success) throw Error('Problem in shared services creating user');
    const newPassword = await randomPasswordHash();
    const newLocalUser = await this.create({ ssGlobalId: newUser.ssGlobalId, password: newPassword, roleId }, localConfig);
    if (venueId) {
      await UserVenue.upsertUserVenue({ ssGlobalId: newLocalUser.ssGlobalId, venueId }, localConfig);
    }
    const tokenResponse = await this.createResetPasswordToken(newLocalUser, localConfig);
    adminCreatedAccountEmail({ email, resetPasswordToken: tokenResponse.user.resetPasswordToken });

    return [tokenResponse.user, undefined];
  } catch (error) {
    return [undefined, `There was a problem creating the user. ${error}`];
  }
}

export default createUser;
