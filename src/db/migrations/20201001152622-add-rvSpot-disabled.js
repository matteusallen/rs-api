'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RVSpot', 'disabled', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('RVSpot', 'disabled');
  }
};
