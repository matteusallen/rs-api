'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('GroupOrder', 'amount', {
      type: Sequelize.DataTypes.FLOAT
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('GroupOrder', 'amount');
  }
};
