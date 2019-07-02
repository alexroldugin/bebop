export function uncirculateIndex(items, index) {
  const len = items.length;
  return len > 1 ? ((index % len) + len) % len : 0;
}

export const range = (start, stop, step = 1) => Array(Math.ceil((stop - start) / step))
  .fill(start).map((x, y) => x + y * step);

export default uncirculateIndex;
