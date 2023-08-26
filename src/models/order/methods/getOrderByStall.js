// @flow

import { Op } from 'sequelize';

import { arrayHelper, formatDate, validateAction } from 'Utils';
import { DB_DATE_FORMAT } from 'Constants';
import type { StallOptionsType } from '../../stall/types';
import { ACTIONS, MENU } from 'Constants';

async function getOrderByStall(stallId: number, options: StallOptionsType, roleId: number): Promise<{} | null> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].GET_ORDER_BY_STALL, roleId);
  try {
    let where = {
      startDate: { [Op.lte]: formatDate.currentDate(DB_DATE_FORMAT) }
    };
    const filterBy = options.filterBy || {};
    if (filterBy) {
      if (filterBy.endDate) {
        where = {
          [Op.and]: {
            startDate: { [Op.lte]: formatDate.currentDate(DB_DATE_FORMAT) },
            endDate: formatDate.toCustomDate(filterBy.endDate, DB_DATE_FORMAT)
          }
        };
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
              attributes: ['id', 'endDate'],
              required: true,
              where: {
                ...where,
                xRefTypeId: 1
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
        const sortedOrderItems = arrayHelper.sortArray(order.orderItems, 'reservation.endDate', 'DSC');
        return {
          ...order,
          orderItems: sortedOrderItems,
          reservation: {
            endDate: sortedOrderItems[0].reservation.endDate
          }
        };
      });

      const ordersWithSortedOrderItems = arrayHelper.sortArray(ordersWithOrderItems, 'reservation.endDate', 'DSC');

      return {
        ...ordersWithSortedOrderItems[0].dataValues,
        lastDepartureDate: formatDate.toUsDate(ordersWithSortedOrderItems[0].reservation.endDate)
      };
    }

    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
}

export default getOrderByStall;
