import { bindModelMethods } from 'Utils';
import methods from './methods';

const AddOn = (sequelize, Sequelize) => {
  const AddOn = sequelize.define(
    'AddOn',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      venueId: {
        type: Sequelize.INTEGER,
        references: { model: 'Venue', key: 'id' }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
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
    },
    {
      freezeTableName: true,
      tableName: 'AddOn',
      paranoid: true
    }
  );

  AddOn.associate = models => {
    AddOn.hasMany(models.AddOnProduct, {
      foreignKey: 'addOnId',
      as: 'addOnProducts'
    });
    AddOn.belongsTo(models.Venue, {
      foreignKey: 'venueId',
      as: 'venue'
    });
  };

  return bindModelMethods(AddOn, methods);
};

export default AddOn;
