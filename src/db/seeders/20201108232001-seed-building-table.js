'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('Building', [
      {
        name: 'Building 1',
        venueId: 1
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('Building', null, {});
  }
};
