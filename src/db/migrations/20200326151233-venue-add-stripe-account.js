'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Venue', 'stripeAccount', {
      type: Sequelize.STRING,
      defaultValue: 'add account number',
      allowNull: false
    });
    return queryInterface.addColumn('Venue', 'platformFee', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  },

  down: queryInterface => {
    queryInterface.removeColumn('Venue', 'platformFee');
    return queryInterface.removeColumn('Venue', 'stripeAccount');
  }
};
