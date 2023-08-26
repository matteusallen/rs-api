'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReservationStatus', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
    await queryInterface.bulkInsert('ReservationStatus', [{ name: 'reserved' }, { name: 'checked in' }, { name: 'departed' }, { name: 'canceled' }]);
    await queryInterface.removeColumn('Reservation', 'status');
    await queryInterface.sequelize.query('DROP TYPE "enum_Reservation_status";');
    return await queryInterface.addColumn('Reservation', 'statusId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ReservationStatus',
        key: 'id'
      },
      allowNull: false,
      defaultValue: 1
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reservation', 'statusId');
    await queryInterface.addColumn('Reservation', 'status', {
      type: Sequelize.ENUM('notAssigned', 'checkedIn', 'checkedOut', 'reserved', 'canceled'),
      defaultValue: 'reserved',
      allowNull: false
    });
    return await queryInterface.dropTable('ReservationStatus');
  }
};
