export const getOrderWithAssignmentsData = () => {
  const ordersData = [
    {
      id: 27283,
      userId: 12656,
      createdAt: '2022-11-08T18:21:24.730Z',
      notes: 'special notes test',
      productQuestionAnswers: [
        {
          answer: ['Rv answer'],
          questionId: 95,
          productQuestion: {
            question: 'RV question 1',
            id: 95,
            productXRefType: 3
          }
        },
        {
          answer: ['testing answer 2'],
          questionId: 94,
          productQuestion: {
            question: 'Stall question 2',
            id: 94,
            productXRefType: 1
          }
        },
        {
          answer: ['testing answer'],
          questionId: 93,
          productQuestion: {
            question: 'Stall question 1',
            id: 93,
            productXRefType: 1
          }
        }
      ],
      orderItems: [
        {
          id: 51317,
          xProductId: 31147,
          quantity: 1,
          xRefTypeId: 4,
          addOnProduct: null,
          reservation: {
            endDate: '2022-11-09',
            startDate: '2022-11-08',
            xRefTypeId: 1,
            reservationSpaces: [
              {
                id: 43398,
                rvSpot: {
                  name: 'W86',
                  rvLot: {
                    name: 'Orange RV Lot'
                  }
                },
                stall: {
                  name: '705',
                  building: {
                    name: 'Barn 7'
                  }
                }
              }
            ]
          }
        },
        {
          id: 51318,
          xProductId: 31148,
          quantity: 2,
          xRefTypeId: 4,
          addOnProduct: null,
          reservation: {
            endDate: '2022-11-11',
            startDate: '2022-11-10',
            xRefTypeId: 3,
            reservationSpaces: [
              {
                id: 43399,
                rvSpot: {
                  name: '7\r',
                  rvLot: {
                    name: 'Red Lot'
                  }
                },
                stall: {
                  name: '1104',
                  building: {
                    name: 'Barn 11'
                  }
                }
              },
              {
                id: 43400,
                rvSpot: {
                  name: '8\r',
                  rvLot: {
                    name: 'Red Lot'
                  }
                },
                stall: {
                  name: '1105',
                  building: {
                    name: 'Barn 11'
                  }
                }
              }
            ]
          }
        }
      ]
    }
  ];

  const expectedRow = [
    [
      'FONSECA, LEANDRO',
      '11/08/2022 18:21',
      '(713) 545-6465',
      '11/10/2022',
      '11/11/2022',
      2,
      'Red Lot',
      '7, 8',
      'Rv answer',
      '11/08/2022',
      '11/09/2022',
      1,
      'Barn 7',
      '705',
      'testing answer 2',
      'testing answer',
      'special notes test'
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
    'RV question 1',
    'Stall start date',
    'Stall end date',
    'Stall qty',
    'Stall Barn name',
    'Stall assignment',
    'Stall question 2',
    'Stall question 1',
    'Special Requests'
  ];

  return [ordersData, expectedRow, expectedColumns];
};
