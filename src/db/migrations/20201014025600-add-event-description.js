'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Event', 'description', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Event', 'description');
  }
};
