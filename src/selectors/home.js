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

export const selectRoot = (state = {}) => state.popup || defaultState;

export const makeSelectQuery = () => createSelector(
  selectRoot,
  popup => popup.query,
);

export const selectMode = () => 'candidate';

export const makeSelectCandidates = () => createSelector(
  selectRoot,
  popup => popup.candidates,
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
  popup => popup.separators,
);

export const makeSelectMarkedCandidateIds = () => createSelector(
  selectRoot,
  popup => popup.markedCandidateIds,
);

// export const makeSelectCandidate  = () => createSelector(
//   selectRoot,
//   popup => popup.prev && popup.prev.candidate,
// );

// export const makeSelectPrev  = () => createSelector(
//   selectRoot,
//   popup => popup.prev,
// );

export const makeSelectScheme     = () => createSelector(
  selectRoot,
  popup => popup.scheme,
);

export const makeSelectSchemeEnum = () => createSelector(
  makeSelectScheme(),
  scheme => scheme.enum,
);

export default selectRoot;
