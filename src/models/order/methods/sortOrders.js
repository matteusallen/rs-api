function sortOrders(orders, key, direction) {
  const delta = direction === 'DESC' ? 1 : -1;
  return orders.sort((a, b) => {
    if (!a.user || !b.user) return 0;
    if (a.user[key] < b.user[key]) {
      return delta;
    } else if (a.user[key] > b.user[key]) {
      return delta * -1;
    } else {
      return 0;
    }
  });
}

export default sortOrders;
