'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('DocumentType', [
      {
        name: 'Venue Agreement'
      },
      {
        name: 'Venue Map'
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('DocumentType', null, {});
  }
};
