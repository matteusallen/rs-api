'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notification', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      subscription: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      ssUserId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('Notification');
  }
};
