import { bindModelMethods } from 'Utils';
import methods from './methods';

const StallProduct = (sequelize, DataTypes) => {
  const StallProduct = sequelize.define(
    'StallProduct',
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
      nightly: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      startDate: {
        type: DataTypes.DATEONLY
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
      tableName: 'StallProduct'
    }
  );

  StallProduct.associate = models => {
    StallProduct.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: 'event'
    });
    StallProduct.belongsToMany(models.Stall, {
      through: 'StallProductStall',
      foreignKey: 'stallProductId',
      as: 'stalls'
    });
    StallProduct.belongsToMany(models.ProductQuestion, {
      through: 'ProductQuestionProduct',
      foreignKey: 'stallProductId',
      as: 'questions'
    });
    StallProduct.hasMany(models.Reservation, {
      foreignKey: 'xProductId',
      as: 'reservations'
    });
  };

  return bindModelMethods(StallProduct, methods);
};

export default StallProduct;
