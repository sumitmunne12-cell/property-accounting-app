// Unit tests for the copilot logic layer (search index, close sequencing, playbooks, glossary).
// Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SCREEN_COUNT,
  searchScreens,
  editDistance,
  normalize,
  getScreenEntry,
} from '../../src/utils/screenIndex.js';
import {
  phaseStatuses,
  nextTask,
  overallProgress,
  toggleTask,
  isTaskUnlocked,
  shiftPeriod,
  periodLabel,
  defaultClosePeriod,
} from '../../src/utils/closeEngine.js';
import { CLOSE_PHASES } from '../../src/data/closePlaybookData.js';
import { EXCEPTION_PLAYBOOKS, entryTotals } from '../../src/data/exceptionsPlaybookData.js';
import { GLOSSARY_TERMS, ACRONYM_TERMS } from '../../src/data/glossaryData.js';

test('screen index covers the full catalog', () => {
  assert.ok(SCREEN_COUNT >= 7100, `expected >= 7100 screens, got ${SCREEN_COUNT}`);
});

test('normalize collapses RealPage abbreviations', () => {
  assert.equal(normalize('A/P Invoice'), 'ap invoice');
  assert.equal(normalize('G/L Account'), 'gl account');
  assert.equal(normalize('1099-NEC'), '1099 nec');
});

test('editDistance is bounded', () => {
  assert.equal(editDistance('positve', 'positive', 2), 1);
  assert.equal(editDistance('reconcile', 'reconcile', 2), 0);
  assert.ok(editDistance('abc', 'xyzxyz', 2) > 2);
});

test('fuzzy search tolerates typos and ranks name matches first', () => {
  const { results } = searchScreens('positve pay file');
  assert.ok(results.length > 0);
  assert.match(results[0].screen.name, /Positive Pay/i);
});

test('search understands A/P style tokens and module filters', () => {
  const { results } = searchScreens('a/p invoice', { moduleId: 'ap' });
  assert.ok(results.length > 0);
  assert.ok(results.every((e) => e.moduleId === 'ap'));
  assert.match(results[0].screen.name, /A\/P Invoice/);
});

test('empty query returns nothing; limit is respected', () => {
  assert.equal(searchScreens('   ').total, 0);
  const r = searchScreens('report', { limit: 10 });
  assert.equal(r.results.length, 10);
  assert.ok(r.total > 10);
});

test('search stays fast across the whole catalog', () => {
  const queries = ['bank rec', 'positve pay', 'journal entry reverse', 'draw model', 'zzqx'];
  const t0 = performance.now();
  for (let i = 0; i < 10; i++) queries.forEach((q) => searchScreens(q));
  const avg = (performance.now() - t0) / (10 * queries.length);
  assert.ok(avg < 50, `average search ${avg.toFixed(1)}ms`);
});

test('close phases unlock strictly in sequence', () => {
  const st = phaseStatuses(CLOSE_PHASES, {});
  assert.equal(st[0].locked, false);
  assert.ok(st.slice(1).every((s) => s.locked));
  const phase2Task = CLOSE_PHASES[1].tasks[0].id;
  assert.equal(isTaskUnlocked(CLOSE_PHASES, {}, phase2Task), false);
  // cannot sign off a locked phase
  const blocked = toggleTask(CLOSE_PHASES, {}, phase2Task);
  assert.equal(blocked.changed, false);
  // complete phase 1 -> phase 2 unlocks
  let done = {};
  for (const t of CLOSE_PHASES[0].tasks) done = toggleTask(CLOSE_PHASES, done, t.id, '2026-09-30T00:00:00Z').done;
  const st2 = phaseStatuses(CLOSE_PHASES, done);
  assert.equal(st2[0].complete, true);
  assert.equal(st2[1].locked, false);
  assert.equal(nextTask(CLOSE_PHASES, done).phase.id, 'phase2');
  // clearing a phase-1 sign-off re-locks phase 2
  const cleared = toggleTask(CLOSE_PHASES, done, CLOSE_PHASES[0].tasks[0].id).done;
  assert.equal(phaseStatuses(CLOSE_PHASES, cleared)[1].locked, true);
});

test('overall progress and full completion', () => {
  let done = {};
  for (const p of CLOSE_PHASES) for (const t of p.tasks) done = toggleTask(CLOSE_PHASES, done, t.id).done;
  const o = overallProgress(CLOSE_PHASES, done);
  assert.equal(o.completed, o.total);
  assert.equal(o.pct, 100);
  assert.equal(nextTask(CLOSE_PHASES, done), null);
});

test('every close task links to a real screen', () => {
  for (const p of CLOSE_PHASES) for (const t of p.tasks) assert.ok(getScreenEntry(t.screenId), t.id);
});

test('period helpers', () => {
  assert.equal(shiftPeriod('2026-01', -1), '2025-12');
  assert.equal(shiftPeriod('2026-12', 1), '2027-01');
  assert.equal(periodLabel('2026-09'), 'Sep 2026');
  assert.equal(defaultClosePeriod(new Date(2026, 9, 3)), '2026-09'); // Oct 3 -> closing September
  assert.equal(defaultClosePeriod(new Date(2026, 9, 20)), '2026-10');
});

test('all 15 exception playbooks have balanced entries and terminating wizards', () => {
  assert.equal(EXCEPTION_PLAYBOOKS.length, 15);
  for (const ex of EXCEPTION_PLAYBOOKS) {
    for (const e of ex.adjustingEntries) {
      const t = entryTotals(e);
      assert.ok(Math.abs(t.debit - t.credit) < 0.005, `${ex.code}: ${e.label}`);
    }
    const nodes = Object.fromEntries(ex.diagnosticWizard.map((n) => [n.id, n]));
    const walk = (id, depth) => {
      assert.ok(depth < 10, `${ex.code}: wizard too deep`);
      for (const o of nodes[id].options) if (!o.outcome) walk(o.next, depth + 1);
    };
    walk(ex.diagnosticWizard[0].id, 0);
  }
});

test('glossary: acronyms, cross-references and uniqueness', () => {
  const byAcr = Object.fromEntries(ACRONYM_TERMS.map((t) => [t.acronym, t]));
  for (const a of ['GPR', 'ROG', 'FAS', 'APM', 'CAM', 'HAP', 'RUBS', 'T-12', 'NOI', 'COI', 'TI']) {
    assert.ok(byAcr[a], `missing acronym ${a}`);
  }
  assert.ok(byAcr.FAS.modules.includes('04_accounts_receivable'));
  assert.ok(byAcr.ROG.modules.includes('02_accounts_payable'));
  assert.ok(byAcr.ROG.modules.includes('06_jobcost_capex_reserves'));
  const names = GLOSSARY_TERMS.map((t) => t.term);
  assert.equal(new Set(names).size, names.length);
  assert.ok(GLOSSARY_TERMS.length > 300);
  assert.ok(GLOSSARY_TERMS.every((t) => t.modules && t.modules.length));
});
