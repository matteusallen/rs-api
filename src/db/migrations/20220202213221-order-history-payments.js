'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OrderHistoryPayments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orderHistoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OrderHistory',
          key: 'id'
        }
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isGroupOrder: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
  },
  down: queryInterface => {
    return queryInterface.dropTable('OrderHistoryPayments');
  }
};
