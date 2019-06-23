export function ejectSagaFactory(store) {
  return function ejectSaga(key) {
    if (Reflect.has(store.injectedSagas, key)) {
      const descriptor = store.injectedSagas[key];
      descriptor.task.cancel();
      const sagas = store.injectedSagas;
      delete sagas[key];
    }
  };
}

export function ejectAllSagasFactory(store) {
  return function ejectAllSagas() {
    Object.keys(store.injectedSagas).forEach((key) => {
      const descriptor = store.injectedSagas[key];
      descriptor.task.cancel();
      const sagas = store.injectedSagas;
      delete sagas[key];
    });
  };
}

export function injectSagaFactory(store) {
  const ejector = exports.ejectSagaFactory(store);
  return function injectSaga(key, saga, args) {
    ejector(key);
    /* eslint-disable no-param-reassign */
    store.injectedSagas[key] = {
      saga,
      task: store.runSaga(saga, args),
    };
    /* eslint-enable no-param-reassign */
  };
}

export default function getInjectors(store) {
  return {
    injectSaga:    exports.injectSagaFactory(store),
    ejectSaga:     exports.ejectSagaFactory(store),
    ejectAllSagas: exports.ejectAllSagasFactory(store),
  };
}
