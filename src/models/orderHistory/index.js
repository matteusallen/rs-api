import { bindModelMethods } from 'Utils';
import methods from './methods';
import { ORDER_HISTORY_CHANGE_TYPES } from 'Constants';

export const OrderHistory = (sequelize, Sequelize) => {
  const OrderHistory = sequelize.define(
    'OrderHistory',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: { model: 'Order', key: 'id' },
        allowNull: false
      },
      adminId: {
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' },
        allowNull: false
      },
      changeType: {
        type: Sequelize.ENUM(Object.keys(ORDER_HISTORY_CHANGE_TYPES)),
        allowNull: false
      },
      oldValues: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      newValues: {
        type: Sequelize.JSONB,
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
      tableName: 'OrderHistory'
    }
  );

  OrderHistory.associate = models => {
    OrderHistory.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });
    OrderHistory.hasMany(models.OrderHistoryPayments, {
      foreignKey: 'orderHistoryId',
      as: 'orderHistoryPayments'
    });
  };

  return bindModelMethods(OrderHistory, methods);
};

export default OrderHistory;
