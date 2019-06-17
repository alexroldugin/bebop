import { createSelector } from 'reselect';

import {
  makeSelectCandidatesIndex as makeSelectHomePageCandidatesIndex,
  makeSelectCandidatesItems as makeSelectHomePageCandidatesItems,
} from './popup';

import { query as queryActions } from '../actions';

const defaultState = {
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

export const makeSelectCandidatesItems = () => createSelector(
  makeSelectQuery(),
  makeSelectHomePageCandidatesItems(),
  makeSelectHomePageCandidatesIndex(),
  (query, items, index) => {
    const candidate = items[index];
    return queryActions(candidate.type, query);
  },
);

export const makeSelectCandidatesIndex = () => createSelector(
  selectRoot,
  root => root.candidates.index,
);

export const makeSelectSeparators  = () => createSelector(
  makeSelectHomePageCandidatesItems(),
  makeSelectHomePageCandidatesIndex(),
  (items, index) => {
    const candidate = items[index];
    return [{ label: `Actions for "${candidate.label}"`, index: 0 }];
  },
);

export const selectMarkedCandidateIds = () => ({});

export const selectScheme = () => emptyScheme;

export default selectRoot;
