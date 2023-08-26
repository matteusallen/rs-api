'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Order', 'discount', {
      type: Sequelize.FLOAT,
      defaultValue: 0
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Order', 'discount');
  }
};
