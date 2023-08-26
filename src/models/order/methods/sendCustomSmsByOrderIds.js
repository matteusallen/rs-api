// @flow
import { Op } from 'sequelize';

import type { SMSOrderItemsInputType, SMSReturnType } from '../types';
import customSMS from 'Services/notification/sms';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function sendCustomSmsByOrderIds(input: SMSOrderItemsInputType, roleId: number): Promise<SMSReturnType> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].SEND_CUSTOM_SMS_BY_ORDER_IDS, roleId);
  try {
    const { User } = this.sequelize.models;
    const { orderIds, body } = input;
    const userIds = await this.findAll({
      where: { id: { [Op.in]: orderIds } }
    }).then(orders => orders.map(order => order.userId));
    const [users] = await User.getUsers({ filterBy: { id: userIds } }, roleId);
    const messagesConfig = users.map(user => {
      return {
        id: user.globalId,
        to: user.phone,
        from: process.env.TWILIO_MESSAGING_SERVICE_SID,
        body
      };
    });
    return await customSMS(messagesConfig);
  } catch (error) {
    return {
      success: false,
      error
    };
  }
}

export default sendCustomSmsByOrderIds;
