import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getOrdersByUserId(userId, roleId) {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].GET_ORDERS_BY_USER_ID, roleId);
  const orders = await this.findAll({
    where: { userId },
    attributes: ['id', 'canceled'],
    order: [['event', 'endDate', 'DESC']],
    include: [
      {
        association: 'event',
        attributes: ['id', 'name', 'venueId', 'endDate', 'startDate'],
        include: [
          {
            association: 'venue',
            attributes: ['id', 'city', 'state']
          }
        ]
      }
    ]
  });
  return orders;
}

export default getOrdersByUserId;
