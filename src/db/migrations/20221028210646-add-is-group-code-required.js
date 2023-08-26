'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Event', 'isGroupCodeRequired', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Event', 'isGroupCodeRequired');
  }
};
