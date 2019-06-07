import React from 'react';

import { Provider } from 'react-redux';
import { Store, applyMiddleware } from 'webext-redux';
import createSagaMiddleware from 'redux-saga';

import ReactDOM from 'react-dom';

import logger from 'kiroku';

import { watchKeySequence } from './sagas/key_sequence';

import Popup from './containers/Popup';
import ThemeProvider from './containers/ThemeProvider';

if (process.env.NODE_ENV === 'production') {
  logger.setLevel('FATAL');
}

function stop({ container, store }) {
  ReactDOM.unmountComponentAtNode(container);
  store.task.cancel();
}

export const popupCloseMiddleware = (/* store */) => next => (action) => {
  if (action.type === 'POPUP_QUIT') {
    if (window.parent !== window) {
      window.parent.postMessage(JSON.stringify({ type: 'CLOSE' }), '*');
    } else {
      window.close();
    }
  } else {
    next(action);
  }
};

export function start({ store }) {
  const container = document.getElementById('container');

  // wait for the store to connect to the background page
  return store.ready().then(() => {
    store.dispatch({ type: 'QUERY', payload: '' });
    const element = (
      <Provider store={store}>
        <ThemeProvider>
          <Popup />
        </ThemeProvider>
      </Provider>
    );
    ReactDOM.render(element, container);
    return { container };
  });
}

export { stop };

export function createConnectedStore(store) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [popupCloseMiddleware, sagaMiddleware];
  const enhancedStore = applyMiddleware(store, ...middleware);
  enhancedStore.task = sagaMiddleware.run(watchKeySequence);
  return enhancedStore;
}

export default start({ store: createConnectedStore(new Store()) });
