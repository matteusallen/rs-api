'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Reservation', 'notes', {
      type: Sequelize.STRING,
      defaultValue: null
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Reservation', 'notes');
  }
};
