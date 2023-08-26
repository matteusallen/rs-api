'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Venue', 'street2', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Venue', 'street2', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
