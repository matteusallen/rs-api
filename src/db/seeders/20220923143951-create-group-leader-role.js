'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('UserRole', [
      {
        name: 'group leader'
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('UserRole', null, {});
  }
};
