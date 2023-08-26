import { bindModelMethods } from 'Utils';
import methods from './methods';

const ReservationSpace = (sequelize, DataTypes) => {
  const ReservationSpace = sequelize.define(
    'ReservationSpace',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      reservationId: {
        type: DataTypes.INTEGER,
        references: { model: 'Reservation', key: 'id' },
        allowNull: false
      },
      spaceId: DataTypes.INTEGER,
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
      tableName: 'ReservationSpace'
    }
  );

  ReservationSpace.associate = models => {
    ReservationSpace.belongsTo(models.Reservation, {
      foreignKey: 'reservationId',
      as: 'reservation'
    });
    ReservationSpace.belongsTo(models.Stall, {
      foreignKey: 'spaceId',
      as: 'stall'
    });
    ReservationSpace.belongsTo(models.RVSpot, {
      foreignKey: 'spaceId',
      as: 'rvSpot'
    });
  };

  return bindModelMethods(ReservationSpace, methods);
};

export default ReservationSpace;
