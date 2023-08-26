'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Payment', 'stripeAccountType', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      defaultValue: 'express'
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Payment', 'stripeAccountType');
  }
};
