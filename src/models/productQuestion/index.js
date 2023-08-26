import { bindModelMethods } from 'Utils';
import methods from './methods';

const ProductQuestion = (sequelize, Sequelize) => {
  const ProductQuestion = sequelize.define(
    'ProductQuestion',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      question: { type: Sequelize.STRING, allowNull: false },
      answerOptions: Sequelize.JSONB,
      questionType: { type: Sequelize.STRING, allowNull: false, validate: { isIn: [['openText', 'singleSelection', 'multipleSelection']] } },
      venueId: { type: Sequelize.INTEGER, references: { model: 'Venue', key: 'id' }, allowNull: false },
      productXRefType: { type: Sequelize.INTEGER, references: { model: 'ProductXRefType', key: 'id' }, allowNull: false },
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
      tableName: 'ProductQuestion',
      freezeTableName: true
    }
  );

  ProductQuestion.associate = models => {
    ProductQuestion.hasMany(models.EventQuestions, {
      foreignKey: 'questionId',
      as: 'eventQuestions'
    });
  };

  return bindModelMethods(ProductQuestion, methods);
};

export default ProductQuestion;
