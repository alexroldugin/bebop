import test from 'ava';

import {
  defaultState as defaultCommandState,
  makeSelectRoot,
  makeSelectQuery,
  selectMode,
  makeSelectSeparators,
  makeSelectCandidatesIndex,
  makeSelectCandidatesItems,
  selectEmptySeparators,
  selectMarkedCandidateIds,
  selectScheme,
  emptyScheme,
} from '../../src/selectors/command';

const preloadedState = {
  'command-empty-page': {
    query:      '',
    separators: [],
    candidates: {
      items: [],
      index: 1,
    },
  },
  'command-items-page': {
    query:      'query',
    separators: [],
    candidates: {
      items: [{ id: '0', label: 'label1', type: 'tab' }, { id: '1', label: 'label2', type: 'tab' }],
      index: 22,
    },
  },
  'command-items-page-with-empty-query': {
    query:      '',
    separators: [],
    candidates: {
      items: [{ id: '0', label: 'label1', type: 'tab' }, { id: '1', label: 'label2', type: 'tab' }],
      index: 21,
    },
  },
};

test('checks selectors with default state', (t) => {
  const command = 'any_command_name';
  const selectRoot = makeSelectRoot(command);
  const selectQuery = makeSelectQuery(command);
  const selectSeparators = makeSelectSeparators(command);
  const selectCandidatesItems = makeSelectCandidatesItems(command);
  const selectCandidatesIndex = makeSelectCandidatesIndex(command);
  t.deepEqual(selectRoot(), defaultCommandState);
  t.is(selectMode(), 'candidates');
  t.is(selectQuery(), '');
  t.deepEqual(selectSeparators(), []);
  t.deepEqual(selectCandidatesItems(), []);
  t.deepEqual(selectCandidatesIndex(), 0);
});

test('checks selectors for command-empty-page', (t) => {
  const command = 'command-empty-page';
  const selectRoot = makeSelectRoot(command);
  const selectQuery = makeSelectQuery(command);
  const selectSeparators = makeSelectSeparators(command);
  const selectCandidatesItems = makeSelectCandidatesItems(command);
  const selectCandidatesIndex = makeSelectCandidatesIndex(command);
  t.deepEqual(selectRoot(preloadedState), preloadedState[command]);
  t.is(selectMode(preloadedState), 'candidates');
  t.is(selectQuery(preloadedState), '');
  t.deepEqual(selectSeparators(preloadedState), []);
  t.deepEqual(selectCandidatesItems(preloadedState), []);
  t.is(selectCandidatesIndex(preloadedState), 0); // zero because of index uncirculation
});

test('checks selectors for command-items-page with specified query', (t) => {
  const command = 'command-items-page';
  const selectRoot = makeSelectRoot(command);
  const selectQuery = makeSelectQuery(command);
  const selectSeparators = makeSelectSeparators(command);
  const selectCandidatesItems = makeSelectCandidatesItems(command);
  const selectCandidatesIndex = makeSelectCandidatesIndex(command);
  t.deepEqual(selectRoot(preloadedState), preloadedState[command]);
  t.is(selectMode(preloadedState), 'candidates');
  t.is(selectQuery(preloadedState), 'query');
  t.deepEqual(selectSeparators(preloadedState), []);
  t.deepEqual(
    selectCandidatesItems(preloadedState),
    [],
  );
  t.is(selectCandidatesIndex(preloadedState), 0);
});

test('checks selectors for command-items-page-with-empty-query', (t) => {
  const command = 'command-items-page-with-empty-query';
  const selectRoot = makeSelectRoot(command);
  const selectQuery = makeSelectQuery(command);
  const selectSeparators = makeSelectSeparators(command);
  const selectCandidatesItems = makeSelectCandidatesItems(command);
  const selectCandidatesIndex = makeSelectCandidatesIndex(command);
  t.deepEqual(selectRoot(preloadedState), preloadedState[command]);
  t.is(selectMode(preloadedState), 'candidates');
  t.is(selectQuery(preloadedState), '');
  t.deepEqual(selectSeparators(preloadedState), []);
  t.deepEqual(
    selectCandidatesItems(preloadedState),
    preloadedState[command].candidates.items,
  );
  t.is(selectCandidatesIndex(preloadedState), 1);
});

test('checks simple selectors', (t) => {
  t.deepEqual(selectEmptySeparators(), []);
  t.deepEqual(selectEmptySeparators(defaultCommandState), []);

  t.deepEqual(selectMarkedCandidateIds(), {});
  t.deepEqual(selectMarkedCandidateIds(defaultCommandState), {});

  t.deepEqual(selectScheme(), emptyScheme);
  t.deepEqual(selectScheme(defaultCommandState), emptyScheme);

  t.deepEqual(selectMode(), 'candidates');
  t.deepEqual(selectMode(defaultCommandState), 'candidates');
});
