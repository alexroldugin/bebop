import test from 'ava';
import {
  uncirculateIndex,
} from '../../src/utils/array';

function checkUncirculateIndex(t, { items, index }, expected) {
  t.is(uncirculateIndex(items, index), expected);
}

test(
  'uncirculateIndex | zero elements with index=0', checkUncirculateIndex,
  { items: [], index: 0 },
  0,
);

test(
  'uncirculateIndex | zero elements with index=1', checkUncirculateIndex,
  { items: [], index: 1 },
  0,
);

test(
  'uncirculateIndex | one element with index=0', checkUncirculateIndex,
  { items: ['item0'], index: 0 },
  0,
);

test(
  'uncirculateIndex | one element with first index', checkUncirculateIndex,
  { items: ['item0'], index: 1 },
  0,
);

test(
  'uncirculateIndex | one element with negative index', checkUncirculateIndex,
  { items: ['item0'], index: -1 },
  0,
);

test(
  'uncirculateIndex | two elements with index=0', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: 0 },
  0,
);

test(
  'uncirculateIndex | two elements with index=1', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: 1 },
  1,
);

test(
  'uncirculateIndex | two elements with index=-1', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: -1 },
  1,
);

test(
  'uncirculateIndex | two elements with index=2', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: 2 },
  0,
);

test(
  'uncirculateIndex | two elements with index=-2', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: -2 },
  0,
);

test(
  'uncirculateIndex | two elements with index=3', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: 3 },
  1,
);

test(
  'uncirculateIndex | two elements with index=-3', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: -3 },
  1,
);

test(
  'uncirculateIndex | two elements with index=4', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: 4 },
  0,
);

test(
  'uncirculateIndex | two elements with index=-4', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: -4 },
  0,
);

test(
  'uncirculateIndex | two elements with index=-5', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: -5 },
  1,
);

test(
  'uncirculateIndex | two elements with index=-6', checkUncirculateIndex,
  { items: ['item0', 'item1'], index: -6 },
  0,
);
