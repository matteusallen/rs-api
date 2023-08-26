'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.removeColumn('Reservation', 'eventId');
    await queryInterface.removeColumn('Reservation', 'type');
    await queryInterface.sequelize.query('drop type "enum_Reservation_type";');
    await queryInterface.removeColumn('Reservation', 'renterId');
    await queryInterface.removeColumn('Reservation', 'stallQuantity');
    await queryInterface.removeColumn('Reservation', 'notes');

    await queryInterface.removeColumn('Payment', 'reservationId');
    await queryInterface.removeColumn('AddOn', 'priceType');
    await queryInterface.sequelize.query('drop type "enum_AddOn_priceType";');

    await queryInterface.removeColumn('Event', 'pricePerNight');
    await queryInterface.removeColumn('Event', 'pricePerEvent');

    await queryInterface.dropTable('EventStall');
    return queryInterface.dropTable('ReservationAddOn');
  },

  down: async (queryInterface, Sequelize) => {
    // ******************************************************************
    // *** IMPORTANT:  EventStall and ReservationAddOn cannot be fixed
    // ******************************************************************

    await queryInterface.addColumn('Event', 'pricePerEvent', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });
    await queryInterface.addColumn('Event', 'pricePerNight', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });
    await queryInterface.addColumn('AddOn', 'priceType', {
      type: Sequelize.ENUM('perUnit', 'total'),
      defaultValue: 'perUnit',
      allowNull: false
    });
    await queryInterface.addColumn('Payment', 'reservationId', {
      type: Sequelize.INTEGER,
      references: { model: 'Reservation', key: 'id' }
    });
    await queryInterface.addColumn('Reservation', 'notes', {
      type: Sequelize.STRING,
      defaultValue: null
    });
    await queryInterface.addColumn('Reservation', 'stallQuantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Reservation', 'renterId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    });
    await queryInterface.addColumn('Reservation', 'type', {
      type: Sequelize.ENUM('fullEvent', 'nightly'),
      defaultValue: 'nightly',
      allowNull: false
    });
    return queryInterface.addColumn('Reservation', 'eventId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Event',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });
  }
};
