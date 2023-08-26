'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Stall', 'status', {
      type: Sequelize.ENUM('dirty', 'occuppied', 'clean'),
      defaultValue: 'clean',
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Stall', 'status');
  }
};
