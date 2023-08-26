const pipePromise = (...functions) => initialValue => functions.reduce((sum, fn) => Promise.resolve(sum).then(fn), initialValue);

export default pipePromise;
