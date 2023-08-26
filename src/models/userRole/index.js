import { bindModelMethods } from 'Utils';
import methods from './methods';

const UserRole = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      freezeTableName: true,
      tableName: 'UserRole'
    }
  );

  UserRole.associate = models => {
    UserRole.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users'
    });
  };

  return bindModelMethods(UserRole, methods);
};

export default UserRole;
