import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PopupPage, { mapDispatchToProps } from '../components/PopupPage';

import {
  makeSelectQuery,
  makeSelectCandidatesItems,
  makeSelectCandidatesIndex,
  makeSelectScheme,
  selectMode,
  makeSelectMarkedCandidateIds,
  makeSelectSeparators,
} from '../selectors/home';

export const mapStateToProps = createStructuredSelector({
  query:              makeSelectQuery(),
  candidates:         makeSelectCandidatesItems(),
  index:              makeSelectCandidatesIndex(),
  separators:         makeSelectSeparators(),
  markedCandidateIds: makeSelectMarkedCandidateIds(),
  mode:               selectMode,
  scheme:             makeSelectScheme(),
});

export default connect(mapStateToProps, mapDispatchToProps)(PopupPage);
