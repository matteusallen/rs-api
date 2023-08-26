const pipe = (...functions) => initialValue => functions.reduce((sum, fn) => fn(sum), initialValue);

export default pipe;
