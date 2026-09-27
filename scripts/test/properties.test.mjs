// Unit tests for user-managed properties and their close timelines (src/utils/propertyTimeline.js).
// Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ALL_PROPERTIES,
  DEFAULT_PROGRESS_KEY,
  DEFAULT_WINDOWS,
  HUB_PHASES,
  parseWindow,
  defaultTimeline,
  normalizeTimeline,
  validateTimeline,
  anchorDate,
  dayToDate,
  phaseSchedule,
  hubSchedule,
  windowStatus,
  isoOf,
  formatRange,
  formatOffsets,
  parseHolidays,
  makeProperty,
  seedProperties,
  normalizeProperties,
  resolveSelection,
  propertyLabel,
  migrateCloseProgress,
  nextDeadline,
} from '../../src/utils/propertyTimeline.js';
import { CLOSE_PHASES } from '../../src/data/closePlaybookData.js';

const day = (iso) => new Date(`${iso}T12:00:00`);

test('default timeline reproduces the playbook windows', () => {
  assert.deepEqual(parseWindow('Day -3 to Day -1'), { start: -3, end: -1 });
  assert.deepEqual(parseWindow('Day 0'), { start: 0, end: 0 });
  assert.deepEqual(parseWindow('Day +4'), { start: 4, end: 4 });
  assert.equal(Object.keys(DEFAULT_WINDOWS).length, CLOSE_PHASES.length);
  for (const p of CLOSE_PHASES) assert.deepEqual(DEFAULT_WINDOWS[p.id], parseWindow(p.window));
  assert.deepEqual(validateTimeline(defaultTimeline()), []);
});

test('business days skip weekends and holidays; calendar days do not', () => {
  // Sep 30 2026 is a Wednesday; May 31 2026 is a Sunday.
  assert.equal(isoOf(anchorDate('2026-09', 'business')), '2026-09-30');
  assert.equal(isoOf(anchorDate('2026-05', 'business')), '2026-05-29');
  assert.equal(isoOf(anchorDate('2026-05', 'calendar')), '2026-05-31');
  assert.equal(isoOf(dayToDate('2026-09', -3, 'business')), '2026-09-25');
  assert.equal(isoOf(dayToDate('2026-09', 3, 'business')), '2026-10-05');
  assert.equal(isoOf(dayToDate('2026-09', 3, 'calendar')), '2026-10-03');
  assert.equal(isoOf(dayToDate('2026-05', 1, 'business', ['2026-06-01'])), '2026-06-02');
  assert.equal(isoOf(dayToDate('2026-12', 1, 'business', ['2027-01-01'])), '2027-01-04');
  assert.equal(isoOf(dayToDate('2026-02', 0, 'calendar')), '2026-02-28');
});

test('phase and Daily Hub schedules follow the timeline', () => {
  const sched = phaseSchedule('2026-09', defaultTimeline());
  assert.equal(sched.length, CLOSE_PHASES.length);
  assert.equal(formatRange(sched[0].start, sched[0].end), 'Sep 25 – Sep 29');
  assert.equal(formatRange(sched[6].start, sched[6].end), 'Oct 7');
  const hub = hubSchedule('2026-09', defaultTimeline());
  assert.deepEqual(hub.map((h) => h.name), HUB_PHASES);
  assert.equal(formatRange(hub[0].start, hub[0].end), 'Sep 25 – Sep 30'); // Pre-AME = phases 1-2
  assert.equal(formatRange(hub[1].start, hub[1].end), 'Oct 1 – Oct 5'); // Post-AME = phases 3-5
  assert.equal(formatOffsets(hub[1].startOffset, hub[1].endOffset, 'business'), 'BD +1 to +3');

  const custom = defaultTimeline();
  custom.phases.phase7 = { start: 8, end: 10 };
  const late = phaseSchedule('2026-09', custom)[6];
  assert.equal(isoOf(late.end), '2026-10-14');
});

test('status of a window relative to today', () => {
  const win = { start: day('2026-10-01'), end: day('2026-10-05') };
  assert.equal(windowStatus(win, day('2026-09-30')), 'upcoming');
  assert.equal(windowStatus(win, day('2026-10-01')), 'due');
  assert.equal(windowStatus(win, day('2026-10-06')), 'overdue');
  assert.equal(windowStatus(win, day('2026-10-06'), true), 'done');
  const next = nextDeadline('2026-09', defaultTimeline(), (id) => id === 'phase1' || id === 'phase2', day('2026-10-02'));
  assert.equal(next.id, 'phase3');
  assert.equal(next.status, 'overdue');
});

test('validation catches inverted and out-of-sequence windows and bad holidays', () => {
  const t = defaultTimeline();
  t.phases.phase3 = { start: 2, end: 1 };
  t.phases.phase4 = { start: -5, end: 2 };
  t.holidays = ['2026-13-01'];
  const errors = validateTimeline(t);
  assert.ok(errors.some((e) => /Phase 3 ends before/.test(e)));
  assert.ok(errors.some((e) => /Phase 4 starts before Phase 3/.test(e)));
  assert.ok(errors.some((e) => /2026-13-01/.test(e)));
  assert.deepEqual(parseHolidays('2026-11-26, 2026-12-25\n2027-01-01'), ['2026-11-26', '2026-12-25', '2027-01-01']);
  // normalize repairs what it can: clamps, orders end >= start, drops invalid holidays
  const n = normalizeTimeline({ basis: 'calendar', holidays: ['x', '2026-12-25'], phases: { phase1: { start: -99, end: -100 } } });
  assert.equal(n.basis, 'calendar');
  assert.deepEqual(n.holidays, ['2026-12-25']);
  assert.ok(n.phases.phase1.end >= n.phases.phase1.start);
  assert.deepEqual(n.phases.phase2, DEFAULT_WINDOWS.phase2);
});

test('properties are seeded, created with unique ids and cleaned on load', () => {
  const seeds = seedProperties();
  assert.equal(seeds.length, 3);
  assert.equal(seeds[0].software, 'yardi'); // "Arcadian (Goldman Sachs - Yardi)"
  assert.equal(seeds[1].software, 'realpage');
  assert.equal(new Set(seeds.map((p) => p.id)).size, 3);
  const dup = makeProperty({ name: 'OSSO Portfolio' }, seeds.map((p) => p.id));
  assert.notEqual(dup.id, seeds[1].id);
  const cleaned = normalizeProperties([{ name: '  Oak Ridge ', software: 'bogus' }, { name: '' }, null, { id: 'x', name: 'Elm' }, { id: 'x', name: 'Pine' }]);
  assert.equal(cleaned.length, 3);
  assert.equal(cleaned[0].name, 'Oak Ridge');
  assert.equal(cleaned[0].software, 'realpage');
  assert.notEqual(cleaned[1].id, cleaned[2].id);
  assert.equal(normalizeProperties(null), null);
});

test('stored selections and close sign-offs migrate to property ids', () => {
  const props = seedProperties();
  assert.equal(resolveSelection('All Properties', props), ALL_PROPERTIES);
  assert.equal(resolveSelection('OSSO Portfolio', props), props[1].id); // older versions stored the name
  assert.equal(resolveSelection(props[2].id, props), props[2].id);
  assert.equal(resolveSelection('Deleted Place', props), ALL_PROPERTIES);
  assert.equal(propertyLabel(props[1].id, props), 'OSSO Portfolio');
  assert.equal(propertyLabel(ALL_PROPERTIES, props), 'All Properties');

  const legacy = { '2026-08': { p1_invoice_cutoff: '2026-08-29T10:00:00Z' } };
  const migrated = migrateCloseProgress(legacy, props);
  assert.deepEqual(migrated, { [props[0].id]: legacy });
  assert.equal(migrateCloseProgress(migrated, props), migrated); // idempotent
  assert.deepEqual(migrateCloseProgress(legacy, props, props[1].id), { [props[1].id]: legacy }); // the property that was selected
  assert.deepEqual(migrateCloseProgress(legacy, []), { [DEFAULT_PROGRESS_KEY]: legacy });
  assert.deepEqual(migrateCloseProgress(null, props), {});
});
