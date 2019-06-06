import logger from 'kiroku';
import { delay } from 'redux-saga';
import {
  fork,
  take,
  takeEvery,
  takeLatest,
  call,
  put,
  select,
  all,
} from 'redux-saga/effects';
import {
  getPort,
  createPortChannel,
} from '../utils/port';

import searchForAllCandidates from '../candidates';

import {
  query as queryActions,
  execute as executeBackgroundAction,
} from '../actions';
import { beginningOfLine } from '../cursor';

import { sendMessageToActiveContentTab } from '../utils/tabs';

import {
  makeSelectPopup,
  makeSelectQuery,
  makeSelectMode,
  makeSelectScheme,
  makeSelectSchemeEnum,
  makeSelectPrev,
  makeSelectCandidate,
  makeSelectCandidatesItems,
  makeSelectCandidatesIndex,
  makeSelectSeparators,
  makeSelectMarkedCandidateIds,
} from '../selectors/popup';

const portName = `popup-${Date.now()}`;
export const port = getPort(portName);

export const debounceDelayMs = 100;

export function* cleanup() {
  const message = { type: 'POPUP_CLEANUP' };
  yield call(sendMessageToActiveContentTab, message);
}

export function* executeAction(action, candidates) {
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
  } finally {
    yield call(cleanup);
  }
}

export function* responseArg(payload) {
  yield call(executeBackgroundAction, { type: 'RESPONSE_ARG', payload });
}

export function* dispatchEmptyQuery() {
  yield put({ type: 'QUERY', payload: '' });
}

export function* searchCandidates({ payload: query }) {
  yield call(delay, debounceDelayMs);
  const candidate = yield select(makeSelectCandidate());
  const mode      = yield select(makeSelectMode());
  switch (mode) {
    case 'candidate': {
      const payload = yield call(searchForAllCandidates, query);
      yield put({ type: 'CANDIDATES', payload });
      break;
    }
    case 'action': {
      const separators = [{ label: `Actions for "${candidate.label}"`, index: 0 }];
      const items      = queryActions(candidate.type, query);
      yield put({ type: 'CANDIDATES', payload: { items, separators } });
      break;
    }
    case 'arg': {
      const values = yield select(makeSelectSchemeEnum());
      const items = (values || []).filter(o => o.label.includes(query));
      yield put({
        type:    'CANDIDATES',
        payload: { items, separators: [] },
      });
      break;
    }
    default:
      break;
  }
}

function* watchQuery() {
  yield takeLatest('QUERY', searchCandidates);
}

function* watchPort() {
  const portChannel = yield call(createPortChannel, port);

  for (;;) {
    const { type, payload } = yield take(portChannel);
    yield put({ type, payload });
  }
}

function* watchChangeCandidate() {
  const actions = ['QUERY', 'NEXT_CANDIDATE', 'PREVIOUS_CANDIDATE'];
  yield takeEvery(actions, function* handleChangeCandidate() {
    const index = yield select(makeSelectCandidatesIndex());
    const items = yield select(makeSelectCandidatesItems());
    const candidate = items[index];
    sendMessageToActiveContentTab({ type: 'CHANGE_CANDIDATE', payload: candidate })
      .catch(() => {});
  });
}

export function* normalizeCandidate(candidate) {
  if (!candidate) {
    return null;
  }
  if (candidate.type === 'search') {
    const q = yield select(makeSelectQuery);
    return Object.assign({}, candidate, { args: [q] });
  }
  return Object.assign({}, candidate);
}

function getMarkedCandidates({ markedCandidateIds, items }) {
  return Object.entries(markedCandidateIds)
    .map(([k, v]) => v && items.find(i => i.id === k))
    .filter(item => item);
}

export function* getTargetCandidates({ markedCandidateIds, items, index }, needNormalize = false) {
  const marked = getMarkedCandidates({ markedCandidateIds, items });
  if (marked.length > 0) {
    return marked;
  }
  if (needNormalize) {
    return [yield normalizeCandidate(items[index])];
  }
  return [items[index]];
}

function* watchSelectCandidate() {
  yield takeEvery('SELECT_CANDIDATE', function* handleSelectCandidate({ payload }) {
    const mode = yield select(makeSelectMode());
    const prev = yield select(makeSelectPrev());
    let action;
    switch (mode) {
      case 'candidate': {
        const c  = yield normalizeCandidate(payload);
        [action] = queryActions(c.type);
        yield executeAction(action, [c]);
        break;
      }
      case 'action': {
        action = payload;
        const candidates = yield getTargetCandidates(prev);
        yield executeAction(action, candidates);
        break;
      }
      case 'arg': {
        const c = yield normalizeCandidate(payload);
        yield responseArg([c]);
        break;
      }
      default:
        break;
    }
  });
}

function* watchReturn() {
  yield takeEvery('RETURN', function* handleReturn({ payload: { actionIndex } }) {
    const index = yield select(makeSelectCandidatesIndex());
    const items = yield select(makeSelectCandidatesItems());
    const mode = yield select(makeSelectMode());
    const markedCandidateIds = yield select(makeSelectMarkedCandidateIds());
    const prev = yield select(makeSelectPrev());

    yield put({ type: 'POPUP_CLEANUP' });
    switch (mode) {
      case 'candidate': {
        const candidates = yield getTargetCandidates({ index, items, markedCandidateIds }, true);
        const actions = queryActions(candidates[0].type);
        const action  = actions[Math.min(actionIndex, actions.length - 1)];
        yield executeAction(action, candidates);
        break;
      }
      case 'action': {
        const action = items[index];
        const candidates = yield getTargetCandidates(prev);
        yield executeAction(action, candidates);
        break;
      }
      case 'arg': {
        const { type } = yield select(makeSelectScheme());
        let payload = yield select(makeSelectQuery());
        if (type === 'object') {
          payload = yield getTargetCandidates({ index, items, markedCandidateIds });
        }
        yield responseArg(payload);
        break;
      }
      default:
        break;
    }
  });
}

function* watchListActions() {
  /* eslint-disable object-curly-newline */
  yield takeEvery('LIST_ACTIONS', function* handleListActions() {
    const index = yield select(makeSelectCandidatesIndex());
    const items = yield select(makeSelectCandidatesItems());
    const query = yield select(makeSelectQuery());
    const separators = yield select(makeSelectSeparators());
    const markedCandidateIds = yield select(makeSelectMarkedCandidateIds());
    const mode = yield select(makeSelectMode());
    const prev = yield select(makeSelectPrev());

    switch (mode) {
      case 'candidate': {
        const candidate = yield normalizeCandidate(items[index]);
        if (!candidate) {
          return;
        }
        yield put({
          type:    'SAVE_CANDIDATES',
          payload: { candidate, query, index, items, separators, markedCandidateIds },
        });
        yield call(searchCandidates, { payload: '' });
        break;
      }
      case 'action':
        yield put({ type: 'RESTORE_CANDIDATES', payload: prev });
        break;
      case 'arg':
        break;
      default:
        break;
    }
  });
}

function* watchMarkCandidate() {
  yield takeEvery('MARK_CANDIDATE', function* handleMarkCandidate() {
    const mode = yield select(makeSelectMode());
    const items = yield select(makeSelectCandidatesItems());
    const index = yield select(makeSelectCandidatesIndex());

    if (mode === 'action') {
      return;
    }
    const candidate = yield normalizeCandidate(items[index]);
    yield put({ type: 'CANDIDATE_MARKED', payload: candidate });
  });
}

function* watchMarkAllCandidates() {
  yield takeEvery('MARK_ALL_CANDIDATES', function* handleMarkAllCandidates() {
    const { mode, candidates: { index, items } } = yield select(makeSelectPopup());
    if (mode === 'action') {
      return;
    }
    const { type } = items[index];
    yield put({ type: 'CANDIDATES_MARKED', payload: items.filter(c => c.type === type) });
  });
}

function* watchRequestArg() {
  yield takeEvery('REQUEST_ARG', function* handleRequestArg({ payload }) {
    const { scheme: { default: defaultValue } } = payload;
    yield put({ type: 'QUERY', payload: defaultValue || '' });
    beginningOfLine();
  });
}

/**
 * Currently, we can't focus to an input form after tab changed.
 * So, we just close window.
 * If this restriction is change, we need to flag on.
 */
function* watchTabChange() {
  yield takeLatest('TAB_CHANGED', function* h({ payload = {} }) {
    if (!payload.canFocusToPopup) {
      yield call(cleanup);
    } else {
      yield call(delay, debounceDelayMs);
      document.querySelector('.commandInput').focus();
      const query = yield select(makeSelectQuery());
      const items = yield call(searchForAllCandidates, query);
      yield put({ type: 'CANDIDATES', payload: items });
    }
  });
}

function* watchQuit() {
  yield takeLatest('POPUP_CLEANUP', cleanup);
}

export default function* root() {
  yield all([
    fork(watchTabChange),
    fork(watchQuery),
    fork(watchChangeCandidate),
    fork(watchSelectCandidate),
    fork(watchReturn),
    fork(watchListActions),
    fork(watchMarkCandidate),
    fork(watchMarkAllCandidates),
    fork(watchRequestArg),
    fork(watchQuit),
    fork(watchPort),
    fork(dispatchEmptyQuery),
  ]);
}
