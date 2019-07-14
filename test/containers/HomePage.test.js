import test from 'ava';

import {
  mapStateToProps,
} from '../../src/containers/HomePage';

const candidate = {
  id:         'item_id',
  label:      'Label',
  type:       'tab',
  args:       [],
  faviconUrl: 'some://test.url',
};

test('<HomePage /> | props | with default state', (t) => {
  t.deepEqual(mapStateToProps(), {
    query:              '',
    candidates:         [],
    index:              0,
    separators:         [],
    markedCandidateIds: {},
    mode:               'candidate',
    scheme:             {
      enum: [],
    },
  });
});

test('<HomePage /> | props | with default state specified directly', (t) => {
  t.deepEqual(mapStateToProps({
    home: {
      query:      'query value',
      candidates: {
        items: [],
        index: 0,
      },
      separators:         [],
      markedCandidateIds: {},
      scheme:             {
        enum: [],
      },
    },
  }), {
    query:              'query value',
    candidates:         [],
    index:              0,
    separators:         [],
    markedCandidateIds: {},
    mode:               'candidate',
    scheme:             { enum: [] },
  });
});

test('<HomePage /> | props | with state with one candidate', (t) => {
  t.deepEqual(mapStateToProps({
    home: {
      query:      'query',
      candidates: {
        items: [candidate],
        index: 0,
      },
      separators:         [],
      markedCandidateIds: {},
      scheme:             {
        enum: [],
      },
    },
  }), {
    query:              'query',
    candidates:         [candidate],
    index:              0,
    separators:         [],
    markedCandidateIds: {},
    mode:               'candidate',
    scheme:             { enum: [] },
  });
});

test('<HomePage /> | props | with state with two candidates and mode | index=0', (t) => {
  t.deepEqual(mapStateToProps({
    home: {
      query:      'query',
      candidates: {
        items: [candidate, candidate],
        index: 0,
      },
      separators:         [],
      markedCandidateIds: {},
      scheme:             {
        enum: [],
      },
    },
  }), {
    query:              'query',
    candidates:         [candidate, candidate],
    index:              0,
    separators:         [],
    markedCandidateIds: {},
    mode:               'candidate',
    scheme:             { enum: [] },
  });
});

test('<HomePage /> | props | with state with two candidates and mode | index=1', (t) => {
  t.deepEqual(mapStateToProps({
    home: {
      query:      'value',
      candidates: {
        items: [candidate, candidate],
        index: 1,
      },
      separators:         [],
      markedCandidateIds: {},
      scheme:             {
        enum: [],
      },
    },
  }), {
    query:              'value',
    candidates:         [candidate, candidate],
    index:              1,
    separators:         [],
    markedCandidateIds: {},
    mode:               'candidate',
    scheme:             { enum: [] },
  });
});

test('<HomePage /> | props | with state with two candidates and mode | index=2', (t) => {
  t.deepEqual(mapStateToProps({
    home: {
      query:      'value',
      candidates: {
        items: [candidate, candidate],
        index: 2,
      },
      separators:         [],
      markedCandidateIds: {},
      scheme:             {
        enum: [],
      },
    },
  }), {
    query:              'value',
    candidates:         [candidate, candidate],
    index:              0,
    separators:         [],
    markedCandidateIds: {},
    mode:               'candidate',
    scheme:             { enum: [] },
  });
});
