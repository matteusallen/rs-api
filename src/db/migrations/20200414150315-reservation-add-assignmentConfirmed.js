'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn('Reservation', 'assignmentConfirmed', {
      type: Sequelize.DATE,
      defaultValue: null
    });
  },
  down: async queryInterface => {
    await queryInterface.removeColumn('Reservation', 'assignmentConfirmed');
  }
};
