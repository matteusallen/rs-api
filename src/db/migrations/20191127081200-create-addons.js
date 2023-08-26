'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Reservation', 'stallQuantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Reservation', 'stallQuantity');
  }
};
