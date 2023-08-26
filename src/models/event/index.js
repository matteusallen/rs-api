import moment from 'moment';

import { bindModelMethods } from 'Utils';
import methods from './methods';

const Event = (sequelize, Sequelize) => {
  const Event = sequelize.define(
    'Event',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      venueAgreementDocumentId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      venueMapDocumentId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          isAfterStartDate(value) {
            if (moment(this.dataValues.startDate).isAfter(value)) {
              throw new Error('End date must be after start date.');
            }
          }
        }
      },
      openDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      closeDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isAfterOpenDate(value) {
            if (moment(this.dataValues.openDate).isAfter(value)) {
              throw new Error('Close date must be after open date.');
            }
          }
        }
      },
      checkInTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      checkOutTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: null
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: null
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null
      },
      stallFlip: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      rvFlip: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      isGroupCodeRequired: {
        type: Sequelize.BOOLEAN,
        defaultValue: null,
        allowNull: true
      }
    },
    {
      freezeTableName: true,
      tableName: 'Event',
      paranoid: true
    }
  );

  Event.associate = models => {
    Event.belongsTo(models.Venue, {
      foreignKey: 'venueId',
      as: 'venue'
    });
    Event.hasMany(models.AddOnProduct, {
      foreignKey: 'eventId',
      as: 'addOnProducts'
    });
    Event.hasMany(models.StallProduct, {
      foreignKey: 'eventId',
      as: 'stallProducts'
    });
    Event.hasMany(models.RVProduct, {
      foreignKey: 'eventId',
      as: 'rvProducts'
    });
    Event.hasMany(models.Order, {
      foreignKey: 'eventId',
      as: 'orders'
    });
    Event.belongsTo(models.Document, {
      foreignKey: 'venueAgreementDocumentId',
      as: 'venueAgreementDocument'
    });
    Event.belongsTo(models.Document, {
      foreignKey: 'venueMapDocumentId',
      as: 'venueMapDocument'
    });
  };

  return bindModelMethods(Event, methods);
};

export default Event;
