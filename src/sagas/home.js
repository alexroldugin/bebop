import { delay } from 'redux-saga';
import {
  fork,
  takeEvery,
  takeLatest,
  call,
  put,
  select,
  all,
} from 'redux-saga/effects';

import searchForAllCandidates from '../candidates';

import { query as queryActions } from '../actions';

import {
  makeSelectQuery,
  makeSelectCandidatesItems,
  makeSelectCandidatesIndex,
  makeSelectMarkedCandidateIds,
} from '../selectors/popup';

export const debounceDelayMs = 100;

export function* searchCandidates({ payload: query }) {
  yield call(delay, debounceDelayMs);
  const payload = yield call(searchForAllCandidates, query);
  yield put({ type: 'CANDIDATES', payload });
}

function* watchQuery() {
  yield takeLatest('QUERY', searchCandidates);
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

function* watchReturn() {
  yield takeEvery('RETURN', function* handleReturn({ payload: { actionIndex } }) {
    const index = yield select(makeSelectCandidatesIndex());
    const items = yield select(makeSelectCandidatesItems());
    const markedCandidateIds = yield select(makeSelectMarkedCandidateIds());

    const candidates = yield getTargetCandidates({ index, items, markedCandidateIds }, true);
    const actions = queryActions(candidates[0].type);
    const action  = actions[Math.min(actionIndex, actions.length - 1)];

    yield put({ type: 'EXECUTE_ACTION', payload: { action, candidates } });
  });
}

function* watchMarkCandidate() {
  yield takeEvery('MARK_CANDIDATE', function* handleMarkCandidate() {
    const items = yield select(makeSelectCandidatesItems());
    const index = yield select(makeSelectCandidatesIndex());

    const candidate = yield normalizeCandidate(items[index]);
    yield put({ type: 'CANDIDATE_MARKED', payload: candidate });
  });
}

function* watchMarkAllCandidates() {
  yield takeEvery('MARK_ALL_CANDIDATES', function* handleMarkAllCandidates() {
    const items = yield select(makeSelectCandidatesItems());
    const index = yield select(makeSelectCandidatesIndex());

    const { type } = items[index];
    yield put({ type: 'CANDIDATES_MARKED', payload: items.filter(c => c.type === type) });
  });
}

export default function* root() {
  yield all([
    fork(watchQuery),
    fork(watchReturn),
    fork(watchMarkCandidate),
    fork(watchMarkAllCandidates),
  ]);
}
