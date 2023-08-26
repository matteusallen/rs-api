// @flow
import type { StallType } from 'Models/stall/types';

const { Op } = require('sequelize');

async function getAvailableStalls(buildingId: number, eventId: number): Promise<Array<?StallType>> {
  const { EventStall, Stall } = this.sequelize.models;
  const stallIds = await EventStall.findAll({
    attributes: ['assignedStalls'],
    where: { eventId },
    raw: true
  }).reduce((acc, item) => [...acc, ...item.assignedStalls], []);

  return await Stall.findAll({
    where: {
      id: {
        [Op.in]: stallIds
      },
      buildingId
    }
  });
}

export default getAvailableStalls;
