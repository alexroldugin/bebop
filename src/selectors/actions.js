import { createSelector } from 'reselect';

import {
  makeSelectCandidatesIndex as makeSelectHomePageCandidatesIndex,
  makeSelectCandidatesItems as makeSelectHomePageCandidatesItems,
} from './home';

import { query as queryActions } from '../actions';
import { uncirculateIndex } from '../utils/array';

export const defaultState = {
  query:      '',
  candidates: { index: 0 },
};

const emptyScheme = { enum: [] };

export const selectRoot      = (state = {}) => state.actions || defaultState;

export const makeSelectQuery = () => createSelector(
  selectRoot,
  root => root.query,
);

export const selectMode = () => 'actions';

export const makeSelectCandidatesItems = (qa = queryActions) => createSelector(
  makeSelectQuery(),
  makeSelectHomePageCandidatesItems(),
  makeSelectHomePageCandidatesIndex(),
  (query, items, index) => {
    const candidate = items[index];
    return candidate ? qa(candidate.type, query) : [];
  },
);

export const makeSelectCandidatesIndex = (qa = queryActions) => createSelector(
  selectRoot,
  makeSelectCandidatesItems(qa),
  (root, items) => uncirculateIndex(items, root.candidates.index),
);

export const makeSelectSeparators  = () => createSelector(
  makeSelectHomePageCandidatesItems(),
  makeSelectHomePageCandidatesIndex(),
  (items, index) => {
    const candidate = items[index];
    return candidate ? [{ label: `Actions for "${candidate.label}"`, index: 0 }] : [];
  },
);

export const selectMarkedCandidateIds = () => ({});

export const selectScheme = () => emptyScheme;

export default selectRoot;
