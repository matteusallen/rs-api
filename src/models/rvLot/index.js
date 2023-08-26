import { bindModelMethods } from 'Utils';
import methods from './methods';

const RVLot = (sequelize, DataTypes) => {
  const RVLot = sequelize.define(
    'RVLot',
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
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      venueId: {
        type: DataTypes.INTEGER,
        references: { model: 'Venue', key: 'id' },
        allowNull: false
      },
      sewer: DataTypes.BOOLEAN,
      water: DataTypes.BOOLEAN,
      power: DataTypes.STRING
    },
    {
      freezeTableName: true,
      tableName: 'RVLot'
    }
  );

  RVLot.associate = models => {
    RVLot.belongsTo(models.Venue, {
      foreignKey: 'venueId',
      as: 'venue'
    });
    RVLot.hasMany(models.RVSpot, {
      foreignKey: 'rvLotId',
      as: 'rvSpots'
    });
    RVLot.hasMany(models.RVProduct, {
      foreignKey: 'rvLotId',
      as: 'rvProducts'
    });
  };

  return bindModelMethods(RVLot, methods);
};

export default RVLot;
