// @flow
import { Order, Reservation } from 'Models';
import { STALL_PRODUCT_X_REF_TYPE_ID } from 'Constants';

async function doesEventHaveStallRes(eventId: number): Promise<boolean> {
  let hasStallRes = false;
  const orders = await Order.findAll({
    where: { eventId, canceled: null },
    attributes: ['id', 'createdAt'],
    include: [
      {
        association: 'orderItems',
        attributes: ['id', 'xProductId', 'quantity'],
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
          }
        ]
      }
    ]
  });

  for (const order of orders) {
    if (!hasStallRes) {
      for (const orderItem of order.orderItems) {
        if (orderItem.addOnProduct && orderItem.quantity > 0) {
          hasStallRes = true;
          break;
        }
        const reservation = await Reservation.findOne({
          where: { id: orderItem.xProductId, xRefTypeId: STALL_PRODUCT_X_REF_TYPE_ID },
          include: []
        });
        if (reservation) {
          hasStallRes = true;
          break;
        }
      }
    } else break;
  }
  return hasStallRes;
}

export default doesEventHaveStallRes;
