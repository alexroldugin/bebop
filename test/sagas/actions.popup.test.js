import test from 'ava';
import {
  takeEvery,
  all,
  fork,
  call,
} from 'redux-saga/effects';

import history from '../../src/utils/history';

import {
  watchEnter,
} from '../../src/sagas/common.popup';

import rootSaga, {
  watchActions,
  watchExit,
  goBack,
} from '../../src/sagas/actions.popup';

test('watches for LIST_ACTIONS', (t) => {
  const gen = watchActions();
  t.deepEqual(gen.next().value, takeEvery('LIST_ACTIONS', goBack));
  t.true(gen.next().done);
});

test('watches for EXIT', (t) => {
  const gen = watchExit();
  t.deepEqual(gen.next().value, takeEvery('EXIT', goBack));
  t.true(gen.next().done);
});

test('navigates back with goBack', (t) => {
  const gen = goBack();
  t.deepEqual(gen.next().value, call(history.go, -1));
  t.true(gen.next().done);
});

test('by default exports all sagas in parallel', (t) => {
  const gen = rootSaga();
  t.deepEqual(gen.next().value, all([
    fork(watchActions),
    fork(watchEnter),
    fork(watchExit),
  ]));
  t.true(gen.next().done);
});
