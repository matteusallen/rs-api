'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Venue', 'timeZone', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'America/Chicago'
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Venue', 'timeZone');
  }
};
