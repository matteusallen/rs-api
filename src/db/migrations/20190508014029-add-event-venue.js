'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Event', 'venueId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Venue',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Event', 'venueId');
  }
};
