import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PopupPage from '../components/PopupPage';
import keySequence from '../key_sequences';
import { commandOfSeq } from '../sagas/key_sequence';

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

export function mapDispatchToProps(dispatch) {
  return {
    handleSelectCandidate: payload => dispatch({ type: 'SELECT_CANDIDATE', payload }),
    handleInputChange:     payload => dispatch({ type: 'QUERY', payload }),
    handleKeyDown:         (e) => {
      const keySeq = keySequence(e);
      if (commandOfSeq[keySeq]) {
        e.preventDefault();
        dispatch({ type: 'KEY_SEQUENCE', payload: keySeq });
      }
    },
    dispatchQuit: () => {
      dispatch({ type: 'EXIT' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupPage);
