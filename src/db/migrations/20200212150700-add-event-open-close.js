'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Event', 'openDate', {
      type: Sequelize.DATEONLY
    });
    return queryInterface.addColumn('Event', 'closeDate', {
      type: Sequelize.DATEONLY
    });
  },

  down: queryInterface => {
    queryInterface.removeColumn('Event', 'openDate');
    return queryInterface.removeColumn('Event', 'closeDate');
  }
};
