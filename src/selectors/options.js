import { createSelector } from 'reselect';

const defaultState = {
  popupWidth:         700,
  orderOfCandidates:  [],
  maxResultsForEmpty: {},
  enabledCJKMove:     false,
  hatenaUserName:     '',
  theme:              '',
};

export const optionsSelector            = state => state.options || defaultState;

export const makeSelectPopupWidth         = () => createSelector(
  optionsSelector,
  options => options.popupWidth,
);

export const makeSelectOrderOfCandidates  = () => createSelector(
  optionsSelector,
  options => options.orderOfCandidates,
);

export const makeSelectMaxResultsForEmpty = () => createSelector(
  optionsSelector,
  options => options.maxResultsForEmpty,
);

export const makeSelectEnabledCJKMove     = () => createSelector(
  optionsSelector,
  options => options.enabledCJKMove,
);

export const makeSelectHatenaUserName     = () => createSelector(
  optionsSelector,
  options => options.hatenaUserName,
);

export const makeSelectTheme              = () => createSelector(
  optionsSelector,
  options => options.theme,
);

export default optionsSelector;
