'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('EventStall', 'assignedStalls');
    await queryInterface.addColumn('EventStall', 'assignedStalls', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('EventStall', 'assignedStalls');
    await queryInterface.changeColumn('EventStall', 'assignedStalls', {
      type: new Sequelize.JSONB()
    });
  }
};
