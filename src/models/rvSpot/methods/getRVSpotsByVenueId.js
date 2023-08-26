// @flow
import { Op } from 'sequelize';
import moment from 'moment';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

import type { RVSpotType } from '../types';

async function getRVSpotsByVenueId(
  id: string | number,
  options: {
    filterBy?: {
      name?: string,
      rvLotId?: string | number,
      startDate?: string
    },
    limit?: number,
    offset?: number,
    orderBy: [string, string]
  },
  roleId: number
): Promise<Array<?RVSpotType> | ?string> {
  try {
    validateAction(MENU.RV_SPOTS, ACTIONS[MENU.RV_SPOTS].GET_RV_SPOTS_BY_VENUE_ID, roleId);
    let reservationWhere = { startDate: { [Op.gte]: moment().format('YYYY-MM-DD') } };
    let where = {};
    const filterBy = (options && options.filterBy) || {};
    where = { ...filterBy };

    let order = [];
    const orderBy = (options && options.orderBy) || [];

    let reservationRequired = false;
    let reservationSpacesRequired = false;

    if (filterBy.startDate) {
      reservationRequired = true;
      reservationWhere = { startDate: moment.utc(filterBy.startDate).format('YYYY-MM-DD') };

      const filterWithoutDate = Object.assign({}, filterBy);
      delete filterWithoutDate.startDate;
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
      where = { ...where, name: this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('RVSpot.name')), 'LIKE', `%${filterName}%`) };
    }

    if (orderBy.length > 0) {
      if (orderBy.includes('rvLot')) {
        order.push([this.sequelize.col('rvLotName'), orderBy[1]]);
      }

      order.push([this.sequelize.fn('length', this.sequelize.col('RVSpot.name')), orderBy[1]], ['name', orderBy[1]]);
    }

    const { RVSpot } = this.sequelize.models;
    const rvSpots = await RVSpot.findAll({
      where,
      attributes: {
        include: [
          [
            this.sequelize.literal(`(
                SELECT "name"
                FROM "RVLot"
                WHERE
                  "RVLot"."id" = "RVSpot"."rvLotId"
                  AND
                  "RVLot"."venueId" = ${id}
              )`),
            'rvLotName'
          ]
        ]
      },
      include: [
        {
          association: 'rvLot',
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
                xRefTypeId: 3
              }
            }
          ]
        }
      ],
      order,
      limit: options && options.limit ? options.limit : null,
      offset: options && options.offset ? options.offset : 0
    });

    return [rvSpots, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getRVSpotsByVenueId;
