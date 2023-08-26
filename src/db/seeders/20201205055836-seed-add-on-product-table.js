'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('AddOnProduct', [
      {
        eventId: 1,
        addOnId: 1,
        price: 20
      },
      {
        eventId: 1,
        addOnId: 2,
        price: 20
      },
      {
        eventId: 1,
        addOnId: 3,
        price: 20
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('AddOnProduct', null, {});
  }
};
