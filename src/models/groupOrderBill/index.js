import { bindModelMethods } from 'Utils';
import methods from './methods';

const GroupOrderBill = (sequelize, Sequelize) => {
  const GroupOrderBill = sequelize.define(
    'GroupOrderBill',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Order',
          key: 'id'
        }
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      isRefund: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      note: Sequelize.STRING,
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
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
      tableName: 'GroupOrderBill'
    }
  );
  GroupOrderBill.associate = models => {
    GroupOrderBill.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    }),
      GroupOrderBill.belongsTo(models.User, {
        foreignKey: 'adminId',
        as: 'admin'
      });
  };

  return bindModelMethods(GroupOrderBill, methods);
};

export default GroupOrderBill;
