// Cross-link validator for the copilot data layer.
// Checks that every screenId referenced by the Close Cockpit, exception playbooks, Rosetta Stone
// and glossary exists in the 9 module files; that module references are valid; that adjusting
// entries balance; and that every diagnostic wizard path terminates in a verdict.
//
// Usage: node --import ./scripts/test/register.mjs --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/validate_app_data.mjs

import { hasScreen, SCREEN_COUNT, getScreenById } from '../src/utils/screenIndex.js';
import { CLOSE_PHASES } from '../src/data/closePlaybookData.js';
import { EXCEPTION_PLAYBOOKS, entryTotals } from '../src/data/exceptionsPlaybookData.js';
import { ROSETTA_OPERATIONS, ROSETTA_CATEGORIES, ROSETTA_CADENCES } from '../src/data/rosettaStoneData.js';
import {
  GLOSSARY_TERMS,
  MULTIFAMILY_TERMS,
  REALPAGE_GLOSSARY_TERMS,
  REALPAGE_GLOSSARY_STATS,
  MODULE_FILE_TITLES,
} from '../src/data/glossaryData.js';

const errors = [];
const err = (m) => errors.push(m);
const checkScreen = (id, where) => {
  if (!id || !hasScreen(id)) err(`${where}: unknown screenId "${id}"`);
};

// ── Close Cockpit ──────────────────────────────────────────────────────────
const taskIds = new Set();
if (CLOSE_PHASES.length !== 7) err(`close: expected 7 phases, found ${CLOSE_PHASES.length}`);
CLOSE_PHASES.forEach((p, i) => {
  if (p.number !== i + 1) err(`close: phase ${p.id} numbered ${p.number}`);
  for (const k of ['title', 'window', 'objective', 'lockGate']) if (!p[k]) err(`close: ${p.id} missing ${k}`);
  if (!p.tasks.length) err(`close: ${p.id} has no tasks`);
  for (const t of p.tasks) {
    if (taskIds.has(t.id)) err(`close: duplicate task id ${t.id}`);
    taskIds.add(t.id);
    for (const k of ['title', 'owner', 'instructions', 'controlCheck', 'evidence', 'yardiEquivalent']) {
      if (!t[k]) err(`close: ${t.id} missing ${k}`);
    }
    checkScreen(t.screenId, `close task ${t.id}`);
  }
});

// ── Exception playbooks ────────────────────────────────────────────────────
if (EXCEPTION_PLAYBOOKS.length !== 15) err(`exceptions: expected 15 playbooks, found ${EXCEPTION_PLAYBOOKS.length}`);
const codes = new Set();
for (const ex of EXCEPTION_PLAYBOOKS) {
  if (codes.has(ex.code)) err(`exceptions: duplicate code ${ex.code}`);
  codes.add(ex.code);
  for (const k of ['title', 'symptom', 'auditRisk', 'proTip']) if (!ex[k]) err(`exceptions: ${ex.id} missing ${k}`);
  if (!ex.rootCause?.length) err(`exceptions: ${ex.id} missing rootCause`);
  if (!ex.resolutionSOP?.length) err(`exceptions: ${ex.id} missing resolutionSOP`);
  if (!MODULE_FILE_TITLES[ex.module]) err(`exceptions: ${ex.id} unknown module ${ex.module}`);
  checkScreen(ex.diagnosticReport?.screenId, `exception ${ex.id} diagnosticReport`);
  (ex.relatedScreenIds || []).forEach((id) => checkScreen(id, `exception ${ex.id} related`));
  if (!ex.adjustingEntries.length && !ex.noEntryReason) err(`exceptions: ${ex.id} has neither entries nor noEntryReason`);
  for (const e of ex.adjustingEntries) {
    const t = entryTotals(e);
    if (Math.abs(t.debit - t.credit) > 0.005) err(`exceptions: ${ex.id} entry "${e.label}" out of balance ${t.debit} vs ${t.credit}`);
    if (!t.debit) err(`exceptions: ${ex.id} entry "${e.label}" has no amounts`);
  }
  // wizard: every option leads to an existing node or an outcome; every path terminates
  const nodes = Object.fromEntries(ex.diagnosticWizard.map((n) => [n.id, n]));
  const visit = (id, seen) => {
    if (seen.has(id)) return err(`exceptions: ${ex.id} wizard cycle at ${id}`);
    const n = nodes[id];
    if (!n) return err(`exceptions: ${ex.id} wizard missing node ${id}`);
    for (const o of n.options) {
      if (o.outcome) continue;
      if (!o.next) err(`exceptions: ${ex.id} option "${o.label}" at ${id} has no next/outcome`);
      else visit(o.next, new Set([...seen, id]));
    }
  };
  if (!ex.diagnosticWizard.length) err(`exceptions: ${ex.id} has no wizard`);
  else visit(ex.diagnosticWizard[0].id, new Set());
}

// ── Rosetta Stone ──────────────────────────────────────────────────────────
if (ROSETTA_OPERATIONS.length !== 50) err(`rosetta: expected 50 operations, found ${ROSETTA_OPERATIONS.length}`);
const rosIds = new Set();
for (const op of ROSETTA_OPERATIONS) {
  if (rosIds.has(op.id)) err(`rosetta: duplicate id ${op.id}`);
  rosIds.add(op.id);
  if (!ROSETTA_CATEGORIES.includes(op.category)) err(`rosetta: ${op.id} bad category ${op.category}`);
  if (!ROSETTA_CADENCES.includes(op.cadence)) err(`rosetta: ${op.id} bad cadence ${op.cadence}`);
  checkScreen(op.realpage.screenId, `rosetta ${op.id}`);
  if (!op.yardi.navigation?.length) err(`rosetta: ${op.id} missing Yardi navigation`);
  if (!op.terminology?.length) err(`rosetta: ${op.id} missing terminology`);
  if (!op.pitfalls?.length) err(`rosetta: ${op.id} missing pitfalls`);
  for (const k of ['howItWorks', 'name']) {
    if (!op.realpage[k] || !op.yardi[k]) err(`rosetta: ${op.id} missing ${k}`);
  }
}

// ── Glossary ───────────────────────────────────────────────────────────────
const REQUIRED_ACRONYMS = ['GPR', 'ROG', 'FAS', 'APM', 'CAM', 'HAP', 'RUBS', 'T-12', 'NOI', 'COI', 'TI'];
const curatedAcronyms = new Set(MULTIFAMILY_TERMS.map((t) => t.acronym));
REQUIRED_ACRONYMS.forEach((a) => !curatedAcronyms.has(a) && err(`glossary: required acronym ${a} missing`));
const terms = new Set();
for (const g of GLOSSARY_TERMS) {
  if (terms.has(g.term)) err(`glossary: duplicate term ${g.term}`);
  terms.add(g.term);
  if (!g.definition) err(`glossary: ${g.term} has no definition`);
  if (!g.modules?.length) err(`glossary: ${g.term} has no module cross-reference`);
  (g.modules || []).forEach((m) => !MODULE_FILE_TITLES[m] && err(`glossary: ${g.term} unknown module ${m}`));
  (g.relatedScreenIds || []).forEach((id) => checkScreen(id, `glossary ${g.term}`));
}
const fas = MULTIFAMILY_TERMS.find((t) => t.acronym === 'FAS');
if (fas && !fas.modules.includes('04_accounts_receivable')) err('glossary: FAS must link to 04_accounts_receivable');
const rog = MULTIFAMILY_TERMS.find((t) => t.acronym === 'ROG');
if (rog && !(rog.modules.includes('02_accounts_payable') && rog.modules.includes('06_jobcost_capex_reserves'))) {
  err('glossary: ROG must link to 02_accounts_payable and 06_jobcost_capex_reserves');
}
if (REALPAGE_GLOSSARY_TERMS.length !== REALPAGE_GLOSSARY_STATS.uniqueTerms) err('glossary: stats out of sync');

// ── Budgeting showcase screens ─────────────────────────────────────────────
['scr_budget_model_creation', 'scr_budget_reforecast_revisions', 'scr_budget_gl_comparison', 'scr_budget_variance_threshold_locking'].forEach(
  (id) => checkScreen(id, 'budgeting showcase')
);

const closeTasks = CLOSE_PHASES.reduce((n, p) => n + p.tasks.length, 0);
console.log(`screens indexed:        ${SCREEN_COUNT}`);
console.log(`close phases / tasks:   ${CLOSE_PHASES.length} / ${closeTasks} (all linked to screens)`);
console.log(`exception playbooks:    ${EXCEPTION_PLAYBOOKS.length}`);
console.log(`rosetta operations:     ${ROSETTA_OPERATIONS.length}`);
console.log(
  `glossary terms:         ${GLOSSARY_TERMS.length} (${MULTIFAMILY_TERMS.length} curated + ${REALPAGE_GLOSSARY_STATS.uniqueTerms} RealPage from ${REALPAGE_GLOSSARY_STATS.entries} entries)`
);
console.log(`budget showcase screen: ${getScreenById('scr_budget_model_creation')?.name}`);
if (errors.length) {
  console.error(`\n${errors.length} validation errors:`);
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log('\nAll cross-links valid.');
