import { bindModelMethods } from 'Utils';
import methods from './methods';

const EventQuestions = (sequelize, Sequelize) => {
  const EventQuestions = sequelize.define(
    'EventQuestions',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      eventId: { type: Sequelize.INTEGER, references: { model: 'Event', key: 'id' }, allowNull: false },
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
      },
      minLength: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      maxLength: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    },
    {
      tableName: 'EventQuestions',
      freezeTableName: true
    }
  );

  EventQuestions.associate = models => {
    EventQuestions.belongsTo(models.ProductQuestion, {
      foreignKey: 'questionId',
      as: 'productQuestion'
    });
  };

  return bindModelMethods(EventQuestions, methods);
};

export default EventQuestions;
