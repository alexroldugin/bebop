import { createSelector } from 'reselect';

import { uncirculateIndex } from '../utils/array';

export const defaultState = {
  query:      '',
  candidates: {
    items: [],
    index: 0,
  },
  separators: [],
};

export const emptyScheme = { enum: [] };

export const makeSelectRoot  = command => (state = {}) => state[command] || defaultState;

export const makeSelectQuery = command => createSelector(
  makeSelectRoot(command),
  root => root.query,
);

export const selectMode = () => 'candidates';

export const makeSelectCandidates = command => createSelector(
  makeSelectRoot(command),
  root => root.candidates,
);

export const makeSelectCandidatesItems = command => createSelector(
  makeSelectCandidates(command),
  makeSelectQuery(command),
  (candidates, query) => candidates.items.filter(c => c.label.includes(query)),
);

export const makeSelectCandidatesIndex = command => createSelector(
  makeSelectCandidates(command),
  makeSelectCandidatesItems(command),
  (candidates, items) => uncirculateIndex(items, candidates.index),
);

export const makeSelectSeparators  = command => createSelector(
  makeSelectRoot(command),
  root => root.separators,
);

export const selectEmptySeparators = () => ([]);

export const selectMarkedCandidateIds = () => ({});

export const selectScheme = () => emptyScheme;
