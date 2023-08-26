// @flow
import { Op } from 'sequelize';
import moment from 'moment';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

import type { SMSCountType, SMSOrderItemsInputType } from '../types';

import { productXRefTypeHelper } from 'Utils';

async function getDetailsSMSCount(input: SMSOrderItemsInputType, productType: 'StallProduct' | 'RVProduct', roleId: number): Promise<[?SMSCountType, ?string]> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].GET_DETAILS_SMS_COUNT, roleId);
  try {
    const { Order } = this.sequelize.models;
    const isStallProduct = productType === productXRefTypeHelper.ProductXRefTypes.STALL_PRODUCT;
    const spaceTypeId = isStallProduct ? 1 : 3;
    // reasons sms won't be sent:
    // 1) already received sms -- last
    // 2) no space assigned -- second
    // 3) product type not purchased -- filter this first, biggest wrong

    const orders = await Order.findAll({
      where: {
        id: { [Op.in]: input.orderIds }
      },
      include: [
        {
          association: 'orderItems',
          where: {
            xRefTypeId: 4
          },
          include: [
            {
              association: 'reservation',
              include: [{ association: 'reservationSpaces' }]
            }
          ]
        }
      ]
    });

    const ordersBrokenOut = orders.reduce(
      (acc, curr) => {
        const orderHasReservations = curr.orderItems.filter(orderItem => {
          return orderItem.reservation.id;
        });
        if (orderHasReservations) {
          const orderItemWithCorrectReservationType = curr.orderItems.filter(orderItem => {
            return orderItem.reservation.xRefTypeId == spaceTypeId;
          });
          if (orderItemWithCorrectReservationType.length) {
            acc.ordersWithCorrectProductType.push(curr);
            const orderItemWithSpacesAssigned = orderItemWithCorrectReservationType[0].reservation.reservationSpaces.length;
            if (orderItemWithSpacesAssigned) {
              acc.ordersWithSpaces.push(curr);
              const reservationSpacesLastUpdatedDates = orderItemWithCorrectReservationType[0].reservation.reservationSpaces.map(
                reservationSpace => reservationSpace.updatedAt
              );
              const anyUpdatesSinceLastSMS = reservationSpacesLastUpdatedDates.filter(updatedAt => {
                return (
                  orderItemWithCorrectReservationType[0].reservation.assignmentConfirmed &&
                  moment(updatedAt).isAfter(moment(orderItemWithCorrectReservationType[0].reservation.assignmentConfirmed))
                );
              });
              if (!orderItemWithCorrectReservationType[0].reservation.assignmentConfirmed || anyUpdatesSinceLastSMS.length) {
                acc.ordersToBeSentAssignment.push(curr);
              }
            }
          }
        }
        return acc;
      },
      {
        ordersWithCorrectProductType: [],
        ordersWithSpaces: [],
        ordersToBeSentAssignment: []
      }
    );
    const productTypeNotPurchased = input.orderIds.length - ordersBrokenOut.ordersWithCorrectProductType.length;
    const noSpacesAssigned = input.orderIds.length - productTypeNotPurchased - ordersBrokenOut.ordersWithSpaces.length;
    const assignmentsAlreadySent = input.orderIds.length - productTypeNotPurchased - noSpacesAssigned - ordersBrokenOut.ordersToBeSentAssignment.length;

    const counts = {
      productTypeNotPurchased,
      noSpacesAssigned,
      assignmentsAlreadySent,
      ordersToBeSentAssignment: ordersBrokenOut.ordersToBeSentAssignment.map(order => order.id)
    };

    return [counts, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default getDetailsSMSCount;
