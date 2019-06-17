import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PopupPage from '../components/PopupPage';
import keySequence from '../key_sequences';
import { commandOfSeq } from '../sagas/key_sequence';

import {
  makeSelectCandidatesItems,
  makeSelectCandidatesIndex,
  selectScheme,
  selectMode,
  selectMarkedCandidateIds,
  makeSelectSeparators,
} from '../selectors/actions';

export const mapStateToProps = createStructuredSelector({
  candidates:         makeSelectCandidatesItems(),
  index:              makeSelectCandidatesIndex(),
  separators:         makeSelectSeparators(),
  markedCandidateIds: selectMarkedCandidateIds,
  mode:               selectMode,
  scheme:             selectScheme,
});

export function mapDispatchToProps(dispatch) {
  return {
    handleSelectCandidate: () => {},
    handleInputChange:     payload => dispatch({ type: 'QUERY', payload }),
    handleKeyDown:         (e) => {
      const keySeq = keySequence(e);
      if (commandOfSeq[keySeq]) {
        e.preventDefault();
        dispatch({ type: 'KEY_SEQUENCE', payload: keySeq });
      }
    },
    dispatchQuit: () => {
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupPage);
