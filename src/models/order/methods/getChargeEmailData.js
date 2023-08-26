import { formatDate } from 'Utils';

const getAddOnDescription = item => {
  const { addOnProduct } = item;
  const { addOn } = addOnProduct;
  const name = ((addOn && addOn.name) || 'add on').toLowerCase();
  const unitName = (addOn && addOn.unitName) || 'unit';
  return `${item.quantity} ${unitName}${item.quantity > 1 ? 's' : ''} of ${name}`;
};

const getStallDescription = item => {
  const quantity = item.quantity || 0;
  const { startDate, endDate } = item.reservation;
  const numberOfNights = formatDate.getNumberOfNights(startDate, endDate);
  return `${quantity} stall${quantity > 1 ? 's' : ''} x ${numberOfNights} night${numberOfNights > 1 ? 's' : ''}`;
};

const getRvDescription = item => {
  const { startDate, endDate } = item.reservation;
  const quantity = item.quantity || 0;
  const numberOfNights = formatDate.getNumberOfNights(startDate, endDate);
  return `${quantity} RV spot${quantity > 1 ? 's' : ''} x ${numberOfNights} night${numberOfNights > 1 ? 's' : ''}`;
};

function getChargeEmailData(orderItemData, event, reservations, orderItemsCosts) {
  const addOns = [];
  const stalls = [];
  const rvs = [];
  const receiptLineItems = [];
  const orderItemsCostsByxProductId = {};

  if (Object.keys(orderItemsCosts).length) {
    orderItemsCosts.orderItemsCostsWithDetails.forEach(orderItemCost => {
      // eslint-disable-next-line no-prototype-builtins
      if (!orderItemsCostsByxProductId.hasOwnProperty(orderItemCost.xProductId)) {
        orderItemsCostsByxProductId[orderItemCost.xProductId] = {
          ...orderItemCost
        };
      }
    });
  }

  const reservationsIds = reservations.map(x => x.reservationId.toString());
  orderItemData
    .filter(orderItem => (orderItem.reservation && reservationsIds.includes(orderItem.reservation.id.toString())) || orderItem.addOnProduct)
    .forEach(orderItem => {
      if (orderItem) {
        const { addOnProduct, reservation, price } = orderItem;

        if (addOnProduct) {
          addOns.push({
            name: addOnProduct.addOn ? addOnProduct.addOn.name || '' : '',
            desc: getAddOnDescription(orderItem)
          });

          receiptLineItems.push({
            desc: getAddOnDescription(orderItem),
            amount:
              reservation && !!Object.keys(orderItemsCostsByxProductId).length
                ? orderItemsCostsByxProductId[reservation.xProductId.toString()]
                  ? orderItemsCostsByxProductId[reservation.xProductId.toString()].orderItemCost
                  : 0
                : price
          });
        }

        if (reservation) {
          const stallProduct = reservation.StallProduct;
          const rvProduct = reservation.RVProduct;
          const { checkInTime, checkOutTime } = event;

          if (rvProduct) {
            const { rvLot: lot, sewer, water, power } = rvProduct;
            const { price } = orderItem;
            rvs.push({
              quantity: orderItem.quantity,
              desc: lot.description || '',
              name: lot.name || '',
              amount: price,
              sewer,
              water,
              power,
              checkInTime,
              checkOutTime,
              startDate: reservation.startDate,
              endDate: reservation.endDate
            });

            receiptLineItems.push({
              desc: getRvDescription(orderItem),
              amount: Object.keys(orderItemsCostsByxProductId).length
                ? orderItemsCostsByxProductId[reservation.xProductId.toString()]
                  ? orderItemsCostsByxProductId[reservation.xProductId.toString()].orderItemCost
                  : 0
                : price
            });
          }

          if (stallProduct) {
            const { description, name } = stallProduct;
            const { startDate, endDate } = reservation;
            stalls.push({
              quantity: orderItem.quantity,
              desc: description,
              name,
              amount: price,
              startDate,
              endDate,
              checkInTime,
              checkOutTime
            });

            receiptLineItems.push({
              desc: getStallDescription(orderItem),
              amount: Object.keys(orderItemsCostsByxProductId).length
                ? orderItemsCostsByxProductId[reservation.xProductId.toString()]
                  ? orderItemsCostsByxProductId[reservation.xProductId.toString()].orderItemCost
                  : 0
                : price
            });
          }
        }
      }
    });

  return { rvs, stalls, addOns, receiptLineItems };
}

export default getChargeEmailData;
