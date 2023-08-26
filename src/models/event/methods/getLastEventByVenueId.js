// @flow
import { Op } from 'sequelize';
import { formatDate } from 'Utils';

async function getLastEventByVenueId(venueId: number): Promise<number | null> {
  try {
    const { Event } = this.sequelize.models;
    const eventIds = await Event.findAll({
      attributes: ['id'],
      where: { venueId, endDate: { [Op.lt]: formatDate.currentDbDateUTC() } },
      order: [['endDate', 'DESC']]
    }).then(res => res.map(item => item.dataValues.id));

    return eventIds[0] || null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
}

export default getLastEventByVenueId;
