async function getOrdersByEventId(eventId) {
  try {
    const where = { eventId, canceled: null, successor: null };
    const orders = await this.findAll({ where });
    return [orders, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getOrdersByEventId;
