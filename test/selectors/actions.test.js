import test from 'ava';
import nisemono from 'nisemono';

import {
  defaultState as defaultActionsState,
  selectRoot,
  makeSelectQuery,
  selectMode,
  makeSelectSeparators,
  makeSelectCandidatesIndex,
  makeSelectCandidatesItems,
  selectMarkedCandidateIds,
  selectScheme,
} from '../../src/selectors/actions';

let queryActionsMock = null;

let selectQuery = null;
let selectSeparators = null;
let selectCandidatesIndex = null;
let selectCandidatesItems = null;

const tabCandidate = {
  id:         'item_id',
  label:      'Tab Label',
  type:       'tab',
  args:       [],
  faviconUrl: 'some://test.url',
};

const tabCandidate2 = {
  id:         'item_id2',
  label:      'Tab Label2',
  type:       'tab2',
  args:       [],
  faviconUrl: 'some://test.url.2',
};

function setup() {
  queryActionsMock = nisemono.func();
  selectQuery = makeSelectQuery();
  selectCandidatesIndex = makeSelectCandidatesIndex(queryActionsMock);
  selectCandidatesItems = makeSelectCandidatesItems(queryActionsMock);
  selectSeparators = makeSelectSeparators();
}

function restore() {
  queryActionsMock = null;
  selectQuery = null;
  selectCandidatesIndex = null;
  selectCandidatesItems = null;
  selectSeparators = null;
}

test.beforeEach(setup);
test.afterEach(restore);

test.serial('checks selectors with default state', (t) => {
  nisemono.expects(queryActionsMock).returns([]);

  t.deepEqual(selectRoot(), defaultActionsState);
  t.is(selectMode(), 'actions');
  t.is(selectQuery(), '');
  t.deepEqual(selectSeparators(), []);

  t.false(queryActionsMock.isCalled);
  t.is(selectCandidatesIndex(), 0);
  t.false(queryActionsMock.isCalled);

  t.deepEqual(selectCandidatesItems(), []);
  t.false(queryActionsMock.isCalled);
});

test.serial('checks selectors with custom non-default state with one candidate', (t) => {
  const state = {
    popup: {
      query:      'some query string in popup',
      candidates: {
        items: [tabCandidate],
        index: 0,
      },
    },
    actions: {
      query:      'some query string in actions',
      candidates: { index: 11 },
    },
  };
  const actions = ['a', 'b', 'c'];

  nisemono.expects(queryActionsMock).returns(actions);

  t.deepEqual(selectRoot(state), state.actions);
  t.is(selectMode(state), 'actions');
  t.is(selectQuery(state), state.actions.query);
  const separators = selectSeparators(state);
  t.is(separators.length, 1);
  t.regex(separators[0].label, new RegExp(`"${tabCandidate.label}"`));

  t.false(queryActionsMock.isCalled);
  t.is(selectCandidatesIndex(state), 2);
  t.is(queryActionsMock.calls.length, 1);
  t.deepEqual(queryActionsMock.calls[0].args, [tabCandidate.type, state.actions.query]);

  t.deepEqual(selectCandidatesItems(state), actions);
  t.is(queryActionsMock.calls.length, 2);
  t.deepEqual(queryActionsMock.calls[1].args, [tabCandidate.type, state.actions.query]);
});

test.serial('checks selectors with custom non-default state with two candidate', (t) => {
  const state = {
    popup: {
      query:      'some query string in popup',
      candidates: {
        items: [tabCandidate, tabCandidate2],
        index: 3,
      },
    },
    actions: {
      query:      'some query string in actions',
      candidates: { index: 5 },
    },
  };
  const actions = ['a', 'b'];

  nisemono.expects(queryActionsMock).returns(actions);

  t.deepEqual(selectRoot(state), state.actions);
  t.is(selectMode(state), 'actions');
  t.is(selectQuery(state), state.actions.query);
  const separators = selectSeparators(state);
  t.is(separators.length, 1);
  t.regex(separators[0].label, new RegExp(`"${tabCandidate2.label}"`));

  t.false(queryActionsMock.isCalled);
  t.is(selectCandidatesIndex(state), 1);
  t.is(queryActionsMock.calls.length, 1);
  t.deepEqual(queryActionsMock.calls[0].args, [tabCandidate2.type, state.actions.query]);

  t.deepEqual(selectCandidatesItems(state), actions);
  t.is(queryActionsMock.calls.length, 2);
  t.deepEqual(queryActionsMock.calls[1].args, [tabCandidate2.type, state.actions.query]);
});


test.serial('selectMode always returns \'actions\'', (t) => {
  const mode = 'actions';
  t.is(selectMode(), mode);
  t.is(selectMode({ mode: 'other value' }), mode);
  t.is(selectMode(null), mode);
});

test.serial('selectMarkedCandidateIds always returns empty object', (t) => {
  t.deepEqual(selectMarkedCandidateIds(), {});
  t.deepEqual(selectMarkedCandidateIds({
    actions: { makedCandidatesIds: { a: 0, b: 1 } },
    popup:   { makedCandidatesIds: { a: 0, b: 1 } },
  }), {});
});

test.serial('selectScheme always returns empty scheme', (t) => {
  t.deepEqual(selectScheme(), { enum: [] });
  t.deepEqual(selectScheme({
    actions: { scheme: { enum: [1, 2, 3] } },
    popup:   { scheme: { enum: [2, 3, 4] } },
  }), { enum: [] });
});
