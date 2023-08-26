'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Notification', 'ssGlobalId', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.removeColumn('Notification', 'ssUserId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Notification', 'ssUserId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.removeColumn('Notification', 'ssGlobalId');
  }
};
