import { bindModelMethods } from 'Utils';
import methods from './methods';

export const ReservationStatus = (sequelize, DataTypes) => {
  const ReservationStatus = sequelize.define(
    'ReservationStatus',
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
      tableName: 'ReservationStatus'
    }
  );

  ReservationStatus.associate = models => {
    ReservationStatus.hasMany(models.Reservation, {
      foreignKey: 'statusId',
      as: 'reservations'
    });
  };

  return bindModelMethods(ReservationStatus, methods);
};

export default ReservationStatus;
