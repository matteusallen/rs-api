import { bindModelMethods } from 'Utils';
import methods from './methods';

const User = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ssGlobalId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'UserRole',
          key: 'id'
        },
        allowNull: false,
        defaultValue: 3
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastLogin: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      token: Sequelize.STRING,
      tokenExpirationDate: Sequelize.DATE,
      resetPasswordToken: Sequelize.STRING,
      resetPasswordTokenExpirationDate: Sequelize.DATE
    },
    {
      freezeTableName: true,
      tableName: 'User'
    }
  );

  User.associate = models => {
    User.belongsToMany(models.Venue, {
      through: 'UserVenue',
      foreignKey: 'userId',
      as: 'venues'
    });
    User.belongsTo(models.UserRole, {
      foreignKey: 'roleId',
      as: 'role'
    });
    User.hasMany(models.Order, {
      foreignKey: 'userId',
      as: 'orders'
    });
  };

  return bindModelMethods(User, methods);
};

export default User;
