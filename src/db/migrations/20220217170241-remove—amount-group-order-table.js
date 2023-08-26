'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('GroupOrder', 'amount');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('GroupOrder', 'amount', {
      type: Sequelize.FLOAT
    });
  }
};
