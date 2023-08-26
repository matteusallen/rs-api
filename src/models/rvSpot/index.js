import { bindModelMethods } from 'Utils';
import methods from './methods';

const RVSpot = (sequelize, DataTypes) => {
  const RVSpot = sequelize.define(
    'RVSpot',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING
      },
      disabled: {
        type: DataTypes.DATE,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      rvLotId: {
        type: DataTypes.INTEGER,
        references: { model: 'RVLot', key: 'id' },
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      tableName: 'RVSpot'
    }
  );

  RVSpot.associate = models => {
    RVSpot.belongsTo(models.RVLot, {
      foreignKey: 'rvLotId',
      as: 'rvLot'
    });
    RVSpot.hasMany(models.ReservationSpace, {
      foreignKey: 'spaceId',
      as: 'reservationSpaces'
    });
    RVSpot.belongsToMany(models.RVProduct, {
      through: 'RVProductRVSpot',
      foreignKey: 'rvSpotId',
      as: 'rvProducts'
    });
  };

  return bindModelMethods(RVSpot, methods);
};

export default RVSpot;
