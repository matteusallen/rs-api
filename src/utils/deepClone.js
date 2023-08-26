const deepClone = o => {
  if (typeof o === 'object' && o !== null) {
    // only clone objects
    if (Array.isArray(o)) {
      // if cloning an array
      return o.map(e => deepClone(e)); // clone each of its elements
    } else {
      return Object.keys(o).reduce(
        // otherwise reduce every key in the object
        (r, k) => ((r[k] = deepClone(o[k])), r),
        {} // and save its cloned value into a new object
      );
    }
  } else return o; // only clone objects
};

export default deepClone;
