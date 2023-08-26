import { bindModelMethods } from 'Utils';
import methods from './methods';

const statusNumValues = {
  dirty: 0,
  occupied: 1,
  clean: 2
};

const Stall = (sequelize, Sequelize) => {
  const Stall = sequelize.define(
    'Stall',
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
      description: Sequelize.STRING,
      disabled: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('dirty', 'occupied', 'clean'),
        defaultValue: 'clean',
        allowNull: false
      },
      statusNum: {
        type: Sequelize.VIRTUAL,
        get() {
          return statusNumValues[this.getDataValue('status')];
        }
      }
    },
    {
      freezeTableName: true,
      tableName: 'Stall'
    }
  );

  Stall.associate = models => {
    Stall.belongsTo(models.Building, {
      foreignKey: 'buildingId',
      as: 'building'
    });
    Stall.hasMany(models.ReservationSpace, {
      foreignKey: 'spaceId',
      as: 'reservationSpaces'
    });
    Stall.belongsToMany(models.StallProduct, {
      through: 'StallProductStall',
      foreignKey: 'stallId',
      as: 'stallProducts'
    });
  };

  return bindModelMethods(Stall, methods);
};

export default Stall;
