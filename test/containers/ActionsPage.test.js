import test from 'ava';

import {
  mapStateToProps,
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
