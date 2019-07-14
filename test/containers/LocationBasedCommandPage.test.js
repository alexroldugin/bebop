import test from 'ava';

import React from 'react';
import { Provider } from 'react-redux';
import {
  createStore,
  combineReducers,
} from 'redux';

import render    from 'react-test-renderer';

import LocationBasedCommandPage from '../../src/containers/LocationBasedCommandPage';

const preloadedState = {
  'command-empty-page': {
    query:      '',
    separators: [],
    candidates: {
      items: [],
      index: 0,
    },
  },
  'command-items-page': {
    query:      '',
    separators: [],
    candidates: {
      items: [{ id: '0', label: 'label1', type: 'tab' }, { id: '1', label: 'label2', type: 'tab' }],
      index: 1,
    },
  },
};

const reducers = combineReducers({
  'command-items-page': (state = {}) => state,
  'command-empty-page': (state = {}) => state,
});
const store = createStore(reducers, preloadedState);

test('renders command-empty-page', (t) => {
  const element = (
    <Provider store={store}>
      <LocationBasedCommandPage location={{ pathname: '/command-empty-page' }} />
    </Provider>
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});

test('renders command-items-page', (t) => {
  const element = (
    <Provider store={store}>
      <LocationBasedCommandPage location={{ pathname: '/command-items-page' }} />
    </Provider>
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});
