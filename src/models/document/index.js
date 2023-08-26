import { bindModelMethods } from 'Utils';
import methods from './methods';

const Document = (sequelize, Sequelize) => {
  const Document = sequelize.define(
    'Document',
    {
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
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
      documentType: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DocumentType',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'User',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      uniqueText: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
          isLowercase: true
        }
      }
    },
    {
      freezeTableName: true,
      tableName: 'Document',
      paranoid: true
    }
  );

  Document.associate = models => {
    Document.belongsTo(models.Venue, {
      foreignKey: 'venueId',
      as: 'venue'
    });

    Document.belongsTo(models.DocumentType, {
      foreignKey: 'documentType',
      as: 'type'
    });

    Document.hasMany(models.Event, {
      foreignKey: 'venueAgreementDocumentId',
      as: 'eventsAgreements'
    });

    Document.hasMany(models.Event, {
      foreignKey: 'venueMapDocumentId',
      as: 'eventsMaps'
    });
  };

  return bindModelMethods(Document, methods);
};

export default Document;
