import test                 from 'ava';
import React                from 'react';
import render from 'react-test-renderer';

import PopupPage from '../../src/components/PopupPage';

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
  mode, candidates, index, separators, markedCandidateIds, scheme,
}) => test(name(mode), async (t) => {
  const element = (
    <PopupPage
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
