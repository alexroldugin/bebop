import browser from 'webextension-polyfill';

import test from 'ava';
import nisemono from 'nisemono';
import {
  put,
  takeEvery,
  all,
  fork,
  call,
} from 'redux-saga/effects';

import { getActiveContentTab } from '../../src/utils/tabs';
import * as arrayContent from '../../src/utils/array';

import rootSaga, {
  watchPageInjected,
  watchZoomChange,
  handlePageInjected,
  handleZoomChange,
} from '../../src/sagas/command-set-zoom';

const { range } = arrayContent;

test('watches for PAGE_INJECTED', (t) => {
  const gen = watchPageInjected();
  t.deepEqual(gen.next().value, takeEvery('PAGE_INJECTED', handlePageInjected));
  t.true(gen.next().done);
});

test('watches for (NEXT|PREVIOUS)_CANDIDATE', (t) => {
  const gen = watchZoomChange();
  t.deepEqual(gen.next().value, takeEvery(['NEXT_CANDIDATE', 'PREVIOUS_CANDIDATE'], handleZoomChange));
  t.true(gen.next().done);
});

test('by default exports all sagas in parallel', (t) => {
  const gen = rootSaga();
  t.deepEqual(gen.next().value, all([
    fork(watchZoomChange),
    fork(watchPageInjected),
  ]));
  t.true(gen.next().done);
});

test('setups new zoom value according to currently active candidte', (t) => {
  const gen = handleZoomChange();
  const index = 0;
  const items = [{ id: 220 }, { id: 230 }, { id: 240 }];
  const tabId = 1258;
  const { setZoom } = browser.tabs;
  browser.tabs.setZoom = nisemono.func();

  gen.next(); // index
  gen.next(index); // items
  t.deepEqual(
    gen.next(items).value,
    call(getActiveContentTab),
  );
  t.deepEqual(
    gen.next({ id: tabId }).value, // tab info
    call(browser.tabs.setZoom, tabId, 2.2),
  );
  t.true(gen.next().done);
  browser.tabs.setZoom = setZoom;
});

test('ignore setup of new zoom value for item that not found', (t) => {
  const gen = handleZoomChange();
  const index = 25;
  const items = [{ id: 220 }, { id: 230 }, { id: 240 }];

  gen.next(); // index
  gen.next(index); // items
  t.true(gen.next(items).done);
});

test('initializes candidates on PAGE_INJECTED', (t) => {
  const gen = handlePageInjected();
  const zoomRange = [100, 120, 200];
  const zoomFactor = 1.2;
  const tabId = 254;
  arrayContent.range = () => zoomRange;
  const { getZoom } = browser.tabs;
  browser.tabs.getZoom = nisemono.func();

  t.deepEqual(
    gen.next().value,
    call(getActiveContentTab),
  );
  t.deepEqual(
    gen.next({ id: tabId }).value,
    call(browser.tabs.getZoom, tabId),
  );
  t.deepEqual(
    gen.next(zoomFactor).value,
    put({ type: 'QUERY', payload: '' }),
  );
  t.snapshot(gen.next().value);
  t.true(gen.next().done);

  arrayContent.range = range;
  browser.tabs.getZoom = getZoom;
});
