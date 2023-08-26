'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn('Event', 'stallMinNights', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      await queryInterface.addColumn('Event', 'rvMinNights', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      })
    ]);
  },

  down: async queryInterface => {
    return Promise.all([await queryInterface.removeColumn('Event', 'stallMinNights'), await queryInterface.removeColumn('Event', 'rvMinNights')]);
  }
};
