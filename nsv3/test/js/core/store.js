// Tiny shared state. get / set / subscribe. No framework.
export function createStore(initial = {}) {
  let state = { ...initial };
  const subs = new Set();
  return {
    get: (key) => (key ? state[key] : state),
    set(patch) {
      state = { ...state, ...patch };
      subs.forEach((fn) => fn(state, patch));
    },
    subscribe(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}
