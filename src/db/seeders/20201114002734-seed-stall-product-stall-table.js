'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('StallProductStall', [
      {
        stallProductId: 1,
        stallId: 1
      },
      {
        stallProductId: 1,
        stallId: 2
      },
      {
        stallProductId: 1,
        stallId: 3
      },
      {
        stallProductId: 1,
        stallId: 4
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('StallProductStall', null, {});
  }
};
