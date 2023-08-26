import { bindModelMethods } from 'Utils';
import methods from './methods';
import { STRIPE_ACCOUNT_TYPE } from 'Constants';

const Venue = (sequelize, Sequelize) => {
  const Venue = sequelize.define(
    'Venue',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Description goes here.'
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false
      },
      street2: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      zip: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timeZone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'America/Chicago'
      },
      stripeAccount: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      platformFee: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      stripeAccountType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: STRIPE_ACCOUNT_TYPE.express
      },
      feePerProduct: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      percentageFee: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      feeCap: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      includeStripeFee: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      applyPlatformFeeOnZeroDollarOrder: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      freezeTableName: true,
      tableName: 'Venue'
    }
  );

  Venue.associate = models => {
    Venue.belongsToMany(models.User, {
      through: 'UserVenue',
      foreignKey: 'venueId',
      as: 'users'
    });
    Venue.hasMany(models.Building, {
      foreignKey: 'venueId',
      as: 'buildings'
    });
    Venue.hasMany(models.RVLot, {
      foreignKey: 'venueId',
      as: 'rvLots'
    });
    Venue.hasMany(models.AddOn, {
      foreignKey: 'venueId',
      as: 'addOns'
    });
    Venue.hasMany(models.Payout, {
      foreignKey: 'venueId',
      as: 'payouts'
    });
  };

  return bindModelMethods(Venue, methods);
};

export default Venue;
