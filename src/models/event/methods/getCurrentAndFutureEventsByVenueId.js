// @flow
import { Op } from 'sequelize';
import { formatDate } from 'Utils';

async function getCurrentAndFutureEventsByVenueId(venueId: number): Promise<Array<number> | null> {
  try {
    const { Event } = this.sequelize.models;
    const eventIds = await Event.findAll({
      attributes: ['id'],
      where: {
        venueId,
        endDate: { [Op.gte]: formatDate.currentDbDateUTC() }
      }
    }).then(res => res.map(item => item.dataValues.id));

    return eventIds;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
}

export default getCurrentAndFutureEventsByVenueId;
