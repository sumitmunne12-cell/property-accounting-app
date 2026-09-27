// Properties and their month-end close timelines (pure functions, unit-tested in Node).
//
// Each property carries its own timeline: how days are counted (business days, skipping weekends
// and listed holidays, or calendar days) and a window per close phase, as day offsets from the
// period end ("Day 0"). The timeline turns a period ("2026-09") into real dates for the Close
// Cockpit phases and the Daily Hub phases (Pre-AME, Post-AME, Review, Reporting).

import { CLOSE_PHASES } from '../data/closePlaybookData';
import { PROPERTIES as SEED_PROPERTY_NAMES } from '../data/tasksData';

export const ALL_PROPERTIES = 'all';
export const DEFAULT_PROGRESS_KEY = '_default'; // close sign-offs when no property is set up
export const OFFSET_MIN = -15;
export const OFFSET_MAX = 30;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Daily Hub phases → the close phases whose windows they span.
export const HUB_PHASE_MAP = {
  'Pre-AME': ['phase1', 'phase2'],
  'Post-AME': ['phase3', 'phase4', 'phase5'],
  Review: ['phase6'],
  Reporting: ['phase7'],
};
export const HUB_PHASES = Object.keys(HUB_PHASE_MAP);

// ---------------------------------------------------------------------------
// Timeline definition
// ---------------------------------------------------------------------------

/** "Day -3 to Day -1" → { start: -3, end: -1 }; "Day +2" → { start: 2, end: 2 }. */
export function parseWindow(text) {
  const nums = String(text || '')
    .match(/[+-]?\d+/g)
    ?.map(Number);
  if (!nums || !nums.length) return { start: 0, end: 0 };
  return { start: nums[0], end: nums.length > 1 ? nums[1] : nums[0] };
}

export const DEFAULT_WINDOWS = Object.fromEntries(CLOSE_PHASES.map((p) => [p.id, parseWindow(p.window)]));

export const defaultTimeline = () => ({
  basis: 'business',
  holidays: [],
  phases: Object.fromEntries(Object.entries(DEFAULT_WINDOWS).map(([id, w]) => [id, { ...w }])),
});

const clampOffset = (n) => Math.max(OFFSET_MIN, Math.min(OFFSET_MAX, Math.round(Number(n) || 0)));

/** Fills missing phases/fields from the default so older or partial timelines keep working. */
export function normalizeTimeline(t) {
  const base = defaultTimeline();
  if (!t || typeof t !== 'object') return base;
  const phases = {};
  for (const p of CLOSE_PHASES) {
    const w = (t.phases && t.phases[p.id]) || base.phases[p.id];
    const start = clampOffset(w.start);
    phases[p.id] = { start, end: Math.max(start, clampOffset(w.end)) };
  }
  return {
    basis: t.basis === 'calendar' ? 'calendar' : 'business',
    holidays: Array.isArray(t.holidays) ? t.holidays.filter((d) => isIsoDate(d)).sort() : [],
    phases,
  };
}

/** Human-readable problems with a timeline; an empty array means it can be saved. */
export function validateTimeline(t) {
  const errors = [];
  let prevStart = -Infinity;
  for (const p of CLOSE_PHASES) {
    const w = t.phases[p.id];
    if (!w) {
      errors.push(`Phase ${p.number} has no window.`);
      continue;
    }
    if (w.end < w.start) errors.push(`Phase ${p.number} ends before it starts.`);
    if (w.start < prevStart) errors.push(`Phase ${p.number} starts before Phase ${p.number - 1}; phases close in sequence.`);
    prevStart = w.start;
  }
  const bad = (t.holidays || []).filter((d) => !isIsoDate(d));
  if (bad.length) errors.push(`Not a date (use YYYY-MM-DD): ${bad.join(', ')}`);
  return errors;
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

export const isIsoDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(`${s}T12:00:00`).getTime());

// Local dates at noon, so daylight-saving shifts never move a day.
const makeDate = (y, m, d) => new Date(y, m, d, 12, 0, 0, 0);
export const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (d, n) => makeDate(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Parses "YYYY-MM-DD, YYYY-MM-DD" (commas, spaces or new lines) into a sorted list. */
export const parseHolidays = (text) =>
  String(text || '')
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

function isWorkday(d, holidaySet) {
  const dow = d.getDay();
  return dow !== 0 && dow !== 6 && !holidaySet.has(isoOf(d));
}

/** Day 0 of a period: its last calendar day, or its last business day. */
export function anchorDate(periodKey, basis = 'business', holidays = []) {
  const [y, m] = periodKey.split('-').map(Number);
  let d = makeDate(y, m, 0); // day 0 of the next month = last day of this month
  if (basis === 'business') {
    const hs = new Set(holidays);
    while (!isWorkday(d, hs)) d = addDays(d, -1);
  }
  return d;
}

/** The date of "Day N" in a period (N may be negative: days before period end). */
export function dayToDate(periodKey, offset, basis = 'business', holidays = []) {
  const anchor = anchorDate(periodKey, basis, holidays);
  if (basis !== 'business') return addDays(anchor, offset);
  const hs = new Set(holidays);
  let d = anchor;
  let left = Math.abs(offset);
  const step = offset < 0 ? -1 : 1;
  while (left > 0) {
    d = addDays(d, step);
    if (isWorkday(d, hs)) left -= 1;
  }
  return d;
}

/** Close Cockpit phases with real start/end dates for the period. */
export function phaseSchedule(periodKey, timeline) {
  const t = normalizeTimeline(timeline);
  return CLOSE_PHASES.map((p) => {
    const w = t.phases[p.id];
    return {
      id: p.id,
      number: p.number,
      title: p.title,
      startOffset: w.start,
      endOffset: w.end,
      start: dayToDate(periodKey, w.start, t.basis, t.holidays),
      end: dayToDate(periodKey, w.end, t.basis, t.holidays),
    };
  });
}

/** Daily Hub phases (Pre-AME, Post-AME, Review, Reporting) with the dates of the close phases they span. */
export function hubSchedule(periodKey, timeline) {
  const byId = new Map(phaseSchedule(periodKey, timeline).map((p) => [p.id, p]));
  return HUB_PHASES.map((name) => {
    const parts = HUB_PHASE_MAP[name].map((id) => byId.get(id));
    const start = parts.reduce((a, p) => (p.start < a ? p.start : a), parts[0].start);
    const end = parts.reduce((a, p) => (p.end > a ? p.end : a), parts[0].end);
    return { name, start, end, startOffset: Math.min(...parts.map((p) => p.startOffset)), endOffset: Math.max(...parts.map((p) => p.endOffset)) };
  });
}

/** done | overdue | due (today is inside the window) | upcoming. */
export function windowStatus(win, today = new Date(), complete = false) {
  if (complete) return 'done';
  const t = isoOf(today);
  if (t > isoOf(win.end)) return 'overdue';
  if (t >= isoOf(win.start)) return 'due';
  return 'upcoming';
}

export const formatShortDate = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
export const formatRange = (start, end) =>
  isoOf(start) === isoOf(end) ? formatShortDate(start) : `${formatShortDate(start)} – ${formatShortDate(end)}`;
const signed = (n) => (n > 0 ? `+${n}` : String(n));
export const formatOffsets = (start, end, basis = 'business') => {
  const unit = basis === 'business' ? 'BD' : 'Day';
  return start === end ? `${unit} ${signed(start)}` : `${unit} ${signed(start)} to ${signed(end)}`;
};

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

const slug = (s) =>
  String(s || 'property')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40) || 'property';

export function newPropertyId(name, existingIds = []) {
  const base = `prop_${slug(name)}`;
  let id = base;
  let i = 2;
  const taken = new Set(existingIds);
  while (taken.has(id)) id = `${base}_${i++}`;
  return id;
}

export function makeProperty({ name, portfolio = '', software = 'realpage', timeline } = {}, existingIds = []) {
  const clean = String(name || '').trim();
  return {
    id: newPropertyId(clean, existingIds),
    name: clean,
    portfolio: String(portfolio || '').trim(),
    software: software === 'yardi' ? 'yardi' : 'realpage',
    timeline: normalizeTimeline(timeline),
  };
}

/** The first-run list: the properties the app used to hard-code, each with the default timeline. */
export function seedProperties() {
  const out = [];
  for (const name of SEED_PROPERTY_NAMES) {
    if (name === 'All Properties') continue;
    out.push(makeProperty({ name, software: /yardi/i.test(name) ? 'yardi' : 'realpage' }, out.map((p) => p.id)));
  }
  return out;
}

/** Cleans a stored list: drops unnamed entries, fills missing fields, de-duplicates ids. */
export function normalizeProperties(stored) {
  if (!Array.isArray(stored)) return null;
  const out = [];
  for (const p of stored) {
    if (!p || !String(p.name || '').trim()) continue;
    const ids = out.map((x) => x.id);
    const id = p.id && !ids.includes(p.id) ? p.id : newPropertyId(p.name, ids);
    out.push({
      id,
      name: String(p.name).trim(),
      portfolio: String(p.portfolio || '').trim(),
      software: p.software === 'yardi' ? 'yardi' : 'realpage',
      timeline: normalizeTimeline(p.timeline),
    });
  }
  return out;
}

/** Stored selection → a property id or ALL_PROPERTIES. Older versions stored the property name. */
export function resolveSelection(stored, properties) {
  if (!stored || stored === ALL_PROPERTIES || stored === 'All Properties') return ALL_PROPERTIES;
  const hit = properties.find((p) => p.id === stored) || properties.find((p) => p.name === stored);
  return hit ? hit.id : ALL_PROPERTIES;
}

export const propertyLabel = (selectedId, properties) =>
  selectedId === ALL_PROPERTIES ? 'All Properties' : (properties.find((p) => p.id === selectedId) || {}).name || 'All Properties';

// ---------------------------------------------------------------------------
// Close sign-offs per property
// ---------------------------------------------------------------------------

const PERIOD_RX = /^\d{4}-\d{2}$/;

/**
 * Close progress is stored as { [propertyId]: { [period]: { [taskId]: iso } } }.
 * Older versions stored { [period]: … } for a single, unnamed property: those sign-offs move to
 * the property that was selected (`preferredId`), else the first property, else the default key.
 */
export function migrateCloseProgress(raw, properties = [], preferredId = null) {
  if (!raw || typeof raw !== 'object') return {};
  const keys = Object.keys(raw);
  const legacy = keys.filter((k) => PERIOD_RX.test(k));
  if (!legacy.length) return raw;
  const preferred = properties.find((p) => p.id === preferredId);
  const target = preferred ? preferred.id : properties.length ? properties[0].id : DEFAULT_PROGRESS_KEY;
  const out = {};
  for (const k of keys) if (!PERIOD_RX.test(k)) out[k] = raw[k];
  out[target] = { ...(out[target] || {}) };
  for (const k of legacy) out[target][k] = { ...raw[k], ...(out[target][k] || {}) };
  return out;
}

/** The first close phase that is not fully signed off, with its dates and status (null when closed). */
export function nextDeadline(periodKey, timeline, phaseComplete = () => false, today = new Date()) {
  for (const p of phaseSchedule(periodKey, timeline)) {
    if (phaseComplete(p.id)) continue;
    return { ...p, status: windowStatus(p, today, false) };
  }
  return null;
}
