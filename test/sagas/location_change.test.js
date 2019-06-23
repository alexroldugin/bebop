import test from 'ava';
import nisemono from 'nisemono';

import { call } from 'redux-saga/effects';

import homeRootReducers from '../../src/reducers/home';
import homeRootSaga from '../../src/sagas/home';
import actionsRootSaga from '../../src/sagas/actions';

import { handleLocationChangeFactory } from '../../src/sagas/location_change';
import getReducerInjectors from '../../src/utils/reducer_injectors';
import getSagaInjectors from '../../src/utils/saga_injectors';

const store = {};
let handleLocationChange = null;

function setup() {
  handleLocationChange = handleLocationChangeFactory(
    store,
  );
}

function restore() {
  handleLocationChange = null;
}

test.beforeEach(setup);
test.afterEach(restore);


test('handles \'/\' location', (t) => {
  const action = { payload: { location: { pathname: '/' } } };
  const gen = handleLocationChange(action);
  const ri = { injectReducer: nisemono.func(), ejectAllReducers: nisemono.func() };
  const si = { injectSaga: nisemono.func(), ejectAllSagas: nisemono.func() };

  t.deepEqual(gen.next().value, call(getReducerInjectors, store));
  t.deepEqual(gen.next(ri).value, call(ri.ejectAllReducers));

  t.deepEqual(gen.next().value, call(getSagaInjectors, store));
  t.deepEqual(gen.next(si).value, call(si.ejectAllSagas));

  const got = gen.next(ri).value;
  const expected = call(ri.injectReducer, 'popup', homeRootReducers());
  t.truthy(got.CALL, 'calls some function');
  t.is(got.CALL.fn, expected.CALL.fn, 'same function as we expected');
  t.deepEqual(got.CALL.args.length, expected.CALL.args.length, 'with same args count');
  t.deepEqual(got.CALL.args[0], expected.CALL.args[0], 'with \'popup\' first argument');

  t.deepEqual(gen.next(si).value, call(si.injectSaga, 'home', homeRootSaga));

  t.true(gen.next().done);
});

test('handles \'/actions\' location', (t) => {
  const action = { payload: { location: { pathname: '/actions' } } };
  const gen = handleLocationChange(action);
  const ri = { injectReducer: nisemono.func(), ejectAllReducers: nisemono.func() };
  const si = { injectSaga: nisemono.func(), ejectAllSagas: nisemono.func() };

  t.deepEqual(gen.next().value, call(getReducerInjectors, store));
  t.deepEqual(gen.next(ri).value, call(ri.ejectAllReducers));

  t.deepEqual(gen.next().value, call(getSagaInjectors, store));
  t.deepEqual(gen.next(si).value, call(si.ejectAllSagas));

  const got = gen.next(ri).value;
  const expected = call(ri.injectReducer, 'actions', homeRootReducers());
  delete got.CALL.args[1];
  delete expected.CALL.args[1];
  t.deepEqual(got, expected);

  t.deepEqual(gen.next(si).value, call(si.injectSaga, 'actions', actionsRootSaga));

  t.true(gen.next().done);
});

test('handles unknown location by ejecting sagas and reducers', (t) => {
  const action = { payload: { location: { pathname: '/unknown' } } };
  const gen = handleLocationChange(action);
  const ri = { injectReducer: nisemono.func(), ejectAllReducers: nisemono.func() };
  const si = { injectSaga: nisemono.func(), ejectAllSagas: nisemono.func() };

  t.deepEqual(gen.next().value, call(getReducerInjectors, store));
  t.deepEqual(gen.next(ri).value, call(ri.ejectAllReducers));

  t.deepEqual(gen.next().value, call(getSagaInjectors, store));
  t.deepEqual(gen.next(si).value, call(si.ejectAllSagas));

  t.true(gen.next().done);
});
