async function getStalls() {
  try {
    const { Stall } = this.sequelize.models;
    const stalls = await Stall.findAll();
    return [stalls];
  } catch (error) {
    return [undefined, error];
  }
}

export default getStalls;
