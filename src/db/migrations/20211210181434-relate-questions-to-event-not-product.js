'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProductQuestionProduct');
    return await queryInterface.addColumn('ProductQuestion', 'productXRefType', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },

  down: async queryInterface => {
    await queryInterface.createTable('ProductQuestionProduct');
    return await queryInterface.removeColumn('ProductQuestion', 'productXRefType');
  }
};
