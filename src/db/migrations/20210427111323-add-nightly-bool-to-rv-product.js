'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('RVProduct', 'nightly', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('RVProduct', 'nightly');
  }
};
