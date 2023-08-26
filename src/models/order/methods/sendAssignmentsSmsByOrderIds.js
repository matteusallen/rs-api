// @flow
import { Op } from 'sequelize';
import moment from 'moment';

import type { AssignmentsByOrderIdsSMSType } from '../types';
import smsServiceSend from 'Services/notification/sms';
import { smsUtils, productXRefTypeHelper, validateAction } from 'Utils';
import { ACTIONS, MENU } from 'Constants';

async function sendAssignmentsSmsByOrderIds(
  input: AssignmentsByOrderIdsSMSType,
  type: 'StallProduct' | 'RVProduct',
  roleId: number
): Promise<[?string, ?string]> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].SEND_ASSIGNMENTS_SMS_BY_ORDER_ID, roleId);
  const getErrorResponse = err => {
    return [undefined, err];
  };

  if (!!input && !!input.orderIds) {
    const { Order, User, Reservation } = this.sequelize.models;
    const spaceType = type === productXRefTypeHelper.ProductXRefTypes.STALL_PRODUCT ? 'stall' : 'rvSpot';
    const productRefId = type === productXRefTypeHelper.ProductXRefTypes.STALL_PRODUCT ? 1 : 3;
    const spaceContainerType = type === productXRefTypeHelper.ProductXRefTypes.STALL_PRODUCT ? 'building' : 'rvLot';
    const spaceName = type === productXRefTypeHelper.ProductXRefTypes.STALL_PRODUCT ? 'stall' : 'RV spot';

    const [orderBreakdown] = await Order.getDetailsSMSCount(input, type, roleId);

    const { ordersToBeSentAssignment } = orderBreakdown;

    const orders = await Order.findAll({
      where: {
        id: { [Op.in]: ordersToBeSentAssignment }
      },
      include: [
        { association: 'user' },
        {
          association: 'event',
          include: [
            {
              association: 'venue',
              attributes: ['name']
            }
          ]
        },
        {
          association: 'orderItems',
          where: { xRefTypeId: 4 },
          include: [
            {
              association: 'reservation',
              where: { xRefTypeId: productRefId },
              include: [
                {
                  association: 'reservationSpaces',
                  include: [
                    {
                      association: spaceType,
                      include: [{ association: spaceContainerType }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const getAssignmentsInfo = async reservation => {
      const { reservationSpaces } = reservation;

      // Get assignment spaces grouped by container
      const spaceAndContainerNames = {};
      const assignmentInfoMap = await reservationSpaces.map(async space => {
        const containerName = space[spaceType][spaceContainerType].name;
        if (!spaceAndContainerNames[containerName]) {
          spaceAndContainerNames[containerName] = [];
        }
        spaceAndContainerNames[containerName].push(space[spaceType].name);
      });
      await Promise.all(assignmentInfoMap);
      return spaceAndContainerNames;
    };

    // Build all the required SMS messages
    const messageConfigPromises = orders.map(async order => {
      const { user, orderItems, event } = order;
      const spaceAndContainerNames = await getAssignmentsInfo(orderItems[0].reservation);
      const assigmentMessages = smsUtils.createSMSAssignmentMessage(spaceAndContainerNames, spaceName);

      // Put everything together into one message for the sms body
      const { payload: fullUser } = await User.getUser({ id: user.id });
      const introMessage = smsUtils.getSMSIntroMessage(fullUser.firstName, orderItems[0].reservation, event);
      const body = `${introMessage} You have been assigned ${assigmentMessages.join(', and ')}, from ${moment(orderItems[0].reservation.startDate).format(
        'M/D/YY'
      )} through ${moment(orderItems[0].reservation.endDate).format('M/D/YY')}.`;
      return {
        id: orderItems[0].reservation.id,
        to: fullUser.phone,
        from: process.env.TWILIO_MESSAGING_SERVICE_SID,
        body
      };
    });

    const messageConfigs = await Promise.all(messageConfigPromises);

    if (messageConfigs.length) {
      const response = await smsServiceSend(messageConfigs);
      if (response.success) {
        const reservationUpdatePromises = response.successfulIds.map(async successfulId => {
          return await Reservation.update({ assignmentConfirmed: Date.now() }, { where: { id: successfulId } });
        });
        return Promise.all(reservationUpdatePromises)
          .then(() => {
            return ['SMS Messages sent and timestamps updated', undefined];
          })
          .catch(err => {
            return getErrorResponse(`Error updating assignment sent updated time: ${err.message}`);
          });
      } else {
        // The call to smsService returned an error
        return getErrorResponse(`Error sending assignments via SMS: ${response.error}`);
      }
    } else {
      return getErrorResponse('No assignment SMS messages were sent');
    }
  } else {
    return getErrorResponse('No order ids provided, returning without sending SMS assignments');
  }
}

export default sendAssignmentsSmsByOrderIds;
