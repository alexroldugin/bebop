import { createSelector } from 'reselect';

const defaultState = {
  query:      '',
  mode:       '',
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

export const makeSelectPopup      = (state = {}) => state.popup || defaultState;

export const makeSelectQuery      = () => createSelector(
  makeSelectPopup,
  popup => popup.query,
);

export const makeSelectMode       = () => createSelector(
  makeSelectPopup,
  popup => popup.mode,
);

export const makeSelectCandidates = () => createSelector(
  makeSelectPopup,
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
  makeSelectPopup,
  popup => popup.separators,
);

export const makeSelectMarkedCandidateIds = () => createSelector(
  makeSelectPopup,
  popup => popup.markedCandidateIds,
);

export const makeSelectCandidate  = () => createSelector(
  makeSelectPopup,
  popup => popup.prev && popup.prev.candidate,
);

export const makeSelectPrev  = () => createSelector(
  makeSelectPopup,
  popup => popup.prev,
);

export const makeSelectScheme     = () => createSelector(
  makeSelectPopup,
  popup => popup.scheme,
);

export const makeSelectSchemeEnum = () => createSelector(
  makeSelectScheme(),
  scheme => scheme.enum,
);

export default makeSelectPopup;
