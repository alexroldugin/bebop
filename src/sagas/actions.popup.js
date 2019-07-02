import {
  fork,
  takeEvery,
  call,
  all,
} from 'redux-saga/effects';

import history from '../utils/history';
import {
  watchEnter,
} from './common.popup';

export function* goBack() {
  yield call(history.go, -1);
}

export function* watchActions() {
  yield takeEvery('LIST_ACTIONS', goBack);
}

export function* watchExit() {
  yield takeEvery('EXIT', goBack);
}

export default function* root() {
  yield all([
    fork(watchActions),
    fork(watchEnter),
    fork(watchExit),
  ]);
}
