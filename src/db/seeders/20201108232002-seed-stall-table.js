'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('Stall', [
      {
        name: 'Stall 1',
        status: 'clean',
        buildingId: 1,
        disabled: null
      },
      {
        name: 'Stall 2',
        status: 'clean',
        buildingId: 1,
        disabled: null
      },
      {
        name: 'Stall 3',
        status: 'clean',
        buildingId: 1,
        disabled: null
      },
      {
        name: 'Stall 4',
        status: 'clean',
        buildingId: 1,
        disabled: null
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('Stall', null, {});
  }
};
