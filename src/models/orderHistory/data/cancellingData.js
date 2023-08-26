import moment from 'moment';

export const getCancellingData = () => {
  const orderHistory = {
    id: 31940,
    orderId: 22793,
    adminId: 2380,
    changeType: 'orderCancellation',
    oldValues: {
      rvs: {
        endDate: '2022-07-30',
        quantity: 2,
        startDate: '2022-07-29',
        xProductId: 864,
        reservationId: 26439,
        price: 10,
        nightly: true
      },
      addons: [
        {
          quantity: 2,
          orderItemId: 43802,
          price: 5,
          name: 'Grass Hay'
        },
        {
          quantity: 2,
          orderItemId: 43803,
          price: 6,
          name: 'Alfalfa Hay'
        }
      ],
      stalls: {
        endDate: '2022-07-29',
        quantity: 1,
        startDate: '2022-07-28',
        xProductId: 1040,
        reservationId: 26438,
        price: 20,
        nightly: true
      },
      discount: 0
    },
    newValues: {},
    createdAt: '2022-07-26T14:32:00.504Z',
    order: {
      id: 22793,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24765,
        payment: {
          id: 20339,
          ssRefundId: 're_3LNkUrGhNUysQh7Y1hfD158R',
          cardPayment: true,
          cardBrand: 'visa',
          notes: 'Example of cancelled with fees refunded',
          amount: -69.91,
          serviceFee: 0,
          stripeFee: 0,
          payout: null
        }
      }
    ],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRow = [
    {
      orderId: 22793,
      transactionDate: moment('2022-07-26T14:32:00.504Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Refund - Card',
      isRefund: true,
      cardBrand: 'visa',
      refundReason: 'Example of cancelled with fees refunded',
      stallsQty: -1,
      stallsNights: 1,
      stallsUnitPrice: 20,
      stallsTotal: -20,
      rvsQty: -2,
      rvsNights: 1,
      rvsUnitPrice: 10,
      rvsTotal: -20,
      'Grass HayQty': -2,
      'Grass HayUnitPrice': 5,
      'Grass HayTotal': -10,
      'Alfalfa HayQty': -2,
      'Alfalfa HayUnitPrice': 6,
      'Alfalfa HayTotal': -12,
      addOnNames: ['Grass Hay', 'Alfalfa Hay'],
      subtotal: -62,
      stripeAccountType: '',
      roloFee: '-',
      stripeFee: '-',
      total: -69.91
    }
  ];

  return [orderHistory, expectedRow];
};
