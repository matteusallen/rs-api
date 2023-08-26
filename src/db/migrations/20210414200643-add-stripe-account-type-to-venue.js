'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Venue', 'stripeAccountType', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      defaultValue: 'express'
    }),

  down: queryInterface => queryInterface.removeColumn('Venue', 'stripeAccountType')
};
