'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OrderHistory', 'noPayment', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('OrderHistory', 'noPayment');
  }
};
