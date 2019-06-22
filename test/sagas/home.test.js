import test from 'ava';
import { put, call } from 'redux-saga/effects';
import {
  normalizeCandidate,
  getTargetCandidates,
  searchCandidates,
} from '../../src/sagas/home';

import searchForAllCandidates from '../../src/candidates';

const items = [{
  id:         'google-search-test',
  label:      'test Search with Google',
  type:       'search',
  args:       ['test'],
  faviconUrl: null,
}];

test('normalizeCandidate', (t) => {
  const noCandidateGen = normalizeCandidate(null);
  t.deepEqual(noCandidateGen.next().value, null);

  const gen = normalizeCandidate({ type: 'test' });
  t.deepEqual(gen.next().value, { type: 'test' });
});

test('getTargetCandidates', (t) => {
  const markedCandidateIds = { 'google-search-test': true };
  const gen = getTargetCandidates({ markedCandidateIds, items, index: 0 });
  t.deepEqual(gen.next().value, items);
});

test('searchCandidates generator runs candidates\' search', (t) => {
  const query = 'some query string';
  const action = { payload: query };
  const searchPayload = 'some payload data';
  const gen = searchCandidates(action);
  gen.next(); // debounce delay
  t.deepEqual(call(searchForAllCandidates, query), gen.next().value);
  t.deepEqual(
    put({ type: 'CANDIDATES', payload: searchPayload }),
    gen.next(searchPayload).value,
  );
  t.true(gen.next().done);
  t.pass();
});
