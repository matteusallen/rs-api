import { bindModelMethods } from 'Utils';
import methods from './methods';

const OrderItem = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define(
    'OrderItem',
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
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      xProductId: {
        type: Sequelize.INTEGER
      },
      xRefTypeId: {
        type: Sequelize.INTEGER,
        references: { model: 'ProductXRefType', key: 'id' }
      },
      price: Sequelize.FLOAT,
      quantity: Sequelize.INTEGER
    },
    {
      freezeTableName: true,
      tableName: 'OrderItem'
    }
  );

  OrderItem.associate = models => {
    OrderItem.belongsTo(models.AddOnProduct, {
      foreignKey: 'xProductId',
      as: 'addOnProduct'
    });
    OrderItem.belongsTo(models.Reservation, {
      foreignKey: 'xProductId',
      as: 'reservation'
    });
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });
    OrderItem.belongsTo(models.ProductXRefType, {
      foreignKey: 'xRefTypeId',
      as: 'productXRefType'
    });
  };

  return bindModelMethods(OrderItem, methods);
};

export default OrderItem;
