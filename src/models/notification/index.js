import { bindModelMethods } from 'Utils';
import methods from './methods';

const Notification = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      subscription: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      ssGlobalId: {
        type: Sequelize.STRING,
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
    },
    {
      freezeTableName: true,
      tableName: 'Notification'
    }
  );

  Notification.associate = models => {
    Notification.hasMany(models.NotificationRequest, {
      foreignKey: 'notificationId',
      as: 'notificationRequests'
    });
  };

  return bindModelMethods(Notification, methods);
};

export default Notification;
