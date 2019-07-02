import test from 'ava';
import {
  uncirculateIndex,
  range,
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

function checkRange(t, { start, stop, step }, expected) {
  t.deepEqual(range(start, stop, step), expected);
}

test(
  'range | default step, [0, 5)', checkRange,
  { start: 0, stop: 5 },
  [0, 1, 2, 3, 4],
);

test(
  'range | step=1, [0, 5)', checkRange,
  { start: 0, stop: 5, step: 1 },
  [0, 1, 2, 3, 4],
);

test(
  'range | step=1, [3, 5)', checkRange,
  { start: 3, stop: 5, step: 1 },
  [3, 4],
);

test(
  'range | step=1, [-3, 3)', checkRange,
  { start: -3, stop: 3, step: 1 },
  [-3, -2, -1, 0, 1, 2],
);

test(
  'range | step=1, [-5, 3)', checkRange,
  { start: -5, stop: -3, step: 1 },
  [-5, -4],
);


test(
  'range | step=2, [0, 10)', checkRange,
  { start: 0, stop: 10, step: 2 },
  [0, 2, 4, 6, 8],
);

test(
  'range | step=2, [3, 10)', checkRange,
  { start: 3, stop: 10, step: 2 },
  [3, 5, 7, 9],
);

test(
  'range | step=2, [-3, 2)', checkRange,
  { start: -3, stop: 2, step: 2 },
  [-3, -1, 1],
);
