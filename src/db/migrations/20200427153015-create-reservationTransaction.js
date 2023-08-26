'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('ReservationTransaction', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      reservationId: {
        type: Sequelize.INTEGER,
        references: { model: 'Reservation', key: 'id' }
      },
      adminId: {
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' }
      },
      ssChargeId: {
        type: Sequelize.STRING
      },
      ssRefundId: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      amount: {
        type: Sequelize.FLOAT
      },
      notes: {
        type: Sequelize.STRING
      }
    });
  },
  down: async queryInterface => {
    return await queryInterface.dropTable('ReservationTransaction');
  }
};
