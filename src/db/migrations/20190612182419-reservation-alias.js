'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Reservation', 'aliasId', {
      type: Sequelize.INTEGER,
      references: { model: 'Alias', key: 'id' }
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Reservation', 'aliasId');
  }
};
