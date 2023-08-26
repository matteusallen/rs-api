import { bindModelMethods } from 'Utils';
import methods from './methods';

const Reservation = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    'Reservation',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      statusId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ReservationStatus',
          key: 'id'
        },
        allowNull: false,
        defaultValue: 1
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null
      },
      assignmentConfirmed: {
        type: DataTypes.DATE,
        defaultValue: null
      },
      xProductId: {
        type: DataTypes.INTEGER
      },
      xRefTypeId: {
        type: DataTypes.INTEGER,
        references: { model: 'ProductXRefType', key: 'id' }
      }
    },
    {
      freezeTableName: true,
      tableName: 'Reservation',
      paranoid: true
    }
  );

  Reservation.associate = models => {
    Reservation.belongsTo(models.ReservationStatus, {
      foreignKey: 'statusId',
      as: 'status'
    });
    Reservation.hasMany(models.ReservationSpace, {
      foreignKey: 'reservationId',
      as: 'reservationSpaces'
    });
    Reservation.belongsTo(models.ProductXRefType, {
      foreignKey: 'xRefTypeId',
      as: 'xRefType'
    });
    Reservation.hasOne(models.OrderItem, {
      foreignKey: 'xProductId',
      as: 'orderItem'
    });
    Reservation.belongsTo(models.RVProduct, {
      foreignKey: 'xProductId',
      as: 'rvProduct'
    });
    Reservation.belongsTo(models.StallProduct, {
      foreignKey: 'xProductId',
      as: 'stallProduct'
    });
  };

  return bindModelMethods(Reservation, methods);
};

export default Reservation;
