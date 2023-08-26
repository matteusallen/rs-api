import { bindModelMethods } from 'Utils';
import methods from './methods';

const AddOnProduct = (sequelize, DataTypes) => {
  const AddOnProduct = sequelize.define(
    'AddOnProduct',
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
      addOnId: {
        type: DataTypes.INTEGER,
        references: { model: 'AddOn', key: 'id' },
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
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
      tableName: 'AddOnProduct'
    }
  );

  AddOnProduct.associate = models => {
    AddOnProduct.belongsTo(models.AddOn, {
      foreignKey: 'addOnId',
      as: 'addOn'
    });
    AddOnProduct.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: 'event'
    });
    AddOnProduct.hasMany(models.OrderItem, {
      foreignKey: 'xProductId',
      as: 'orderItems'
    });
  };

  return bindModelMethods(AddOnProduct, methods);
};

export default AddOnProduct;
