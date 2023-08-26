'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.changeColumn('RVLot', 'power', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.changeColumn('RVLot', 'power', {
      type: Sequelize.INTEGER
    });
  }
};
