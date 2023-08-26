import moment from 'moment';

export const getMultiRefundData = () => {
  const orderHistory = {
    id: 31936,
    orderId: 22792,
    adminId: 2380,
    changeType: 'orderChange',
    oldValues: {
      rvs: {
        endDate: '2022-07-28',
        quantity: 2,
        startDate: '2022-07-26',
        xProductId: 864,
        reservationId: 26437,
        price: 10,
        nightly: true
      },
      addOns: [
        {
          quantity: 3,
          orderItemId: 43798
        },
        {
          quantity: 3,
          orderItemId: 43799
        }
      ],
      stalls: {
        endDate: '2022-07-28',
        quantity: 2,
        startDate: '2022-07-26',
        xProductId: 1040,
        reservationId: 26436,
        price: 20,
        nightly: true
      }
    },
    newValues: {
      rvs: {
        endDate: '2022-07-28',
        quantity: 1,
        startDate: '2022-07-26',
        xProductId: 864,
        reservationId: 26437,
        price: 10,
        nightly: true
      },
      addOns: [
        {
          quantity: 2,
          orderItemId: 43798,
          price: 5,
          name: 'Grass Hay'
        },
        {
          quantity: 2,
          orderItemId: 43799,
          price: 6,
          name: 'Alfalfa Hay'
        }
      ],
      stalls: {
        endDate: '2022-07-27',
        startDate: '2022-07-26',
        xProductId: 1040,
        reservationId: 26436,
        price: 20,
        nightly: true
      },
      discount: 0
    },
    createdAt: '2022-07-20T16:38:46.433Z',
    order: {
      id: 22792,
      userId: 10820,
      event: {
        name: 'Trans Report Event'
      }
    },
    orderHistoryPayments: [
      {
        id: 24760,
        payment: {
          id: 20334,
          ssRefundId: 're_3LNfqGGhNUysQh7Y0wzK0OmF',
          cardPayment: true,
          cardBrand: 'visa',
          notes: 'MULTI REFUND: Multiple card refund test',
          amount: -10,
          serviceFee: 0,
          stripeFee: 0
        }
      },
      {
        id: 24761,
        payment: {
          id: 20335,
          ssRefundId: 're_3LNfphGhNUysQh7Y1Aarbk3O',
          cardPayment: true,
          cardBrand: 'visa',
          notes: 'MULTI REFUND: Multiple card refund test',
          amount: -20,
          serviceFee: 0,
          stripeFee: 0
        }
      },
      {
        id: 24762,
        payment: {
          id: 20336,
          ssRefundId: 're_3LNfoxGhNUysQh7Y1LD1zcXJ',
          cardPayment: true,
          cardBrand: 'visa',
          notes: 'MULTI REFUND: Multiple card refund test',
          amount: -41,
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
      orderId: 22792,
      transactionDate: moment('2022-07-20T16:38:46.433Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Refund - Card',
      isRefund: true,
      cardBrand: 'visa',
      refundReason: 'MULTI REFUND: Multiple card refund test',
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
      stripeAccountType: '',
      stripeFee: '-',
      total: -10
    },
    {
      orderId: 22792,
      transactionDate: moment('2022-07-20T16:38:46.433Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Refund - Card',
      isRefund: true,
      cardBrand: 'visa',
      refundReason: 'MULTI REFUND: Multiple card refund test',
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
      stripeAccountType: '',
      stripeFee: '-',
      total: -20
    },
    {
      orderId: 22792,
      transactionDate: moment('2022-07-20T16:38:46.433Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Trans Report Event',
      renterName: 'leandro fonseca',
      transactionType: 'Refund - Card',
      isRefund: true,
      cardBrand: 'visa',
      refundReason: 'MULTI REFUND: Multiple card refund test',
      stallsQty: 2,
      stallsNights: -1,
      stallsUnitPrice: 20,
      stallsTotal: -40,
      rvsQty: -1,
      rvsNights: 2,
      rvsUnitPrice: 10,
      rvsTotal: -20,
      'Grass HayQty': -1,
      'Grass HayUnitPrice': 5,
      'Grass HayTotal': -5,
      'Alfalfa HayQty': -1,
      'Alfalfa HayUnitPrice': 6,
      'Alfalfa HayTotal': -6,
      addOnNames: ['Grass Hay', 'Alfalfa Hay'],
      subtotal: -71,
      roloFee: '-',
      stripeAccountType: '',
      stripeFee: '-',
      total: -41
    }
  ];

  return [orderHistory, expectedRow];
};
