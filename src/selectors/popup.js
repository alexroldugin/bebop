import { createSelector } from 'reselect';

const defaultState = {
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

export const selectRoot      = (state = {}) => state.popup || defaultState;

export const makeSelectQuery      = () => createSelector(
  selectRoot,
  popup => popup.query,
);

export const selectMode       = () => 'candidate';

export const makeSelectCandidates = () => createSelector(
  selectRoot,
  popup => popup.candidates,
);

export const makeSelectCandidatesItems = () => createSelector(
  makeSelectCandidates(),
  candidates => candidates.items,
);

export const makeSelectCandidatesIndex = () => createSelector(
  makeSelectCandidates(),
  candidates => candidates.index,
);

export const makeSelectSeparators  = () => createSelector(
  selectRoot,
  popup => popup.separators,
);

export const makeSelectMarkedCandidateIds = () => createSelector(
  selectRoot,
  popup => popup.markedCandidateIds,
);

export const makeSelectCandidate  = () => createSelector(
  selectRoot,
  popup => popup.prev && popup.prev.candidate,
);

export const makeSelectPrev  = () => createSelector(
  selectRoot,
  popup => popup.prev,
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
