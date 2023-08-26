'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('Document', [
      {
        venueId: 1,
        name: 'Venue Agreement',
        description: 'Venue Agreement',
        key: 'docs/default/Generic Venue Agreement.pdf',
        documentType: 1
      },
      {
        venueId: 1,
        name: 'Venue Map',
        description: 'Venue Map',
        key: 'docs/default/Generic Venue Map.pdf',
        documentType: 2
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('DocumentType', null, {});
  }
};
