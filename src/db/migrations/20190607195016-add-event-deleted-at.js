'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Event', 'deletedAt', {
      type: Sequelize.DATE,
      defaultValue: null
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Event', 'deletedAt');
  }
};
