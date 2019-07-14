import test      from 'ava';
import nisemono  from 'nisemono';
import React     from 'react';
import render    from 'react-test-renderer';

import PopupPage, { mapDispatchToProps } from '../../src/components/PopupPage';

const candidateTabItem = {
  id:         'tab_item_id',
  label:      'Some Tab Label',
  type:       'tab',
  args:       [],
  faviconUrl: 'some://favicon.url',
};

const candidateLinkItem = {
  id:         'link_item_id',
  label:      'Some Link Label',
  type:       'link',
  args:       [],
  faviconUrl: 'some://link.favicon.url',
};

const tn = name => mode => `<PopupPage /> | ${mode} | ${name}`;

const runTestTemplateFunction = (name, {
  query, mode, candidates, index, separators, markedCandidateIds, scheme,
}) => test(name(mode), async (t) => {
  const element = (
    <PopupPage
      query={query}
      candidates={candidates}
      index={index}
      separators={separators}
      markedCandidateIds={markedCandidateIds}
      mode={mode}
      scheme={scheme}

      handleSelectCandidate={() => {}}
      handleInputChange={() => {}}
      handleKeyDown={() => {}}
      dispatchQuit={() => {}}
    />
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});

['candidate', 'action', 'arg'].forEach((mode) => {
  runTestTemplateFunction(
    tn('no candidates snapshot'),
    {
      query:              '',
      candidates:         [],
      index:              null,
      separators:         [],
      markedCandidateIds: {},
      mode,
      scheme:             {
        type:  'none',
        title: 'title for args',
      },
    },
  );

  runTestTemplateFunction(
    tn('no candidates with no query specified snapshot'),
    {
      query:              '',
      candidates:         [],
      index:              null,
      separators:         [],
      markedCandidateIds: {},
      mode,
      scheme:             {
        type:  'none',
        title: 'title for args',
      },
    },
  );

  runTestTemplateFunction(
    tn('no candidates with query specified snapshot'),
    {
      query:              `some query for ${mode}`,
      candidates:         [],
      index:              null,
      separators:         [],
      markedCandidateIds: {},
      mode,
      scheme:             {
        type:  'none',
        title: 'title for args',
      },
    },
  );

  runTestTemplateFunction(
    tn('no candidates snapshot with number args'),
    {
      query:              '',
      candidates:         [],
      index:              null,
      separators:         [],
      markedCandidateIds: {},
      mode,
      scheme:             {
        type:    'number',
        title:   'title for args',
        minimum: 0,
        maximum: 195,
      },
    },
  );

  runTestTemplateFunction(
    tn('one candidate snapshot'),
    {
      query:              '',
      candidates:         [candidateTabItem],
      index:              null,
      separators:         [],
      markedCandidateIds: {},
      mode,
      scheme:             {
        type:  'type1',
        title: 'title for args',
      },
    },
  );

  runTestTemplateFunction(
    tn('two candidates snapshot'),
    {
      query:              '',
      candidates:         [candidateTabItem, candidateLinkItem],
      index:              null,
      separators:         [],
      markedCandidateIds: {},
      mode,
      scheme:             {
        type:  'type2',
        title: 'title for args',
      },
    },
  );

  runTestTemplateFunction(
    tn('two candidates with one marked and selected snapshot'),
    {
      query:              '',
      candidates:         [candidateTabItem, candidateLinkItem],
      index:              1,
      separators:         [],
      markedCandidateIds: { tab_item_id: true },
      mode,
      scheme:             {
        type:  'type3',
        title: 'title for args',
      },
    },
  );

  runTestTemplateFunction(
    tn('two candidates with one marked snapshot'),
    {
      query:              '',
      candidates:         [candidateTabItem, candidateLinkItem],
      index:              null,
      separators:         [],
      markedCandidateIds: { tab_item_id: true },
      mode,
      scheme:             {
        type:  'type4',
        title: 'title for args',
      },
    },
  );

  runTestTemplateFunction(
    tn('two candidates with selected snapshot'),
    {
      query:              '',
      candidates:         [candidateTabItem, candidateLinkItem],
      index:              1,
      separators:         [],
      markedCandidateIds: {},
      mode,
      scheme:             {
        type:  'type5',
        title: 'title for args',
      },
    },
  );

  runTestTemplateFunction(
    tn('two candidates with two marked snapshot'),
    {
      query:              '',
      candidates:         [candidateTabItem, candidateLinkItem],
      index:              null,
      separators:         [],
      markedCandidateIds: { tab_item_id: true, link_item_id: true },
      mode,
      scheme:             {
        type:  'type6',
        title: 'title for args',
      },
    },
  );
});

test('dispatch | dispatches SELECT_DANDIDATE on handleSelectCandidate', (t) => {
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

test('dispatches QUERY on handleInputChange', (t) => {
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

test('dispatches EXIT on dispatchQuit', (t) => {
  const dispatch = nisemono.func();

  const handlers = mapDispatchToProps(dispatch);
  handlers.dispatchQuit();

  t.true(dispatch.isCalled);
  t.is(1, dispatch.calls.length);
  const call1 = dispatch.calls[0];
  t.deepEqual([{ type: 'EXIT' }], call1.args);
});

test('dispatches KEY_SEQUENCES for known keybinding in handleKeyDown', (t) => {
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

test('doesn\'t dispatch KEY_SEQUENCES for unknown keybinding in handleKeyDown', (t) => {
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
