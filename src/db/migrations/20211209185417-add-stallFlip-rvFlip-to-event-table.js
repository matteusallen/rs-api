'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Event', 'stallFlip', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
    await queryInterface.addColumn('Event', 'rvFlip', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Event', 'stallFlip');
    await queryInterface.removeColumn('Event', 'rvFlip');
  }
};
