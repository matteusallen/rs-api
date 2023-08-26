'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OrderHistory', 'adminId', {
      type: Sequelize.INTEGER
    });
  },

  down: async queryInterface => {
    return await queryInterface.removeColumn('OrderHistory', 'adminId');
  }
};
