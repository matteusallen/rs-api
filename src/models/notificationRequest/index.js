import { bindModelMethods } from 'Utils';
import methods from './methods';

const NotificationRequest = (sequelize, Sequelize) => {
  const NotificationRequest = sequelize.define(
    'NotificationRequest',
    {
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
    },
    {
      freezeTableName: true,
      tableName: 'NotificationRequest'
    }
  );

  NotificationRequest.associate = models => {
    NotificationRequest.belongsTo(models.Notification, {
      foreignKey: 'notificationId',
      as: 'notification'
    });
  };

  return bindModelMethods(NotificationRequest, methods);
};

export default NotificationRequest;
