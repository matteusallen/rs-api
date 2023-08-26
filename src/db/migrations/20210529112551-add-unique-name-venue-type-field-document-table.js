'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn('Document', 'uniqueText', {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isLowercase: true
      }
    });
  },

  down: async queryInterface => {
    return await queryInterface.removeColumn('Document', 'uniqueText');
  }
};
