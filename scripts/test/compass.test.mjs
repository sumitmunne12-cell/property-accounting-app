// Unit tests for the Deduction Compass engine (src/utils/compassEngine.js).
// Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  deduce,
  matchScenario,
  buildDeck,
  grade,
  buildGrid,
  cellSubmenus,
  taskPrompt,
  stageOptionsFor,
  appUsesSections,
  COMPASS_ENTRIES,
  DRILLABLE_COUNT,
  getCompassEntry,
  getException,
  STAGE_KEYS,
} from '../../src/utils/compassEngine.js';
import { SCREEN_COUNT } from '../../src/utils/screenIndex.js';
import { isModuleLoaded, MODULE_IDS } from '../../src/data/moduleLoader.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PARITY = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'output', 'compass_parity.json'), 'utf8'));

test('JS matcher reproduces every Python prediction in the parity fixture', () => {
  assert.ok(PARITY.length > 700, `parity fixture too small: ${PARITY.length}`);
  for (const { text, scenario, expected } of PARITY) {
    const got = deduce(text, { scenario });
    assert.deepEqual(got, expected, `mismatch for ${scenario ? 'scenario' : 'title'}: ${text}`);
  }
});

test('compass index covers every screen without loading module detail', () => {
  assert.equal(COMPASS_ENTRIES.length, SCREEN_COUNT);
  for (const id of MODULE_IDS) assert.equal(isModuleLoaded(id), false, `${id} loaded at import time`);
  const menu = COMPASS_ENTRIES.filter((c) => c.pathKind === 'menu');
  assert.ok(menu.length > 4500, `menu-path screens: ${menu.length}`);
  assert.ok(menu.every((c) => c.app && c.tab), 'menu-path screens need app and tab');
  assert.ok(COMPASS_ENTRIES.filter((c) => c.pathKind === 'topic').every((c) => !c.fit), 'topics are never scored');
});

test('worked examples resolve to their real RealPage paths', () => {
  const cases = [
    ['Void a vendor check and restore the invoice', 'Accounts Payable', 'Reports', 'Check Register'],
    ['Move cash from operating to the reserve account', 'Cash Management', 'Periodic Tasks', 'Funds Transfer'],
    ['Accrue the utility bill we have not received', 'General Ledger', 'Periodic Tasks', 'Accrual'],
    ['Invoice is stuck in approval', 'Company', null, 'Approvals'],
  ];
  for (const [text, app, section, submenu] of cases) {
    const p = deduce(text, { scenario: true });
    assert.equal(p.app, app, text);
    assert.equal(p.section, section, text);
    assert.equal(p.submenu, submenu, text);
  }
});

test('scenario box walks steps 1-2-3, surfaces exceptions and lands on real screens', () => {
  const r = matchScenario('Refund a resident security deposit after move-out');
  assert.equal(r.steps.length, 3);
  assert.equal(r.prediction.app, 'Accounts Payable');
  assert.ok(r.exceptions.some((e) => e.id === 'E18'), 'refund exception E18 expected');
  const posted = matchScenario('site entered the wrong invoice date and the batch is already posted');
  assert.equal(posted.prediction.state, 'posted');
  assert.match(posted.steps[2].detail, /Reverse/);
  assert.ok(posted.candidates.length > 0);
  assert.ok(posted.candidates.every((c) => c.app === 'Accounts Payable' || posted.alternates.some((a) => a.app === c.app)));
  assert.equal(matchScenario('   '), null);
});

test('drill decks are reproducible, mix in exceptions and grade each step', () => {
  assert.ok(DRILLABLE_COUNT > 2000, `drillable screens: ${DRILLABLE_COUNT}`);
  const a = buildDeck({ seed: 42, size: 10 });
  const b = buildDeck({ seed: 42, size: 10 });
  assert.deepEqual(a.map((q) => q.id), b.map((q) => q.id));
  assert.equal(a.length, 10);
  assert.ok(a.some((q) => q.screen.exc), 'deck should include an exception card');
  for (const q of a) {
    assert.ok(q.choices.apps.includes(q.answer.app));
    assert.ok(q.choices.submenus.includes(q.answer.submenu));
    assert.ok(stageOptionsFor(q.answer.app).some((o) => o.key === q.answer.stage));
    const right = grade(q, q.answer);
    assert.equal(right.all, true);
    const wrongApp = q.choices.apps.find((x) => x !== q.answer.app);
    const g = grade(q, { ...q.answer, app: wrongApp });
    assert.equal(g.app, false);
    assert.ok(g.explanation.realPath[0] === 'Applications');
    if (q.screen.exc) assert.equal(g.explanation.exception.id, q.screen.exc);
  }
});

test('map grid counts every menu-path screen once and drills down to lists', () => {
  const grid = buildGrid();
  const menu = COMPASS_ENTRIES.filter((c) => c.pathKind === 'menu' && c.app && c.app !== 'Property Management').length;
  assert.equal(grid.reduce((n, r) => n + r.total, 0), menu);
  const ap = grid.find((r) => r.app === 'Accounts Payable');
  assert.ok(STAGE_KEYS.every((k) => ap.cells[k] > 0), 'AP uses every lifecycle stage');
  const lists = cellSubmenus('Accounts Payable', 'enter');
  assert.ok(lists.some((g) => g.submenu === 'Pay A/P Invoices'));
  assert.ok(appUsesSections('Accounts Payable'));
  assert.equal(appUsesSections('Company'), false);
});

test('prompts read as tasks and exceptions resolve', () => {
  assert.equal(taskPrompt('Voiding a Check'), 'Void a check');
  assert.equal(taskPrompt('Vendors List'), 'Open the Vendors List');
  assert.ok(getException('E01').hook.length > 10);
  const tagged = COMPASS_ENTRIES.filter((c) => c.exc);
  assert.ok(tagged.length > 300, `screens explained by exceptions: ${tagged.length}`);
  assert.ok(getCompassEntry(tagged[0].id));
});

test('Daily Hub tasks are linked to compass objects', async () => {
  const { ALL_TASKS } = await import('../../src/data/tasksData.js');
  const { indexTasksByObject } = await import('../../src/utils/compassEngine.js');
  const map = indexTasksByObject(ALL_TASKS);
  const linked = [...map.values()].reduce((n, list) => n + list.length, 0);
  assert.ok(linked >= ALL_TASKS.length * 0.6, `only ${linked}/${ALL_TASKS.length} tasks linked`);
});
