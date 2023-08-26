async function getStallCount(buildingId) {
  const { Stall } = this.sequelize.models;
  return Stall.count({ where: { buildingId } });
}

export default getStallCount;
