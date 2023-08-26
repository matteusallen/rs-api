// @flow
async function setIsVisited(id: string | number): Promise<boolean> {
  try {
    const order = await this.findOne({ where: { id } });

    if (!order) {
      throw new Error('order does not exist!');
    }

    const result = await this.update({ isVisited: true }, { where: { id } });

    return Boolean(result[0]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error(`Unable to update isVisited for orderId ${id}: ${error}`);
  }
}

export default setIsVisited;
