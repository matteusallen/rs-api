// @flow
import moment from 'moment';
import { RENTER } from 'Constants';
import { User, Venue } from 'Models';

type RequestType = {|
  headers: {|
    auth?: string
  |}
|};

export type UserContextType = {|
  user: {|
    id: ?number,
    roleId: ?number,
    ssGlobalId: ?string,
    token: ?string
  |},
  venue: {
    id: ?number
  }
|};

async function getUserFromToken(req: RequestType): Promise<UserContextType> {
  const bear = 'Bearer ';
  const baseUserContext = {
    user: {
      id: null,
      roleId: null,
      token: null,
      ssGlobalId: null
    },
    venue: {
      id: null
    }
  };

  if (!req.headers.auth || !req.headers.auth.startsWith(bear)) {
    return baseUserContext;
  }

  const token = req.headers.auth.slice(req.headers.auth.indexOf(bear) + bear.length);

  try {
    const res = await User.getUser({ token });
    if (!res || !res.payload) {
      return baseUserContext;
    }
    const user = res.payload;
    if (moment(user.tokenExpirationDate).isAfter()) {
      const { token, roleId, ssGlobalId, id } = user;
      let currentVenueId = null;
      if (roleId !== RENTER) {
        const venue = await Venue.getVenuesByUserId(user.id).then(res => res[0]);
        currentVenueId = venue.id;
      }
      return { user: { token, roleId, ssGlobalId, id }, venue: { id: currentVenueId } };
    } else {
      await User.update({ token: null, tokenExpirationDate: null }, { where: { id: user.id } });
      return baseUserContext;
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('Error while getting user info', e);
    return baseUserContext;
  }
}

export default getUserFromToken;
