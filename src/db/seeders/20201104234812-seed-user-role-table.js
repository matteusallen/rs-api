'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('UserRole', [
      {
        name: 'venue admin'
      },
      {
        name: 'operations'
      },
      {
        name: 'renter'
      },
      {
        name: 'reservation admin'
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('UserRole', null, {});
  }
};
