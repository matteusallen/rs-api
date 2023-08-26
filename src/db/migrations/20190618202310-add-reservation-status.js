'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Reservation', 'status', {
      type: Sequelize.ENUM('notAssigned', 'checkedIn', 'checkedOut', 'reserved', 'canceled'),
      defaultValue: 'notAssigned',
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Reservation', 'status');
  }
};
