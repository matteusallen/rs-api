export const OrderHistoryPayments = (sequelize, Sequelize) => {
  const OrderHistoryPayments = sequelize.define(
    'OrderHistoryPayments',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orderHistoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OrderHistory',
          key: 'id'
        }
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isGroupOrder: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
      tableName: 'OrderHistoryPayments',
      timestamps: true
    }
  );

  OrderHistoryPayments.associate = models => {
    OrderHistoryPayments.belongsTo(models.OrderHistory, {
      foreignKey: 'orderHistoryId',
      as: 'orderHistory'
    });
  };

  OrderHistoryPayments.associate = models => {
    OrderHistoryPayments.belongsTo(models.Payment, {
      foreignKey: 'paymentId',
      as: 'payment'
    });
  };

  return OrderHistoryPayments;
};

export default OrderHistoryPayments;
