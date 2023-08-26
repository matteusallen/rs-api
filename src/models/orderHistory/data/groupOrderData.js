import moment from 'moment';

export const getGroupOrderData = () => {
  const orderHistory = {
    orderId: 22795,
    adminId: 2380,
    order: {
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    changeType: 'groupOrder',
    createdAt: '2022-07-26T21:06:59.617Z',
    dataValues: {
      adminName: 'lazy e arena',
      renterName: 'leandro fonseca'
    },
    orderHistoryPayments: [
      {
        payment: {
          isGroupOrder: true,
          serviceFee: 5,
          cardPayment: true,
          isRefund: false,
          cardBrand: '-',
          refundReason: '',
          amount: 46
        }
      }
    ],
    newValues: {
      stalls: {
        endDate: '2022-07-29',
        quantity: 1,
        startDate: '2022-07-28',
        xProductId: 1040,
        reservationId: 26442,
        price: 20,
        nightly: true
      },
      rvs: {
        endDate: '2022-07-29',
        quantity: 1,
        startDate: '2022-07-28',
        xProductId: 864,
        reservationId: 26443,
        price: 10,
        nightly: true
      },
      addOns: [
        {
          quantity: 1,
          orderItemId: 43810,
          price: 5,
          name: 'Grass Hay'
        },
        {
          quantity: 1,
          orderItemId: 43811,
          price: 6,
          name: 'Alfalfa Hay'
        }
      ]
    },
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRow = [
    {
      orderId: 22795,
      transactionDate: moment('2022-07-26T21:06:59.617Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Deferred',
      isRefund: false,
      cardBrand: '-',
      refundReason: '',
      stallsQty: 1,
      stallsNights: 1,
      stallsUnitPrice: 20,
      stallsTotal: 20,
      rvsQty: 1,
      rvsNights: 1,
      rvsUnitPrice: 10,
      rvsTotal: 10,
      'Grass HayQty': 1,
      'Grass HayUnitPrice': 5,
      'Grass HayTotal': 5,
      'Alfalfa HayQty': 1,
      'Alfalfa HayUnitPrice': 6,
      'Alfalfa HayTotal': 6,
      addOnNames: ['Grass Hay', 'Alfalfa Hay'],
      subtotal: 41,
      roloFee: 5,
      stripeAccountType: '',
      stripeFee: '-',
      total: 46
    }
  ];

  return [orderHistory, expectedRow];
};
