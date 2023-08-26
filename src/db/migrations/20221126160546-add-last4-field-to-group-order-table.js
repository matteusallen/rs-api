'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('GroupOrder', 'last4', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('GroupOrder', 'last4');
  }
};
