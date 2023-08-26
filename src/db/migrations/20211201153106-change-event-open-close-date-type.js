'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Event', 'openDate', {
      type: Sequelize.DATE
    });
    return queryInterface.changeColumn('Event', 'closeDate', {
      type: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Event', 'openDate', {
      type: Sequelize.DATEONLY
    });
    return queryInterface.changeColumn('Event', 'closeDate', {
      type: Sequelize.DATEONLY
    });
  }
};
