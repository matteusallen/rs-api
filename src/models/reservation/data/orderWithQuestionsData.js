export const getOrderWithQuestionsData = () => {
  const ordersData = [
    {
      id: 27248,
      userId: 12656,
      createdAt: '2022-09-27T15:15:43.566Z',
      notes: '',
      productQuestionAnswers: [
        {
          answer: ['rv common question answer'],
          questionId: 129,
          productQuestion: {
            question: 'common question',
            id: 129,
            productXRefType: 3
          }
        },
        {
          answer: ['rv question 1 answer'],
          questionId: 128,
          productQuestion: {
            question: 'rv question 1',
            id: 128,
            productXRefType: 3
          }
        },
        {
          answer: ['Stall common question answer'],
          questionId: 127,
          productQuestion: {
            question: 'common question',
            id: 127,
            productXRefType: 1
          }
        },
        {
          answer: ['Stall question 2 answer'],
          questionId: 126,
          productQuestion: {
            question: 'Stall question 2',
            id: 126,
            productXRefType: 1
          }
        },
        {
          answer: ['Stall question 1 answer'],
          questionId: 125,
          productQuestion: {
            question: 'Stall question 1',
            id: 125,
            productXRefType: 1
          }
        }
      ],
      orderItems: [
        {
          id: 51252,
          xProductId: 31091,
          quantity: 1,
          xRefTypeId: 4,
          addOnProduct: null,
          reservation: {
            endDate: '2022-09-27',
            startDate: '2022-09-26',
            xRefTypeId: 1,
            reservationSpaces: []
          }
        },
        {
          id: 51253,
          xProductId: 31092,
          quantity: 1,
          xRefTypeId: 4,
          addOnProduct: null,
          reservation: {
            endDate: '2022-09-27',
            startDate: '2022-09-26',
            xRefTypeId: 3,
            reservationSpaces: []
          }
        }
      ]
    }
  ];

  const expectedRow = [
    [
      'FONSECA, LEANDRO',
      '09/27/2022 15:15',
      '(713) 545-6465',
      '09/26/2022',
      '09/27/2022',
      1,
      '-',
      '-',
      'rv common question answer',
      'rv question 1 answer',
      '09/26/2022',
      '09/27/2022',
      1,
      '-',
      '-',
      'Stall common question answer',
      'Stall question 2 answer',
      'Stall question 1 answer',
      ''
    ],
    ['divider-top']
  ];

  const expectedColumns = [
    'Renter name',
    'Trans date & Time',
    'Phone number',
    'RV start date',
    'RV end date',
    'RV qty',
    'RV Lot',
    'RV Lot assignment',
    'common question',
    'rv question 1',
    'Stall start date',
    'Stall end date',
    'Stall qty',
    'Stall Barn name',
    'Stall assignment',
    'common question',
    'Stall question 2',
    'Stall question 1',
    'Special Requests'
  ];

  return [ordersData, expectedRow, expectedColumns];
};
