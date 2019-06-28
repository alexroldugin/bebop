import test from 'ava';
import nisemono from 'nisemono';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../../src/containers/ActionsPage';

import { init as initActions } from '../../src/actions';

initActions();

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


test('<ActionsPage /> | props | actions for tab candidate and empty query', (t) => {
  const props = mapStateToProps({
    home: {
      candidates: {
        items: [tabCandidate],
        index: 0,
      },
    },
    actions: {
      query:      '',
      candidates: {
        items: [],
        index: 0,
      },
    },
  });
  t.snapshot(props);
});

test('<ActionsPage /> | props | actions for tab candidate and query specified', (t) => {
  const props = mapStateToProps({
    home: {
      candidates: {
        items: [tabCandidate],
        index: 0,
      },
    },
    actions: {
      query:      'close',
      candidates: {
        items: [],
        index: 0,
      },
    },
  });
  t.snapshot(props);
});

test('<ActionsPage /> | props | actions for link candidate and empty query', (t) => {
  const props = mapStateToProps({
    home: {
      candidates: {
        items: [tabCandidate, linkCandidate],
        index: 1,
      },
    },
    actions: {
      query:      '',
      candidates: {
        items: [],
        index: 0,
      },
    },
  });
  t.snapshot(props);
});


test('<ActionsPage /> | props | actions for link candidate and query specified', (t) => {
  const props = mapStateToProps({
    home: {
      candidates: {
        items: [linkCandidate, tabCandidate],
        index: 0,
      },
    },
    actions: {
      query:      'open',
      candidates: {
        items: [],
        index: 0,
      },
    },
  });
  t.snapshot(props);
});

test('<ActionsPage /> | dispatch | dispatches nothing on handleSelectCandidate', (t) => {
  const dispatch = nisemono.func();
  const payload = 'some payload data';

  const handlers = mapDispatchToProps(dispatch);
  handlers.handleSelectCandidate(payload);

  t.false(dispatch.isCalled);
});

test('<ActionsPage /> | dispatch | dispatches QUERY on handleInputChange', (t) => {
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

test('<ActionsPage /> | dispatch | dispatches nothing on dispatchQuit', (t) => {
  const dispatch = nisemono.func();

  const handlers = mapDispatchToProps(dispatch);
  handlers.dispatchQuit();

  t.false(dispatch.isCalled);
});

// TODO optimize code duplication for handleKeyDown in ActionsPage and HomePage
test('<ActionsPage /> | dispatch | dispatches KEY_SEQUENCES for known keybinding in handleKeyDown', (t) => {
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
test('<ActionsPage /> | dispatch | doesn\'t dispatch KEY_SEQUENCES for unknown keybinding in handleKeyDown', (t) => {
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
