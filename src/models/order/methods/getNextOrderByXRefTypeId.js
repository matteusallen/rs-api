// @flow
import { Op } from 'sequelize';
import moment from 'moment';
import { ACTIONS, MENU } from 'Constants';

import type { StallOptionsType } from '../../stall/types';
import { arrayHelper, formatDate, validateAction } from 'Utils';

async function getNextOrderByXRefTypeId(stallId: number, options: StallOptionsType, xRefTypeId: number, roleId: number): Promise<{} | null> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].GET_NEXT_ORDER_BY_XREF_TYPE_ID, roleId);
  try {
    let where = { startDate: { [Op.gt]: moment.utc().format('YYYY-MM-DD') } };
    const filterBy = options.filterBy || {};
    if (filterBy) {
      if (filterBy.startDate) {
        where = { startDate: moment.utc(filterBy.startDate).format('YYYY-MM-DD') };
      }
    }
    const orders = await this.findAll({
      include: [
        {
          association: 'orderItems',
          required: true,
          include: [
            {
              association: 'reservation',
              attributes: ['id', 'startDate'],
              required: true,
              where: {
                ...where,
                xRefTypeId
              },
              include: [
                {
                  association: 'reservationSpaces',
                  attributes: ['id', 'spaceId'],
                  where: { spaceId: stallId }
                }
              ]
            }
          ]
        }
      ]
    });

    if (orders.length > 0) {
      const ordersWithOrderItems = orders.map(order => {
        const sortedOrderItems = arrayHelper.sortArray(order.orderItems, 'reservation.startDate');
        return {
          ...order,
          orderItems: sortedOrderItems,
          reservation: {
            startDate: sortedOrderItems[0].reservation.startDate
          }
        };
      });

      const ordersWithSortedOrderItems = arrayHelper.sortArray(ordersWithOrderItems, 'reservation.startDate');

      return {
        ...ordersWithSortedOrderItems[0].dataValues,
        nextReservationDate: formatDate.toUsDate(ordersWithSortedOrderItems[0].reservation.startDate)
      };
    }

    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
}

export default getNextOrderByXRefTypeId;
