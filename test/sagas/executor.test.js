import test from 'ava';
import { executeAction } from '../../src/sagas/executor';

const items = [{
  id:         'google-search-test',
  label:      'test Search with Google',
  type:       'search',
  args:       ['test'],
  faviconUrl: null,
}];

test('executeAction', (t) => {
  const action = { handler: () => Promise.resolve() };
  const gen = executeAction({ payload: { action, candidates: items } });
  gen.next();
  gen.next();
  t.pass();

  const noActionGen = executeAction({ payload: { action: null, candidates: items } });
  noActionGen.next();
  t.pass();
});
