// @flow

type UserVenueType = {|
  userId: string,
  venueId: string
|};

export type NewUserVenueInputType = {|
  ssGlobalId: string,
  venueId: string
|};

export type NewUserVenueReturnType = {|
  error?: string,
  success: boolean,
  userVenue?: UserVenueType
|};
