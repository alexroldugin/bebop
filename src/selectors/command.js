import { createSelector } from 'reselect';

import { uncirculateIndex } from '../utils/array';

const defaultState = {
  query:      '',
  candidates: {
    items: [],
    index: 0,
  },
};

const emptyScheme = { enum: [] };

export const selectRoot      = (state = {}) => state.command || defaultState;

export const makeSelectQuery = () => createSelector(
  selectRoot,
  root => root.query,
);

export const selectMode = () => 'candidates';

export const makeSelectCandidates = () => createSelector(
  selectRoot,
  root => root.candidates,
);

export const makeSelectCandidatesItems = () => createSelector(
  makeSelectCandidates(),
  makeSelectQuery(),
  (candidates, query) => candidates.items.filter(c => c.label.includes(query)),
);

export const makeSelectCandidatesIndex = () => createSelector(
  makeSelectCandidates(),
  makeSelectCandidatesItems(),
  (candidates, items) => uncirculateIndex(items, candidates.index),
);

export const selectSeparators  = () => ([]);

export const selectMarkedCandidateIds = () => ({});

export const selectScheme = () => emptyScheme;

export default selectRoot;
