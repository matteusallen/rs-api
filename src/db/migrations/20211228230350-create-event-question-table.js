'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.describeTable('ProductQuestion').then(async tableDefinition => {
      if (tableDefinition.venueId) {
        return Promise.resolve();
      }

      return queryInterface.addColumn('ProductQuestion', 'venueId', {
        type: Sequelize.INTEGER,
        references: { model: 'Venue', key: 'id' },
        allowNull: false
      });
    });

    return await queryInterface.createTable('EventQuestions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProductQuestion',
          key: 'id',
          allowNull: false
        }
      },
      eventId: { type: Sequelize.INTEGER, references: { model: 'Event', key: 'id' }, allowNull: false },
      required: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      listOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('ProductQuestion', 'venueId');
    return queryInterface.dropTable('EventQuestions');
  }
};
