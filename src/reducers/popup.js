import { combineReducers } from 'redux';

const defaultScheme = { type: 'object' };

const query = (state = '', action) => {
  switch (action.type) {
    case 'QUERY':
      return action.payload;
    case 'SAVE_CANDIDATES':
      return '';
    case 'RESTORE_CANDIDATES':
      return action.payload.query;
    case 'REQUEST_ARG':
      return '';
    default:
      return state;
  }
};

function normalize({ index, items }) {
  return { index: (index + items.length) % items.length, items };
}

const candidates = (state = { index: null, items: [] }, action) => {
  switch (action.type) {
    case 'CANDIDATES': {
      const { items } = action.payload;
      return normalize({ index: state.index, items });
    }
    case 'NEXT_CANDIDATE': {
      const i = state.index;
      return normalize({ index: (Number.isNaN(i) ? -1 : i) + 1, items: state.items });
    }
    case 'PREVIOUS_CANDIDATE': {
      const i = state.index;
      return normalize({ index: (Number.isNaN(i) ? 0 : i) - 1, items: state.items });
    }
    case 'SAVE_CANDIDATES':
      return { index: null, items: state.items };
    case 'RESTORE_CANDIDATES': {
      const { index, items } = action.payload;
      return normalize({ index, items });
    }
    case 'CANDIDATE_MARKED':
      return normalize({ index: state.index + 1, items: state.items });
    case 'REQUEST_ARG': {
      const { scheme } = action.payload;
      return { index: null, items: scheme.enum || [] };
    }
    default:
      return state;
  }
};

const separators = (state = [], action) => {
  switch (action.type) {
    case 'CANDIDATES':
      return action.payload.separators;
    case 'RESTORE_CANDIDATES':
      return action.payload.separators;
    case 'REQUEST_ARG': {
      return [];
    }
    default:
      return state;
  }
};

const markedCandidateIds = (state = {}, action) => {
  switch (action.type) {
    case 'CANDIDATE_MARKED': {
      const { id } = action.payload;
      return Object.assign({}, state, { [id]: !state[id] });
    }
    case 'CANDIDATES_MARKED': {
      const items = action.payload;
      return items.reduce((acc, { id }) => Object.assign(acc, {
        [id]: true,
      }), state);
    }
    case 'SAVE_CANDIDATES':
      return {};
    case 'RESTORE_CANDIDATES':
      return action.payload.markedCandidateIds;
    case 'REQUEST_ARG':
      return {};
    default:
      return state;
  }
};

const prev = (state = {}, action) => {
  switch (action.type) {
    case 'SAVE_CANDIDATES':
      return action.payload;
    case 'RESTORE_CANDIDATES':
      return {};
    default:
      return state;
  }
};

const mode = (state = 'candidate', action) => {
  switch (action.type) {
    case 'SAVE_CANDIDATES':
      return 'action';
    case 'RESTORE_CANDIDATES':
      return 'candidate';
    case 'REQUEST_ARG':
      return 'arg';
    default:
      return state;
  }
};

const scheme = (state = defaultScheme, action) => {
  switch (action.type) {
    case 'REQUEST_ARG': {
      const { payload } = action;
      return payload.scheme || defaultScheme;
    }
    default:
      return state;
  }
};

export default () => combineReducers({
  query,
  candidates,
  separators,
  markedCandidateIds,
  prev,
  mode,
  scheme,
});
