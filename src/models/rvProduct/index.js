import { bindModelMethods } from 'Utils';
import methods from './methods';

const RVProduct = (sequelize, DataTypes) => {
  const RVProduct = sequelize.define(
    'RVProduct',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      eventId: {
        type: DataTypes.INTEGER,
        references: { model: 'Event', key: 'id' },
        allowNull: false
      },
      rvLotId: {
        type: DataTypes.INTEGER,
        references: { model: 'RVLot', key: 'id' },
        allowNull: false
      },
      nightly: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      minNights: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      freezeTableName: true,
      tableName: 'RVProduct'
    }
  );

  RVProduct.associate = models => {
    RVProduct.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: 'event'
    });
    RVProduct.belongsToMany(models.RVSpot, {
      through: 'RVProductRVSpot',
      foreignKey: 'rvProductId',
      as: 'rvSpots'
    });
    RVProduct.belongsToMany(models.ProductQuestion, {
      through: 'ProductQuestionProduct',
      foreignKey: 'rvProductId',
      as: 'rvProductId'
    });
    RVProduct.hasMany(models.Reservation, {
      foreignKey: 'xProductId',
      as: 'reservations'
    });
    RVProduct.belongsTo(models.RVLot, {
      foreignKey: 'rvLotId',
      as: 'rvLot'
    });
  };

  return bindModelMethods(RVProduct, methods);
};

export default RVProduct;
