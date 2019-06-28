import browser from 'webextension-polyfill';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { MARKER_SIZE } from '../link';

import {
  makeSelectCandidatesItemsLinks,
  makeSelectCandidatesItems,
  makeSelectCandidatesIndex,
} from '../selectors/home';

export class LinksOverlayComponent extends React.Component {
  static get propTypes() {
    return {
      links:      PropTypes.arrayOf(PropTypes.object).isRequired,
      candidates: PropTypes.arrayOf(PropTypes.object).isRequired,
      index:      PropTypes.number.isRequired,
    };
  }

  render() {
    const url = browser.extension.getURL('images/link.png');
    const candidate = this.props.candidates[this.props.index];
    let element = null;
    if (candidate && candidate.type === 'link') {
      element = this.props.links.map((link) => {
        const selected = candidate === link;
        const style = {
          position:        'absolute',
          display:         'block',
          zIndex:          1000000,
          padding:         '2px',
          borderRadius:    '5px',
          width:           `${MARKER_SIZE}px`,
          height:          `${MARKER_SIZE}px`,
          left:            `${link.rect.left - MARKER_SIZE}px`,
          top:             `${link.rect.top - (MARKER_SIZE * 0.5)}px`,
          backgroundColor: selected ? '#FF8C00' : '#ADFF2F',
        };

        return (
          <img
            alt={link.title}
            src={url}
            style={style}
          />
        );
      });
    }
    return element;
  }
}

export const mapStateToProps = createStructuredSelector({
  links:      makeSelectCandidatesItemsLinks(),
  candidates: makeSelectCandidatesItems(),
  index:      makeSelectCandidatesIndex(),
});

export function mapDispatchToProps(/* dispatch */) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LinksOverlayComponent);
