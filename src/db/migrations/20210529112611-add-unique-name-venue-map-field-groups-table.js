'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Group', 'uniqueText', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isLowercase: true
      }
    });
  },

  down: async queryInterface => {
    return await queryInterface.removeColumn('Group', 'uniqueText');
  }
};
