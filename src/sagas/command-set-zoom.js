import browser from 'webextension-polyfill';
import {
  fork,
  takeEvery,
  put,
  select,
  all,
  call,
} from 'redux-saga/effects';

import { getActiveContentTab } from '../utils/tabs';
import { range } from '../utils/array';
import getMessage from '../utils/i18n';

import {
  makeSelectCandidatesItems,
  makeSelectCandidatesIndex,
} from '../selectors/command';

const REDUX_ROOT_KEY = 'command-set-zoom';

export function* handleZoomChange() {
  const actionIndex = yield select(makeSelectCandidatesIndex(REDUX_ROOT_KEY));
  const actionItems = yield select(makeSelectCandidatesItems(REDUX_ROOT_KEY));
  const action = actionItems[actionIndex];

  if (action) {
    const zoomFactor = action.id / 100;
    const { id: tabId } = yield call(getActiveContentTab);
    yield call(browser.tabs.setZoom, tabId, zoomFactor);
  }
}

export function* handlePageInjected() {
  const items = range(30, 310, 10).map(x => ({
    id:         x,
    label:      `${x}%`,
    type:       'command',
    faviconUrl: browser.extension.getURL('images/zoom.png'),
  }));
  const { id: tabId } = yield call(getActiveContentTab);
  const zoomFactor    = yield call(browser.tabs.getZoom, tabId);
  const zoom = Math.round(zoomFactor * 100);
  const index = items.findIndex(e => e.id === zoom);
  const separators = [{ index: 0, label: getMessage('command_set_zoom_separator') }];

  yield put({ type: 'QUERY', payload: '' });
  yield put({ type: 'CANDIDATES', payload: { items, separators, index } });
}

export function* watchZoomChange() {
  yield takeEvery(['NEXT_CANDIDATE', 'PREVIOUS_CANDIDATE'], handleZoomChange);
}

export function* watchPageInjected() {
  yield takeEvery('PAGE_INJECTED', handlePageInjected);
}

export default function* root() {
  yield all([
    fork(watchZoomChange),
    fork(watchPageInjected),
  ]);
}
