function getOrderByValues(orderString, keys) {
  const [targetProperty, direction] = orderString.split('_');
  keys.sort((a, b) => {
    if (a === targetProperty) return -1;
    if (b === targetProperty) return 1;
    return 0;
  });

  return [keys, direction];
}

export default getOrderByValues;
