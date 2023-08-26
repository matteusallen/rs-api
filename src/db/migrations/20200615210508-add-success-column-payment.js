'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn('Payment', 'success', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: async queryInterface => {
    return await queryInterface.removeColumn('Payment', 'success');
  }
};
