'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.changeColumn('Venue', 'stripeAccount', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.changeColumn('Venue', 'stripeAccount', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    });
  }
};
