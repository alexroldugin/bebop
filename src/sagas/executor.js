import logger from 'kiroku';
import {
  fork,
  takeEvery,
  call,
  all,
} from 'redux-saga/effects';

import { execute as executeBackgroundAction } from '../actions';

import { sendMessageToActiveContentTab } from '../utils/tabs';

export function* executeAction({ payload: { action, candidates } }) {
  if (!action || candidates.length === 0) {
    return;
  }
  try {
    const payload = { actionId: action.id, candidates };
    const message = { type: 'EXECUTE_ACTION', payload };

    yield call(executeBackgroundAction, action.id, candidates);
    yield call(sendMessageToActiveContentTab, message);
  } catch (e) {
    logger.error(e);
  }
}

function* watchExecuteAction() {
  yield takeEvery('EXECUTE_ACTION', executeAction);
}

export default function* root() {
  yield all([
    fork(watchExecuteAction),
  ]);
}
