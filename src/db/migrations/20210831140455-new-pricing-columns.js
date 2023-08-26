'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Venue', 'feePerProduct', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn('Venue', 'percentageFee', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn('Venue', 'feeCap', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn('Venue', 'includeStripeFee', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      })
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('Venue', 'feePerProduct'),
      queryInterface.removeColumn('Venue', 'percentageFee'),
      queryInterface.removeColumn('Venue', 'feeCap'),
      queryInterface.removeColumn('Venue', 'includeStripeFee')
    ]);
  }
};
