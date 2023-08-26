import { bindModelMethods } from 'Utils';
import methods from './methods';
import { STRIPE_ACCOUNT_TYPE } from 'Constants';

const Payment = (sequelize, Sequelize) => {
  const Payment = sequelize.define(
    'Payment',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: { model: 'Order', key: 'id' }
      },
      adminId: {
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' }
      },
      ssChargeId: {
        type: Sequelize.STRING
      },
      ssRefundId: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.FLOAT
      },
      notes: {
        type: Sequelize.STRING
      },
      cardBrand: {
        type: Sequelize.STRING
      },
      cardPayment: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      last4: {
        type: Sequelize.STRING
      },
      success: {
        type: Sequelize.BOOLEAN
      },
      stripeAccountType: {
        type: Sequelize.STRING,
        defaultValue: STRIPE_ACCOUNT_TYPE.express
      },
      serviceFee: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      stripeFee: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      freezeTableName: true,
      tableName: 'Payment'
    }
  );

  Payment.associate = models => {
    Payment.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });
    Payment.belongsTo(models.User, {
      foreignKey: 'adminId',
      as: 'admin'
    });
    Payment.belongsTo(models.Payout, {
      foreignKey: 'payoutId',
      as: 'payout'
    });
    Payment.hasMany(models.OrderHistoryPayments, {
      foreignKey: 'paymentId',
      as: 'orderHistoryPayments'
    });
  };

  return bindModelMethods(Payment, methods);
};

export default Payment;
