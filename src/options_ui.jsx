import React   from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Store } from 'webext-redux';

import logger from 'kiroku';

import Options from './containers/Options';

if (process.env.NODE_ENV === 'production') {
  logger.setLevel('FATAL');
}

function stop({ container }) {
  ReactDOM.unmountComponentAtNode(container);
}


export function start({ store }) {
  const container = document.getElementById('container');
  // wait for the store to connect to the background page
  return store.ready().then(() => {
    store.dispatch({ type: 'INIT' });

    const element = (
      <Provider store={store}>
        <Options />
      </Provider>
    );
    ReactDOM.render(element, container);
    return { container };
  });
}

export { stop };

export default start({ store: new Store() });
