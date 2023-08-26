'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('OrderHistory', 'paymentInfo');
    await queryInterface.addColumn('OrderHistory', 'paymentId', {
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OrderHistory', 'paymentInfo', {
      type: Sequelize.JSONB
    });
    await queryInterface.renameColumn('OrderHistory', 'paymentId');
  }
};
