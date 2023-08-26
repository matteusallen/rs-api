'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('AddOnProduct', 'disabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('AddOnProduct', 'disabled');
  }
};
