import test from 'ava';
import { put, takeEvery } from 'redux-saga/effects';
import {
  watchReturn,
  handleReturn,
  watchQuery,
  handleQuery,
} from '../../src/sagas/actions';

test('watches for RETURN', (t) => {
  const gen = watchReturn();
  t.deepEqual(gen.next().value, takeEvery('RETURN', handleReturn));

  t.true(gen.next().done);
});

test('watches for QUERY', (t) => {
  const gen = watchQuery();
  t.deepEqual(gen.next().value, takeEvery('QUERY', handleQuery));

  t.true(gen.next().done);
});

test('handles RETURN', (t) => {
  const gen = handleReturn();
  const actionsIndex = 1;
  const actionsItems = ['action one', 'action two', 'action three'];
  const items = ['item one', 'item two'];
  const index = 0;
  const markedCandidatesIds = {};
  const candidates = ['c1', 'c2', 'c3', 'c4', 'c5'];
  gen.next();
  gen.next(actionsIndex);

  gen.next(actionsItems);
  gen.next(items);
  gen.next(index);
  gen.next(markedCandidatesIds);

  t.deepEqual(
    gen.next(candidates).value,
    put({ type: 'EXECUTE_ACTION', payload: { action: actionsItems[actionsIndex], candidates } }),
  );
  t.true(gen.next().done);
});

test('handles QUERY by redirecting to CANDIDATES', (t) => {
  const gen = handleQuery();
  t.deepEqual(
    gen.next().value,
    put({ type: 'CANDIDATES', payload: { items: [], separators: [] } }),
  );
  t.true(gen.next().done);
});
