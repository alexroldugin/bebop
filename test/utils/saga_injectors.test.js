import test from 'ava';
import nisemono from 'nisemono';

import getInjectors, {
  injectSagaFactory,
  ejectSagaFactory,
  ejectAllSagasFactory,
  content,
} from '../../src/utils/saga_injectors';

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
  content.injectSagaFactory = nisemono.func();
  nisemono.expects(content.injectSagaFactory).returns(7);

  content.ejectSagaFactory = nisemono.func();
  nisemono.expects(content.ejectSagaFactory).returns(54);

  content.ejectAllSagasFactory = nisemono.func();
  nisemono.expects(content.ejectAllSagasFactory).returns(2);

  const injectors = getInjectors(store);

  t.deepEqual(injectors, { injectSaga: 7, ejectSaga: 54, ejectAllSagas: 2 });

  t.true(content.injectSagaFactory.isCalled);
  t.true(content.ejectSagaFactory.isCalled);
  t.true(content.ejectAllSagasFactory.isCalled);

  // revert mocking
  content.injectSagaFactory = injectSagaFactory;
  content.ejectSagaFactory = ejectSagaFactory;
  content.ejectAllSagasFactory = ejectAllSagasFactory;
});

test.serial('injects saga and starts it. stops saga if it exists', (t) => {
  const sagaEjector = nisemono.func();
  nisemono.expects(store.runSaga).returns('saga task');
  content.ejectSagaFactory = nisemono.func();
  nisemono.expects(content.ejectSagaFactory).returns(sagaEjector);

  const injectSaga = injectSagaFactory(store);

  t.is(Object.keys(store.injectedSagas).length, 0);
  injectSaga('key', 'saga generators', ['arg1', 'arg2', 'arg3']);

  t.is(content.ejectSagaFactory.calls.length, 1);
  t.deepEqual(content.ejectSagaFactory.calls[0].args, [store]);

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
