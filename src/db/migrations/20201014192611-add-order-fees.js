'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn('Order', 'platformFee', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async queryInterface => {
    return await queryInterface.removeColumn('Order', 'platformFee');
  }
};
