import { takeEvery, put } from 'redux-saga/effects';
import * as cursor from '../cursor';

export function dispatchAction(type, payload) {
  return function* dispatch() {
    yield put({ type, payload });
  };
}

/* eslint-disable quote-props */
export const commandOfSeq = {
  'C-f':      cursor.forwardChar,
  'C-b':      cursor.backwardChar,
  'C-a':      cursor.beginningOfLine,
  'C-e':      cursor.endOfLine,
  'C-n':      dispatchAction('NEXT_CANDIDATE'),
  'C-p':      dispatchAction('PREVIOUS_CANDIDATE'),
  'C-h':      cursor.deleteBackwardChar,
  'C-k':      cursor.killLine,
  up:         dispatchAction('PREVIOUS_CANDIDATE'),
  down:       dispatchAction('NEXT_CANDIDATE'),
  // tab:        dispatchAction('NEXT_CANDIDATE'),
  // 'S-tab':    dispatchAction('PREVIOUS_CANDIDATE'),
  'return':   dispatchAction('ENTER', { actionIndex: 0 }),
  'S-return': dispatchAction('ENTER', { actionIndex: 1 }),
  'tab':      dispatchAction('LIST_ACTIONS'),
  'C-SPC':    dispatchAction('MARK_CANDIDATE'),
  'M-a':      dispatchAction('MARK_ALL_CANDIDATES'),
  'ESC':      dispatchAction('EXIT'),
  'C-g':      dispatchAction('EXIT'),
};

export function* handleKeySequece({ payload }) {
  const command = commandOfSeq[payload];
  if (!command) {
    return;
  }
  yield command();
  if (command === cursor.deleteBackwardChar) {
    yield put({ type: 'QUERY', payload: cursor.activeElementValue() });
  }
}

export function* watchKeySequence() {
  yield takeEvery('KEY_SEQUENCE', handleKeySequece);
}

export function init({ enabledCJKMove }) {
  if (enabledCJKMove) {
    commandOfSeq['C-j'] = dispatchAction('NEXT_CANDIDATE');
    commandOfSeq['C-k'] = dispatchAction('PREVIOUS_CANDIDATE');
  }
}
