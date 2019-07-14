import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PopupPage, { mapDispatchToProps } from '../components/PopupPage';

import {
  makeSelectCandidatesItems,
  makeSelectCandidatesIndex,
  makeSelectSeparators,
  selectScheme,
  selectMode,
  selectMarkedCandidateIds,
} from '../selectors/command';

export const makeMapStateToProps = command => createStructuredSelector({
  query:              () => '',
  candidates:         makeSelectCandidatesItems(command),
  index:              makeSelectCandidatesIndex(command),
  separators:         makeSelectSeparators(command),
  markedCandidateIds: selectMarkedCandidateIds,
  mode:               selectMode,
  scheme:             selectScheme,
});

export const makeCommandPage = command => connect(
  makeMapStateToProps(command),
  mapDispatchToProps,
)(PopupPage);
