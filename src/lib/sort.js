/**
 * Card sorting utility.
 *
 * "newest" / "oldest" prefer `card.createdAt` (ISO string or Date) when present,
 * falling back to the numeric portion of `card.id`. This lets the same logic
 * serve both the demo fixtures (which only have ids) and future real data
 * (which will carry timestamps).
 *
 * "az" sorts by `title` with locale-aware comparison.
 */

export const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'az',     label: 'A–Z' },
];

export const DEFAULT_SORT = 'newest';

function orderKey(card) {
  if (card?.createdAt) {
    const t = new Date(card.createdAt).getTime();
    if (Number.isFinite(t)) return t;
  }
  const n = Number(card?.id);
  return Number.isFinite(n) ? n : 0;
}

export function sortCards(cards, sortKey) {
  const arr = Array.isArray(cards) ? cards.slice() : [];
  switch (sortKey) {
    case 'oldest':
      return arr.sort((a, b) => orderKey(a) - orderKey(b));
    case 'az':
      return arr.sort((a, b) =>
        (a?.title || '').localeCompare(b?.title || '', undefined, { sensitivity: 'base' })
      );
    case 'newest':
    default:
      return arr.sort((a, b) => orderKey(b) - orderKey(a));
  }
}
