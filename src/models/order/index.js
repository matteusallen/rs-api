import { bindModelMethods } from 'Utils';
import methods from './methods';

export const Order = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' },
        allowNull: false
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: { model: 'Event', key: 'id' },
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      successor: {
        type: Sequelize.INTEGER
      },
      canceled: {
        type: Sequelize.DATE
      },
      fee: Sequelize.FLOAT,
      total: Sequelize.FLOAT,
      discount: Sequelize.FLOAT,
      adminNotes: Sequelize.STRING,
      notes: Sequelize.STRING,
      platformFee: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      isVisited: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      freezeTableName: true,
      tableName: 'Order'
    }
  );

  Order.associate = models => {
    Order.hasMany(models.Payment, {
      foreignKey: 'orderId',
      as: 'payments'
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems'
    });
    Order.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: 'event'
    });
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Order.hasOne(models.GroupOrder, {
      foreignKey: 'orderId',
      as: 'groupOrder'
    });
    Order.hasMany(models.GroupOrderBill, {
      foreignKey: 'orderId',
      as: 'groupOrderBills'
    });
    Order.hasMany(models.ProductQuestionAnswer, {
      foreignKey: 'orderId',
      as: 'productQuestionAnswers'
    });
    Order.hasMany(models.OrderHistory, {
      foreignKey: 'orderId',
      as: 'orderHistory'
    });
  };

  return bindModelMethods(Order, methods);
};

export default Order;
