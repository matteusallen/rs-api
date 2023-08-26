'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable(
        'OrderHistory',
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          orderId: {
            type: Sequelize.INTEGER,
            references: { model: 'Order', key: 'id' },
            allowNull: false
          },
          paymentInfo: {
            type: Sequelize.JSONB
          },
          changeType: {
            type: Sequelize.ENUM('reservationChange', 'reservationProductChange', 'addOnChange', 'assignmentChange'),
            allowNull: false
          },
          oldValues: {
            type: Sequelize.JSONB,
            allowNull: false
          },
          newValues: {
            type: Sequelize.JSONB,
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
        },
        {
          freezeTableName: true,
          tableName: 'OrderHistory'
        }
      )
      .then(() =>
        queryInterface.addIndex('OrderHistory', {
          fields: ['orderId'],
          name: 'orderId_index',
          unique: false
        })
      );
  },

  down: queryInterface => {
    return queryInterface.dropTable('OrderHistory');
  }
};
