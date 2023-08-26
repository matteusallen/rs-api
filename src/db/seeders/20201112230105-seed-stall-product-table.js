'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('StallProduct', [
      {
        eventId: 1,
        nightly: true,
        startDate: '2020-12-01',
        endDate: '2021-12-15',
        price: 22,
        minNights: 0
      },
      {
        eventId: 1,
        nightly: true,
        startDate: '2020-11-01',
        endDate: '2021-11-15',
        price: 19,
        minNights: 0
      },
      {
        eventId: 1,
        nightly: true,
        startDate: '2020-11-01',
        endDate: '2021-11-15',
        price: 19,
        minNights: 0
      },
      {
        eventId: 1,
        nightly: true,
        startDate: '2020-11-01',
        endDate: '2021-11-15',
        price: 19,
        minNights: 0
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('StallProduct', null, {});
  }
};
