import test                 from 'ava';
import { mount }            from 'enzyme';
import React                from 'react';
import { Provider } from 'react-redux';
import {
  createStore,
} from 'redux';

import Popup from '../../src/containers/Popup';
import reducers from '../../src/reducers/popup';

const store = createStore(reducers());
const element = (
  <Provider store={store}>
    <Popup />
  </Provider>
);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

test('<Popup />', async (t) => {
  const wrapper = mount(element);
  await delay(500);
  t.is(wrapper.find('form.commandForm').length, 1);
  t.is(wrapper.find('input.commandInput').length, 1);
  t.is(wrapper.find('ul.candidatesList').length, 1);
});
