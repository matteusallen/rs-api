// @flow
import type { UserType } from '../types';

type GetUserArgsType = {|
  email?: string,
  id?: number,
  token?: string,
  venueId?: string
|};

type GetUserType = {|
  error: ?string,
  payload: ?UserType
|};

async function getUser(options: GetUserArgsType): Promise<?GetUserType> {
  const { email, id, token, venueId } = options;
  const returnWithError = error => ({
    payload: null,
    error: error ? error : 'No user was found'
  });

  const returnWithPayload = (ssUser, localUser) => ({
    payload: { ...ssUser, ...localUser },
    error: null
  });

  // this will call to the local db first, then the ss db
  const fetchWithLocal = async (key, value) => {
    const whereClause = {
      // $FlowIgnore
      where: { [key]: value }
    };
    const res = await this.findOne(whereClause);

    if (!res || !res.dataValues) return returnWithError();

    const { dataValues: localUser } = res;

    // eslint-disable-next-line no-unused-vars
    const [ssUser, ssUserError] = await this.getSSUserFields({
      globalId: localUser.ssGlobalId
    });

    return returnWithPayload(ssUser[0], localUser);
  };

  // this will call to the ss db first, then the local db
  const fetchWithSS = async (key, value) => {
    const whereClause = {
      // $FlowIgnore
      [key]: value
    };
    // eslint-disable-next-line no-unused-vars
    const [ssUser, ssUserError] = await this.getSSUserFields(whereClause);
    if (!ssUser || !ssUser[0]) return returnWithError(ssUserError);
    if (venueId) ssUser[0].venueId = venueId;

    const { dataValues: localUser } = await this.findOne({
      where: { ssGlobalId: ssUser[0].globalId }
    });

    return returnWithPayload(ssUser[0], localUser);
  };

  const key = id ? 'id' : email ? 'email' : 'token';

  // If email is passed, we want to call fetchWithSS first, else we want to call fetchWithLocal
  if (key !== 'email') {
    return fetchWithLocal(key, id || token);
  }

  return fetchWithSS(key, email);
}

export default getUser;
