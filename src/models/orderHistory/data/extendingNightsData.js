import moment from 'moment';

export const getExtendingNightsData = () => {
  const orderHistory = {
    id: 31924,
    orderId: 22785,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {
      stalls: {
        endDate: '2022-07-13',
        quantity: 1,
        startDate: '2022-07-12',
        xProductId: 1039,
        reservationId: 26428
      }
    },
    newValues: {
      stalls: {
        endDate: '2022-07-17',
        startDate: '2022-07-12',
        xProductId: 1039,
        reservationId: 26428,
        price: 10,
        nightly: true
      },
      discount: 0
    },
    createdAt: '2022-07-08T16:44:34.447Z',
    order: {
      id: 22785,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24748,
        payment: {
          id: 20322,
          ssRefundId: null,
          cardPayment: true,
          cardBrand: 'visa',
          notes: null,
          amount: 41.5,
          serviceFee: 0,
          stripeFee: 1.5
        }
      }
    ],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRows = [
    {
      orderId: 22785,
      transactionDate: moment('2022-07-08T16:44:34.447Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Card',
      isRefund: false,
      cardBrand: 'visa',
      refundReason: '-',
      stallsQty: 1,
      stallsNights: 4,
      stallsUnitPrice: 10,
      stallsTotal: 40,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: 40,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: 1.5,
      total: 41.5
    }
  ];

  return [orderHistory, expectedRows];
};
