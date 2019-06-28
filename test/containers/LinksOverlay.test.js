import React from 'react';

import test from 'ava';

import render   from 'react-test-renderer';

import { LinksOverlayComponent } from '../../src/containers/LinksOverlay';

const tabCandidate = {
  id:         'tab_item_id',
  label:      'Tab Candidate Label',
  type:       'tab',
  args:       [],
  faviconUrl: 'some://test.tab.url',
};

const linkCandidate1 = {
  id:         'link_item_id1',
  label:      'Link Candidate Label1',
  type:       'link',
  args:       [],
  faviconUrl: 'some://test.link.url1',
  title:      'link title1',
  rect:       {
    left:   0,
    top:    1,
    width:  10,
    height: 15,
  },
};
const linkCandidate2 = {
  id:         'link_item_id2',
  label:      'Link Candidate Label2',
  type:       'link',
  args:       [],
  faviconUrl: 'some://test.link.url2',
  title:      'link title2',
  rect:       {
    left:   100,
    top:    200,
    width:  30,
    height: 15,
  },
};


test('empty data', (t) => {
  const links = [];
  const candidates = [];
  const index = 0;
  const element = (
    <LinksOverlayComponent
      links={links}
      candidates={candidates}
      index={index}
    />
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});

test('no links in candidates', (t) => {
  const links = [];
  const candidates = [tabCandidate];
  const index = 0;
  const element = (
    <LinksOverlayComponent
      links={links}
      candidates={candidates}
      index={index}
    />
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});

test('one link in candidates', (t) => {
  const links = [linkCandidate1];
  const candidates = [linkCandidate1];
  const index = 0;
  const element = (
    <LinksOverlayComponent
      links={links}
      candidates={candidates}
      index={index}
    />
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});

test('one inactive link in two candidates list', (t) => {
  const links = [linkCandidate1];
  const candidates = [linkCandidate1, tabCandidate];
  const index = 1;
  const element = (
    <LinksOverlayComponent
      links={links}
      candidates={candidates}
      index={index}
    />
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});

test('one active link in two candidates list', (t) => {
  const links = [linkCandidate1];
  const candidates = [linkCandidate1, tabCandidate];
  const index = 0;
  const element = (
    <LinksOverlayComponent
      links={links}
      candidates={candidates}
      index={index}
    />
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});

test('two links\' candidates list with first active', (t) => {
  const links = [linkCandidate1, linkCandidate2];
  const candidates = [linkCandidate1, linkCandidate2];
  const index = 0;
  const element = (
    <LinksOverlayComponent
      links={links}
      candidates={candidates}
      index={index}
    />
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});

test('two links\' candidates list with second active', (t) => {
  const links = [linkCandidate1, linkCandidate2];
  const candidates = [linkCandidate1, linkCandidate2];
  const index = 1;
  const element = (
    <LinksOverlayComponent
      links={links}
      candidates={candidates}
      index={index}
    />
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});

test('two links in 3-candidates list with no link active', (t) => {
  const links = [linkCandidate1, linkCandidate2];
  const candidates = [tabCandidate, linkCandidate1, linkCandidate2];
  const index = 0;
  const element = (
    <LinksOverlayComponent
      links={links}
      candidates={candidates}
      index={index}
    />
  );
  const tree = render.create(element).toJSON();
  t.snapshot(tree);
});
