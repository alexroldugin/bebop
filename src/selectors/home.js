import { createSelector } from 'reselect';

import { uncirculateIndex } from '../utils/array';

export const defaultState = {
  query:      '',
  candidates: {
    items: [],
    index: 0,
  },
  markedCandidateIds: {},
  separators:         [],
  scheme:             {
    enum: [],
  },
};

export const selectRoot = (state = {}) => state.home || defaultState;

export const makeSelectQuery = () => createSelector(
  selectRoot,
  home => home.query,
);

export const selectMode = () => 'candidate';

export const makeSelectCandidates = () => createSelector(
  selectRoot,
  home => home.candidates,
);

export const makeSelectCandidatesItems = () => createSelector(
  makeSelectCandidates(),
  candidates => candidates.items,
);

export const makeSelectCandidatesItemsLinks = () => createSelector(
  makeSelectCandidatesItems(),
  items => items.filter(item => item.type === 'link'),
);

export const makeSelectCandidatesIndex = () => createSelector(
  makeSelectCandidates(),
  makeSelectCandidatesItems(),
  (candidates, items) => uncirculateIndex(items, candidates.index),
);

export const makeSelectSeparators  = () => createSelector(
  selectRoot,
  home => home.separators,
);

export const makeSelectMarkedCandidateIds = () => createSelector(
  selectRoot,
  home => home.markedCandidateIds,
);

export const makeSelectScheme     = () => createSelector(
  selectRoot,
  popup => popup.scheme,
);

export const makeSelectSchemeEnum = () => createSelector(
  makeSelectScheme(),
  scheme => scheme.enum,
);

export default selectRoot;
