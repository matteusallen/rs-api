'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('GroupOrder', 'createdAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn('GroupOrder', 'updatedAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('GroupOrder', 'createdAt');
    await queryInterface.removeColumn('GroupOrder', 'updatedAt');
  }
};
