import {
  call,
  take,
  put,
} from 'redux-saga/effects';

import { LOCATION_CHANGE } from 'connected-react-router';

import getSagaInjectors    from '../utils/saga_injectors';
import getReducerInjectors from '../utils/reducer_injectors';

export default function handleLifeCycleFactory(store) {
  return function* watchLifeCycle() {
    const reducerInjectors = yield call(getReducerInjectors, store);
    const sagaInjectors = yield call(getSagaInjectors, store);

    while (true) {
      const { payload } = yield take('PAGE_INJECTED');
      if (payload === '/') {
        yield put({ type: 'QUERY', payload: '' });
        yield take('POPUP_CLOSED');

        // eject all injected reducers/sagas in any state we've stoped
        yield call(reducerInjectors.ejectAllReducers);
        yield call(sagaInjectors.ejectAllSagas);

        // prepare to next execution
        // fix router's location to bo root-page
        yield put({
          type:    LOCATION_CHANGE,
          payload: {
            location: { pathname: '/' },
            action:   'POP',
          },
        });
        yield take('PAGE_INJECTED');

        // TODO take into consideration case when QUERY is not completed yet but we attempt to
        // TODO open popup and it's injections will concur with ejections below

        // initialize with default data loading
        yield put({ type: 'QUERY', payload: '' });
        yield take('CANDIDATES');

        yield call(reducerInjectors.ejectAllReducers);
        yield call(sagaInjectors.ejectAllSagas);
      }
    }
  };
}
