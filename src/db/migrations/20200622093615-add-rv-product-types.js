'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ProductXRefType', [
      { id: 1, name: 'StallProduct' },
      { id: 2, name: 'AddOnProduct' },
      { id: 3, name: 'RVProduct' },
      { id: 4, name: 'Reservation' }
    ]);
    await queryInterface.createTable('RVLot', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
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
      venueId: {
        type: Sequelize.INTEGER,
        references: { model: 'Venue', key: 'id' },
        allowNull: false
      },
      sewer: Sequelize.BOOLEAN,
      water: Sequelize.BOOLEAN,
      power: Sequelize.INTEGER
    });
    await queryInterface.createTable('RVSpot', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
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
      rvLotId: {
        type: Sequelize.INTEGER,
        references: { model: 'RVLot', key: 'id' },
        allowNull: false
      }
    });
    await queryInterface.renameTable('EventAddOn', 'AddOnProduct');
    await queryInterface.createTable('StallProduct', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: { model: 'Event', key: 'id' },
        allowNull: false
      },
      nightly: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      name: Sequelize.STRING,
      description: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
    await queryInterface.createTable('RVProduct', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: { model: 'Event', key: 'id' },
        allowNull: false
      },
      rvLotId: {
        type: Sequelize.INTEGER,
        references: { model: 'RVLot', key: 'id' },
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      name: Sequelize.STRING,
      description: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
    await queryInterface.createTable('RVProductRVSpot', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      rvProductId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'RVProduct',
          key: 'id'
        }
      },
      rvSpotId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'RVSpot',
          key: 'id'
        }
      }
    });

    await queryInterface.renameTable('ReservationStall', 'ReservationSpace');
    await queryInterface.removeConstraint('ReservationSpace', 'ReservationStall_stallId_fkey');

    await queryInterface.removeColumn('ReservationSpace', 'deletedAt');
    await queryInterface.renameColumn('ReservationSpace', 'stallId', 'spaceId');

    await queryInterface.createTable('StallProductStall', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      stallProductId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'StallProduct',
          key: 'id'
        }
      },
      stallId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Stall',
          key: 'id'
        }
      }
    });
    await queryInterface.addColumn('AddOn', 'venueId', {
      type: Sequelize.INTEGER,
      references: { model: 'Venue', key: 'id' }
    });
    await queryInterface.addColumn('Reservation', 'xProductId', {
      type: Sequelize.INTEGER
    });
    return queryInterface.addColumn('Reservation', 'xRefTypeId', {
      type: Sequelize.INTEGER,
      references: { model: 'ProductXRefType', key: 'id' }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('AddOn', 'venueId');
    await queryInterface.removeColumn('Reservation', 'xProductId');
    await queryInterface.removeColumn('Reservation', 'xRefTypeId');

    await queryInterface.renameColumn('ReservationSpace', 'spaceId', 'stallId');
    await queryInterface.renameTable('ReservationSpace', 'ReservationStall');
    await queryInterface.addConstraint('ReservationStall', ['stallId'], {
      type: 'FOREIGN KEY',
      name: 'ReservationStall_stallId_fkey',
      allowNull: false,
      references: {
        table: 'Stall',
        field: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });

    await queryInterface.addColumn('ReservationStall', 'deletedAt', {
      type: Sequelize.DATE,
      defaultValue: null
    });
    await queryInterface.dropTable('StallProductStall');
    await queryInterface.dropTable('RVProductRVSpot');
    await queryInterface.dropTable('RVProduct');
    await queryInterface.dropTable('StallProduct');
    await queryInterface.renameTable('AddOnProduct', 'EventAddOn');

    await queryInterface.dropTable('RVSpot');
    await queryInterface.dropTable('RVLot');

    return queryInterface.bulkDelete('ProductXRefType');
  }
};
