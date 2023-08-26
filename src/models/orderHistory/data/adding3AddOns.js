import moment from 'moment';

export const getAdding3AddOnsData = () => {
  const orderHistory = {
    id: 31929,
    orderId: 22790,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {},
    newValues: {
      addOns: [
        {
          quantity: 3,
          orderItemId: 43791,
          price: 5,
          name: 'Grass Hay'
        },
        {
          quantity: 2,
          orderItemId: 43792,
          price: 6,
          name: 'Alfalfa Hay'
        },
        {
          quantity: 1,
          orderItemId: 43793,
          price: 7,
          name: 'Shavings'
        }
      ],
      discount: 0
    },
    createdAt: '2022-07-12T21:08:31.530Z',
    order: {
      id: 22790,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24753,
        payment: {
          id: 20327,
          ssRefundId: null,
          cardPayment: true,
          cardBrand: 'visa',
          notes: null,
          amount: 35.32,
          serviceFee: 0,
          stripeFee: 1.32
        }
      }
    ],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRows = [
    {
      orderId: 22790,
      transactionDate: moment('2022-07-12T21:08:31.530Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Card',
      isRefund: false,
      cardBrand: 'visa',
      refundReason: '-',
      stallsQty: null,
      stallsNights: null,
      stallsUnitPrice: null,
      stallsTotal: null,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      'Grass HayQty': 3,
      'Grass HayUnitPrice': 5,
      'Grass HayTotal': 15,
      'Alfalfa HayQty': 2,
      'Alfalfa HayUnitPrice': 6,
      'Alfalfa HayTotal': 12,
      ShavingsQty: 1,
      ShavingsUnitPrice: 7,
      ShavingsTotal: 7,
      addOnNames: ['Grass Hay', 'Alfalfa Hay', 'Shavings'],
      subtotal: 34,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: 1.32,
      total: 35.32
    }
  ];

  return [orderHistory, expectedRows];
};
