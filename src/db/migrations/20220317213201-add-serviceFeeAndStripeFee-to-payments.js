'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn('Payment', 'serviceFee', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      }),
      await queryInterface.addColumn('Payment', 'stripeFee', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      })
    ]);
  },

  down: async queryInterface => {
    return Promise.all([await queryInterface.removeColumn('Payment', 'serviceFee'), await queryInterface.removeColumn('Payment', 'stripeFee')]);
  }
};
