import test from 'ava';
import nisemono from 'nisemono';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../../src/containers/CommandPage';

const tabCandidate = {
  id:         'tab_item_id',
  label:      'Tab Candidate Label',
  type:       'tab',
  args:       [],
  faviconUrl: 'some://test.tab.url',
};

const linkCandidate = {
  id:         'link_item_id',
  label:      'Link Candidate Label',
  type:       'link',
  args:       [],
  faviconUrl: 'some://test.link.url',
};


test('props | items for tab candidate and empty query', (t) => {
  const props = mapStateToProps({
    command: {
      candidates: {
        items: [tabCandidate],
        index: 0,
      },
      separators: [],
    },
  });
  t.snapshot(props);
});

test('props | items for tab candidate and query specified', (t) => {
  const props = mapStateToProps({
    command: {
      query:      '',
      candidates: {
        items: [tabCandidate],
        index: 0,
      },
      separators: [],
    },
  });
  t.snapshot(props);
});

test('props | items for two candidates and empty query', (t) => {
  const props = mapStateToProps({
    command: {
      query:      '',
      candidates: {
        items: [tabCandidate, linkCandidate],
        index: 1,
      },
      separators: [],
    },
  });
  t.snapshot(props);
});

test('props | items for two candidates, separator and empty query', (t) => {
  const props = mapStateToProps({
    command: {
      query:      '',
      candidates: {
        items: [tabCandidate, linkCandidate],
        index: 1,
      },
      separators: [{ label: 'separator label', index: 22 }],
    },
  });
  t.snapshot(props);
});


test('props | filtered items for two candidate and query specified', (t) => {
  const props = mapStateToProps({
    command: {
      query:      'Lin',
      candidates: {
        items: [linkCandidate, tabCandidate],
        index: 0,
      },
      separators: [],
    },
  });
  t.snapshot(props);
});

test('dispatch | dispatches nothing on handleSelectCandidate', (t) => {
  const dispatch = nisemono.func();
  const payload = 'some payload data';

  const handlers = mapDispatchToProps(dispatch);
  handlers.handleSelectCandidate(payload);

  t.false(dispatch.isCalled);
});

test('dispatch | dispatches QUERY on handleInputChange', (t) => {
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

test('dispatch | dispatches EXIT on dispatchQuit', (t) => {
  const dispatch = nisemono.func();

  const handlers = mapDispatchToProps(dispatch);
  handlers.dispatchQuit();

  t.is(1, dispatch.calls.length);

  const call = dispatch.calls[0];
  t.deepEqual([{ type: 'EXIT' }], call.args);
});

// TODO optimize code duplication for handleKeyDown in ActionsPage and HomePage
test('dispatch | dispatches KEY_SEQUENCES for known keybinding in handleKeyDown', (t) => {
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

// TODO optimize code duplication for handleKeyDown in ActionsPage and HomePage
test('dispatch | doesn\'t dispatch KEY_SEQUENCES for unknown keybinding in handleKeyDown', (t) => {
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
