// @flow
import { Op } from 'sequelize';

import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function booked(addOnId: number | string, eventId: number, roleId: number) {
  validateAction(MENU.ADDONS, ACTIONS[MENU.ADDONS].BOOKED, roleId);

  const { Order } = this.sequelize.models;

  const order = await Order.findOne({
    where: { eventId, canceled: null },
    attributes: ['id'],
    include: [
      {
        association: 'orderItems',
        where: { xProductId: addOnId, quantity: { [Op.gt]: 0 } },
        attributes: ['id', 'xProductId', 'quantity']
      }
    ]
  });

  return order ? true : false;
}

export default booked;
