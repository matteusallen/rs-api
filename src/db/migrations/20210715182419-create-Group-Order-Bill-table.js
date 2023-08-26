'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('GroupOrderBill', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Order',
          key: 'id'
        }
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      isRefund: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      note: Sequelize.STRING,
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
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
    return queryInterface.dropTable('GroupOrderBill');
  }
};
