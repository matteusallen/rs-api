const StallProductStall = (sequelize, Sequelize) => {
  const StallProductStall = sequelize.define(
    'StallProductStall',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      stallProductId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'StallProduct',
          key: 'id'
        }
      },
      stallId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Stall',
          key: 'id'
        }
      }
    },
    {
      freezeTableName: true,
      tableName: 'StallProductStall',
      timestamps: false
    }
  );

  return StallProductStall;
};

export default StallProductStall;
