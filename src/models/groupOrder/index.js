import { bindModelMethods } from 'Utils';
import methods from './methods';

const GroupOrder = (sequelize, Sequelize) => {
  const GroupOrder = sequelize.define(
    'GroupOrder',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Group',
          key: 'id'
        }
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Order',
          key: 'id'
        }
      },
      last4: {
        type: Sequelize.STRING,
        allowNull: true,
        min: {
          args: 4,
          msg: 'Can only store last4 of card'
        },
        max: {
          args: 4,
          msg: 'last4 cannot be more than 4 digits'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null
      }
    },
    {
      freezeTableName: true,
      tableName: 'GroupOrder'
    }
  );
  GroupOrder.associate = models => {
    GroupOrder.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group'
    });
    GroupOrder.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });
  };

  return bindModelMethods(GroupOrder, methods);
};

export default GroupOrder;
