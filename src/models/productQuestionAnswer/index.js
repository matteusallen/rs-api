import { bindModelMethods } from 'Utils';
import methods from './methods';

const ProductQuestionAnswer = (sequelize, Sequelize) => {
  const ProductQuestionAnswer = sequelize.define(
    'ProductQuestionAnswer',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: { model: 'Order', key: 'id' },
        allowNull: false
      },
      questionId: {
        type: Sequelize.INTEGER,
        references: { model: 'ProductQuestion', key: 'id' },
        allowNull: false
      },
      answer: {
        type: Sequelize.JSONB,
        allowNull: false
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
      tableName: 'ProductQuestionAnswer',
      freezeTableName: true
    }
  );

  ProductQuestionAnswer.associate = models => {
    ProductQuestionAnswer.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });

    ProductQuestionAnswer.belongsTo(models.ProductQuestion, {
      foreignKey: 'questionId',
      as: 'productQuestion'
    });
  };

  return bindModelMethods(ProductQuestionAnswer, methods);
};

export default ProductQuestionAnswer;
