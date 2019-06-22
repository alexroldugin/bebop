import {
  fork,
  takeEvery,
  put,
  select,
  all,
} from 'redux-saga/effects';

import {
  makeSelectQuery,
  makeSelectCandidatesItems,
  makeSelectCandidatesIndex,
} from '../selectors/actions';

import {
  makeSelectCandidatesItems as makeSelectHomeCandidatesItems,
  makeSelectCandidatesIndex as makeSelectHomeCandidatesIndex,
  makeSelectMarkedCandidateIds as makeSelectHomeMarkedCandidateIds,
} from '../selectors/popup';

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

export function* handleReturn() {
  const actionIndex = yield select(makeSelectCandidatesIndex());
  const actionItems = yield select(makeSelectCandidatesItems());

  const items = yield select(makeSelectHomeCandidatesItems());
  const index = yield select(makeSelectHomeCandidatesIndex());
  const markedCandidateIds = yield select(makeSelectHomeMarkedCandidateIds());

  const action = actionItems[actionIndex];
  const candidates = yield getTargetCandidates({ index, items, markedCandidateIds }, true);

  yield put({ type: 'EXECUTE_ACTION', payload: { action, candidates } });
}

export function* watchReturn() {
  yield takeEvery('RETURN', handleReturn);
}

export default function* root() {
  yield all([
    fork(watchReturn),
  ]);
}
