import { combineReducers } from 'redux';

import optionsReducers from './options';
import popupReducers from './popup';

const rootReducer = () => combineReducers({
  popup:   popupReducers(),
  options: optionsReducers(),
});

export default rootReducer;
