import {
  fork,
  all,
} from 'redux-saga/effects';

import optionsRootSaga from './options';
import executorRootSaga from './executor';
import locationChangeSagaFactory from './location_change';
import lifeCycleSagaFactory from './lifecycle';

export default function rootFactory(store) {
  return function* root() {
    yield all([
      fork(locationChangeSagaFactory(store)),
      fork(optionsRootSaga),
      fork(executorRootSaga),
      fork(lifeCycleSagaFactory(store)),
    ]);
  };
}
