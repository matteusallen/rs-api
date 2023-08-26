'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Reservation', 'renterId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Reservation', 'renterId');
  }
};
