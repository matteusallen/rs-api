import moment from 'moment';

export const getNoRefundData = () => {
  const orderHistory = {
    id: 31955,
    orderId: 22797,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {
      rvs: {
        endDate: '2022-08-18',
        quantity: 2,
        startDate: '2022-08-15',
        xProductId: 867,
        reservationId: 26447,
        price: 10,
        nightly: true
      },
      addOns: [
        {
          quantity: 1,
          orderItemId: 43820
        },
        {
          quantity: 2,
          orderItemId: 43821
        }
      ],
      stalls: {
        endDate: '2022-08-18',
        quantity: 2,
        startDate: '2022-08-15',
        xProductId: 1042,
        reservationId: 26446,
        price: 10,
        nightly: true
      }
    },
    newValues: {
      rvs: {
        endDate: '2022-08-18',
        quantity: 1,
        startDate: '2022-08-15',
        xProductId: 867,
        reservationId: 26447,
        price: 10,
        nightly: true
      },
      addOns: [
        {
          quantity: 0,
          orderItemId: 43820,
          noRefundReason: 'Testing No Refund',
          price: 5,
          name: 'Grass Hay'
        },
        {
          quantity: 1,
          orderItemId: 43821,
          noRefundReason: 'Testing No Refund',
          price: 6,
          name: 'Alfalfa Hay'
        }
      ],
      stalls: {
        endDate: '2022-08-17',
        quantity: 1,
        startDate: '2022-08-15',
        xProductId: 1042,
        reservationId: 26446,
        price: 10,
        nightly: true
      },
      discount: 0,
      noRefundReason: 'Testing No Refund'
    },
    createdAt: '2022-08-03T22:18:42.328Z',
    order: {
      id: 22797,
      userId: 10820,
      platformFee: 5,
      event: {
        name: 'Trans Report Event 2'
      },
      groupOrderBills: []
    },
    orderHistoryPayments: [
      {
        id: 24779,
        payment: {
          id: 20350,
          ssRefundId: null,
          cardPayment: false,
          cardBrand: null,
          notes: 'NO REFUND: Testing No Refund',
          amount: -81,
          serviceFee: 0,
          stripeFee: 0,
          payout: null
        }
      }
    ],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRows = [
    {
      orderId: 22797,
      transactionDate: moment('2022-08-03T22:18:42.328Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event 2',
      renterName: 'leandro fonseca',
      transactionType: '-',
      isRefund: true,
      cardBrand: '-',
      refundReason: 'NO REFUND: Testing No Refund',
      stallsQty: -1,
      stallsNights: 3,
      stallsUnitPrice: 10,
      stallsTotal: '-',
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: '-',
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: '-',
      total: '-'
    },
    {
      orderId: 22797,
      transactionDate: moment('2022-08-03T22:18:42.328Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event 2',
      renterName: 'leandro fonseca',
      transactionType: '-',
      isRefund: true,
      cardBrand: '-',
      refundReason: 'NO REFUND: Testing No Refund',
      stallsQty: 1,
      stallsNights: -1,
      stallsUnitPrice: 10,
      stallsTotal: '-',
      rvsQty: -1,
      rvsNights: 3,
      rvsUnitPrice: 10,
      rvsTotal: '-',
      'Grass HayQty': -1,
      'Grass HayUnitPrice': 5,
      'Grass HayTotal': '-',
      'Alfalfa HayQty': -1,
      'Alfalfa HayUnitPrice': 6,
      'Alfalfa HayTotal': '-',
      addOnNames: ['Grass Hay', 'Alfalfa Hay'],
      subtotal: '-',
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: '-',
      total: '-'
    }
  ];

  return [orderHistory, expectedRows];
};
