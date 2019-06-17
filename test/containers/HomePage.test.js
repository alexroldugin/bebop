import test from 'ava';
import nisemono from 'nisemono';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../../src/containers/HomePage';

const candidate = {
  id:         'item_id',
  label:      'Label',
  type:       'tab',
  args:       [],
  faviconUrl: 'some://test.url',
};

test('<HomePage /> | props | with default state', (t) => {
  t.deepEqual({
    candidates:         [],
    index:              0,
    separators:         [],
    markedCandidateIds: {},
    mode:               'candidate',
    scheme:             {
      enum: [],
    },
  }, mapStateToProps());
});

test('<HomePage /> | props | with default state specified directly', (t) => {
  t.deepEqual({
    candidates:         [],
    index:              0,
    separators:         [],
    markedCandidateIds: {},
    mode:               'candidate',
    scheme:             { enum: [] },
  }, mapStateToProps({
    popup: {
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
  }));
});

test('<HomePage /> | props | with state with one candidate', (t) => {
  t.deepEqual({
    candidates:         [candidate],
    index:              15,
    separators:         [],
    markedCandidateIds: {},
    mode:               'candidate',
    scheme:             { enum: [] },
  }, mapStateToProps({
    popup: {
      candidates: {
        items: [candidate],
        index: 15,
      },
      separators:         [],
      markedCandidateIds: {},
      scheme:             {
        enum: [],
      },
    },
  }));
});

test('<HomePage /> | props | with state with two candidates and mode', (t) => {
  t.deepEqual({
    candidates:         [candidate, candidate],
    index:              15,
    separators:         [],
    markedCandidateIds: {},
    mode:               'candidate',
    scheme:             { enum: [] },
  }, mapStateToProps({
    popup: {
      candidates: {
        items: [candidate, candidate],
        index: 15,
      },
      separators:         [],
      markedCandidateIds: {},
      scheme:             {
        enum: [],
      },
    },
  }));
});

test('<HomePage /> | dispatch | dispatches SELECT_DANDIDATE on handleSelectCandidate', (t) => {
  const dispatch = nisemono.func();
  const payload = 'some payload data';

  const handlers = mapDispatchToProps(dispatch);
  handlers.handleSelectCandidate(payload);

  t.true(dispatch.isCalled);
  t.is(1, dispatch.calls.length);
  const call = dispatch.calls[0];
  t.is(1, call.args.length);
  t.deepEqual({ type: 'SELECT_CANDIDATE', payload }, call.args[0]);
});

test('<HomePage /> | dispatch | dispatches QUERY on handleInputChange', (t) => {
  const dispatch = nisemono.func();
  const payload = 'some payload data';

  const handlers = mapDispatchToProps(dispatch);
  handlers.handleInputChange(payload);

  t.true(dispatch.isCalled);
  t.is(1, dispatch.calls.length);
  const call = dispatch.calls[0];
  t.is(1, call.args.length);
  t.deepEqual({ type: 'QUERY', payload }, call.args[0]);
});

test('<HomePage /> | dispatch | dispatches POPUP_CLEANUP and POPUP_QUIT on dispatchQuit', (t) => {
  const dispatch = nisemono.func();

  const handlers = mapDispatchToProps(dispatch);
  handlers.dispatchQuit();

  t.true(dispatch.isCalled);
  t.is(2, dispatch.calls.length);
  const call1 = dispatch.calls[0];
  t.is(1, call1.args.length);
  t.deepEqual({ type: 'POPUP_CLEANUP' }, call1.args[0]);

  const call2 = dispatch.calls[1];
  t.is(1, call2.args.length);
  t.deepEqual({ type: 'POPUP_QUIT' }, call2.args[0]);
});

test('<HomePage /> | dispatch | dispatches KEY_SEQUENCES for known keybinding in handleKeyDown', (t) => {
  const dispatch = nisemono.func();
  const SPC_KEY = 32;
  const event = {
    keyCode:        SPC_KEY,
    ctrlKey:        true,
    preventDefault: nisemono.func(),
  };

  const handlers = mapDispatchToProps(dispatch);
  handlers.handleKeyDown(event);

  t.true(dispatch.isCalled);
  t.is(1, dispatch.calls.length);

  const call = dispatch.calls[0];
  t.is(1, call.args.length);
  t.deepEqual({ type: 'KEY_SEQUENCE', payload: 'C-SPC' }, call.args[0]);

  t.true(event.preventDefault.isCalled);
});

test('<HomePage /> | dispatch | doesn\'t dispatch KEY_SEQUENCES for unknown keybinding in handleKeyDown', (t) => {
  const dispatch = nisemono.func();
  const A_KEY = 65;
  const event = {
    keyCode:        A_KEY,
    preventDefault: nisemono.func(),
  };

  const handlers = mapDispatchToProps(dispatch);
  handlers.handleKeyDown(event);

  t.false(dispatch.isCalled);
  t.false(event.preventDefault.isCalled);
});
