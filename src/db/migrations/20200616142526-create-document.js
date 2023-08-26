'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DocumentType', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    await queryInterface.createTable('Document', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      venueId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Venue',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      key: {
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
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null
      },
      venueAgreementDocumentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DocumentType',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'User',
          key: 'id'
        }
      }
    });

    return await queryInterface.addColumn('Event', 'venueAgreementDocumentId', {
      type: Sequelize.DataTypes.INTEGER,
      references: { model: 'Document', key: 'id' },
      allowNull: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Event', 'venueAgreementDocumentId');
    return queryInterface.dropTable('Document').then(() => queryInterface.dropTable('DocumentType'));
  }
};
