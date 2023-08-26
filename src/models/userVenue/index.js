import { bindModelMethods } from 'Utils';
import methods from './methods';

const UserVenue = (sequelize, Sequelize) => {
  const UserVenue = sequelize.define(
    'UserVenue',
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      venueId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'venue',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    },
    {
      freezeTableName: true,
      tableName: 'UserVenue',
      timestamps: false
    }
  );

  UserVenue.associate = models => {
    UserVenue.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return bindModelMethods(UserVenue, methods);
};

export default UserVenue;
