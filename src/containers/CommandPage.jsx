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
  selectSeparators,
} from '../selectors/command';

export const mapStateToProps = createStructuredSelector({
  query:              () => '',
  candidates:         makeSelectCandidatesItems(),
  index:              makeSelectCandidatesIndex(),
  separators:         selectSeparators,
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
      dispatch({ type: 'EXIT' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupPage);
