'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRole', {
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
    await queryInterface.bulkInsert('UserRole', [{ name: 'venue admin' }, { name: 'operations' }, { name: 'renter' }, { name: 'reservation admin' }]);
    await queryInterface.removeColumn('User', 'role');
    await queryInterface.sequelize.query('DROP TYPE "enum_user_role";');
    return await queryInterface.addColumn('User', 'roleId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'UserRole',
        key: 'id'
      },
      allowNull: false,
      defaultValue: 3
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('User', 'roleId');
    await queryInterface.addColumn('User', 'role', {
      type: Sequelize.ENUM('admin', 'ops', 'renter'),
      defaultValue: 'renter',
      allowNull: false
    });
    return await queryInterface.dropTable('UserRole');
  }
};
