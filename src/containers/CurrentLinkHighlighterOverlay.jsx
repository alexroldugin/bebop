import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import {
  makeSelectCandidatesItems,
  makeSelectCandidatesIndex,
} from '../selectors/popup';

export class CurrentLinkHighlighterOverlayComponent extends React.Component {
  static get propTypes() {
    return {
      candidates: PropTypes.arrayOf(PropTypes.object).isRequired,
      index:      PropTypes.number.isRequired,
    };
  }

  componentDidMount() {
    this.scrollToLinkCandidate();
  }

  componentDidUpdate(prevProps) {
    if (this.props.index !== prevProps.index) {
      this.scrollToLinkCandidate();
    }
  }

  scrollToLinkCandidate() {
    const candidate = this.props.candidates[this.props.index];
    if (candidate && candidate.type === 'link') {
      const { rect } = candidate;
      window.scrollTo(rect.left, rect.top + rect.height / 2 - window.innerHeight / 2);
    } else {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const candidate = this.props.candidates[this.props.index];
    let element = null;
    if (candidate && candidate.type === 'link') {
      const { rect } = candidate;
      const style = {
        position:        'absolute',
        display:         'block',
        zIndex:          1000000,
        padding:         '2px',
        borderRadius:    '5px',
        left:            `${rect.left}px`,
        top:             `${rect.top}px`,
        width:           `${rect.width}px`,
        height:          `${rect.height}px`,
        backgroundColor: '#FF8C0055',
        border:          'dashed 2px #FF8C00',
      };

      element = (<div style={style} />);
    }
    return element;
  }
}

const mapStateToProps = createStructuredSelector({
  candidates: makeSelectCandidatesItems(),
  index:      makeSelectCandidatesIndex(),
});

function mapDispatchToProps(/* dispatch */) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentLinkHighlighterOverlayComponent);
