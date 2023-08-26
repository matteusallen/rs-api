'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payout', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      venueId: {
        type: Sequelize.INTEGER,
        references: { model: 'Venue', key: 'id' },
        allowNull: false
      },
      stripePayoutId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      paidDate: {
        type: Sequelize.DATE,
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

    return await queryInterface.addColumn('Payment', 'payoutId', {
      type: Sequelize.INTEGER,
      references: { model: 'Payout', key: 'id' },
      allowNull: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Payment', 'payoutId');
    return await queryInterface.dropTable('Payout');
  }
};
