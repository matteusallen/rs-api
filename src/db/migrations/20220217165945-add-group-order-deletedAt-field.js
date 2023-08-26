'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('GroupOrder', 'deletedAt', {
      type: Sequelize.DATE,
      defaultValue: null
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('GroupOrder', 'deletedAt');
  }
};
