'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Venue', 'applyPlatformFeeOnZeroDollarOrder', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Venue', 'applyPlatformFeeOnZeroDollarOrder');
  }
};
