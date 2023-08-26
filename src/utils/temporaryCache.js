// @flow
// eslint-disable-next-line
type Anything = ?any;
type FnType = () => Promise<Anything>;

// eslint-disable-next-line
const clearCache = (fn: FnType, timeout: number, name: ?string) =>
  new Promise(res => {
    setTimeout(function () {
      // console.log(`clearing the ${name || ''} now!!!`)
      fn();
    }, timeout);
    res(clearTimeout());
  });
// $FlowIgnore
async function temporaryCache(loadFn: FnType, clearFn: FnType, timeout: number, name: ?string): Anything {
  const res = await loadFn();
  clearCache(clearFn, timeout, name);
  return res;
}

export default temporaryCache;
