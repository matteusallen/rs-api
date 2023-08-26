import { bindModelMethods } from 'Utils';
import methods from './methods';

const ProductDiscount = (sequelize, Sequelize) => {
  const ProductDiscount = sequelize.define(
    'ProductDiscount',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      xProductId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      xRefTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      rate: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    },
    {
      tableName: 'ProductDiscount',
      freezeTableName: true
    }
  );
  return bindModelMethods(ProductDiscount, methods);
};

export default ProductDiscount;
