import browser from 'webextension-polyfill';

const commands = [];

function filterContentCommands(q) {
  return commands
    .filter(n => n.includes(q))
    .map(name => ({
      id:   name,
      type: 'content',
      name,
    }));
}

function candidates(query) {
  const q = query.toLowerCase();
  return Promise.all([
    browser.history.search({ text: q, startTime: 0 }),
    Promise.resolve(filterContentCommands(q)),
  ]).then(([histories, commandItems]) => {
    const h = histories.map(v => ({
      id:   `${v.title}:${v.url}`,
      type: 'history',
      name: 'open-history',
      args: [v.url],
    }));
    const items = [{
      id:   `${q} － Search with Google`,
      type: 'search',
      name: 'google-search',
      args: [q],
    }];
    return items.concat(h).concat(commandItems);
  });
}

export default {
  candidates,
};
