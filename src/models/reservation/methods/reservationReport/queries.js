import { Op } from 'sequelize';
import { Order, User, Event } from 'Models';

export const getOrders = async filterProps => {
  const orders = await Order.findAll({
    order: [['createdAt', 'ASC']],
    where: { ...filterProps, canceled: null },
    attributes: ['id', 'userId', 'createdAt', 'notes'],
    include: [
      { association: 'event', attributes: ['venueId'] },
      {
        association: 'productQuestionAnswers',
        attributes: ['answer', 'questionId'],
        include: [
          {
            association: 'productQuestion',
            attributes: ['question', 'id', 'productXRefType']
          }
        ]
      },
      {
        association: 'orderItems',
        attributes: ['id', 'xProductId', 'quantity', 'xRefTypeId'],
        include: [
          {
            association: 'addOnProduct',
            attributes: ['id'],
            include: [
              {
                association: 'addOn',
                attributes: ['id', 'name']
              }
            ]
          },
          {
            association: 'reservation',
            attributes: ['endDate', 'startDate', 'xRefTypeId'],
            include: [
              {
                association: 'reservationSpaces',
                attributes: ['id'],
                include: [
                  {
                    association: 'rvSpot',
                    attributes: ['name'],
                    include: [
                      {
                        association: 'rvLot',
                        attributes: ['name']
                      }
                    ]
                  },
                  {
                    association: 'stall',
                    attributes: ['name'],
                    include: [
                      {
                        association: 'building',
                        attributes: ['name']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  return orders;
};

export const getEvents = async eventIds => {
  const events = await Event.findAll({
    where: { id: { [Op.in]: eventIds } },
    attributes: ['id', 'name']
  });

  return events;
};

export const getUsers = async (orders, roleId) => {
  const userIdSet = orders.reduce((userIds, order) => {
    userIds.add(order.userId);
    return userIds;
  }, new Set());

  const userIdArray = Array.from(userIdSet);

  const [users] = await User.getUsers({ filterBy: { id: userIdArray } }, roleId);
  return users;
};
