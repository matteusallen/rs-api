'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ReservationTransaction', 'cardPayment', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    await queryInterface.addColumn('ReservationTransaction', 'cardBrand', {
      type: Sequelize.DataTypes.STRING
    });
    return await queryInterface.addColumn('ReservationTransaction', 'last4', {
      type: Sequelize.DataTypes.STRING
    });
  },
  down: async queryInterface => {
    await queryInterface.removeColumn('ReservationTransaction', 'cardPayment');
    await queryInterface.removeColumn('ReservationTransaction', 'cardBrand');
    return await queryInterface.removeColumn('ReservationTransaction', 'last4');
  }
};
