import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectTheme,
} from '../selectors/options';

class ThemeProvider extends React.Component {
  static get propTypes() {
    return {
      theme:    PropTypes.string.isRequired,
      children: PropTypes.element.isRequired,
    };
  }

  componentDidMount() {
    document.documentElement.setAttribute('data-theme', this.props.theme);
  }

  render() {
    return (
      <>
        {React.Children.only(this.props.children)}
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  theme: makeSelectTheme(),
});

function mapDispatchToProps(/* dispatch */) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeProvider);
