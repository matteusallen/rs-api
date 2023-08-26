'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Order', 'isVisited', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Order', 'isVisited');
  }
};
