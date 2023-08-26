import moment from 'moment';

export const getIncreasingQtyExtendingNightsData = () => {
  const orderHistory = {
    id: 31922,
    orderId: 22785,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {
      stalls: {
        endDate: '2022-06-29',
        quantity: 1,
        startDate: '2022-06-28',
        xProductId: 1039,
        reservationId: 26428
      },
      discount: 0
    },
    newValues: {
      stalls: {
        endDate: '2022-07-14',
        quantity: 2,
        startDate: '2022-07-12',
        xProductId: 1039,
        reservationId: 26428,
        price: 10,
        nightly: true
      }
    },
    createdAt: '2022-07-06T17:07:33.262Z',
    order: {
      id: 22785,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24746,
        payment: {
          id: 20320,
          ssRefundId: null,
          cardPayment: true,
          cardBrand: 'visa',
          notes: null,
          amount: 31.2,
          serviceFee: 0,
          stripeFee: 1.2
        }
      }
    ],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRows = [
    {
      orderId: 22785,
      transactionDate: moment('2022-07-06T17:07:33.262Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Card',
      isRefund: false,
      cardBrand: 'visa',
      refundReason: '-',
      stallsQty: 1,
      stallsNights: 2,
      stallsUnitPrice: 10,
      stallsTotal: 20,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: 20,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: '-',
      total: '-'
    },
    {
      orderId: 22785,
      transactionDate: moment('2022-07-06T17:07:33.262Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Card',
      isRefund: false,
      cardBrand: 'visa',
      refundReason: '-',
      stallsQty: 1,
      stallsNights: 1,
      stallsUnitPrice: 10,
      stallsTotal: 10,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: 10,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: 1.2,
      total: 31.2
    }
  ];

  return [orderHistory, expectedRows];
};
