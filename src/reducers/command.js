import { combineReducers } from 'redux';
import {
  query,
  candidatesItems,
  candidatesIndex,
  separators,
  markedCandidateIds,
} from './candidates';

export default () => combineReducers({
  query,
  separators,
  candidates: combineReducers({
    items: candidatesItems,
    index: candidatesIndex,
  }),
  markedCandidateIds,
});
