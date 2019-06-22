export default function uncirculateIndex(items, index) {
  const len = items.length;
  return len > 1 ? ((index % len) + len) % len : 0;
}

export {
  uncirculateIndex,
};
