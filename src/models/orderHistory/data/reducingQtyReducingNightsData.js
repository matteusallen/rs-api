import moment from 'moment';

export const getReducingQtyReducingNightsData = () => {
  const orderHistory = {
    id: 31923,
    orderId: 22785,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {
      stalls: {
        endDate: '2022-07-14',
        quantity: 2,
        startDate: '2022-07-12',
        xProductId: 1039,
        reservationId: 26428
      }
    },
    newValues: {
      stalls: {
        endDate: '2022-07-13',
        quantity: 1,
        startDate: '2022-07-12',
        xProductId: 1039,
        reservationId: 26428,
        price: 10,
        nightly: true
      }
    },
    createdAt: '2022-07-06T17:28:33.786Z',
    order: {
      id: 22785,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24747,
        payment: {
          id: 20321,
          ssRefundId: 're_3LIbhFGhNUysQh7Y0iL1kiQP',
          cardPayment: true,
          cardBrand: 'visa',
          notes: 'reduced a stall and night',
          amount: -30,
          serviceFee: 0,
          stripeFee: 0
        }
      }
    ],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRows = [
    {
      orderId: 22785,
      transactionDate: moment('2022-07-06T17:28:33.786Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Refund - Card',
      isRefund: true,
      cardBrand: 'visa',
      refundReason: 'reduced a stall and night',
      stallsQty: -1,
      stallsNights: 2,
      stallsUnitPrice: 10,
      stallsTotal: -20,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: -20,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: '-',
      total: '-'
    },
    {
      orderId: 22785,
      transactionDate: moment('2022-07-06T17:28:33.786Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Refund - Card',
      isRefund: true,
      cardBrand: 'visa',
      refundReason: 'reduced a stall and night',
      stallsQty: 1,
      stallsNights: -1,
      stallsUnitPrice: 10,
      stallsTotal: -10,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: -10,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: '-',
      total: -30
    }
  ];

  return [orderHistory, expectedRows];
};
