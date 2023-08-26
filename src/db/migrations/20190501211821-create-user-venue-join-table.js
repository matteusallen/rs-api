'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserVenue', {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      venueId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'venue',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('UserVenue');
  }
};
