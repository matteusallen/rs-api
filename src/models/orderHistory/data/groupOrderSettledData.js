import moment from 'moment';

export const getGroupOrderSettledData = () => {
  const orderHistory = [
    {
      orderId: 27241,
      adminId: 2380,
      order: {
        userId: 12656,
        event: {
          name: 'Leandro event',
          venue: {
            stripeAccountType: 'express'
          }
        }
      },
      changeType: 'groupOrder',
      createdAt: '2022-08-24T20:57:42.510Z',
      dataValues: {
        adminName: 'lazy e arena',
        renterName: 'leandro fonseca'
      },
      isSettled: true,
      orderHistoryPayments: [
        {
          payment: {
            isGroupOrder: true,
            serviceFee: 5,
            cardPayment: true,
            isRefund: false,
            cardBrand: 'visa',
            refundReason: '',
            amount: 46.65,
            stripeFee: 1.65,
            stripeAccountType: 'express'
          }
        }
      ],
      newValues: {
        stalls: {
          endDate: '2022-08-26',
          quantity: 1,
          startDate: '2022-08-25',
          xProductId: 1146,
          reservationId: 31078,
          price: 20,
          nightly: true
        },
        rvs: {
          endDate: '2022-08-26',
          quantity: 1,
          startDate: '2022-08-25',
          xProductId: 995,
          reservationId: 31079,
          price: 20,
          nightly: true
        },
        addOns: []
      },
      adminName: 'lazy e arena',
      renterName: 'leandro fonseca'
    },
    {
      id: 54090,
      orderId: 27241,
      adminId: 2380,
      changeType: 'orderChange',
      oldValues: {
        rvs: {
          endDate: '2022-08-26',
          quantity: 1,
          startDate: '2022-08-25',
          xProductId: 995,
          reservationId: 31079,
          price: 20,
          nightly: true
        }
      },
      newValues: {
        rvs: {
          endDate: '2022-08-26',
          quantity: 2,
          startDate: '2022-08-25',
          xProductId: 995,
          reservationId: 31079,
          price: 20,
          nightly: true
        },
        discount: 0
      },
      createdAt: '2022-08-24T22:47:14.533Z',
      order: {
        id: 27241,
        userId: 12656,
        platformFee: 5,
        event: {
          name: 'Leandro event',
          venue: {
            stripeAccountType: 'express'
          }
        },
        groupOrderBills: [
          {
            amount: 25,
            isRefund: false
          },
          {
            amount: 20,
            isRefund: false
          }
        ]
      },
      orderHistoryPayments: [
        {
          id: 43787,
          isGroupOrder: false,
          payment: {
            id: 24724,
            ssRefundId: null,
            cardPayment: true,
            cardBrand: 'visa',
            notes: null,
            amount: 20.91,
            serviceFee: 0,
            stripeFee: 0.91,
            stripeAccountType: 'express',
            orderId: 27241,
            payout: null
          }
        }
      ],
      adminName: 'lazy e arena',
      renterName: 'leandro fonseca'
    }
  ];

  const expectedRow = [
    {
      orderId: 27241,
      transactionDate: moment('2022-08-24T20:57:42.510Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Leandro event',
      renterName: 'leandro fonseca',
      transactionType: 'Card',
      isRefund: false,
      cardBrand: 'visa',
      refundReason: '',
      stallsQty: 1,
      stallsNights: 1,
      stallsUnitPrice: 20,
      stallsTotal: 20,
      rvsQty: 1,
      rvsNights: 1,
      rvsUnitPrice: 20,
      rvsTotal: 20,
      subtotal: 40,
      roloFee: 5,
      stripeAccountType: 'express',
      stripeFee: 1.65,
      total: 46.65
    },
    {
      orderId: 27241,
      transactionDate: moment('2022-08-24T22:47:14.533Z').format('MM-DD-YYYY hh:mm:ss A'),
      adminName: 'lazy e arena',
      event: 'Leandro event',
      renterName: 'leandro fonseca',
      transactionType: 'Card',
      isRefund: false,
      cardBrand: 'visa',
      refundReason: '-',
      stallsQty: null,
      stallsNights: null,
      stallsUnitPrice: null,
      stallsTotal: null,
      rvsQty: 1,
      rvsNights: 1,
      rvsUnitPrice: 20,
      rvsTotal: 20,
      subtotal: 20,
      roloFee: '-',
      stripeAccountType: 'express',
      stripeFee: 0.91,
      total: 20.91
    }
  ];

  return [orderHistory, expectedRow];
};
