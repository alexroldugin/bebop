import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PopupPage, { mapDispatchToProps } from '../components/PopupPage';

import {
  makeSelectCandidatesItems,
  makeSelectCandidatesIndex,
  selectScheme,
  selectMode,
  selectMarkedCandidateIds,
  makeSelectSeparators,
} from '../selectors/actions';

export const mapStateToProps = createStructuredSelector({
  query:              () => '',
  candidates:         makeSelectCandidatesItems(),
  index:              makeSelectCandidatesIndex(),
  separators:         makeSelectSeparators(),
  markedCandidateIds: selectMarkedCandidateIds,
  mode:               selectMode,
  scheme:             selectScheme,
});

export default connect(mapStateToProps, mapDispatchToProps)(PopupPage);
