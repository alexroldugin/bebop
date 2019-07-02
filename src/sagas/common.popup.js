import {
  takeEvery,
  put,
  fork,
  all,
} from 'redux-saga/effects';

export function* handleEnter({ payload }) {
  yield put({ type: 'RETURN', payload });
  yield put({ type: 'POPUP_QUIT' });
}

export function* watchEnter() {
  yield takeEvery('ENTER', handleEnter);
}

export function* handleExit() {
  yield put({ type: 'POPUP_QUIT' });
}

export function* watchExit() {
  yield takeEvery('EXIT', handleExit);
}

export default function* root() {
  yield all([
    fork(watchEnter),
    fork(watchExit),
  ]);
}
