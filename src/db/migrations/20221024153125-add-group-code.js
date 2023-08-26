'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Group', 'code', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Group', 'code');
  }
};
