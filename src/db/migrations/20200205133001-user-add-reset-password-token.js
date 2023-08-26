'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('User', 'resetPasswordToken', {
      type: Sequelize.STRING
    });
    return queryInterface.addColumn('User', 'resetPasswordTokenExpirationDate', {
      type: Sequelize.STRING
    });
  },

  down: queryInterface => {
    queryInterface.removeColumn('User', 'resetPasswordToken');
    return queryInterface.removeColumn('User', 'resetPasswordTokenExpirationDate');
  }
};
