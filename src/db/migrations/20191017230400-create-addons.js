'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AddOn', {
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
        type: Sequelize.STRING,
        allowNull: false
      },
      priceType: {
        type: Sequelize.ENUM('perUnit', 'total'),
        defaultValue: 'perUnit',
        allowNull: false
      },
      unitName: {
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
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
    await queryInterface.createTable('EventAddOn', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Event',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      addOnId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'AddOn',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      price: {
        type: Sequelize.DECIMAL,
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
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
    await queryInterface.createTable('ReservationAddOn', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      reservationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Reservation',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      addOnId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'AddOn',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
    return await queryInterface.removeColumn('Reservation', 'bagsOfShavings');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EventAddOn');
    await queryInterface.dropTable('ReservationAddOn');
    await queryInterface.dropTable('AddOn');
    return await queryInterface.addColumn('Reservation', 'bagsOfShavings', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  }
};
