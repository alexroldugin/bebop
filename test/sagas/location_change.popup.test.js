import test from 'ava';
import nisemono from 'nisemono';

import {
  takeEvery,
  call,
} from 'redux-saga/effects';

import { LOCATION_CHANGE } from 'connected-react-router';
import getSagaInjectors from '../../src/utils/saga_injectors';

import {
  handleLocationChangeFactory,
  watchLocationChangeSagaFactory,
  content,
} from '../../src/sagas/location_change.popup';

import homeRootSaga from '../../src/sagas/home.popup';
import actionsRootSaga from '../../src/sagas/actions.popup';
import commonSaga from '../../src/sagas/common.popup';

let store;
let handleLocationChange;
let watchLocationChangeSaga;

function setup() {
  store = {
    injectedSagas: {},
  };
  handleLocationChange = handleLocationChangeFactory(store);
  watchLocationChangeSaga = watchLocationChangeSagaFactory(store);
}

function restore() {
  store = null;
  handleLocationChange = null;
  watchLocationChangeSaga = null;
  content.handleLocationChangeFactory = handleLocationChangeFactory;
}

test.beforeEach(setup);
test.afterEach(restore);

test('handles LOCATION_CHANGE for \'/\' page', (t) => {
  const sagaInjectors = {
    injectSaga:    nisemono.func(),
    ejectAllSagas: nisemono.func(),
    ejectSaga:     nisemono.func(),
  };
  const gen = handleLocationChange({ payload: { location: { pathname: '/' } } });
  t.deepEqual(gen.next().value, call(getSagaInjectors, store));
  t.deepEqual(gen.next(sagaInjectors).value, call(sagaInjectors.ejectAllSagas));

  t.deepEqual(gen.next().value, call(sagaInjectors.injectSaga, '/', homeRootSaga));
  t.true(gen.next().done);
});

test('handles LOCATION_CHANGE for \'/actions\' page', (t) => {
  const sagaInjectors = {
    injectSaga:    nisemono.func(),
    ejectAllSagas: nisemono.func(),
    ejectSaga:     nisemono.func(),
  };
  const gen = handleLocationChange({ payload: { location: { pathname: '/actions' } } });
  t.deepEqual(gen.next().value, call(getSagaInjectors, store));
  t.deepEqual(gen.next(sagaInjectors).value, call(sagaInjectors.ejectAllSagas));

  t.deepEqual(gen.next().value, call(sagaInjectors.injectSaga, '/actions', actionsRootSaga));
  t.true(gen.next().done);
});

test('handles LOCATION_CHANGE for unknown page', (t) => {
  const sagaInjectors = {
    injectSaga:    nisemono.func(),
    ejectAllSagas: nisemono.func(),
    ejectSaga:     nisemono.func(),
  };
  const gen = handleLocationChange({ payload: { location: { pathname: '/some-unknown-page' } } });
  t.deepEqual(gen.next().value, call(getSagaInjectors, store));
  t.deepEqual(gen.next(sagaInjectors).value, call(sagaInjectors.ejectAllSagas));

  t.deepEqual(gen.next().value, call(sagaInjectors.injectSaga, '/some-unknown-page', commonSaga));
  t.true(gen.next().done);
});

test('watches location change', (t) => {
  content.handleLocationChangeFactory = () => handleLocationChange;
  const gen = watchLocationChangeSaga();
  t.deepEqual(gen.next().value, takeEvery(LOCATION_CHANGE, handleLocationChange));
  t.true(gen.next().done);
});
