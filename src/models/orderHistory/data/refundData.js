import moment from 'moment';

export const getRefundData = () => {
  const orderHistory = {
    id: 31912,
    orderId: 22785,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {
      rvs: {},
      addOns: {
        quantity: 4,
        orderItemId: 43781
      },
      stalls: {
        endDate: '2022-06-29',
        quantity: 2,
        startDate: '2022-06-28',
        xProductId: 1039,
        reservationId: 26428
      }
    },
    newValues: {
      rvs: {},
      addOns: {
        quantity: 2,
        orderItemId: 43781,
        price: 5,
        name: 'Grass Hay'
      },
      stalls: {
        endDate: '2022-06-29',
        quantity: 1,
        startDate: '2022-06-28',
        xProductId: 1039,
        reservationId: '26428',
        price: 10,
        nightly: true
      }
    },
    createdAt: '2022-06-27T22:35:55.443Z',
    order: {
      id: 22785,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24736,
        payment: {
          id: 20310,
          ssRefundId: 're_3LDYDkGhNUysQh7Y0eU8DqqY',
          cardPayment: true,
          cardBrand: 'visa',
          notes: 'No longer needed a stall or shavings',
          amount: -20,
          serviceFee: 0,
          stripeFee: 0
        }
      }
    ],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRow = [
    {
      orderId: 22785,
      transactionDate: moment('2022-06-27T22:35:55.443Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Refund - Card',
      isRefund: true,
      cardBrand: 'visa',
      refundReason: 'No longer needed a stall or shavings',
      stallsQty: -1,
      stallsNights: 1,
      stallsUnitPrice: 10,
      stallsTotal: -10,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      'Grass HayQty': -2,
      'Grass HayUnitPrice': 5,
      'Grass HayTotal': -10,
      addOnNames: ['Grass Hay'],
      subtotal: -20,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: '-',
      total: -20
    }
  ];

  return [orderHistory, expectedRow];
};
