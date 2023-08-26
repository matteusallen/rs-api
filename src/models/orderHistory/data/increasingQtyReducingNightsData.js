import moment from 'moment';

export const getIncreasingQtyReducingNightsData = () => {
  const orderHistory = {
    id: 31925,
    orderId: 22785,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {
      stalls: {
        endDate: '2022-07-17',
        quantity: 1,
        startDate: '2022-07-12',
        xProductId: 1039,
        reservationId: 26428
      }
    },
    newValues: {
      stalls: {
        endDate: '2022-07-16',
        quantity: 2,
        startDate: '2022-07-13',
        xProductId: 1039,
        reservationId: 26428,
        price: 10,
        nightly: true
      },
      discount: 0
    },
    createdAt: '2022-07-08T21:21:34.445Z',
    order: {
      id: 22785,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24749,
        payment: {
          id: 20323,
          ssRefundId: null,
          cardPayment: true,
          cardBrand: 'visa',
          notes: null,
          amount: 10.61,
          serviceFee: 0,
          stripeFee: 0.61
        }
      }
    ],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRows = [
    {
      orderId: 22785,
      transactionDate: moment('2022-07-08T21:21:34.445Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Card',
      isRefund: false,
      cardBrand: 'visa',
      refundReason: '-',
      stallsQty: 1,
      stallsNights: 3,
      stallsUnitPrice: 10,
      stallsTotal: 30,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: 30,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: '-',
      total: '-'
    },
    {
      orderId: 22785,
      transactionDate: moment('2022-07-08T21:21:34.445Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Card',
      isRefund: false,
      cardBrand: 'visa',
      refundReason: '-',
      stallsQty: 1,
      stallsNights: -2,
      stallsUnitPrice: 10,
      stallsTotal: -20,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: -20,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: 0.61,
      total: 10.61
    }
  ];

  return [orderHistory, expectedRows];
};
