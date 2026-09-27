// Spaced-repetition engine for the GAAP Codex study mode (Leitner boxes).
// Every audit/interview trap is a flashcard. "Got it" moves the card up a box and pushes its next
// review further out; "Review again" sends it back to box 1 (due tomorrow). Box 4+ counts as mastered.
// Pure JS (no React Native imports) so it can be unit-tested in Node.

/** Days until the next review for each box (index = box). */
export const INTERVALS = [0, 1, 3, 7, 14, 30];
export const MAX_BOX = INTERVALS.length - 1;
export const MASTERED_BOX = 4;

export const emptyStudy = () => ({ cards: {}, bookmarks: [] });

// Stable id from the question text, so editing an answer keeps progress (djb2 → base36).
export function trapId(topic, question) {
  let h = 5381;
  const s = String(question);
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return `${topic}:${h.toString(36)}`;
}

/** Local calendar date as YYYY-MM-DD. */
export function todayIso(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  return todayIso(new Date(y, m - 1, d + days));
}

/** Records an answer; returns a new study state (the input is not mutated). */
export function grade(state, id, knewIt, today = todayIso()) {
  const prev = state.cards[id] || { box: 0, seen: 0, correct: 0 };
  const box = knewIt ? Math.min(MAX_BOX, Math.max(1, prev.box + 1)) : 1;
  const card = {
    box,
    due: addDays(today, INTERVALS[box]),
    seen: prev.seen + 1,
    correct: prev.correct + (knewIt ? 1 : 0),
    last: today,
  };
  return { ...state, cards: { ...state.cards, [id]: card } };
}

export const isMastered = (rec) => Boolean(rec && rec.box >= MASTERED_BOX);

/**
 * Today's session: cards that are due (oldest first), then cards never studied, up to `limit`.
 * @param items [{ id, topic, q, a, ... }]
 */
export function buildDeck(items, state, { today = todayIso(), limit = 20 } = {}) {
  const due = items
    .filter((i) => state.cards[i.id] && state.cards[i.id].due <= today)
    .sort((a, b) => state.cards[a.id].due.localeCompare(state.cards[b.id].due) || state.cards[a.id].box - state.cards[b.id].box);
  const fresh = items.filter((i) => !state.cards[i.id]);
  return due.concat(fresh).slice(0, limit);
}

/** Counts for a set of card ids: total, studied, mastered and due today. */
export function progressFor(state, ids, today = todayIso()) {
  let seen = 0;
  let mastered = 0;
  let due = 0;
  for (const id of ids) {
    const rec = state.cards[id];
    if (!rec) continue;
    seen++;
    if (isMastered(rec)) mastered++;
    if (rec.due <= today) due++;
  }
  return { total: ids.length, seen, mastered, due, fresh: ids.length - seen };
}

/** Mastered-card count per Topic, from card ids ("842:abc123"). */
export function masteredByTopic(state) {
  const out = {};
  for (const [id, rec] of Object.entries(state.cards)) {
    if (!isMastered(rec)) continue;
    const topic = id.split(':')[0];
    out[topic] = (out[topic] || 0) + 1;
  }
  return out;
}

export function toggleBookmark(state, topic) {
  const t = String(topic);
  const bookmarks = state.bookmarks.includes(t) ? state.bookmarks.filter((b) => b !== t) : [...state.bookmarks, t];
  return { ...state, bookmarks };
}

/** Accepts whatever was stored (or nothing) and returns a well-formed state. */
export function normalizeStudy(raw) {
  if (!raw || typeof raw !== 'object') return emptyStudy();
  return {
    cards: raw.cards && typeof raw.cards === 'object' ? raw.cards : {},
    bookmarks: Array.isArray(raw.bookmarks) ? raw.bookmarks.map(String) : [],
  };
}
