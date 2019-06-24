import test from 'ava';
import nisemono from 'nisemono';

import getInjectors, {
  noop,
  injectReducerFactory,
  ejectAllReducersFactory,
  content,
} from '../../src/utils/reducer_injectors';

import * as globalReducers from '../../src/reducers/global';

const createReducer = globalReducers.default;

let store = null;

function setup() {
  store = {
    injectedReducers: {},
    replaceReducer:   nisemono.func(),
  };
}

function restore() {
  store = null;
  globalReducers.default = createReducer;
}

test.beforeEach(setup);
test.afterEach(restore);

test.serial('getInjectors returns injector/ejector', (t) => {
  content.injectReducerFactory = nisemono.func();
  nisemono.expects(content.injectReducerFactory).returns(5);

  content.ejectAllReducersFactory = nisemono.func();
  nisemono.expects(content.ejectAllReducersFactory).returns(12);

  const injectors = getInjectors(store);

  t.deepEqual(injectors, { injectReducer: 5, ejectAllReducers: 12 });

  t.true(content.injectReducerFactory.isCalled);
  t.true(content.ejectAllReducersFactory.isCalled);

  // revert mocking
  content.injectReducerFactory = injectReducerFactory;
  content.ejectAllReducersFactory = ejectAllReducersFactory;
});

test.serial('injects reducer for first time', (t) => {
  const reducersObject = { a: 1, b: 2 };
  globalReducers.default = nisemono.func(); // createReducer
  nisemono.expects(globalReducers.default).returns(reducersObject);

  const injectReducer = injectReducerFactory(store);

  injectReducer('key', 'reducer');
  t.deepEqual(store.injectedReducers, { key: 'reducer' });
  t.is(store.replaceReducer.calls.length, 1);
  t.deepEqual(store.replaceReducer.calls[0].args, [reducersObject]);

  t.pass();
});

test.serial('injects reducer and ejects all other reducers', (t) => {
  const reducersObject = { c: 12, d: 27 };
  globalReducers.default = nisemono.func(); // createReducer
  nisemono.expects(globalReducers.default).returns(reducersObject);

  store.injectedReducers.first = 'first reducer';
  const injectReducer = injectReducerFactory(store);

  injectReducer('second', 'second reducer');
  t.deepEqual(store.injectedReducers, { second: 'second reducer', first: noop });
  t.is(store.replaceReducer.calls.length, 1);
  t.deepEqual(store.replaceReducer.calls[0].args, [reducersObject]);

  t.pass();
});

test.serial('ejects all the reducers', (t) => {
  const reducersObject = { e: 20, f: 57 };
  globalReducers.default = nisemono.func(); // createReducer
  nisemono.expects(globalReducers.default).returns(reducersObject);

  store.injectedReducers.first = 'first reducer';
  store.injectedReducers.second = 'second reducer';
  store.injectedReducers.third = 'third reducer';

  const ejectAllReducers = ejectAllReducersFactory(store);
  ejectAllReducers();

  t.deepEqual(store.injectedReducers, { second: noop, first: noop, third: noop });
  t.is(store.replaceReducer.calls.length, 1);
  t.deepEqual(store.replaceReducer.calls[0].args, [reducersObject]);

  t.pass();
});

test.serial('noop reducer does nothing', (t) => {
  t.deepEqual(noop(), {});
  t.deepEqual(noop({ a: 0, b: 1, c: 55 }), { a: 0, b: 1, c: 55 });
  t.is(noop('a'), 'a');
  t.is(noop('b'), 'b');
});
