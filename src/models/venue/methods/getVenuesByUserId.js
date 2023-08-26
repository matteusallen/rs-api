// @flow
const { Op } = require('sequelize');

type VenueIdsType = Array<{ id: number }>;

async function getVenuesByUserId(userId: number): Promise<VenueIdsType> {
  const { UserVenue, Venue } = this.sequelize.models;
  const venueIds = await UserVenue.findAll({
    attributes: ['venueId'],
    where: { userId }
  }).then(res => res.map(item => item.dataValues.venueId));

  return Venue.findAll({
    where: {
      id: {
        [Op.or]: venueIds
      }
    }
  }).then(results =>
    results.map(result => {
      return result.dataValues;
    })
  );
}

export default getVenuesByUserId;
