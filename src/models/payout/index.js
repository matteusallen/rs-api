import { bindModelMethods } from 'Utils';
import methods from './methods';

const Payout = (sequelize, Sequelize) => {
  const Payout = sequelize.define(
    'Payout',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      stripePayoutId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      venueId: {
        type: Sequelize.INTEGER,
        references: { model: 'Venue', key: 'id' },
        allowNull: false
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      paidDate: {
        type: Sequelize.DATE,
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
      tableName: 'Payout'
    }
  );

  Payout.associate = models => {
    Payout.hasMany(models.Payment, {
      foreignKey: 'payoutId',
      as: 'payments'
    });
    Payout.belongsTo(models.Venue, {
      foreignKey: 'venueId',
      as: 'venue'
    });
  };

  return bindModelMethods(Payout, methods);
};

export default Payout;
