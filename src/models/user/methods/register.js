// @flow
import type { UpsertUserReturnType, UpsertUserInputType } from '../types';
import { ssPost } from 'Utils/ssNetworkRequests';
import validateCreateUserInput from './validateCreateUserInput';
import { RENTER } from 'Constants';

async function register(input: UpsertUserInputType): Promise<UpsertUserReturnType> {
  const { password } = input;

  const errorMessage = validateCreateUserInput(input, RENTER);
  if (errorMessage) throw Error(errorMessage);

  const email = input.email.trim().toLowerCase();
  const firstName = input.firstName.trim().toLowerCase();
  const lastName = input.lastName.trim().toLowerCase();
  const phone = input.phone.trim();
  const cleanInput = { email, firstName, lastName, phone };

  const [user] = await this.getSSUserFields({ email });
  const newUserData = !user[0] ? await ssPost('/user/new', cleanInput).then(({ data }) => data) : {};
  const ssGlobalId = user[0] ? user[0].globalId : newUserData.ssGlobalId;
  const localAccount = await this.findOne({
    where: { ssGlobalId },
    attributes: ['id']
  });

  if (localAccount === null) {
    const { data: passwordHash } = await ssPost('/auth/create-hash', { password });
    const { dataValues } = await this.create({
      ssGlobalId,
      password: passwordHash
    });
    return { success: true, userId: dataValues.id };
  } else {
    return { success: false, error: 'There is already an account associated with this email' };
  }
}

export default register;
