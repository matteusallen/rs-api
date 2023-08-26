'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Stall', 'disabled', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Stall', 'disabled');
  }
};
