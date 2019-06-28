import test from 'ava';
import {
  defaultState,
  selectRoot,
  makeSelectQuery,
  selectMode,
  makeSelectSeparators,
  makeSelectCandidates,
  makeSelectCandidatesIndex,
  makeSelectCandidatesItems,
  makeSelectCandidatesItemsLinks,
  makeSelectMarkedCandidateIds,
  makeSelectScheme,
  makeSelectSchemeEnum,
} from '../../src/selectors/home';

let selectQuery = null;
let selectSeparators = null;
let selectCandidates = null;
let selectCandidatesIndex = null;
let selectCandidatesItems = null;
let selectCandidatesItemsLinks = null;
let selectMarkedCandidateIds = null;
let selectScheme = null;
let selectSchemeEnum = null;

function setup() {
  selectQuery = makeSelectQuery();
  selectCandidates = makeSelectCandidates();
  selectCandidatesIndex = makeSelectCandidatesIndex();
  selectCandidatesItems = makeSelectCandidatesItems();
  selectCandidatesItemsLinks = makeSelectCandidatesItemsLinks();
  selectMarkedCandidateIds = makeSelectMarkedCandidateIds();
  selectScheme = makeSelectScheme();
  selectSchemeEnum = makeSelectSchemeEnum();
  selectSeparators = makeSelectSeparators();
}

function restore() {
  selectQuery = null;
  selectSeparators = null;
  selectCandidates = null;
  selectCandidatesIndex = null;
  selectCandidatesItems = null;
  selectCandidatesItemsLinks = null;
  selectMarkedCandidateIds = null;
  selectScheme = null;
  selectSchemeEnum = null;
}

test.beforeEach(setup);
test.afterEach(restore);

test('checks selectors with default state', (t) => {
  t.deepEqual(selectRoot(), defaultState);
  t.is(selectMode(), 'candidate');
  t.is(selectQuery(), '');
  t.deepEqual(selectSeparators(), []);
  t.deepEqual(selectCandidates(), { items: [], index: 0 });
  t.is(selectCandidatesIndex(), 0);
  t.deepEqual(selectCandidatesItems(), []);
  t.deepEqual(selectCandidatesItemsLinks(), []);
  t.deepEqual(selectMarkedCandidateIds(), {});
  t.deepEqual(selectScheme(), { enum: [] });
  t.deepEqual(selectSchemeEnum(), []);
});

test('checks selectors with non-default custom state', (t) => {
  const root = {
    query:      'some query',
    candidates: {
      items: ['item0', 'item1', 'item2', 'item3'],
      index: 6,
    },
    markedCandidateIds: { a: 0, b: 1, c: 25 },
    separators:         ['a', 'b', 'c', 'd'],
    scheme:             {
      some: 'other key',
      enum: [0, 1, 2, 3],
    },
  };
  const state = { home: root };
  t.deepEqual(selectRoot(state), root);
  t.is(selectMode(state), 'candidate');
  t.is(selectQuery(state), root.query);
  t.deepEqual(selectSeparators(state), root.separators);
  t.deepEqual(selectCandidates(state), root.candidates);
  t.deepEqual(selectCandidatesItems(state), root.candidates.items);
  t.deepEqual(selectMarkedCandidateIds(state), root.markedCandidateIds);
  t.deepEqual(selectScheme(state), root.scheme);
  t.deepEqual(selectSchemeEnum(state), root.scheme.enum);
  root.candidates.index = -9;
  t.is(selectCandidatesIndex(state), 3);
});

test('checks links list based on candidates list', (t) => {
  const root = {
    candidates: {
      items: [
        {
          label: 'tab1',
          type:  'tab',
        },
        {
          label: 'link1',
          type:  'link',
        },
        {
          label: 'link2',
          type:  'link',
        },
        {
          label: 'tab1',
          type:  'tab',
        },
      ],
    },
  };
  const state = { home: root };
  t.deepEqual(
    selectCandidatesItemsLinks(state),
    root.candidates.items.filter(c => c.type === 'link'),
  );
});

test('selectMode always returns \'candidate\'', (t) => {
  const mode = 'candidate';
  t.is(selectMode(), mode);
  t.is(selectMode({ mode: 'other value' }), mode);
  t.is(selectMode(null), mode);
});
