import test from 'ava';
import nisemono from 'nisemono';

import * as sagaInjectors from '../../src/utils/saga_injectors';

const {
  injectSagaFactory,
  ejectSagaFactory,
  ejectAllSagasFactory,
} = sagaInjectors;
const getInjectors = sagaInjectors.default;

let store = null;

function setup() {
  store = {
    injectedSagas: {},
    runSaga:       nisemono.func(),
  };
}

function restore() {
  store = null;
}

test.beforeEach(setup);
test.afterEach(restore);

test.serial('getInjectors returns injector/ejector', (t) => {
  sagaInjectors.injectSagaFactory = nisemono.func();
  nisemono.expects(sagaInjectors.injectSagaFactory).returns(7);

  sagaInjectors.ejectSagaFactory = nisemono.func();
  nisemono.expects(sagaInjectors.ejectSagaFactory).returns(54);

  sagaInjectors.ejectAllSagasFactory = nisemono.func();
  nisemono.expects(sagaInjectors.ejectAllSagasFactory).returns(2);

  const injectors = getInjectors(store);

  t.deepEqual(injectors, { injectSaga: 7, ejectSaga: 54, ejectAllSagas: 2 });

  t.true(sagaInjectors.injectSagaFactory.isCalled);
  t.true(sagaInjectors.ejectSagaFactory.isCalled);
  t.true(sagaInjectors.ejectAllSagasFactory.isCalled);

  // revert mocking
  sagaInjectors.injectSagaFactory = injectSagaFactory;
  sagaInjectors.ejectSagaFactory = ejectSagaFactory;
  sagaInjectors.ejectAllSagasFactory = ejectAllSagasFactory;
});

test.serial('injects saga and starts it. stops saga if it exists', (t) => {
  const sagaEjector = nisemono.func();
  nisemono.expects(store.runSaga).returns('saga task');
  sagaInjectors.ejectSagaFactory = nisemono.func();
  nisemono.expects(sagaInjectors.ejectSagaFactory).returns(sagaEjector);

  const injectSaga = injectSagaFactory(store);

  t.is(Object.keys(store.injectedSagas).length, 0);
  injectSaga('key', 'saga generators', ['arg1', 'arg2', 'arg3']);

  t.is(sagaInjectors.ejectSagaFactory.calls.length, 1);
  t.deepEqual(sagaInjectors.ejectSagaFactory.calls[0].args, [store]);

  t.is(sagaEjector.calls.length, 1);
  t.deepEqual(sagaEjector.calls[0].args, ['key']);

  t.is(Object.keys(store.injectedSagas).length, 1);
  t.deepEqual(store.injectedSagas.key, {
    saga: 'saga generators',
    task: 'saga task',
  });
  t.is(store.runSaga.calls.length, 1);
  t.deepEqual(store.runSaga.calls[0].args, ['saga generators', ['arg1', 'arg2', 'arg3']]);
});

test.serial('ejects specific saga and stops it', (t) => {
  const key1SagaCancel = nisemono.func();
  const key2SagaCancel = nisemono.func();
  store.injectedSagas.key1 = {
    saga: 'saga1', task: { cancel: key1SagaCancel },
  };
  store.injectedSagas.key2 = {
    saga: 'saga2', task: { cancel: key2SagaCancel },
  };

  const ejectSaga = ejectSagaFactory(store);
  t.is(Object.keys(store.injectedSagas).length, 2);
  ejectSaga('key1');
  t.is(Object.keys(store.injectedSagas).length, 1);

  t.true(key1SagaCancel.isCalled);
  t.false(key2SagaCancel.isCalled);
});

test.serial('ejects no saga if it absent', (t) => {
  const key1SagaCancel = nisemono.func();
  const key2SagaCancel = nisemono.func();
  store.injectedSagas.key1 = {
    saga: 'saga1', task: { cancel: key1SagaCancel },
  };
  store.injectedSagas.key2 = {
    saga: 'saga2', task: { cancel: key2SagaCancel },
  };

  const ejectSaga = ejectSagaFactory(store);
  t.is(Object.keys(store.injectedSagas).length, 2);
  ejectSaga('abesent_key');
  t.is(Object.keys(store.injectedSagas).length, 2);

  t.false(key1SagaCancel.isCalled);
  t.false(key2SagaCancel.isCalled);
});

test.serial('ejects all sagas and stops it', (t) => {
  const key1SagaCancel = nisemono.func();
  const key2SagaCancel = nisemono.func();
  store.injectedSagas.key1 = {
    saga: 'saga1', task: { cancel: key1SagaCancel },
  };
  store.injectedSagas.key2 = {
    saga: 'saga2', task: { cancel: key2SagaCancel },
  };

  const ejectAllSagas = ejectAllSagasFactory(store);
  t.is(Object.keys(store.injectedSagas).length, 2);
  ejectAllSagas();
  t.is(Object.keys(store.injectedSagas).length, 0);

  t.true(key1SagaCancel.isCalled);
  t.true(key2SagaCancel.isCalled);
});
