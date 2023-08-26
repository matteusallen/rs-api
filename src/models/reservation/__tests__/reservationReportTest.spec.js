import { getReservations } from '../methods/reservationReport/reservationBuilder';
import { getOrderWithQuestionsData } from '../data/orderWithQuestionsData';
import { getOrderWithAssignmentsData } from '../data/orderWithAssignmentsData';

const users = [{ id: 12656, firstName: 'Leandro', lastName: 'Fonseca', phone: '7135456465' }];

describe('order with questions', () => {
  const [ordersData, expectedRow, expectedColumns] = getOrderWithQuestionsData();
  const [generatedRow, generatedColumns] = getReservations(ordersData, users);

  it(`should match expected data`, async () => {
    expect(generatedRow).toEqual(expectedRow);
    expect(generatedColumns).toEqual(expectedColumns);
  });
});

describe('order with assignments', () => {
  const [ordersData, expectedRow, expectedColumns] = getOrderWithAssignmentsData();
  const [generatedRow, generatedColumns] = getReservations(ordersData, users);

  it(`should match expected data`, async () => {
    expect(generatedRow).toEqual(expectedRow);
    expect(generatedColumns).toEqual(expectedColumns);
  });
});
