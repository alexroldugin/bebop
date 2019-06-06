import test from 'ava';
import nisemono from 'nisemono';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReactTestUtils from 'react-dom/test-utils';
import { start, stop, popupCloseMiddleware } from '../src/popup';

import { init as candidateInit } from '../src/candidates';
import { init as actionInit } from '../src/actions';
import popupReducers from '../src/reducers/popup';
import optionsReducers from '../src/reducers/options';
import popupSaga, { port } from '../src/sagas/popup';
import { watchKeySequence } from '../src/sagas/key_sequence';

const WAIT_MS = 250;
const delay  = ms => new Promise(resolve => setTimeout(resolve, ms));
const ENTER = 13;
const SPC   = 32;
const TAB   = 9;

actionInit();

const { close } = window;

let popup = null;
let store = null;

function code(c) {
  return c.toUpperCase().charCodeAt(0);
}

function keyDown(node, keyCode, { s = false, c = false, m = false } = {}) {
  ReactTestUtils.Simulate.keyDown(node, {
    keyCode,
    key:      keyCode,
    which:    keyCode,
    shiftKey: s,
    ctrlKey:  c,
    metaKey:  m,
  });
}

function getSelectedIndex() {
  const items = document.getElementsByClassName('candidate');
  const selected = document.getElementsByClassName('selected');
  if (selected.length > 0) {
    for (let i = 0; i < items.length; i += 1) {
      if (items[i] === selected[0]) {
        return i;
      }
    }
  }
  return -1;
}

async function setup() {
  document.scrollingElement = { scrollTo: nisemono.func() };
  nisemono.expects(document.scrollingElement.scrollTo).returns();
  window.close = nisemono.func();

  const state = {
    options: {},
    popup:   {},
  };
  candidateInit(state.options);
  const sagaMiddleware = createSagaMiddleware();
  const middleware     = [
    sagaMiddleware,
    popupCloseMiddleware,
  ];
  const reducers = combineReducers({
    options: optionsReducers(),
    popup:   popupReducers(),
  });
  store = createStore(reducers, state, applyMiddleware(...middleware));

  function* mergedSaga() {
    yield all([
      fork(popupSaga),
      fork(watchKeySequence),
    ]);
  }
  store.task = sagaMiddleware.run(mergedSaga);
  store.ready = () => Promise.resolve();

  popup = await start({ store });
}

function restore() {
  document.scrollingElement = null;
  window.close = close;

  stop({ container: popup.container, store });
  store = null;
  popup = null;
}

test.beforeEach(setup);
test.afterEach(restore);

test.serial('popup succeeds in rendering html', async (t) => {
  await delay(WAIT_MS);
  const { document } = window;

  const input = document.querySelector('.commandInput');
  t.truthy(input !== null);
  const candidate = document.querySelector('.candidate');
  t.truthy(candidate !== null);
  await delay(500);
});

test.serial('popup changes a candidate', async (t) => {
  await delay(WAIT_MS);
  const { document } = window;
  const input = document.querySelector('.commandInput');
  const { length } = document.getElementsByClassName('candidate');
  t.is(getSelectedIndex(), 0);

  keyDown(input, TAB);
  await delay(WAIT_MS);
  t.is(getSelectedIndex(), 1);

  keyDown(input, TAB, { s: true });
  await delay(WAIT_MS);
  t.is(getSelectedIndex(), 0);

  keyDown(input, TAB, { s: true });
  await delay(WAIT_MS);
  t.is(getSelectedIndex(), length - 1);

  keyDown(input, TAB);
  await delay(WAIT_MS);
  t.is(getSelectedIndex(), 0);
});

test.serial('popup selects a candidate by `return`', async (t) => {
  await delay(WAIT_MS);
  const { document } = window;
  const input = document.querySelector('.commandInput');
  input.value = 'aa';
  ReactTestUtils.Simulate.change(input);
  keyDown(input, ENTER);
  t.pass();
  await delay(WAIT_MS);
});

test.serial('popup selects a candidate by `click`', async (t) => {
  await delay(WAIT_MS);
  const { document } = window;
  const candidate = document.querySelector('.candidate');
  ReactTestUtils.Simulate.click(candidate);
  t.pass();
  await delay(WAIT_MS);
});

test.serial('popup selects action lists', async (t) => {
  await delay(WAIT_MS);
  const { document } = window;
  const input = document.querySelector('.commandInput');
  ReactTestUtils.Simulate.change(input);
  keyDown(input, code('i'), { c: true });
  await delay(WAIT_MS);
  keyDown(input, code('i'), { c: true });
  t.pass();
  await delay(WAIT_MS);
});


test.serial('popup selects a action and `return`', async (t) => {
  await delay(WAIT_MS);
  const { document } = window;
  const input = document.querySelector('.commandInput');
  ReactTestUtils.Simulate.change(input);
  keyDown(input, code('i'), { c: true });
  await delay(WAIT_MS);
  keyDown(input, ENTER);
  t.pass();
  await delay(WAIT_MS);
});

test.serial('popup selects a action and `click`', async (t) => {
  await delay(WAIT_MS);
  const { document } = window;
  const input = document.querySelector('.commandInput');
  ReactTestUtils.Simulate.change(input);
  keyDown(input, code('i'), { c: true });
  await delay(WAIT_MS);
  const candidate = document.querySelector('.candidate');
  t.truthy(candidate !== null);
  ReactTestUtils.Simulate.click(candidate);
  t.pass();
  await delay(WAIT_MS);
});

test.serial('popup marks candidates', async (t) => {
  await delay(WAIT_MS);
  const { document } = window;
  const input = document.querySelector('.commandInput');
  keyDown(input, SPC, { c: true });
  await delay(WAIT_MS);
  const candidate = document.querySelector('.candidate.marked');
  t.truthy(candidate !== null);
  await delay(WAIT_MS);
});

test.serial('popup cannot marks actions', async (t) => {
  await delay(WAIT_MS);
  const { document } = window;
  const input = document.querySelector('.commandInput');
  keyDown(input, code('i'), { c: true });
  await delay(WAIT_MS);
  keyDown(input, SPC, { c: true });
  await delay(WAIT_MS);
  const markedCandidate = document.querySelector('.candidate.marked');
  t.truthy(markedCandidate === null);
  await delay(WAIT_MS);
});

test.serial('popup handles REQUEST_ARG message', async (t) => {
  await delay(WAIT_MS);
  const input = document.querySelector('.commandInput');
  port.messageListeners.forEach((l) => {
    l({
      type:    'REQUEST_ARG',
      payload: {
        scheme: {
          type:    'number',
          title:   'arg title',
          minimum: 0,
          maximum: 10,
        },
      },
    });
    keyDown(input, code('1'));
    keyDown(input, ENTER);
  });
  await delay(WAIT_MS);
  t.pass();
});

test.serial('popup handles TAB_CHANGED action and close', async (t) => {
  await delay(WAIT_MS);
  port.messageListeners.forEach((l) => {
    l({ type: 'TAB_CHANGED' });
  });
  t.pass();
  await delay(WAIT_MS);
});

test.serial('popup handles TAB_CHANGED action re-focus', async (t) => {
  await delay(WAIT_MS);
  port.messageListeners.forEach((l) => {
    l({ type: 'TAB_CHANGED', payload: { canFocusToPopup: true } });
  });
  t.pass();
  await delay(WAIT_MS);
});

test.serial('popup closes itself on POPUP_QUIT action re-focus', async (t) => {
  await delay(WAIT_MS);
  const { document } = window;
  const input = document.querySelector('.commandInput');
  ReactTestUtils.Simulate.change(input);
  keyDown(input, code('g'), { c: true });
  await delay(WAIT_MS);
  t.true(window.close.isCalled);
  await delay(WAIT_MS);
});

test.serial('popupCloseMiddleware ignores all actions non-equal to POPUP_QUIT', async (t) => {
  const next = nisemono.func();
  const action = { type: 'NON_POPUP_QUIT' };
  const w = window;
  global.window = nisemono.obj(window);
  global.window.parent = null;

  popupCloseMiddleware()(next)(action);

  t.true(next.isCalled);
  t.false(global.window.close.isCalled);
  t.pass();

  global.window = w;
});

test.serial('popupCloseMiddleware closes popup-window for popup-button case', async (t) => {
  const next = nisemono.func();
  const action = { type: 'POPUP_QUIT' };
  const w = window;
  global.window = nisemono.obj(window);
  global.window.parent = global.window;

  popupCloseMiddleware()(next)(action);

  t.false(next.isCalled);
  t.true(global.window.close.isCalled);
  t.pass();

  global.window = w;
});

test.serial('popupCloseMiddleware posts CLOSE message to window for content-window case', async (t) => {
  const next = nisemono.func();
  const action = { type: 'POPUP_QUIT' };
  const w = window;
  global.window = nisemono.obj(window);
  global.window.parent = nisemono.obj(global.window.parent, { only: ['postMessage'] });
  const { postMessage } = global.window.parent;

  popupCloseMiddleware()(next)(action);

  t.false(next.isCalled);
  t.false(window.close.isCalled);

  t.true(postMessage.isCalled);
  t.is(1, postMessage.calls.length);
  const call = postMessage.calls[0];
  t.is(2, call.args.length);
  t.is('{"type":"CLOSE"}', call.args[0]);
  t.is('*', call.args[1]);

  t.pass();
  global.window = w;
});
