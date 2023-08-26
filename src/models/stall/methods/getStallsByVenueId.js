// @flow
import { Op } from 'sequelize';
import moment from 'moment';

import type { StallType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getStallsByVenueId(
  id: string | number,
  options: {
    filterBy?: {
      buildingId?: string | number,
      endDate?: string,
      name?: string,
      startDate?: string,
      status?: string
    },
    limit?: number,
    offset?: number,
    orderBy: [string, string]
  },
  roleId: number
): Promise<Array<?StallType> | ?string> {
  validateAction(MENU.STALLS, ACTIONS[MENU.STALLS].GET_STALLS_BY_VENUE_ID, roleId);
  try {
    let reservationWhere = { startDate: { [Op.gte]: moment().format('YYYY-MM-DD') } };
    let where = {};
    const filterBy = (options && options.filterBy) || {};
    where = { ...filterBy };

    let order = null;
    const orderBy = (options && options.orderBy) || [];

    let reservationRequired = false;
    let reservationSpacesRequired = false;

    if (filterBy.startDate || filterBy.endDate) {
      reservationRequired = true;

      if (filterBy.startDate) {
        reservationWhere = { startDate: moment.utc(filterBy.startDate).format('YYYY-MM-DD') };
      }

      if (filterBy.endDate) {
        reservationWhere = { endDate: moment.utc(filterBy.endDate).format('YYYY-MM-DD') };
      }

      const filterWithoutDate = Object.assign({}, filterBy);
      delete filterWithoutDate.startDate;
      delete filterWithoutDate.endDate;
      where = { ...filterWithoutDate };

      if (!options.limit) {
        // if no limit is set and filtering by reservation startDate,
        // then required attr for reservationSpaces must be true to
        // return correct count
        reservationSpacesRequired = true;
      }
    }

    if (filterBy.name) {
      const filterName = filterBy && filterBy.name ? filterBy.name.toLowerCase() : '';
      where = { ...where, name: this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('Stall.name')), 'LIKE', `%${filterName}%`) };
    }

    if (orderBy.length > 0) {
      order = [];

      if (orderBy.includes('building')) {
        order.push([this.sequelize.col('buildingName'), orderBy[1]]);
      }

      if (orderBy.includes('statusId')) {
        order = [[this.sequelize.cast(this.sequelize.col('status'), 'TEXT'), orderBy[1]]];
      }

      order.push([this.sequelize.fn('length', this.sequelize.col('Stall.name')), orderBy[1]], ['name', orderBy[1]]);
    }

    const { Stall } = this.sequelize.models;
    const stalls = await Stall.findAll({
      where,
      include: [
        {
          association: 'building',
          attributes: ['name'],
          where: { venueId: id }
        },
        {
          association: 'reservationSpaces',
          required: reservationSpacesRequired,
          include: [
            {
              association: 'reservation',
              required: reservationRequired,
              attributes: ['startDate', 'id'],
              where: {
                ...reservationWhere,
                xRefTypeId: 1
              },
              include: [
                {
                  association: 'orderItem',
                  attributes: ['orderId'],
                  include: [
                    {
                      association: 'order',
                      attributes: ['id', 'eventId']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      order,
      limit: options && options.limit ? options.limit : null,
      offset: options && options.offset ? options.offset : 0
    });

    return [stalls, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getStallsByVenueId;
