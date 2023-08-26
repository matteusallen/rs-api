import { get } from 'lodash';

const sortFn = (a, b, direction = 'ASC') => {
  if (direction.toUpperCase() === 'ASC') {
    return a > b ? 1 : b > a ? -1 : 0;
  } else {
    return a > b ? -1 : b > a ? 1 : 0;
  }
};

/**
 * sorts an array of objects or basic values in ascending or descending order
 * @param {Array} items list of items to be sorted
 * @param {string} [attr] optional used if `items` is an array of objects
 * @param {string} direction optional
 * @return {Array} returns the sorted array
 */
export const sortArray = (items, attr = null, direction = 'ASC') => {
  if (!items) {
    return;
  }

  let sortedArray = [...items];
  if (attr) {
    sortedArray.sort((a, b) => sortFn(get(a, attr), get(b, attr), direction));
  } else {
    sortedArray.sort((a, b) => sortFn(a, b, direction));
  }
  return sortedArray;
};
