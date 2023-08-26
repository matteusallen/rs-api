'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn('EventQuestions', 'minLength', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      await queryInterface.addColumn('EventQuestions', 'maxLength', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ]);
  },

  down: async queryInterface => {
    return Promise.all([await queryInterface.removeColumn('EventQuestions', 'minLength'), await queryInterface.removeColumn('EventQuestions', 'maxLength')]);
  }
};
