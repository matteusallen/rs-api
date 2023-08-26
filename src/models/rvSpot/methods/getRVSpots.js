async function getRVSpots() {
  try {
    const { RVSpot } = this.sequelize.models;
    const rvSpots = await RVSpot.findAll();
    return [rvSpots];
  } catch (error) {
    return [undefined, error];
  }
}

export default getRVSpots;
