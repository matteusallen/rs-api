'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('NotificationRequest', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      notificationId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Notification',
          key: 'id'
        }
      },
      requestType: {
        type: Sequelize.ENUM,
        values: ['reconciliation', 'accounting'],
        allowNull: false
      },
      requestData: {
        type: Sequelize.STRING,
        allowNull: false
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
    return queryInterface.dropTable('NotificationRequest');
  }
};
