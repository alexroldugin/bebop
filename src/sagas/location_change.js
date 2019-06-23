import {
  call,
  takeEvery,
} from 'redux-saga/effects';

import { LOCATION_CHANGE } from 'connected-react-router';

import homeRootReducers from '../reducers/home';
import homeRootSaga from './home';

import actionsReducers from '../reducers/actions';
import actionsRootSaga from './actions';

import getReducerInjectors from '../utils/reducer_injectors';
import getSagaInjectors from '../utils/saga_injectors';

export function handleLocationChangeFactory(store) {
  return function* handleLocationChange({ payload: { location } }) {
    const reducerInjectors = yield call(getReducerInjectors, store);
    yield call(reducerInjectors.ejectAllReducers);

    const sagaInjectors = yield call(getSagaInjectors, store);
    yield call(sagaInjectors.ejectAllSagas);

    switch (location.pathname) {
      case '/':
        yield call(reducerInjectors.injectReducer, 'popup', homeRootReducers());
        yield call(sagaInjectors.injectSaga, 'home', homeRootSaga);
        break;
      case '/actions':
        yield call(reducerInjectors.injectReducer, 'actions', actionsReducers());
        yield call(sagaInjectors.injectSaga, 'actions', actionsRootSaga);
        break;
      default:
        break;
    }
  };
}

export default function locationChangeSagaFactory(store) {
  return function* locationChangeSaga() {
    yield takeEvery(LOCATION_CHANGE, handleLocationChangeFactory(store));
  };
}
