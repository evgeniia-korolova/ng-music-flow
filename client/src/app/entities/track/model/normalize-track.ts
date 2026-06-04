export function normalize(value = ''): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^[^\wа-яё0-9]+/i, '');
}
