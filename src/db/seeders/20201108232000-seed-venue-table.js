'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('Venue', [
      {
        name: 'Venue 1',
        phone: '+15125211011',
        street: '14005 Research Blvd',
        city: 'Austin',
        state: 'TX',
        zip: 78758,
        description: 'Description goes here',
        timeZone: 'America/Chicago',
        stripeAccount: '123456789',
        platformFee: 5
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('Venue', null, {});
  }
};
