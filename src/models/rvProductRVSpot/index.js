const RVProductRVSpot = (sequelize, Sequelize) => {
  const RVProductRVSpot = sequelize.define(
    'RVProductRVSpot',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      rvProductId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'RVProduct',
          key: 'id'
        }
      },
      rvSpotId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'RVSpot',
          key: 'id'
        }
      }
    },
    {
      freezeTableName: true,
      tableName: 'RVProductRVSpot',
      timestamps: false
    }
  );

  return RVProductRVSpot;
};

export default RVProductRVSpot;
