let m;

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
  const ejector = m.ejectSagaFactory(store);
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
    injectSaga:    m.injectSagaFactory(store),
    ejectSaga:     m.ejectSagaFactory(store),
    ejectAllSagas: m.ejectAllSagasFactory(store),
  };
}

m = {
  injectSagaFactory,
  ejectSagaFactory,
  ejectAllSagasFactory,
};

export const content = m;
