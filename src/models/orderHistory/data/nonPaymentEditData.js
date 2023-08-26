import moment from 'moment';

export const getNonPaymentEditData = () => {
  const orderHistory = {
    id: 31939,
    orderId: 22793,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {
      rvs: {
        endDate: '2022-07-27',
        quantity: 2,
        startDate: '2022-07-26',
        xProductId: 864,
        reservationId: 26439,
        price: 10,
        nightly: true
      },
      stalls: {
        endDate: '2022-07-27',
        quantity: 1,
        startDate: '2022-07-26',
        xProductId: 1040,
        reservationId: 26438,
        price: 20,
        nightly: true
      }
    },
    newValues: {
      rvs: {
        endDate: '2022-07-30',
        quantity: 2,
        startDate: '2022-07-29',
        xProductId: 864,
        reservationId: 26439,
        price: 10,
        nightly: true
      },
      stalls: {
        endDate: '2022-07-29',
        startDate: '2022-07-28',
        xProductId: 1040,
        reservationId: 26438,
        price: 20,
        nightly: true
      },
      discount: 0
    },
    createdAt: '2022-07-21T22:53:23.688Z',
    order: {
      id: 22793,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRow = [
    {
      orderId: 22793,
      transactionDate: moment('2022-07-21T22:53:23.688Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Non payment edit',
      isRefund: false,
      cardBrand: '-',
      refundReason: '-',
      stallsQty: null,
      stallsNights: null,
      stallsUnitPrice: null,
      stallsTotal: null,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: '-',
      roloFee: '-',
      stripeFee: '-',
      total: '-'
    }
  ];

  return [orderHistory, expectedRow];
};
