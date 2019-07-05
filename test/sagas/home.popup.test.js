import test from 'ava';
import {
  put,
  takeEvery,
  all,
  fork,
  call,
} from 'redux-saga/effects';

import history from '../../src/utils/history';

import {
  watchExit,
} from '../../src/sagas/common.popup';

import rootSaga, {
  watchActions,
  watchEnter,
  handleEnter,
  gotoActionsPage,
} from '../../src/sagas/home.popup';

test('watches for LIST_ACTIONS', (t) => {
  const gen = watchActions();
  t.deepEqual(gen.next().value, takeEvery('LIST_ACTIONS', gotoActionsPage));
  t.true(gen.next().done);
});

test('navigates to /actions page on LIST_ACTIONS', (t) => {
  const gen = gotoActionsPage();
  t.deepEqual(gen.next().value, call(history.push, '/actions'));
  t.true(gen.next().done);
});

test('watches for ENTER', (t) => {
  const gen = watchEnter();
  t.deepEqual(gen.next().value, takeEvery('ENTER', handleEnter));
  t.true(gen.next().done);
});

test('navigates to candidate\'s page if specified on ENTER', (t) => {
  const payload = 'some payload data';
  const gen = handleEnter({ payload });

  const index = 1;
  const items = [{ navigate: '/page1' }, { navigate: '/page2' }, { navigate: '/page3' }];
  gen.next(); // select index
  gen.next(index); // select items
  t.deepEqual(gen.next(items).value, call(history.push, items[index].navigate));
  t.true(gen.next().done);
});

test('dispatches POPUP_QUIT if navigate info didn\'t specify on ENTER', (t) => {
  const payload = 'some new payload data';
  const gen = handleEnter({ payload });

  const index = 0;
  const items = [{ candidate: 0 }, { candidate: 1 }, { candidate: 2 }];
  gen.next(); // select index
  gen.next(index); // select items
  t.deepEqual(gen.next(items).value, put({ type: 'RETURN', payload }));
  t.deepEqual(gen.next().value, put({ type: 'POPUP_QUIT' }));
  t.true(gen.next().done);
});

test('dispatches POPUP_QUIT if candidate didn\'t find on ENTER', (t) => {
  const payload = 'some new payload data';
  const gen = handleEnter({ payload });

  const index = 10;
  const items = [];
  gen.next(); // select index
  gen.next(index); // select items
  t.deepEqual(gen.next(items).value, put({ type: 'RETURN', payload }));
  t.deepEqual(gen.next().value, put({ type: 'POPUP_QUIT' }));
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
