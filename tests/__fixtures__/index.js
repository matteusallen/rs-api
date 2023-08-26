import * as reportsSample from './reportSamples';

const productDiscount1 = {
  title: 'No discount available for order',
  input: {
    xProductId: 1,
    xRefTypeId: 3,
    startDate: '2022-11-01',
    endDate: '2022-11-08',
    price: 2,
    quantity: 1
  }
};

const order1 = {
  title: 'create order with stalls only',
  input: {
    orderItems: [
      {
        assignments: [1],
        xProductId: 1,
        xRefTypeId: 1,
        quantity: 3,
        startDate: '2022-03-01T00:00:00.000Z',
        endDate: '2022-03-10T00:00:00.000Z',
        reservation: {
          id: 1
        }
      }
    ],
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1
  },
  cost: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 1,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2022-03-01T00:00:00.000Z',
        endDate: '2022-03-10T00:00:00.000Z',
        orderItemCost: 22
      }
    ],
    subtotal: 22,
    stripeFee: 1.115345005149333,
    serviceFee: 5,
    total: 28.115345005149333
  },
  output: {
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1,
    fee: 1.12,
    platformFee: 5,
    total: 28.12,
    successor: null,
    canceled: null
  }
};

const order2 = {
  title: 'create order with rv spots only',
  input: {
    orderItems: [
      {
        assignments: [2],
        xProductId: 14,
        xRefTypeId: 3,
        quantity: 1,
        startDate: '2020-11-04T00:00:00.000Z',
        endDate: '2021-11-05T00:00:00.000Z'
      }
    ],
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1
  },
  cost: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 14,
        xRefTypeId: 3,
        quantity: 1,
        startDate: '2020-11-04T00:00:00.000Z',
        endDate: '2021-11-05T00:00:00.000Z',
        orderItemCost: 44
      }
    ],
    subtotal: 44,
    stripeFee: 1.7723995880535526,
    serviceFee: 5,
    total: 50.77239958805355
  },
  output: {
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1,
    fee: 1.77,
    platformFee: 5,
    total: 50.77,
    successor: null,
    canceled: null
  }
};

const order3 = {
  title: 'create order with add ons only',
  input: {
    orderItems: [
      {
        xProductId: 12,
        xRefTypeId: 2,
        quantity: 2
      },
      {
        xProductId: 13,
        xRefTypeId: 2,
        quantity: 1
      }
    ],
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1
  },
  cost: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 12,
        xRefTypeId: 2,
        quantity: 2,
        orderItemCost: 22
      },
      {
        xProductId: 13,
        xRefTypeId: 2,
        quantity: 1,
        orderItemCost: 9
      }
    ],
    subtotal: 31,
    stripeFee: 1.2348094747682836,
    serviceFee: 0,
    total: 32.234809474768284
  },
  output: {
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1,
    fee: 1.23,
    platformFee: 0,
    total: 32.23,
    successor: null,
    canceled: null
  }
};

const order4 = {
  title: 'create full order with stalls, rv spots and add ons',
  input: {
    orderItems: [
      {
        assignments: [5],
        xProductId: 72,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-11-04T00:00:00.000Z',
        endDate: '2021-11-05T00:00:00.000Z'
      },
      {
        assignments: [4],
        xProductId: 14,
        xRefTypeId: 3,
        quantity: 1,
        startDate: '2020-11-04T00:00:00.000Z',
        endDate: '2021-11-05T00:00:00.000Z'
      },
      {
        xProductId: 12,
        xRefTypeId: 2,
        quantity: 2
      },
      {
        xProductId: 13,
        xRefTypeId: 2,
        quantity: 1
      }
    ],
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1
  },
  cost: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 72,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-11-04T00:00:00.000Z',
        endDate: '2021-11-05T00:00:00.000Z',
        orderItemCost: 22
      },
      {
        xProductId: 14,
        xRefTypeId: 3,
        quantity: 1,
        startDate: '2020-11-04T00:00:00.000Z',
        endDate: '2021-11-05T00:00:00.000Z',
        orderItemCost: 22
      },
      {
        xProductId: 12,
        xRefTypeId: 2,
        quantity: 2,
        orderItemCost: 22
      },
      {
        xProductId: 13,
        xRefTypeId: 2,
        quantity: 1,
        orderItemCost: 9
      }
    ],
    subtotal: 75,
    stripeFee: 2.6982492276004137,
    serviceFee: 5,
    total: 82.69824922760041
  },
  output: {
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1,
    fee: 2.7,
    platformFee: 5,
    total: 82.7,
    successor: null,
    canceled: null
  }
};

const order5 = {
  title: 'create order with invalid eventId',
  input: {
    orderItems: [],
    eventId: 100000000,
    userId: 1
  },
  cost: {},
  output: 'insert or update on table "Order" violates foreign key constraint "Order_eventId_fkey"'
};

const order6 = {
  title: 'create group order',
  input: {
    orderItems: [
      {
        assignments: [1],
        xProductId: 1,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-11-04T00:00:00.000Z',
        endDate: '2021-11-05T00:00:00.000Z',
        reservation: {
          id: 1
        }
      }
    ],
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1,
    groupId: 1
  },
  cost: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 1,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-11-04T00:00:00.000Z',
        endDate: '2021-11-05T00:00:00.000Z',
        orderItemCost: 22
      }
    ],
    subtotal: 22,
    stripeFee: 1.115345005149333,
    serviceFee: 5,
    total: 28.115345005149333
  }
};
const order7 = {
  title: 'create order with stalls only',
  input: {
    orderItems: [
      {
        assignments: [1],
        xProductId: 2,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-12-04T00:00:00.000Z',
        endDate: '2020-12-06T00:00:00.000Z',
        reservation: {
          id: 1
        }
      }
    ],
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1
  },
  cost: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 2,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-12-04T00:00:00.000Z',
        endDate: '2020-12-06T00:00:00.000Z',
        orderItemCost: 19
      }
    ],
    subtotal: 19,
    stripeFee: 1.03,
    serviceFee: 5,
    total: 25.03,
    discount: 19
  },
  output: {
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1,
    fee: 1.03,
    platformFee: 5,
    total: 25.03,
    successor: null,
    canceled: null
  }
};

const order8 = {
  title: 'create order with addOns only',
  input: {
    orderItems: [
      {
        xProductId: 1,
        xRefTypeId: 2,
        quantity: 1,
        startDate: '2020-12-04T00:00:00.000Z',
        endDate: '2020-12-06T00:00:00.000Z'
      }
    ],
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1
  },
  cost: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 1,
        xRefTypeId: 2,
        quantity: 1,
        startDate: '2020-12-04T00:00:00.000Z',
        endDate: '2020-12-06T00:00:00.000Z',
        orderItemCost: 20
      }
    ],
    subtotal: 20,
    stripeFee: 0,
    serviceFee: 5,
    total: 25,
    discount: 0
  },
  output: {
    eventId: 1,
    notes: '',
    adminNotes: '',
    userId: 1,
    fee: 0,
    platformFee: 5,
    total: 25,
    successor: null,
    canceled: null
  }
};

const cancelOrder1 = {
  title: 'cancel order with a valid orderId',
  input: {
    orderId: 1,
    refundPayment: false,
    refundInformation: null
  },
  adminId: 1
};

const cancelOrder2 = {
  title: 'cancel order with a invalid orderId',
  input: {
    orderId: 1000,
    refundPayment: false,
    refundInformation: null
  },
  adminId: 1
};

const cancelOrder3 = {
  title: 'cancel order with refund',
  input: {
    orderId: 1,
    refundInformation: [
      {
        orderId: 1,
        amount: 10,
        cardBrand: 'visa',
        cardPayment: true,
        last4: '4242',
        ssChargeId: 'ch_1JGReaGhNUysQh7YMeiD68bj',
        notes: 'refund all'
      }
    ],
    refundPayment: true
  },
  adminId: 1
};

const paymentInput = {
  adminId: 1,
  ssChargeId: 'ch_1JGReaGhNUysQh7YMeiD68bj',
  cardPayment: true,
  cardBrand: 'visa',
  last4: '4242',
  ssRefundId: null,
  orderId: 1,
  amount: 10,
  success: true
};

const paymentInput1 = {
  adminId: 1,
  ssChargeId: 'ch_1JGReaGhNUysQh7YMeiD68bj',
  cardPayment: true,
  cardBrand: 'visa',
  last4: '4242',
  ssRefundId: null,
  orderId: 1,
  amount: 25.03,
  success: true
};

const paymentInput2 = {
  adminId: 1,
  ssChargeId: 'ch_1JGReaGhNUysQh7YMeiD68bj',
  cardPayment: true,
  cardBrand: 'visa',
  last4: '4242',
  ssRefundId: null,
  orderId: 1,
  amount: 25.0,
  success: true
};

const getOrderExtras = {
  orderBy: 'lastName_ASC',
  limit: 25,
  offset: 1
};

const getOrder1 = {
  title: 'get orders with no filter',
  input: {
    venueId: 1,
    extras: {
      checkInOnly: false,
      checkOutOnly: false,
      filterBy: {},
      ...getOrderExtras
    }
  },
  output: {
    count: 2
  }
};

const getOrder2 = {
  title: 'get orders with filters',
  input: {
    venueId: 1,
    extras: {
      checkInOnly: true,
      checkOutOnly: true,
      filterBy: {
        stallName: 'Stall 1',
        event: '1',
        allSpacesAssigned: true,
        spacesNeedAssignment: true
      },
      ...getOrderExtras
    }
  },
  output: {
    count: 1
  }
};

const updateOrder1 = {
  title: 'update to change stall assignments and checkout date and update stall quantity',
  input: {
    orderId: '',
    reservations: [
      {
        reservationId: '',
        type: 'updateDates',
        startDate: '2020-11-04',
        endDate: '2020-11-05'
      },
      { reservationId: '1', type: 'updateQuantity', quantity: '1', startDate: '2021-07-01', endDate: '2021-11-06' }
    ],
    addOns: [],
    refundPayment: false,
    noRefund: {
      notes: 'reduced date and set assignments',
      amount: 10
    },
    assignments: [{ reservationId: '1', spaceId: '1', type: 'add' }]
  }
};

const updateOrder2 = {
  title: 'update regular order with refund',
  input: {
    orderId: '',
    reservations: [
      {
        reservationId: '',
        type: 'updateDates',
        startDate: '2021-07-01',
        endDate: '2021-11-06'
      },
      { reservationId: '1', type: 'updateQuantity', quantity: '1', startDate: '2021-07-01', endDate: '2021-11-06' }
    ],
    addOns: [],
    assignments: [{ reservationId: '1', spaceId: '1', type: 'add' }],
    orderItemsArray: [],
    refundInformation: [
      {
        amount: 10,
        cardBrand: 'visa',
        cardPayment: true,
        last4: '4242',
        notes: 'a refund test',
        orderId: 1,
        ssChargeId: 'ch_1JGReaGhNUysQh7YMeiD68bj',
        success: true,
        userId: 1
      }
    ],
    refundPayment: true,
    noRefund: { notes: null }
  }
};

const updateOrder3 = {
  title: 'update group order with refund',
  input: {
    orderId: '',
    reservations: [
      {
        reservationId: '',
        type: 'updateDates',
        startDate: '2021-07-01',
        endDate: '2021-11-06'
      },
      { reservationId: '1', type: 'updateQuantity', quantity: '1', startDate: '2021-07-01', endDate: '2021-11-06' }
    ],
    addOns: [],
    assignments: [{ reservationId: '1', spaceId: '1', type: 'add' }],
    orderItemsArray: [],
    groupOrderPayment: {
      amount: 5,
      notes: 'a refund test',
      isRefund: true
    },
    refundPayment: true
  }
};

const updateOrder4 = {
  title: 'update (remove stall) order with no refund',
  input: {
    orderId: '',
    refundInformation: [],
    reservations: [
      {
        reservationId: '',
        type: 'updateQuantity',
        quantity: '0',
        startDate: '2021-07-01',
        endDate: '2021-11-06'
      }
    ],
    addOns: [],
    assignments: [],
    orderItemsArray: [],
    noRefund: {
      notes: 'removed stalls',
      amount: 3
    },
    refundPayment: false,
    groupOrderPayment: null
  },
  output: {
    quantity: 0
  }
};

const updateOrder5 = {
  title: 'update order with multiple refunds',
  input: {
    orderId: '',
    adminNotes: '',
    refundInformation: [
      {
        amount: 10,
        cardBrand: 'visa',
        cardPayment: true,
        last4: '4242',
        orderId: 1,
        ssChargeId: 'ch_3KMJZPGhNUysQh7Y1MbS8Vbm',
        notes: 'rthnakjs '
      }
    ],
    refundPayment: true,
    groupOrderPayment: null,
    reservations: [
      {
        reservationId: 1,
        type: 'changeProduct',
        startDate: '2022-01-26',
        endDate: '2022-02-20',
        quantity: 2,
        xProductId: 1,
        xRefTypeId: 1,
        assignments: []
      }
    ],
    productQuestionAnswers: [],
    addOns: [],
    assignments: [],
    orderItemsArray: [
      {
        xProductId: 1,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2022-01-26',
        endDate: '2022-02-22'
      }
    ],
    noRefund: { notes: null }
  }
};

const updateOrder6 = {
  title: 'update group order with different product type',
  input: {
    orderId: '',
    refundInformation: [],
    groupOrderPayment: {
      isRefund: false,
      amount: 0,
      notes: 'some update'
    },
    reservations: [
      {
        reservationId: '',
        type: 'changeProduct',
        xProductId: '2',
        xRefTypeId: 1,
        startDate: '2022-03-01',
        endDate: '2022-03-05'
      }
    ],
    addOns: [],
    assignments: [],
    orderItemsArray: [
      {
        xProductId: '2',
        xRefTypeId: 1,
        quantity: 2,
        startDate: '2022-03-01',
        endDate: '2022-03-05'
      }
    ],
    noRefund: null,
    refundPayment: false
  },

  output: {
    xProductId: 2,
    reservationId: '1'
  }
};

const updateOrder7 = {
  title: 'update reservation dates with invalid date (making the startDate and endDate the same)',
  input: {
    orderId: '',
    refundInformation: [],
    groupOrderPayment: {
      isRefund: false,
      amount: 0,
      notes: 'some update'
    },
    reservations: [
      {
        reservationId: '',
        type: 'updateDates',
        xProductId: '2',
        xRefTypeId: 1,
        startDate: '2022-03-01',
        endDate: '2022-03-01'
      }
    ],
    addOns: [],
    assignments: [],
    orderItemsArray: [
      {
        xProductId: '2',
        xRefTypeId: 1,
        quantity: 2,
        startDate: '2022-03-01',
        endDate: '2022-03-01'
      }
    ],
    noRefund: null,
    refundPayment: false
  },

  output: {
    errorMessage: 'Date selection is not valid'
  }
};

const updateOrder8 = {
  title: 'update reservation dates when check in date is changed (with upcharge), calculate total cost',
  input: {
    orderId: '',
    refundInformation: [],
    groupOrderPayment: null,
    paymentInput: {
      adminId: 1,
      token: 'tok_1Hn8YdGhNUysQh7YEqBcNdGe',
      description: 'payment description',
      saveCard: false,
      selectedCard: null,
      useCard: true
    },
    reservations: [
      {
        reservationId: '',
        type: 'updateDates',
        xProductId: '2',
        xRefTypeId: 1,
        startDate: '2020-12-06',
        endDate: '2020-12-08'
      }
    ],
    addOns: [],
    assignments: [],
    orderItemsArray: [
      {
        xProductId: '2',
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-12-06',
        endDate: '2020-12-08'
      }
    ],
    noRefund: null,
    refundPayment: false
  },
  output: {
    total: 64.47
  }
};

const updateOrder9 = {
  title: 'update reservation date when check in date is extended (to an earlier date), calculate total cost',
  input: {
    orderId: '',
    refundInformation: [],
    groupOrderPayment: null,
    paymentInput: {
      adminId: 1,
      token: 'tok_1Hn8YdGhNUysQh7YEqBcNdGa',
      description: 'payment description',
      saveCard: false,
      selectedCard: null,
      useCard: true
    },
    reservations: [
      {
        reservationId: '',
        type: 'updateDates',
        xProductId: '2',
        xRefTypeId: 1,
        startDate: '2020-12-01',
        endDate: '2020-12-06'
      }
    ],
    addOns: [],
    assignments: [],
    orderItemsArray: [
      {
        xProductId: '2',
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-12-01',
        endDate: '2020-12-06'
      }
    ],
    noRefund: null,
    refundPayment: false
  },
  output: {
    total: 25.03
  }
};

const updateOrder10 = {
  title: 'update order by increasing addon quantity (cash payment) ',
  input: {
    orderId: '',
    refundInformation: [],
    groupOrderPayment: null,
    paymentInput: {
      adminId: 1,
      token: 'tok_1Hn8YdGhNUysQh7YEqBcNdGa',
      description: 'payment description',
      saveCard: false,
      selectedCard: null,
      useCard: false
    },
    reservations: [],
    addOns: [
      {
        type: 'updateQuantity',
        orderItemId: ''
      }
    ],
    assignments: [],
    orderItemsArray: [
      {
        xProductId: 1,
        xRefTypeId: 2,
        quantity: 2
      }
    ],
    noRefund: null,
    refundPayment: false
  },
  output: {
    total: 45
  }
};

const updateOrder11 = {
  title: 'update order by increasing addon quantity and adding a new addon (cash payment) ',
  input: {
    orderId: '',
    refundInformation: [],
    groupOrderPayment: null,
    paymentInput: {
      adminId: 1,
      token: 'tok_1Hn8YdGhNUysQh7YEqBcNdGa',
      description: 'payment description',
      saveCard: false,
      selectedCard: null,
      useCard: false
    },
    reservations: [],
    addOns: [
      {
        type: 'updateQuantity',
        orderItemId: ''
      },
      {
        type: 'add',
        quantity: 2,
        xProductId: 2
      }
    ],
    assignments: [],
    orderItemsArray: [
      {
        xProductId: 1,
        xRefTypeId: 2,
        quantity: 2
      },
      {
        xProductId: 2,
        xRefTypeId: 2,
        quantity: 2
      }
    ],
    noRefund: null,
    refundPayment: false
  },
  output: {
    total: 85
  }
};

const refundInformation = {
  amount: 10,
  cardBrand: 'visa',
  cardPayment: true,
  last4: '4242',
  notes: 'refund test',
  orderId: 1,
  ssChargeId: null,
  success: true,
  userId: 1
};

const orderCheckout1 = {
  title: 'checkout order when pay by card',
  input: {
    userInput: {
      id: 1,
      email: 'filiberto.ullrich0@mailinator.com',
      firstName: 'filiberto',
      lastName: 'ullrich',
      phone: '6788180232',
      venueId: 1
    },
    orderInput: {
      orderItems: [
        {
          assignments: [3],
          xProductId: 1,
          xRefTypeId: 2,
          quantity: 1,
          startDate: '2020-11-10T00:00:00.000Z',
          endDate: '2020-12-01T00:00:00.000Z'
        }
      ],
      eventId: 1,
      notes: '',
      adminNotes: '',
      userId: 1
    },
    paymentInput: {
      adminId: 1,
      token: 'tok_1Hn8YdGhNUysQh7YEqBcNdGe',
      description: 'payment description',
      saveCard: false,
      selectedCard: null,
      useCard: true
    },
    multipaymentInput: null
  }
};

const orderCheckout2 = {
  title: 'fail to checkout order when stall is unavailable',
  input: {
    userInput: {
      id: 1,
      email: 'filiberto.ullrich0@mailinator.com',
      firstName: 'filiberto',
      lastName: 'ullrich',
      phone: '6788180232',
      venueId: 1
    },
    orderInput: {
      orderItems: [
        {
          assignments: [1, 2, 3, 4, 5, 6],
          xProductId: 1,
          xRefTypeId: 1,
          quantity: 6,
          startDate: '2020-11-10T00:00:00.000Z',
          endDate: '2020-11-11T00:00:00.000Z'
        }
      ],
      eventId: 1,
      notes: '',
      adminNotes: '',
      userId: 1
    },
    paymentInput: {
      adminId: 1,
      token: 'tok_1Hn8YdGhNUysQh7YEqBcNdGe',
      description: 'payment description',
      saveCard: false,
      selectedCard: null,
      useCard: true
    }
  },
  output: 'One or more Stall assignment is no longer available.'
};

const orderCheckout3 = {
  title: 'checkout order when deferred to group',
  input: {
    userInput: {
      id: 1,
      email: 'filiberto.ullrich0@mailinator.com',
      firstName: 'filiberto',
      lastName: 'ullrich',
      phone: '6788180232',
      venueId: 1
    },
    orderInput: {
      orderItems: [
        {
          assignments: [],
          xProductId: 1,
          xRefTypeId: 1,
          quantity: 1,
          startDate: '2020-11-10T00:00:00.000Z',
          endDate: '2020-11-11T00:00:00.000Z'
        }
      ],
      eventId: 1,
      notes: '',
      adminNotes: '',
      userId: 1
    },
    groupId: 1
  }
};

const orderCheckout4 = {
  title: 'checkout order when multipayment is selected',
  input: {
    userInput: {
      id: 1,
      email: 'filiberto.ullrich0@mailinator.com',
      firstName: 'filiberto',
      lastName: 'ullrich',
      phone: '6788180232',
      venueId: 1
    },
    orderInput: {
      orderItems: [
        {
          assignments: [3],
          xProductId: 1,
          xRefTypeId: 2,
          quantity: 1,
          startDate: '2020-11-10T00:00:00.000Z',
          endDate: '2020-12-01T00:00:00.000Z'
        }
      ],
      eventId: 1,
      notes: '',
      adminNotes: '',
      userId: 1
    },
    paymentInput: {
      adminId: 1,
      token: 'tok_1Hn8YdGhNUysQh7YEqBcNdGe',
      description: 'payment description',
      saveCard: false,
      selectedCard: null,
      useCard: true
    },
    multipaymentInput: {
      isMultipayment: true,
      totalToCard: '362',
      totalToCash: '100'
    }
  }
};

const orderCheckoutWithProductAnswers = {
  title: 'checkout order when pay by card',
  input: {
    userInput: {
      id: 1,
      email: 'filiberto.ullrich0@mailinator.com',
      firstName: 'filiberto',
      lastName: 'ullrich',
      phone: '6788180232',
      venueId: 1
    },
    orderInput: {
      orderItems: [
        {
          assignments: [],
          xProductId: 1,
          xRefTypeId: 1,
          quantity: 1,
          startDate: '2020-11-10T00:00:00.000Z',
          endDate: '2020-12-01T00:00:00.000Z',
          productQuestionAnswers: [{ questionId: 1, answer: { 1: 'This is my first answer' } }]
        }
      ],
      eventId: 1,
      notes: '',
      adminNotes: '',
      userId: 1
    },
    paymentInput: {
      adminId: 1,
      token: '',
      description: 'payment description',
      saveCard: false,
      selectedCard: null,
      useCard: false
    }
  }
};

const orderCost1 = {
  title: 'calculate order cost for 1 nigtly stall at $19 per night',
  input: {
    useCard: false,
    selectedOrderItems: [
      {
        assignments: [2],
        xProductId: 1,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-12-04T00:00:00.000Z',
        endDate: '2020-12-05T00:00:00.000Z'
      }
    ]
  },
  output: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 1,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-12-04T00:00:00.000Z',
        endDate: '2020-12-05T00:00:00.000Z',
        orderItemCost: 22
      }
    ],
    subtotal: 22,
    stripeFee: 0,
    serviceFee: 5,
    total: 27
  }
};

const orderCost2 = {
  title: 'calculate order cost for 5 nigtly stall at $22 per night',
  input: {
    useCard: false,
    selectedOrderItems: [
      {
        assignments: [1, 2, 3, 4, 5],
        xProductId: 1,
        xRefTypeId: 1,
        quantity: 5,
        startDate: '2020-12-04T00:00:00.000Z',
        endDate: '2020-12-09T00:00:00.000Z'
      }
    ]
  },
  output: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 1,
        xRefTypeId: 1,
        quantity: 5,
        startDate: '2020-12-04T00:00:00.000Z',
        endDate: '2020-12-09T00:00:00.000Z',
        orderItemCost: 550
      }
    ],
    subtotal: 550,
    stripeFee: 0,
    serviceFee: 5,
    total: 555
  }
};

const orderCost3 = {
  title: 'calculate order cost for 5 nigtly stall at $19 per night with invalid date',
  input: {
    useCard: false,
    selectedOrderItems: [
      {
        assignments: [1, 2, 3, 4, 5],
        xProductId: 2,
        xRefTypeId: 1,
        quantity: 5,
        startDate: '2020-11-04T00:00:00.000Z',
        endDate: '2020-11-10T00:00:00.000Z'
      }
    ]
  },
  output: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 2,
        xRefTypeId: 1,
        quantity: 5,
        startDate: '2020-11-04T00:00:00.000Z',
        endDate: '2020-11-09T00:00:00.000Z',
        orderItemCost: 475
      }
    ],
    subtotal: 475,
    stripeFee: 0,
    serviceFee: 5,
    total: 480
  }
};

const orderCost4 = {
  title: 'send back zero cost if no order items',
  input: {
    useCard: false,
    selectedOrderItems: []
  },
  output: { orderItemsCostsWithDetails: [], subtotal: 0, stripeFee: 0, serviceFee: 0, total: 0, discount: 0 }
};
const orderCost5 = {
  title: 'Apply $0 rate for one night resulting to zero dollar order but applying platform fee',
  input: {
    useCard: false,
    selectedOrderItems: [
      {
        assignments: [1],
        xProductId: 2,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-12-04T00:00:00.000Z',
        endDate: '2020-12-05T00:00:00.000Z'
      }
    ]
  },
  output: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 2,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-12-04T00:00:00.000Z',
        endDate: '2020-12-05T00:00:00.000Z',
        orderItemCost: 19
      }
    ],
    subtotal: 0,
    stripeFee: 0,
    serviceFee: 5,
    total: 5
  }
};

const orderCost6 = {
  title: 'Apply $2 discount rate for one night ',
  input: {
    useCard: false,
    selectedOrderItems: [
      {
        assignments: [1],
        xProductId: 3,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-11-04',
        endDate: '2020-11-05'
      }
    ]
  },
  output: {
    orderItemsCostsWithDetails: [
      {
        xProductId: 3,
        xRefTypeId: 1,
        quantity: 1,
        startDate: '2020-11-04',
        endDate: '2020-11-05',
        orderItemCost: 19
      }
    ],
    subtotal: 2,
    stripeFee: 0,
    serviceFee: 5,
    total: 7,
    discount: 17
  }
};

const additionalAddOnCost = {
  existingOrderItems: [
    {
      id: 2739,
      orderId: 998,
      createdAt: '2020-12-01T00:04:02.797Z',
      updatedAt: '2020-12-01T00:04:02.798Z',
      xProductId: 1,
      xRefTypeId: 2,
      price: 20,
      quantity: 2,
      reservation: null
    },
    {
      id: 2740,
      orderId: 998,
      createdAt: '2020-12-01T00:04:02.798Z',
      updatedAt: '2020-12-01T00:04:02.798Z',
      xProductId: 2,
      xRefTypeId: 2,
      price: 20,
      quantity: 2,
      reservation: null
    }
  ],
  newOrderItems: [
    {
      xProductId: '1',
      xRefTypeId: '2',
      quantity: 3
    },
    {
      xProductId: '2',
      xRefTypeId: '2',
      quantity: 3
    }
  ],
  useCard: false
};

const additionalAddOnCharge = {
  orderId: 1,
  userId: 1,
  eventId: 1,
  adminId: null,
  selectedCard: null,
  useCard: false,
  costs: {
    total: 42,
    stripeFee: 0
  }
};

const ssPostUserResponse = {
  json: () => {
    return {
      data: [
        {
          id: 1,
          globalId: 'cWEtYWRtaW5AbWFpbC5jb20='
        }
      ]
    };
  }
};

const ssPostPaymentResponse = {
  json: () => {
    return {
      data: {
        success: true,
        data: {
          chargeId: 'ch_1HnEmZGhNUysQh7Ys3K0s5mx',
          paymentDetails: {
            card: {
              brand: 'visa',
              checks: {
                address_line1_check: null,
                address_postal_code_check: 'pass',
                cvc_check: 'pass'
              },
              country: 'US',
              exp_month: 4,
              exp_year: 2024,
              fingerprint: 'VmwONkbkdAm1MvpU',
              funding: 'credit',
              installments: null,
              last4: 4242,
              network: 'visa',
              three_d_secure: null,
              wallet: null
            },
            type: 'card'
          }
        }
      }
    };
  }
};

const ProductQuestionInput1 = {
  question: 'are you bringing a horse?',
  answerOptions: 'yes',
  questionType: 'singleSelection',
  required: true,
  listOrder: 1,
  eventId: 1,
  venueId: 1,
  productXRefType: 1
};

const ProductQuestionInput2 = {
  question: 'Would you like a mat included?',
  answerOptions: 'No',
  questionType: 'singleSelection',
  required: true,
  listOrder: 1,
  eventId: 1,
  venueId: 1,
  productXRefType: 1
};

const ProductQuestionInputWithoutProduct = {
  question: 'Will you be staying more than three days?',
  answerOptions: 'yes',
  questionType: 'singleSelection',
  required: true,
  listOrder: 1,
  eventId: 1,
  venueId: 1,
  productXRefType: 1
};

const ProductQuestionInputWithTwoProducts = {
  question: 'Does your horse need hay',
  answerOptions: 'yes',
  questionType: 'singleSelection',
  required: true,
  listOrder: 1,
  eventId: 1,
  venueId: 1,
  productXRefType: 1
};

const ProductQuestionAnswerBaseInput = {
  answer: 'yes',
  orderId: 1
};

const eventReportData = [
  {
    data: [
      ['Product', '8/16', '8/17', '8/18', '8/19', '8/20', 'Total qty', 'Unit price', 'Total'],
      ['Barn 10 (Nightly)', 1, 4, 4, 2, 0, 11, 20, 220],
      ['Rv Lot #1 (Nightly)', 1, 3, 3, 2, 0, 9, 20, 180],
      ['Hay and other things', '-', '-', '-', '-', '-', 2, 20, 40],
      ['Shavings and other things', '-', '-', '-', '-', '-', 2, 20, 40],
      ['Mats', '-', '-', '-', '-', '-', 2, 20, 40],
      ['blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'Grand Total'],
      ['blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 520],
      ['divider'],
      ['Products sold', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'Total qty sold'],
      ['Hay and other things', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 2],
      ['Shavings and other things', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 2],
      ['Mats', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 2],
      ['Barn 10', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 4],
      ['Rv Lot #1', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 3],
      ['divider-top']
    ],
    headerLabels: [['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', '', '', '']],
    title: 'OS-1001',
    sheetName: 'OS-1001'
  }
];

const stallReportData = [
  {
    data: [
      ['5555, 555', '08/16/2021 14:53', '(555) 555-5555', '-', '-', '-', '-', '3', '-', '-'],
      ['DACTYL, TERRA', '08/16/2021 15:00', '(512) 555-1212', '2021-08-16', '2021-08-19', 'Barn 11', '117,118,119,120,122', '-', '-', '5'],
      ['ODINSDOTTIR, HELA', '08/16/2021 15:03', '(512) 555-1212', '2021-08-15', '2021-08-17', 'Barn 10', '13', '-', '-', '-'],
      ['GERD, IRMA', '08/19/2021 15:26', '(512) 555-1212', '2021-08-18', '2021-08-19', '-', '-', '-', '-', '-']
    ],
    headerLabels: [
      [
        'Renter name',
        'Trans date & Time',
        'Phone number',
        'Start date',
        'End date',
        'Barn name',
        'Assignment',
        'Hay and other things',
        'Shavings and other things',
        'Mats'
      ]
    ],
    title: 'Weekend II Electric Boogaloo (DEV) ',
    sheetName: 'Weekend II Electric Boogaloo (DEV) '
  }
];

const rvReportData = [
  {
    data: [
      ['CARD, TEST TWO', '12/29/2021 00:02', '(999) 999-9999', '12/28/2021', '12/31/2021', 'Rv Lot #1', 'QRV1, ARV2, CRV3, BRV4, RV8', ''],
      ['DACTYL, TERRA', '12/22/2021 18:15', '(512) 555-1212', '12/21/2021', '12/22/2021', 'Rv Lot #1', 'RV6', ''],
      ['ODINSDOTTIR, HELA', '12/22/2021 18:09', '(512) 555-1212', '12/22/2021', '12/23/2021', 'Rv Lot #1', 'RV5', 'these are special requests ']
    ],
    headerLabels: [['Renter name', 'Trans date & Time', 'Phone number', 'Start date', 'End date', 'RV Lot', 'Assignment', 'Special Requests']],
    title: 'Weekend II Electric Boogaloo (DEV) ',
    sheetName: 'Weekend II Electric Boogaloo (DEV) '
  }
];
const transactionReportData = [
  {
    data: [
      [
        12237,
        '12-14-2021',
        '12-13-2021',
        'Week of Dec 13',
        'hela odinsdottir',
        'card',
        'visa',
        'Reservation change - sdsds',
        1,
        1,
        10.5,
        10.5,
        1,
        1,
        10.5,
        10.5,
        1,
        5.5,
        5.5,
        1,
        4.5,
        4.5,
        '-',
        0,
        3.5,
        34.5,
        5,
        1.49,
        -5
      ], // eslint-disable-line
      [
        12237,
        '12-14-2021',
        '12-13-2021',
        'Week of Dec 13',
        'hela odinsdottir',
        'card',
        'visa',
        '-',
        1,
        1,
        10.5,
        10.5,
        1,
        1,
        10.5,
        10.5,
        1,
        5.5,
        5.5,
        1,
        4.5,
        4.5,
        '-',
        0,
        3.5,
        34.5,
        5,
        1.49,
        41
      ], // eslint-disable-line
      [
        12238,
        '12-14-2021',
        '12-13-2021',
        'Week of Dec 13',
        'hela odinsdottir',
        'card',
        'visa',
        'Add on change - TEST',
        1,
        1,
        10.5,
        10.5,
        '-',
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0.77,
        -16
      ], // eslint-disable-line
      [
        12238,
        '12-14-2021',
        '12-13-2021',
        'Week of Dec 13',
        'hela odinsdottir',
        'card',
        'visa',
        '-',
        1,
        1,
        10.5,
        10.5,
        '-',
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0.77,
        16
      ], // eslint-disable-line
      [
        12239,
        '12-13-2021',
        '12-13-2021',
        'Week of Dec 13',
        'hela odinsdottir',
        'cash/check',
        '-',
        'Assignment change - TEST',
        '-',
        '-',
        0,
        0,
        1,
        1,
        10.5,
        10.5,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        -11
      ], // eslint-disable-line
      [
        12239,
        '12-13-2021',
        '12-13-2021',
        'Week of Dec 13',
        'hela odinsdottir',
        'cash/check',
        '-',
        '-',
        '-',
        '-',
        0,
        0,
        1,
        1,
        10.5,
        10.5,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        16
      ], // eslint-disable-line
      [
        12240,
        '12-13-2021',
        '12-13-2021',
        'Week of Dec 13',
        'terra dactyl',
        'cash/check',
        '-',
        'Add on change - TEST',
        1,
        1,
        10.5,
        10.5,
        '-',
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        -11
      ], // eslint-disable-line
      [
        12240,
        '12-13-2021',
        '12-13-2021',
        'Week of Dec 13',
        'terra dactyl',
        'cash/check',
        '-',
        '-',
        1,
        1,
        10.5,
        10.5,
        '-',
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        16
      ], // eslint-disable-line
      [
        12241,
        '12-13-2021',
        '12-13-2021',
        'Week of Dec 13',
        'terra dactyl',
        'cash/check',
        '-',
        'Add on change - TEST',
        '-',
        '-',
        0,
        0,
        1,
        1,
        10.5,
        10.5,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        -16
      ], // eslint-disable-line
      [
        12241,
        '12-13-2021',
        '12-13-2021',
        'Week of Dec 13',
        'terra dactyl',
        'cash/check',
        '-',
        '-',
        '-',
        '-',
        0,
        0,
        1,
        1,
        10.5,
        10.5,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        16
      ], // eslint-disable-line
      [
        12243,
        '12-14-2021',
        '12-14-2021',
        'Week of Dec 13',
        'terra dactyl',
        'card',
        'visa',
        'Reservation change - TEST',
        1,
        1,
        10.5,
        10.5,
        1,
        1,
        10.5,
        10.5,
        1,
        5.5,
        5.5,
        1,
        4.5,
        4.5,
        1,
        3.5,
        3.5,
        34.5,
        5,
        1.49,
        -41
      ], // eslint-disable-line
      [
        12243,
        '12-14-2021',
        '12-14-2021',
        'Week of Dec 13',
        'terra dactyl',
        'card',
        'visa',
        '-',
        1,
        1,
        10.5,
        10.5,
        1,
        1,
        10.5,
        10.5,
        1,
        5.5,
        5.5,
        1,
        4.5,
        4.5,
        1,
        3.5,
        3.5,
        34.5,
        5,
        1.49,
        41
      ], // eslint-disable-line
      [
        12248,
        '12-14-2021',
        '12-14-2021',
        'Week of Dec 13',
        'hela odinsdottir',
        'cash/check',
        '-',
        '-',
        1,
        1,
        10.5,
        10.5,
        '-',
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        16
      ], // eslint-disable-line
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        'Stall total',
        null,
        null,
        null,
        'RV total',
        null,
        null,
        'Mats total',
        null,
        null,
        'Shavings and other things total',
        null,
        null,
        'Hay and other things total',
        'Sub total',
        null,
        null,
        'Grand Total'
      ], // eslint-disable-line
      ['totalsRow', '', '', '', '', '', '', '', '', '', '', 94.5, '', '', '', 84, '', '', 22, '', '', 18, '', '', 14, 232.5, '', '', 62]
    ],
    headerLabels: [
      'Order ID',
      'Payout date',
      'Trans. date',
      'eventName',
      'Renter name',
      'Trans. type',
      'Card brand',
      'Refund Reason',
      'Stalls',
      'Nights',
      'Unit price',
      'Total price',
      'Spots',
      'Nights',
      'Unit price',
      'Total price',
      'Mats',
      'Unit price',
      'Total price',
      'Shavings and other things',
      'Unit price',
      'Total price',
      'Hay and other things',
      'Unit price',
      'Total price',
      'Sub Total',
      'ROLO fee',
      'Stripe fee',
      'Total'
    ], // eslint-disable-line
    title: 'Week of Dec 13 Transaction Report',
    subTitle:
      'Due to the dates selected, this report may not contain all transactions associated with each event in the report. All deferred payments are pulled at the time of report generation based on their current reservation details. Special Refunds only reflect order subtotal and total.  Itemized product totals have not been updated.',
    sheetName: 'Trans-Week of Dec 13',
    sheetTitle: 'Transaction Report'
  },
  {
    data: [
      [
        12239,
        '12-13-2021',
        'Week of Dec 13',
        'hela odinsdottir',
        'cash/check',
        '-',
        'Assignment change - TEST',
        '-',
        '-',
        0,
        0,
        1,
        1,
        10.5,
        10.5,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        -11
      ], // eslint-disable-line
      [
        12239,
        '12-13-2021',
        'Week of Dec 13',
        'hela odinsdottir',
        'cash/check',
        '-',
        '-',
        '-',
        '-',
        0,
        0,
        1,
        1,
        10.5,
        10.5,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        16
      ], // eslint-disable-line
      [
        12240,
        '12-13-2021',
        'Week of Dec 13',
        'terra dactyl',
        'cash/check',
        '-',
        'Add on change - TEST',
        1,
        1,
        10.5,
        10.5,
        '-',
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        -11
      ], // eslint-disable-line
      [
        12240,
        '12-13-2021',
        'Week of Dec 13',
        'terra dactyl',
        'cash/check',
        '-',
        '-',
        1,
        1,
        10.5,
        10.5,
        '-',
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        16
      ], // eslint-disable-line
      [
        12241,
        '12-13-2021',
        'Week of Dec 13',
        'terra dactyl',
        'cash/check',
        '-',
        'Add on change - TEST',
        '-',
        '-',
        0,
        0,
        1,
        1,
        10.5,
        10.5,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        -16
      ], // eslint-disable-line
      [
        12241,
        '12-13-2021',
        'Week of Dec 13',
        'terra dactyl',
        'cash/check',
        '-',
        '-',
        '-',
        '-',
        0,
        0,
        1,
        1,
        10.5,
        10.5,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        16
      ], // eslint-disable-line
      [
        12248,
        '12-14-2021',
        'Week of Dec 13',
        'hela odinsdottir',
        'cash/check',
        '-',
        '-',
        1,
        1,
        10.5,
        10.5,
        '-',
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        '-',
        0,
        0,
        10.5,
        5,
        0,
        16
      ], // eslint-disable-line
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        'Stall total',
        null,
        null,
        null,
        'RV total',
        null,
        null,
        'Mats total',
        null,
        null,
        'Shavings and other things total',
        null,
        null,
        'Hay and other things total',
        'Sub total',
        null,
        null,
        'Grand Total'
      ], // eslint-disable-line
      ['totalsRow', '', '', '', '', '', '', '', '', '', 31.5, '', '', '', 42, '', '', 0, '', '', 0, '', '', 0, 73.5, '', '', 26]
    ],
    headerLabels: [
      'Order ID',
      'Trans. date',
      'eventName',
      'Renter name',
      'Trans. type',
      'Card brand',
      'Refund Reason',
      'Stalls',
      'Nights',
      'Unit price',
      'Total price',
      'Spots',
      'Nights',
      'Unit price',
      'Total price',
      'Mats',
      'Unit price',
      'Total price',
      'Shavings and other things',
      'Unit price',
      'Total price',
      'Hay and other things',
      'Unit price',
      'Total price',
      'Sub Total',
      'ROLO fee',
      'Stripe fee',
      'Total'
    ], // eslint-disable-line
    title: 'Week of Dec 13 Cash Report',
    subTitle: '* indicates an event with a partial reporting period',
    sheetName: 'Cash-Week of Dec 13',
    sheetTitle: 'Cash Report'
  }
];

module.exports = {
  productDiscount1,
  order1,
  order2,
  order3,
  order4,
  order5,
  order6,
  order7,
  order8,
  cancelOrder1,
  cancelOrder2,
  cancelOrder3,
  paymentInput,
  paymentInput1,
  paymentInput2,
  getOrder1,
  getOrder2,
  updateOrder1,
  updateOrder2,
  updateOrder3,
  updateOrder4,
  updateOrder5,
  updateOrder6,
  updateOrder7,
  updateOrder8,
  updateOrder9,
  updateOrder10,
  updateOrder11,
  refundInformation,
  orderCheckout1,
  orderCheckout2,
  orderCheckout3,
  orderCheckout4,
  orderCheckoutWithProductAnswers,
  orderCost1,
  orderCost2,
  orderCost3,
  orderCost4,
  orderCost5,
  orderCost6,
  additionalAddOnCost,
  additionalAddOnCharge,
  ssPostUserResponse,
  ssPostPaymentResponse,
  eventReportData,
  reportsSample,
  ProductQuestionAnswerBaseInput,
  ProductQuestionInput1,
  ProductQuestionInput2,
  ProductQuestionInputWithoutProduct,
  ProductQuestionInputWithTwoProducts,
  stallReportData,
  rvReportData,
  transactionReportData
};
