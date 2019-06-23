import createReducer from '../reducers/global';

export const noop = (state = {}) => state;

export function injectReducerFactory(store) {
  return function injectReducer(key, reducer) {
    // disable previously injected reducers without removing its keys from state
    Object.keys(store.injectedReducers).forEach((k) => {
      store.injectedReducers[k] = noop; // eslint-disable-line no-param-reassign
    });
    store.injectedReducers[key] = reducer; // eslint-disable-line no-param-reassign
    store.replaceReducer(createReducer(store.injectedReducers));
  };
}

export function ejectAllReducersFactory(store) {
  return function ejectAllReducers() {
    // disable previously injected reducers without removing its keys from state
    Object.keys(store.injectedReducers).forEach((k) => {
      store.injectedReducers[k] = noop; // eslint-disable-line no-param-reassign
    });
    store.replaceReducer(createReducer(store.injectedReducers));
  };
}

export default function getInjectors(store) {
  return {
    injectReducer:    exports.injectReducerFactory(store),
    ejectAllReducers: exports.ejectAllReducersFactory(store),
  };
}
