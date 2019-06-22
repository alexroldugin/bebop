import { combineReducers } from 'redux';
import {
  query,
  candidatesIndex,
} from './candidates';

export default () => combineReducers({
  query,
  candidates: combineReducers({
    index: candidatesIndex,
  }),
});
