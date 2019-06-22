export const query = (state = '', action) => {
  switch (action.type) {
    case 'QUERY':
      return action.payload;
    default:
      return state;
  }
};

export const candidatesItems = (state = [], action) => {
  switch (action.type) {
    case 'CANDIDATES':
      return action.payload.items;
    default:
      return state;
  }
};

export const candidatesIndex = (state = null, action) => {
  switch (action.type) {
    case 'CANDIDATES':
      return null;
    case 'NEXT_CANDIDATE': {
      const i = state;
      return (Number.isNaN(i) ? -1 : i) + 1;
    }
    case 'PREVIOUS_CANDIDATE': {
      const i = state;
      return (Number.isNaN(i) ? 0 : i) - 1;
    }
    default:
      return state;
  }
};

export const separators = (state = [], action) => {
  switch (action.type) {
    case 'CANDIDATES':
      return action.payload.separators;
    default:
      return state;
  }
};

export const markedCandidateIds = (state = {}, action) => {
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
    default:
      return state;
  }
};
