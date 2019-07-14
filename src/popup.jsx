import React from 'react';

import { Provider } from 'react-redux';
import { Store, applyMiddleware } from 'webext-redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { ConnectedRouter, routerMiddleware } from 'connected-react-router';

import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';

import logger from 'kiroku';

import { watchKeySequence } from './sagas/key_sequence';
import { watchLocationChangeSagaFactory } from './sagas/location_change.popup';

import history from './utils/history';

import HomePage from './containers/HomePage';
import ActionsPage from './containers/ActionsPage';
import LocationBasedCommandPage from './containers/LocationBasedCommandPage';
import ThemeProvider from './containers/ThemeProvider';

import { init as actionsInit } from './actions';

import {
  getPort,
  createPortChannel,
} from './utils/port';

// create port to listen to onDisconnect in background script when popup closed
const portName = `popup-${Date.now()}`;
export const port = getPort(portName);
createPortChannel(port);

actionsInit();

if (process.env.NODE_ENV === 'production') {
  logger.setLevel('FATAL');
}

export function stop({ container }) {
  ReactDOM.unmountComponentAtNode(container);
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
    const element = (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ThemeProvider>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/actions" component={ActionsPage} />
              <Route
                exact
                path="/command-:command"
                component={LocationBasedCommandPage}
              />
              <Route render={() => (<div>Miss</div>)} />
            </Switch>
          </ThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
    ReactDOM.render(element, container);
    return { container };
  });
}

export function rootPopupSagaFactory(store) {
  return function* rootPopupSaga() {
    yield all([
      fork(watchKeySequence),
      fork(watchLocationChangeSagaFactory(store)),
    ]);
  };
}

export function setupStoreSagas(store) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [
    sagaMiddleware,
    popupCloseMiddleware,
    routerMiddleware(history),
  ];
  const enhancedStore = applyMiddleware(store, ...middleware);
  enhancedStore.injectedSagas = {}; // Saga registry
  enhancedStore.runSaga = sagaMiddleware.run;
  enhancedStore.runSaga(rootPopupSagaFactory(enhancedStore));

  return enhancedStore;
}

export default start({ store: setupStoreSagas(new Store()) });
