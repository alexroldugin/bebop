import { delay } from 'redux-saga';
import {
  fork,
  take,
  takeEvery,
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';
import {
  router,
  createHashHistory,
} from 'redux-saga-router';
import {
  getPort,
  createPortChannel,
} from '../utils/port';
import commands from '../commands';
import * as cursor from '../cursor';

const history = createHashHistory();
const portName = `popup-${Date.now()}`;
const port = getPort(portName);

function dispatchAction(type) {
  return function* dispatch() {
    yield put({ type });
  };
}

const debounceDelayMs = 100;

export const commandOfSeq = {
  'C-f':   cursor.forwardChar,
  'C-b':   cursor.backwardChar,
  'C-a':   cursor.beginningOfLine,
  'C-e':   cursor.endOfLine,
  'C-n':   dispatchAction('NEXT_CANDIDATE'),
  'C-p':   dispatchAction('PREVIOUS_CANDIDATE'),
  'C-h':   cursor.deleteBackwardChar,
  up:      dispatchAction('PREVIOUS_CANDIDATE'),
  down:    dispatchAction('NEXT_CANDIDATE'),
  tab:     dispatchAction('NEXT_CANDIDATE'),
  'S-tab': dispatchAction('PREVIOUS_CANDIDATE'),
};

function* dispatchEmptyQuery() {
  yield put({ type: 'QUERY', payload: '' });
}

function post(type, payload) {
  port.postMessage({ type, payload, portName });
}

function passAction(type) {
  return function* watch() {
    yield takeEvery(type, ({ payload }) => post(type, payload));
  };
}

function* watchQuery() {
  yield takeLatest('QUERY', function* searchCandidates({ payload }) {
    yield call(delay, debounceDelayMs);
    const candidates = yield commands.candidates(payload);
    yield put({ type: 'CANDIDATES', payload: candidates });
  });
}

function* watchKeySequence() {
  yield takeEvery('KEY_SEQUENCE', function* handleKeySequece({ payload }) {
    const command = commandOfSeq[payload];
    if (!command) {
      return;
    }
    yield command();
    if (command === cursor.deleteBackwardChar) {
      yield put({ type: 'QUERY', payload: cursor.activeElementValue() });
    }
  });
}

function* watchPort() {
  const portChannel = yield call(createPortChannel, port);

  for (;;) {
    const { type, payload } = yield take(portChannel);
    yield put({ type, payload });
  }
}

/**
 * Currently, we can't focus to an input form after tab changed.
 * So, we just close window.
 * If this restriction is change, we need to flag on.
 */
const canFocusToPopup = false;

function* watchTabChange() {
  yield takeLatest('TAB_CHANGED', function* searchCandidates() {
    if (!canFocusToPopup) {
      window.close();
    } else {
      yield call(delay, debounceDelayMs);
      document.querySelector('.commandInput').focus();
      const query = yield select(state => state.query);
      const candidates = yield commands.candidates(query);
      yield put({ type: 'CANDIDATES', payload: candidates });
    }
  });
}

function* watchClose() {
  yield takeEvery('CLOSE', () => window.close());
}

const routes = {
  '/search': function* putSearch() {
    yield put({ type: 'SEARCH' });
  },
};

function* routerSaga() {
  yield fork(router, history, routes);
}

export default function* root() {
  yield [
    fork(passAction('COMMAND')),
    fork(watchTabChange),
    fork(watchQuery),
    fork(watchKeySequence),
    fork(watchPort),
    fork(watchClose),
    fork(routerSaga),
    fork(dispatchEmptyQuery),
  ];
}
