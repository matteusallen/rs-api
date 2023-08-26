'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Event', 'isGroupCodeRequired', {
      type: Sequelize.BOOLEAN,
      defaultValue: null,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Event', 'isGroupCodeRequired', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
  }
};
