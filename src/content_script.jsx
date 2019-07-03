import React from 'react';

import browser from 'webextension-polyfill';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store, applyMiddleware } from 'webext-redux';
import createSagaMiddleware from 'redux-saga';

import logger from 'kiroku';
import { init as actionInit, find as findAction } from './actions';
import {
  search,
  reduce,
} from './link';

import LinksOverlay from './containers/LinksOverlay';
import CurrentLinkHighlighterOverlay from './containers/CurrentLinkHighlighterOverlay';

const portName = `content-script-${window.location.href}`;
let port = null;
if (process.env.NODE_ENV === 'production') {
  logger.setLevel('FATAL');
}

export function executeAction(actionId, candidates) {
  const action = findAction(actionId);
  if (action && action.contentHandler) {
    const f = action.contentHandler;
    return f.call(this, candidates);
  }
  return Promise.resolve();
}

function handleExecuteAction({ actionId, candidates }) {
  return executeAction(actionId, candidates);
}

function handleClose() {
}

export function portMessageListener(msg) {
  const { type, payload } = msg;
  logger.trace(`Handle message ${type} ${JSON.stringify(payload)}`);
  switch (type) {
    case 'POPUP_CLOSE':
      handleClose();
      break;
    default:
      break;
  }
}

export function messageListener(request) {
  switch (request.type) {
    case 'FETCH_LINKS':
      return Promise.resolve(search(request.payload));
    case 'EXECUTE_ACTION':
      return handleExecuteAction(request.payload);
    // case 'TOGGLE_POPUP':
    //   return handleTogglePopup(request.payload);
    default:
      return null;
  }
}

setTimeout(() => {
  port = browser.runtime.connect({ name: portName });
  port.onMessage.addListener(portMessageListener);
  const disconnectListener = () => {
    port.onMessage.removeListener(portMessageListener);
    port.onDisconnect.removeListener(disconnectListener);
  };
  port.onDisconnect.addListener(disconnectListener);
  browser.runtime.onMessage.addListener(messageListener);
  logger.info('bebop content_script is loaded');
}, 500);


export function start({ store }) {
  // wait for the store to connect to the background page
  return store.ready().then(() => {
    const overlays = reduce((doc) => {
      const element = (
        <Provider store={store}>
          <LinksOverlay />
          <CurrentLinkHighlighterOverlay />
        </Provider>
      );
      const container = doc.createElement('div');
      if (doc.body) {
        doc.body.appendChild(container);
        ReactDOM.render(element, container);
      }
      return { container };
    });
    return overlays;
  });
}

export function stop({ container }) {
  ReactDOM.unmountComponentAtNode(container);
}

export function setupStoreSagas(store) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [
    sagaMiddleware,
  ];
  const enhancedStore = applyMiddleware(store, ...middleware);
  enhancedStore.injectedSagas = {}; // Saga registry
  enhancedStore.runSaga = sagaMiddleware.run;

  return enhancedStore;
}
actionInit();

export default start({ store: setupStoreSagas(new Store()) });
