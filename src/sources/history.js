import browser from 'webextension-polyfill';
import { getFaviconUrl } from '../utils/url';

export default function candidates(q, { maxResults = 20 } = {}) {
  const startTime = 0;
  return browser.history.search({ text: q, startTime, maxResults })
    .then(l => l.map(v => ({
      id:         `${v.id}`,
      label:      `${v.title}:${v.url}`,
      type:       'history',
      name:       'open-history',
      args:       [v.url],
      faviconUrl: getFaviconUrl(v.url),
    })));
}