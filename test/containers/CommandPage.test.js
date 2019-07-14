import test from 'ava';

import {
  makeMapStateToProps,
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

let mapStateToProps;

function setup() {
  mapStateToProps = makeMapStateToProps('command');
}

function restore() {
  mapStateToProps = null;
}

test.beforeEach(setup);
test.afterEach(restore);


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

test('props | filtered items for two candidate and query specified another root', (t) => {
  const stateToProps = makeMapStateToProps('command2');
  const props = stateToProps({
    command2: {
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
