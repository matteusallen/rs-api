'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.removeColumn('OrderHistory', 'ignorePayment');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OrderHistory', 'ignorePayment', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  }
};
