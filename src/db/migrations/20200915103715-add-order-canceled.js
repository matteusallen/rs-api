'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Order', 'canceled', {
      type: Sequelize.DATE,
      defaultValue: null
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Order', 'canceled');
  }
};
