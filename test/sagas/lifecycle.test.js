import test from 'ava';
import nisemono from 'nisemono';

import { call, put, take } from 'redux-saga/effects';

import { LOCATION_CHANGE } from 'connected-react-router';

import handleLifeCycleFactory from '../../src/sagas/lifecycle';
import getReducerInjectors from '../../src/utils/reducer_injectors';
import getSagaInjectors from '../../src/utils/saga_injectors';

const store = {};
let handleLifeCycle = null;

function setup() {
  handleLifeCycle = handleLifeCycleFactory(store);
}

function restore() {
  handleLifeCycle = null;
}

test.beforeEach(setup);
test.afterEach(restore);

test('checks popup\'s lifycycle', (t) => {
  const action = { payload: { location: { pathname: '/' } } };
  const gen = handleLifeCycle(action);
  const ri = { injectReducer: nisemono.func(), ejectAllReducers: nisemono.func() };
  const si = { injectSaga: nisemono.func(), ejectAllSagas: nisemono.func() };

  t.deepEqual(gen.next().value, call(getReducerInjectors, store));
  t.deepEqual(gen.next(ri).value, call(getSagaInjectors, store));

  t.deepEqual(gen.next(si).value, take('PAGE_INJECTED'));
  t.deepEqual(gen.next({ payload: '/somepath' }).value, take('PAGE_INJECTED'));
  t.deepEqual(gen.next({ payload: '/actions' }).value, take('PAGE_INJECTED'));

  t.deepEqual(gen.next({ payload: '/' }).value, put({ type: 'QUERY', payload: '' }));
  t.deepEqual(gen.next().value, take('POPUP_CLOSED'));

  t.deepEqual(gen.next().value, call(ri.ejectAllReducers));
  t.deepEqual(gen.next().value, call(si.ejectAllSagas));

  t.deepEqual(gen.next().value, put({
    type:    LOCATION_CHANGE,
    payload: {
      location: { pathname: '/' },
      action:   'POP',
    },
  }));
  t.deepEqual(gen.next().value, take('PAGE_INJECTED'));
  t.deepEqual(gen.next().value, put({ type: 'QUERY', payload: '' }));
  t.deepEqual(gen.next().value, take('CANDIDATES'));

  t.deepEqual(gen.next().value, call(ri.ejectAllReducers));
  t.deepEqual(gen.next().value, call(si.ejectAllSagas));

  t.deepEqual(gen.next(si).value, take('PAGE_INJECTED'));

  t.false(gen.next({ payload: '/page' }).done);
});
