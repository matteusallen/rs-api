import moment from 'moment';

export const getChangingProductData = () => {
  const orderHistory = {
    id: 31928,
    orderId: 22790,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {
      rvs: {
        endDate: '2022-07-22',
        quantity: 3,
        startDate: '2022-07-19',
        xProductId: 864,
        reservationId: 26433,
        price: 10,
        nightly: true
      }
    },
    newValues: {
      rvs: {
        endDate: '2022-07-22',
        quantity: 2,
        startDate: '2022-07-18',
        xProductId: '865',
        reservationId: 26433,
        price: 20,
        nightly: true
      },
      discount: 0
    },
    createdAt: '2022-07-12T16:00:22.163Z',
    order: {
      id: 22790,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24752,
        payment: {
          id: 20326,
          ssRefundId: null,
          cardPayment: true,
          cardBrand: 'visa',
          notes: null,
          amount: 72.4,
          serviceFee: 0,
          stripeFee: 2.4
        }
      }
    ],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRows = [
    {
      orderId: 22790,
      transactionDate: moment('2022-07-12T16:00:22.163Z').format('MM-DD-YYYY hh:mm:ss A'),
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
      rvsQty: -3,
      rvsNights: 3,
      rvsUnitPrice: 10,
      rvsTotal: -90,
      subtotal: -90,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: '-',
      total: '-'
    },
    {
      orderId: 22790,
      transactionDate: moment('2022-07-12T16:00:22.163Z').format('MM-DD-YYYY hh:mm:ss A'),
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
      rvsQty: 2,
      rvsNights: 4,
      rvsUnitPrice: 20,
      rvsTotal: 160,
      subtotal: 160,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: 2.4,
      total: 72.4
    }
  ];

  return [orderHistory, expectedRows];
};
