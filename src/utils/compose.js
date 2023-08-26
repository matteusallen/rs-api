const compose = (...functions) => initialValue => functions.reduceRight((sum, fn) => Promise.resolve(sum).then(fn), initialValue);

export default compose;
