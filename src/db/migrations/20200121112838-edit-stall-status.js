'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Stall', 'status');
    await queryInterface.sequelize.query('DROP TYPE "enum_Stall_status";');
    return await queryInterface.addColumn('Stall', 'status', {
      type: Sequelize.ENUM('dirty', 'occupied', 'clean'),
      defaultValue: 'clean',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Stall', 'status');
    await queryInterface.sequelize.query('DROP TYPE "enum_Stall_status";');
    return await queryInterface.addColumn('Stall', 'status', {
      type: Sequelize.ENUM('dirty', 'occuppied', 'clean'),
      defaultValue: 'clean',
      allowNull: false
    });
  }
};
