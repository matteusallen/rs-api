'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('ProductDiscount', [
      {
        xProductId: 2,
        xRefTypeId: 1,
        startDate: '2020-10-04',
        endDate: '2020-12-05',
        rate: 0
      },
      {
        xProductId: 3,
        xRefTypeId: 1,
        startDate: '2020-11-04',
        endDate: '2020-11-05',
        rate: 2
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('ProductDiscount', null, {});
  }
};
