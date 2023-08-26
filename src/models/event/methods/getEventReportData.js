// @flow
import { Op } from 'sequelize';
import { formatDate, reportHelpers } from 'Utils';
import { ADD_ON_PRODUCT_X_REF_TYPE_ID } from 'Constants';
import { em } from '../../../utils/processReport';
import { User } from 'Models';

const calculateNumberOfWeeklyItems = (item: any, event: any, productType: string) => {
  let totalItems = 0;
  const orderItems = [];
  event.orders.forEach(order => {
    orderItems.push(...order.orderItems);
  });

  orderItems.forEach(orderItem => {
    if (orderItem.reservation && item.id === orderItem.reservation[productType]?.id) {
      totalItems += orderItem.quantity;
    }
  });
  return totalItems;
};

const getDateTotals = (dates: string[], orderItems: any) =>
  dates.map(date =>
    orderItems.reduce((state, curr) => {
      const endDate = formatDate.subtractFromDate(curr.reservation.endDate, 1, 'days');
      const inRange = formatDate.datesInRange({
        start: curr.reservation.startDate || '',
        end: endDate || '',
        selected: {
          start: date,
          end: date
        }
      });
      if (inRange) {
        return state + Number(curr.quantity || 0);
      }
      return state;
    }, 0)
  );

const parseStallProducts = (event: any, dates: string[]) => {
  let totalStall = 0;
  const items = [];
  const oi = event.orders.map(order => order.orderItems).flat();
  const res = event.orders.map(order => order.orderItems.map(oi => oi.reservation)).flat();
  for (const item of event.stallProducts) {
    const eventOrderItems = oi.filter(
      orderItem => !!res.find(res => res && res.stallProduct && res.stallProduct.id === item.id && res.id === orderItem.xProductId) && orderItem
    );
    const dateTotals = getDateTotals(dates, eventOrderItems);
    const allItems = item.nightly ? dateTotals.reduce((state, curr) => state + Number(curr), 0) : calculateNumberOfWeeklyItems(item, event, 'stallProduct');
    const totals = [allItems, item.price, allItems * item.price];
    items.push([`${item.name} ${item.nightly ? '(Nightly)' : '(Flat Rate)'}`, ...dateTotals, ...totals]);
    totalStall += allItems * item.price;
  }
  return [items, totalStall];
};

const parseRvProducts = (event: any, dates: string[]) => {
  let rvTotal = 0;
  const items = [];
  const oi = event.orders.map(order => order.orderItems).flat();
  const res = event.orders.map(order => order.orderItems.map(oi => oi.reservation)).flat();
  for (const item of event.rvProducts) {
    const eventOrderItems = oi.filter(
      orderItem => !!res.find(res => res && res.rvProduct && res.rvProduct.id === item.id && res.id === orderItem.xProductId) && orderItem
    );
    const dateTotals = getDateTotals(dates, eventOrderItems);
    const allItems = item.nightly ? dateTotals.reduce((state, curr) => state + Number(curr), 0) : calculateNumberOfWeeklyItems(item, event, 'rvProduct');
    const totals = [allItems, item.price, allItems * item.price];
    items.push([`${item.rvLot.name} ${item.nightly ? '(Nightly)' : '(Flat Rate)'}`, ...dateTotals, ...totals]);
    rvTotal += allItems * item.price;
  }
  return [items, rvTotal];
};

const parseAddOnProducts = (event: any, dates: string[]) => {
  const items = [];
  let addOnTotal = 0;
  const oi = event.orders.map(order => order.orderItems).flat();
  for (const item of event.addOnProducts) {
    const eventOrderItems = oi.filter(orderItem => orderItem.xRefTypeId === ADD_ON_PRODUCT_X_REF_TYPE_ID && item.id === orderItem.xProductId);
    const dateTotals = dates.map(() => '-');
    const allItems = eventOrderItems.reduce((state, curr) => state + Number(curr.quantity || 0), 0);
    const price = +item.price;
    const priceTotal = allItems * +item.price;
    addOnTotal += priceTotal;
    const totals = [allItems, price, priceTotal];
    items.push([item.addOn.name, ...dateTotals, ...totals]);
  }
  return [items, addOnTotal];
};

const getProductsSold = (event: any, length: number) => {
  const orderQuantity = {};
  const orderItems = [];
  event.orders.forEach(order => {
    orderItems.push(...order.orderItems);
  });

  orderItems.forEach(orderItem => {
    const quantity = orderItem.quantity;
    const productType = orderItem.reservation?.rvProduct ? 'rvProduct' : 'stallProduct';
    const id = orderItem.addOnProduct?.id || (orderItem.reservation && orderItem.reservation[productType]?.id);
    if (!id) return null;
    orderQuantity[id] = orderQuantity[id] + quantity || quantity;
  });

  const allProducts = [...event.addOnProducts, ...event.stallProducts, ...event.rvProducts];
  const productCount = [];

  allProducts.forEach(prod => {
    const name = prod.name || prod.addOn?.name;
    const quantity = orderQuantity[prod.id];
    if (quantity) {
      productCount.push(reportHelpers.getTwoItemsRow(length, name, quantity));
    }
  });

  return productCount;
};

const getReportArray = (event: any): string[][] => {
  const dates = formatDate.parseDays(event.startDate, event.endDate, 'M/DD');
  const fullDates = formatDate.parseDays(event.startDate, event.endDate);
  const totals = ['Total qty', 'Unit price', 'Total'];
  const totalNumOfColumns = dates.length + totals.length;
  const [stallProducts, stallTotal] = parseStallProducts(event, fullDates);
  const [rvProducts, rvTotal] = parseRvProducts(event, fullDates);
  const [addOnProducts, addOnTotal] = parseAddOnProducts(event, fullDates);
  const grandTotal = addOnTotal + rvTotal + stallTotal;

  return [
    ['Product', ...dates, ...totals],
    ...stallProducts,
    ...rvProducts,
    ...addOnProducts,
    reportHelpers.getTwoItemsRow(totalNumOfColumns, null, 'Grand Total'),
    reportHelpers.getTwoItemsRow(totalNumOfColumns, null, grandTotal),
    ['divider'],
    reportHelpers.getTwoItemsRow(totalNumOfColumns, 'Products sold', 'Total qty sold'),
    ...getProductsSold(event, totalNumOfColumns),
    ['divider-top']
  ];
};

async function getEventReportData(eventIds: [], request?: any = {}): Promise<any> {
  const events = await this.findAll({
    where: { id: { [Op.in]: eventIds } },
    attributes: ['id', 'name', 'startDate', 'endDate'],
    include: [
      {
        association: 'orders',
        attributes: ['id', 'fee', 'total'],
        where: { canceled: null },
        include: [
          {
            association: 'orderItems',
            attributes: ['id', 'price', 'quantity', 'xRefTypeId', 'xProductId'],
            include: [
              {
                association: 'addOnProduct',
                attributes: ['id', 'price'],
                include: [
                  {
                    association: 'addOn',
                    attributes: ['id', 'name']
                  }
                ]
              },
              {
                association: 'reservation',
                attributes: ['id', 'xProductId', 'xRefTypeId', 'endDate', 'startDate'],
                include: [
                  {
                    association: 'status',
                    attributes: ['id', 'name']
                  },
                  {
                    association: 'stallProduct',
                    attributes: ['id', 'nightly', 'startDate', 'endDate', 'name', 'description', 'price']
                  },
                  {
                    association: 'rvProduct',
                    attributes: ['id', 'nightly', 'startDate', 'endDate', 'name', 'description', 'price']
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        association: 'addOnProducts',
        attributes: ['id', 'price'],
        include: [
          {
            association: 'addOn',
            attributes: ['id', 'name', 'unitName', 'description']
          }
        ]
      },
      {
        association: 'stallProducts',
        attributes: ['id', 'nightly', 'startDate', 'endDate', 'name', 'description', 'price']
      },
      {
        association: 'rvProducts',
        attributes: ['id', 'nightly', 'startDate', 'endDate', 'name', 'description', 'price'],
        include: [
          {
            association: 'rvLot',
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  });

  const reportData = [];
  const eventDates = [];
  for (const event of events) {
    eventDates.push(formatDate.getDbDateRange(event.startDate, event.endDate).length);
    reportData.push({
      data: getReportArray(event),
      headerLabels: formatDate.getDaysFromRange(event.startDate, event.endDate, 1, 3),
      title: event.name,
      sheetName: event.name
    });
  }

  const eventReportDataEstimate = eventDates.reduce((curr, val) => curr + val, 0) * events.length;

  if (eventReportDataEstimate >= Number(process.env.MAX_ROWS_FOR_DOWNLOAD) && request) {
    const { userId } = request.body;
    const user = await User.getUser({ id: userId });
    em.emit('processReport', request, user.payload);
    return [undefined, true];
  }

  const eventWorkbook = await reportHelpers.populateTemplate(reportData, 'src/assets/event-report-template.xlsx', 'Event Report', 1, 9);
  return [eventWorkbook, false];
}

export default getEventReportData;
