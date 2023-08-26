import { bindModelMethods } from 'Utils';
import methods from './methods';

const ProductXRefType = (sequelize, Sequelize) => {
  const ProductXRefType = sequelize.define(
    'ProductXRefType',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING
    },
    {
      freezeTableName: true,
      tableName: 'ProductXRefType',
      timestamps: false
    }
  );

  ProductXRefType.associate = models => {
    ProductXRefType.hasMany(models.OrderItem, {
      foreignKey: 'xRefTypeId',
      as: 'orderItems'
    });
    ProductXRefType.hasMany(models.Reservation, {
      foreignKey: 'xRefTypeId',
      as: 'reservations'
    });
  };

  return bindModelMethods(ProductXRefType, methods);
};

export default ProductXRefType;
