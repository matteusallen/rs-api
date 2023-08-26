'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('OrderHistory', 'isGroupOrder', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('OrderHistory', 'isGroupOrder');
  }
};
