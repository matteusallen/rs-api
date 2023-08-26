import moment from 'moment';

export const getSpecialRefundData = () => {
  const orderHistory = {
    id: 31930,
    orderId: 22790,
    adminId: 2380,
    changeType: 'specialRefund',
    oldValues: {},
    newValues: {},
    createdAt: '2022-07-12T22:09:16.065Z',
    order: {
      id: 22790,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24754,
        payment: {
          id: 20328,
          ssRefundId: 're_3LKl6kGhNUysQh7Y1VtfdBlz',
          cardPayment: true,
          cardBrand: 'visa',
          notes: '$10 off',
          amount: -10,
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
      orderId: 22790,
      transactionDate: moment('2022-07-12T22:09:16.065Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Refund - Card',
      isRefund: true,
      cardBrand: 'visa',
      refundReason: 'Special Refund: $10 off',
      stallsQty: null,
      stallsNights: null,
      stallsUnitPrice: null,
      stallsTotal: null,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: -10,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: '-',
      total: -10
    }
  ];

  return [orderHistory, expectedRow];
};
