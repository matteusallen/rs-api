// @flow
import type { NewUserVenueReturnType, NewUserVenueInputType } from '../types';

async function upsertUserVenue(input: NewUserVenueInputType, config: {}): Promise<NewUserVenueReturnType> {
  try {
    const { Venue, User } = this.sequelize.models;
    const { ssGlobalId, venueId } = input;
    const localConfig = config ? config : {};
    const venue = await Venue.findOne({
      where: { id: venueId }
    });

    const user = await User.findOne({
      where: { ssGlobalId }
    });

    const userVenue = await user.addVenue(venue, localConfig);

    if (!userVenue) return { success: false, error: 'UserVenue already exists' };
    return { success: true, userVenue };
  } catch (error) {
    return {
      success: false,
      error: `There was a problem upserting the user venue. ${error}`
    };
  }
}

export default upsertUserVenue;
