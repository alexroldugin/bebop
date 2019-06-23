import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';

import history from '../utils/history';

import optionsReducers from './options';

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    router:  connectRouter(history),
    options: optionsReducers(),
    ...injectedReducers,
  });

  return rootReducer;
}
