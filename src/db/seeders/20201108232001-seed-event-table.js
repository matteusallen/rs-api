'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('Event', [
      {
        name: 'Event 1',
        startDate: '2019-03-01T00:00:00.000Z',
        endDate: '2023-03-20T00:00:00.000Z',
        checkInTime: '10:00:00',
        checkOutTime: '08:00:00',
        venueId: 1
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('Event', null, {});
  }
};
