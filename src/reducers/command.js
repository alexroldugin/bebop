import { combineReducers } from 'redux';
import {
  query,
  candidatesItems,
  candidatesIndex,
} from './candidates';

export default () => combineReducers({
  query,
  candidates: combineReducers({
    items: candidatesItems,
    index: candidatesIndex,
  }),
});
