// @flow
import { Order, Reservation } from 'Models';
import { RV_PRODUCT_X_REF_TYPE_ID } from 'Constants';

async function doesEventHaveRVRes(eventId: number): Promise<boolean> {
  let hasRVRes = false;
  const orders = await Order.findAll({
    where: { eventId, canceled: null },
    attributes: ['id', 'createdAt'],
    include: [
      {
        association: 'orderItems',
        attributes: ['id', 'xProductId', 'quantity'],
        include: []
      }
    ]
  });

  for (const order of orders) {
    if (!hasRVRes) {
      for (const orderItem of order.orderItems) {
        if (!orderItem.addOnProduct) {
          const reservation = await Reservation.findOne({
            where: { id: orderItem.xProductId, xRefTypeId: RV_PRODUCT_X_REF_TYPE_ID },
            include: []
          });
          if (reservation) hasRVRes = true;
        }
      }
    } else break;
  }
  return hasRVRes;
}

export default doesEventHaveRVRes;
