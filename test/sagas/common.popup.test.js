import test from 'ava';
import {
  put,
  takeEvery,
  all,
  fork,
} from 'redux-saga/effects';

import rootSaga, {
  handleExit,
  watchExit,
  handleEnter,
  watchEnter,
} from '../../src/sagas/common.popup';

test('dispatches POPUP_QUIT on EXIT', (t) => {
  const gen = handleExit();
  t.deepEqual(gen.next().value, put({ type: 'POPUP_QUIT' }));
  t.true(gen.next().done);
});

test('watches EXIT', (t) => {
  const gen = watchExit();
  t.deepEqual(gen.next().value, takeEvery('EXIT', handleExit));
  t.true(gen.next().done);
});

test('watches ENTER', (t) => {
  const gen = watchEnter();
  t.deepEqual(gen.next().value, takeEvery('ENTER', handleEnter));
  t.true(gen.next().done);
});

test('dispatches RETURN and POPUP_QUIT on ENTER', (t) => {
  const payload = 'some data';
  const gen = handleEnter({ payload });
  t.deepEqual(gen.next().value, put({ type: 'RETURN', payload }));
  t.deepEqual(gen.next().value, put({ type: 'POPUP_QUIT' }));
  t.true(gen.next().done);
});

test('by default exports all sagas in parallel', (t) => {
  const gen = rootSaga();
  t.deepEqual(gen.next().value, all([
    fork(watchEnter),
    fork(watchExit),
  ]));
  t.true(gen.next().done);
});
