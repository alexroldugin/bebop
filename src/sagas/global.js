import {
  fork,
  all,
} from 'redux-saga/effects';

import popupRootSaga from './popup';
import optionsRootSaga from './options';

export default function* root() {
  yield all([
    fork(popupRootSaga),
    fork(optionsRootSaga),
  ]);
}
