import {
  call,
  takeEvery,
  put,
} from 'redux-saga/effects';

import { LOCATION_CHANGE } from 'connected-react-router';

import homeRootReducers from '../reducers/home';
import homeRootSaga from './home';

import actionsReducers from '../reducers/actions';
import actionsRootSaga from './actions';

import commandReducers from '../reducers/command';
import commandSetZoomRootSaga from './command-set-zoom';
// import commandManageCookiesSaga from './command-manage-cookies';

import getReducerInjectors from '../utils/reducer_injectors';
import getSagaInjectors from '../utils/saga_injectors';

const locationSagas = {
  '/':                 homeRootSaga,
  '/actions':          actionsRootSaga,
  '/command-set-zoom': commandSetZoomRootSaga,
  // '/command-manage-cookies': commandManageCookiesSaga,
};

const locationReducers = {
  '/':        homeRootReducers(),
  '/actions': actionsReducers(),
  common:     commandReducers(),
};

export function handleLocationChangeFactory(store) {
  return function* handleLocationChange({ payload: { location } }) {
    const reducerInjectors = yield call(getReducerInjectors, store);
    yield call(reducerInjectors.ejectAllReducers);

    const sagaInjectors = yield call(getSagaInjectors, store);
    yield call(sagaInjectors.ejectAllSagas);

    const reducer = locationReducers[location.pathname]
      ? locationReducers[location.pathname] : locationReducers.common;
    yield call(
      reducerInjectors.injectReducer,
      location.pathname === '/' ? 'home' : location.pathname,
      reducer,
    );

    const saga = locationSagas[location.pathname] ? locationSagas[location.pathname] : null;
    if (saga) {
      yield call(sagaInjectors.injectSaga, location.pathname, saga);
      yield put({ type: 'PAGE_INJECTED', payload: location.pathname });
    }
  };
}

export default function locationChangeSagaFactory(store) {
  return function* locationChangeSaga() {
    yield takeEvery(LOCATION_CHANGE, handleLocationChangeFactory(store));
  };
}
