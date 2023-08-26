'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn('StallProduct', 'minNights', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      await queryInterface.addColumn('RVProduct', 'minNights', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      })
    ]);
  },

  down: async queryInterface => {
    return Promise.all([await queryInterface.removeColumn('StallProduct', 'minNights'), await queryInterface.removeColumn('RVProduct', 'minNights')]);
  }
};
