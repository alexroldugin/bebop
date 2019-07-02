import {
  fork,
  takeEvery,
  call,
  all,
  put,
  select,
} from 'redux-saga/effects';

import history from '../utils/history';
import {
  makeSelectCandidatesIndex,
  makeSelectCandidatesItems,
} from '../selectors/home';

import {
  watchExit,
} from './common.popup';

export function* gotoActionsPage() {
  yield call(history.push, '/actions');
}

export function* watchActions() {
  yield takeEvery('LIST_ACTIONS', gotoActionsPage);
}

export function* handleEnter({ payload }) {
  yield put({ type: 'RETURN', payload });

  const index = yield select(makeSelectCandidatesIndex());
  const items = yield select(makeSelectCandidatesItems());
  const candidate = items[index];
  if (candidate && candidate.navigate) {
    yield call(history.push, candidate.navigate);
  } else {
    yield put({ type: 'POPUP_QUIT' });
  }
}

export function* watchEnter() {
  yield takeEvery('ENTER', handleEnter);
}

export default function* root() {
  yield all([
    fork(watchActions),
    fork(watchEnter),
    fork(watchExit),
  ]);
}
