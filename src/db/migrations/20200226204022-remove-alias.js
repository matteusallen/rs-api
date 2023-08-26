'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.removeColumn('Reservation', 'aliasId');
    return await queryInterface.dropTable('Alias');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Alias', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        unique: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' }
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
    return await queryInterface.addColumn('Reservation', 'aliasId', {
      type: Sequelize.INTEGER,
      references: { model: 'Alias', key: 'id' }
    });
  }
};
