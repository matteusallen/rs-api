'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Group', 'deletedAt', {
      type: Sequelize.DATE,
      defaultValue: null
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Group', 'deletedAt');
  }
};
