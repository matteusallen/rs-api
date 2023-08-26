'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('AddOn', [
      {
        name: 'shavings',
        description: 'Bags of shavings for bedding'
      },
      {
        name: 'mats',
        description: 'stall mats'
      },
      {
        name: 'hay',
        description: 'bale of hay'
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('AddOn', null, {});
  }
};
