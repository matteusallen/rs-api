'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'ProductQuestionProduct',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        stallProductId: Sequelize.INTEGER,
        rvProductId: Sequelize.INTEGER,
        listOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        questionId: { type: Sequelize.STRING, allowNull: false },
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
        uniqueKeys: {
          StallProduct_unique: {
            fields: ['listOrder', 'stallProductId']
          },
          RVProduct_unique: {
            fields: ['listOrder', 'rvProductId']
          }
        }
      }
    );
  },

  down: queryInterface => {
    return queryInterface.dropTable('ProductQuestionProduct');
  }
};
