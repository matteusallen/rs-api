'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Venue', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Description goes here.'
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Venue', 'description');
  }
};
