'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('EventStall', 'stallId');
    await queryInterface.addColumn('EventStall', 'assignedStalls', {
      type: new Sequelize.JSONB()
    });
    await queryInterface.addColumn('EventStall', 'buildingId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Building',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('EventStall', 'stallId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Stall',
        key: 'id'
      }
    });
    await queryInterface.removeColumn('EventStall', 'assignedStalls');
    await queryInterface.removeColumn('EventStall', 'buildingId');
  }
};
