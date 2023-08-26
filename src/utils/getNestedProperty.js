function getNestedProperty(path, nestedObj, defaultValue = null) {
  const pathArr = path.split('.');
  return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : defaultValue), nestedObj);
}

export default getNestedProperty;
