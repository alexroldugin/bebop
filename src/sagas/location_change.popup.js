import {
  call,
  takeEvery,
} from 'redux-saga/effects';

import { LOCATION_CHANGE } from 'connected-react-router';

import homeRootSaga from './home.popup';
import actionsRootSaga from './actions.popup';

import commandManageCookiesSaga from './command-manage-cookies.popup';
import commandManageCookiesActionsSaga from './command-manage-cookies-actions.popup';
import commonSaga from './common.popup';

import getSagaInjectors from '../utils/saga_injectors';

const locationSagas = {
  '/':                               homeRootSaga,
  '/actions':                        actionsRootSaga,
  common:                            commonSaga,
  '/command-manage-cookies':         commandManageCookiesSaga,
  '/command-manage-cookies-actions': commandManageCookiesActionsSaga,
};
let m;

export function handleLocationChangeFactory(store) {
  return function* handleLocationChange({ payload: { location } }) {
    const sagaInjectors = yield call(getSagaInjectors, store);
    yield call(sagaInjectors.ejectAllSagas);

    const commandSaga = locationSagas[location.pathname]
      ? locationSagas[location.pathname] : locationSagas.common;
    yield call(sagaInjectors.injectSaga, location.pathname, commandSaga);
  };
}

export function watchLocationChangeSagaFactory(store) {
  return function* watchLocationChange() {
    yield takeEvery(LOCATION_CHANGE, m.handleLocationChangeFactory(store));
  };
}

m = {
  handleLocationChangeFactory,
};

export const content = m;

export default watchLocationChangeSagaFactory;
