import moment from 'moment';

export const getInitialOrderData = () => {
  const orderHistory = {
    id: 31908,
    orderId: 22785,
    adminId: 2380,
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca',
    changeType: 'orderChange',
    oldValues: {},
    newValues: {
      rvs: {},
      addOns: {
        orderItemId: 43781,
        price: 5,
        name: 'Grass Hay',
        quantity: 4
      },
      stalls: {
        endDate: '2022-06-29',
        quantity: 2,
        startDate: '2022-06-28',
        xProductId: 1039,
        assignments: [],
        reservationId: 26428,
        price: 10,
        nightly: true
      },
      discount: 0
    },
    createdAt: '2022-06-22T18:24:10.284Z',
    updatedAt: '2022-06-22T18:24:10.285Z',
    order: {
      id: 22785,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24732,
        payment: {
          id: 20306,
          cardPayment: true,
          cardBrand: 'visa',
          notes: null,
          amount: 46.65,
          serviceFee: 5,
          stripeFee: 1.65
        }
      }
    ]
  };

  const expectedRows = [
    {
      orderId: 22785,
      transactionDate: moment('2022-06-22T18:24:10.284Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Card',
      isRefund: false,
      cardBrand: 'visa',
      refundReason: '-',
      stallsQty: 2,
      stallsNights: 1,
      stallsUnitPrice: 10,
      stallsTotal: 20,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      'Grass HayQty': 4,
      'Grass HayUnitPrice': 5,
      'Grass HayTotal': 20,
      addOnNames: ['Grass Hay'],
      subtotal: 40,
      roloFee: 5,
      stripeAccountType: '',
      stripeFee: 1.65,
      total: 46.65
    }
  ];

  return [orderHistory, expectedRows];
};
