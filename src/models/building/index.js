import { bindModelMethods } from 'Utils';
import methods from './methods';

const Building = (sequelize, Sequelize) => {
  const Building = sequelize.define(
    'Building',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      venueId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Venue',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    },
    {
      freezeTableName: true,
      tableName: 'Building'
    }
  );

  Building.associate = models => {
    Building.belongsTo(models.Venue, { foreignKey: 'venueId', as: 'venue' });
    Building.hasMany(models.Stall, { foreignKey: 'buildingId', as: 'stalls' });
  };

  return bindModelMethods(Building, methods);
};

export default Building;
