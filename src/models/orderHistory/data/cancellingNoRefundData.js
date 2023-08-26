import moment from 'moment';

export const getCancellingNoRefundData = () => {
  const orderHistory = {
    id: 31949,
    orderId: 22794,
    adminId: 2380,
    changeType: 'orderCancellation',
    oldValues: {
      rvs: {
        endDate: '2022-07-31',
        quantity: 1,
        startDate: '2022-07-28',
        xProductId: 864,
        reservationId: 26441,
        price: 10,
        nightly: true
      },
      addons: [
        {
          quantity: 2,
          orderItemId: 43814,
          price: 7,
          name: 'Shavings'
        },
        {
          quantity: 1,
          orderItemId: 43807,
          price: 6,
          name: 'Alfalfa Hay'
        }
      ],
      stalls: {
        endDate: '2022-07-29',
        quantity: 2,
        startDate: '2022-07-28',
        xProductId: 1040,
        reservationId: 26440,
        price: 20,
        nightly: true
      },
      discount: 0
    },
    newValues: {},
    createdAt: '2022-07-28T19:34:42.706Z',
    order: {
      id: 22794,
      userId: 10820,
      platformFee: 5,
      event: {
        name: 'Trans Report Event'
      },
      groupOrderBills: []
    },
    orderHistoryPayments: [],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRow = [
    {
      orderId: 22794,
      transactionDate: moment('2022-07-28T19:34:42.706Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: '-',
      isRefund: false,
      cardBrand: '-',
      refundReason: 'NO REFUND: Cancelled',
      stallsQty: -2,
      stallsNights: 1,
      stallsUnitPrice: 20,
      stallsTotal: '-',
      rvsQty: -1,
      rvsNights: 3,
      rvsUnitPrice: 10,
      rvsTotal: '-',
      ShavingsQty: -2,
      ShavingsUnitPrice: 7,
      ShavingsTotal: '-',
      'Alfalfa HayQty': -1,
      'Alfalfa HayUnitPrice': 6,
      'Alfalfa HayTotal': '-',
      addOnNames: ['Shavings', 'Alfalfa Hay'],
      subtotal: '-',
      roloFee: '-',
      stripeFee: '-',
      total: '-'
    }
  ];

  return [orderHistory, expectedRow];
};
