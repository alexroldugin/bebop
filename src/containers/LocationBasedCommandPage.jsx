import React from 'react';

import PropTypes from 'prop-types';

import { makeCommandPage } from './CommandPage';

class LocationBasedCommandPage extends React.Component {
  static get propTypes() {
    return {
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
      }).isRequired,
    };
  }

  constructor() {
    super();
    this.pages = {};
  }

  render() {
    const { location } = this.props;
    const command = location.pathname.replace('/', '');
    const CommandPage = this.pages[command]
      ? this.pages[command] : this.pages[command] = makeCommandPage(command);
    return (<CommandPage />);
  }
}

export default LocationBasedCommandPage;
