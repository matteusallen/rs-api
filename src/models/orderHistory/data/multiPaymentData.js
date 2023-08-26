import moment from 'moment';

export const getMultiPaymentData = () => {
  const orderHistory = {
    id: 54123,
    orderId: 27281,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {
      stalls: {
        endDate: '2022-10-26',
        quantity: 1,
        startDate: '2022-10-25',
        xProductId: 1148,
        reservationId: 31143,
        price: 10,
        nightly: false
      }
    },
    newValues: {
      stalls: {
        endDate: '2022-10-26',
        quantity: 1,
        startDate: '2022-10-25',
        xProductId: '1150',
        reservationId: 31143,
        price: 20,
        nightly: false
      },
      discount: 0
    },
    createdAt: '2022-10-25T20:57:09.341Z',
    order: {
      id: 27281,
      userId: 12656,
      platformFee: 5,
      event: {
        name: 'Leandro Event 2',
        venue: {
          stripeAccountType: 'express'
        }
      },
      groupOrderBills: []
    },
    orderHistoryPayments: [
      {
        id: 43822,
        isGroupOrder: false,
        payment: {
          id: 24767,
          ssChargeId: 'ch_3LwuBJGhNUysQh7Y0Ebixowk',
          ssRefundId: null,
          cardPayment: true,
          cardBrand: 'visa',
          notes: null,
          amount: 6.61,
          serviceFee: 0,
          stripeFee: 0.61,
          stripeAccountType: 'express',
          orderId: 27281,
          success: true,
          payout: null
        }
      },
      {
        id: 43823,
        isGroupOrder: false,
        payment: {
          id: 24768,
          ssChargeId: null,
          ssRefundId: null,
          cardPayment: false,
          cardBrand: null,
          notes: null,
          amount: 4,
          serviceFee: 0,
          stripeFee: 0,
          stripeAccountType: 'express',
          orderId: 27281,
          success: true,
          payout: null
        }
      }
    ],
    adminName: 'lazy e arena',
    renterName: 'leandro fonseca'
  };

  const expectedRow = [
    {
      orderId: 27281,
      transactionDate: moment('2022-10-25T20:57:09.341Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Leandro Event 2',
      renterName: 'leandro fonseca',
      transactionType: 'Multi Payment',
      isRefund: false,
      cardBrand: '',
      refundReason: '-',
      stallsQty: -1,
      stallsNights: 1,
      stallsUnitPrice: 10,
      stallsTotal: -10,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: null,
      roloFee: '-',
      stripeAccountType: 'express',
      stripeFee: '-',
      total: null
    },
    {
      orderId: 27281,
      transactionDate: moment('2022-10-25T20:57:09.341Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Leandro Event 2',
      renterName: 'leandro fonseca',
      transactionType: 'Multi Payment',
      isRefund: false,
      cardBrand: '',
      refundReason: '-',
      stallsQty: 1,
      stallsNights: 1,
      stallsUnitPrice: 20,
      stallsTotal: 20,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: null,
      roloFee: '-',
      stripeAccountType: 'express',
      stripeFee: '-',
      total: null
    },
    {
      orderId: 27281,
      transactionDate: moment('2022-10-25T20:57:09.341Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Leandro Event 2',
      renterName: 'leandro fonseca',
      transactionType: 'Multi Payment: Card',
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
      subtotal: 6,
      roloFee: '-',
      stripeAccountType: 'express',
      stripeFee: 0.61,
      total: 6.61
    },
    {
      orderId: 27281,
      transactionDate: moment('2022-10-25T20:57:09.341Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Leandro Event 2',
      renterName: 'leandro fonseca',
      transactionType: 'Multi Payment: Cash',
      isRefund: false,
      cardBrand: '',
      refundReason: '-',
      stallsQty: null,
      stallsNights: null,
      stallsUnitPrice: null,
      stallsTotal: null,
      rvsQty: null,
      rvsNights: null,
      rvsUnitPrice: null,
      rvsTotal: null,
      subtotal: 4,
      roloFee: '-',
      stripeAccountType: 'express',
      stripeFee: '-',
      total: 4
    }
  ];

  return [orderHistory, expectedRow];
};
