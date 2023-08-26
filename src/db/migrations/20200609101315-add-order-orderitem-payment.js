'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Order', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' },
        allowNull: false
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: { model: 'Event', key: 'id' },
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      successor: {
        type: Sequelize.INTEGER
      },
      fee: Sequelize.FLOAT,
      total: Sequelize.FLOAT,
      notes: Sequelize.STRING
    });
    await queryInterface.createTable('ProductXRefType', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING
    });
    await queryInterface.createTable('OrderItem', {
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
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      xProductId: {
        type: Sequelize.INTEGER
      },
      xRefTypeId: {
        type: Sequelize.INTEGER,
        references: { model: 'ProductXRefType', key: 'id' }
      },
      price: Sequelize.FLOAT,
      quantity: Sequelize.INTEGER
    });

    // rename and modify ReservationTransaction to Payment
    await queryInterface.renameTable('ReservationTransaction', 'Payment');
    await queryInterface.addColumn('Payment', 'orderId', {
      type: Sequelize.INTEGER,
      references: { model: 'Order', key: 'id' }
    });
  },
  down: async queryInterface => {
    await queryInterface.renameTable('Payment', 'ReservationTransaction');
    await queryInterface.removeColumn('ReservationTransaction', 'orderId');

    await queryInterface.dropTable('OrderItem');
    await queryInterface.dropTable('ProductXRefType');
    await queryInterface.dropTable('Order');
  }
};
