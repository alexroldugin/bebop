import test                 from 'ava';
import { mount }            from 'enzyme';
import React                from 'react';
import { Provider } from 'react-redux';
import {
  createStore,
} from 'redux';

import ThemeProvider from '../../src/containers/ThemeProvider';
import globalReducers from '../../src/reducers/global';

function setup() {
  document.documentElement.setAttribute('data-theme', '');
}

function restore() {
  document.documentElement.setAttribute('data-theme', '');
}

test.beforeEach(setup);
test.afterEach(restore);

test.serial('<ThemeProvider /> should render its child', async (t) => {
  const store = createStore(globalReducers());
  const children = <h1>Test</h1>;
  const element = (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
  const wrapper = mount(element);
  t.truthy(wrapper.find(ThemeProvider).children());
  t.is(1, wrapper.find(ThemeProvider).children().length);
});

test.serial('<ThemeProvider /> sets up string data-theme attribute', async (t) => {
  const theme = 'some-theme-name';
  const state = {
    options: { theme },
  };
  const store = createStore(globalReducers(), state);
  const children = <h1>Test</h1>;
  const element = (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
  t.is('', document.documentElement.getAttribute('data-theme'));
  mount(element);
  t.is(theme, document.documentElement.getAttribute('data-theme'));
});

test.serial('<ThemeProvider /> sets up empty data-theme attribute', async (t) => {
  const theme = '';
  const state = {
    options: { theme },
  };
  const store = createStore(globalReducers(), state);
  const children = <h1>Test</h1>;
  const element = (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
  t.is('', document.documentElement.getAttribute('data-theme'));
  mount(element);
  t.is(theme, document.documentElement.getAttribute('data-theme'));
});
