'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Order', 'adminNotes', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Order', 'adminNotes');
  }
};
