import { bindModelMethods } from 'Utils';
import methods from './methods';

const ProductQuestionProduct = (sequelize, Sequelize) => {
  const ProductQuestionProduct = sequelize.define(
    'ProductQuestionProduct',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      stallProductId: { type: Sequelize.INTEGER, references: { model: 'StallProduct', key: 'id' }, allowNull: true },
      rvProductId: { type: Sequelize.INTEGER, references: { model: 'RVProduct', key: 'id' }, allowNull: true },
      listOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      questionId: { type: Sequelize.STRING, references: { model: 'ProductQuestion', key: 'id' }, allowNull: false },
      required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
      tableName: 'ProductQuestionProduct',
      freezeTableName: true,
      hooks: {
        beforeCreate: productQuestion => {
          const { rvProductId, stallProductId } = productQuestion;
          if ((!rvProductId && !stallProductId) || (rvProductId && stallProductId)) {
            throw new Error('You must associate a question to exactly one product');
          }
        }
      }
    }
  );

  return bindModelMethods(ProductQuestionProduct, methods);
};

export default ProductQuestionProduct;
