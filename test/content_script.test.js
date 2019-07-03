import test from 'ava';
import nisemono from 'nisemono';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { combineReducers, createStore, applyMiddleware } from 'redux';

import { init as candidateInit } from '../src/candidates';

import homeReducers from '../src/reducers/home';
import optionsReducers from '../src/reducers/options';

import homeSaga from '../src/sagas/home';
import homePopupSaga from '../src/sagas/home.popup';

import {
  executeAction,
  portMessageListener,
  messageListener,
  start,
  stop,
  setupStoreSagas,
} from '../src/content_script';

const WAIT_MS = 250;
const delay  = ms => new Promise(resolve => setTimeout(resolve, ms));
const { scrollTo } = window;

let store = null;
let overlay = null;

async function setup() {
  document.scrollingElement = { scrollTo: nisemono.func() };
  window.scrollTo = nisemono.func();
  const state = {
    options: {},
    home:    {},
  };
  candidateInit(state.options);
  const sagaMiddleware = createSagaMiddleware();
  const middleware     = [
    sagaMiddleware,
  ];
  const reducers = combineReducers({
    options: optionsReducers(),
    home:    homeReducers(),
  });
  store = createStore(reducers, state, applyMiddleware(...middleware));

  function* mergedSaga() {
    yield all([
      fork(homeSaga),
      fork(homePopupSaga),
    ]);
  }
  store.task = sagaMiddleware.run(mergedSaga);
  store.ready = () => Promise.resolve();
  store.dispatch({ type: 'QUERY', payload: '' });

  overlay = await start({ store });
}

function restore() {
  document.scrollingElement = null;
  window.scrollTo = scrollTo;
  stop(overlay);
  store = null;
  overlay = null;
}

test.beforeEach(setup);
test.afterEach(restore);

test.serial('content_script', async (t) => {
  await delay(500);
  t.pass();
});

test.serial('executeAction calls contentHandler of a action', async (t) => {
  executeAction('click', []);
  t.pass();
});

test.serial('executeAction does nothing for action that has no contentHandler', async (t) => {
  executeAction('unknown', []);
  t.pass();
});

test.serial('portMessageListener handles POPUP_CLOSE message', (t) => {
  const message = { type: 'POPUP_CLOSE', payload: {} };
  portMessageListener(message);
  t.pass();
});

test.serial('portMessageListener handles UNKNOWN message', (t) => {
  const message = { type: 'UNKNOWN', payload: {} };
  portMessageListener(message);
  t.pass();
});

test.serial('messageListener handles FETCH_LINKS messages from popup', async (t) => {
  const message = { type: 'FETCH_LINKS', payload: { query: '', maxResults: 20 } };
  await messageListener(message);
  t.pass();
});

test.serial('messageListener handles EXECUTE_ACTION messages from popup', async (t) => {
  const message = { type: 'EXECUTE_ACTION', payload: { actionId: 'open', candidates: [] } };
  await messageListener(message, {}, () => t.end());
  t.pass();
});

test.serial('messageListener does not handle unknown messages from popup', async (t) => {
  const message = { type: 'UNKNOWN', payload: {} };
  await messageListener(message, {}, () => t.end());
  t.pass();
});

test.serial('checks store structure to be ready for injections', async (t) => {
  const emptyStore = createStore(state => state);
  const gotStore = setupStoreSagas(emptyStore);
  t.truthy(gotStore);
  t.deepEqual(gotStore.injectedSagas, {});
  t.truthy(gotStore.runSaga);
});

function createCandidate(type, index) {
  return {
    id:    `id${index}`,
    type,
    url:   '',
    label: `link${index}`,
    role:  'button',
    index,
    rect:  {
      left:   index,
      top:    index,
      width:  10 + index,
      height: 10 + index,
    },
  };
}

test.serial('creates links marks and higlighter overlay for one candidate', async (t) => {
  const { container } = overlay;
  await delay(WAIT_MS);
  t.is(container.children.length, 0);
  store.dispatch({
    type:    'CANDIDATES',
    payload: {
      items:      [createCandidate('link', 0)],
      separators: [],
    },
  });
  await delay(WAIT_MS);
  t.is(container.children.length, 2);
});

test.serial('creates links marks and higlighter overlay for two candidates', async (t) => {
  const { container } = overlay;
  await delay(WAIT_MS);
  t.is(container.children.length, 0);
  store.dispatch({
    type:    'CANDIDATES',
    payload: {
      items:      [createCandidate('link', 0), createCandidate('link', 1)],
      separators: [],
    },
  });
  await delay(WAIT_MS);
  t.is(container.children.length, 3);
});

test.serial('creates links marks and higlighter overlay for three candidates', async (t) => {
  const { container } = overlay;
  await delay(WAIT_MS);
  t.is(container.children.length, 0);
  store.dispatch({
    type:    'CANDIDATES',
    payload: {
      items: [
        createCandidate('tab', 0),
        createCandidate('link', 1),
        createCandidate('link', 2),
      ],
      separators: [],
      index:      1,
    },
  });
  await delay(WAIT_MS);
  t.is(container.children.length, 3);
});

test.serial('no overlays for active non-link candidate', async (t) => {
  const { container } = overlay;
  await delay(WAIT_MS);
  t.is(container.children.length, 0);
  store.dispatch({
    type:    'CANDIDATES',
    payload: {
      items: [
        createCandidate('tab', 0),
        createCandidate('link', 1),
        createCandidate('link', 2),
      ],
      separators: [],
      index:      0,
    },
  });
  await delay(WAIT_MS);
  t.is(container.children.length, 0);
});
