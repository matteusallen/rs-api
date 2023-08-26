import { bindModelMethods } from 'Utils';
import methods from './methods';

const Group = (sequelize, Sequelize) => {
  const Group = sequelize.define(
    'Group',
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
      contactName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      allowDeferred: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      venueId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null
      },
      uniqueText: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isLowercase: true
        }
      },
      groupLeaderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      }
    },
    {
      freezeTableName: true,
      tableName: 'Group',
      hooks: {
        beforeValidate: group => {
          if (group.dataValues.name)
            //only needed during insert, delete will not have name field
            group.dataValues.uniqueText = `${group.dataValues.name.toLowerCase()}-${group.dataValues.venueId}`;
        }
      }
    }
  );

  Group.associate = models => {
    Group.belongsTo(models.Venue, {
      foreignKey: 'venueId',
      as: 'venue'
    });
    Group.belongsTo(models.User, {
      foreignKey: 'groupLeaderId',
      as: 'groupLeader'
    });
    Group.hasOne(models.GroupOrder, {
      foreignKey: 'groupId',
      as: 'groupOrder'
    });
  };

  return bindModelMethods(Group, methods);
};

export default Group;
