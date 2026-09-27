// Validates the hand-written SME analysis layer in src/data/sme/.
// Checks that every part file is aggregated, that every key is a catalog screen of that module,
// that each analysis has the required fields and a valid confidence, and that no purpose or
// root cause is copy-pasted between screens (boilerplate). Prints coverage per module.
//
// Usage: node --import ./scripts/test/register.mjs --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/validate_sme.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MODULE_IDS, loadSmeAnalysis } from '../src/data/moduleLoader.js';
import { getScreenEntry, MODULES } from '../src/utils/screenIndex.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SME_DIR = path.join(ROOT, 'src', 'data', 'sme');
const TEXT_FIELDS = { purpose: 80, outcome: 30, rootCause: 80, ifSkipped: 40 };
const LIST_FIELDS = ['glAccounts', 'gaap', 'stakeholders', 'reports', 'redFlags'];
const REQUIRED_LISTS = ['stakeholders', 'redFlags'];
const PLACEHOLDER = /(\btodo\b|\btbd\b|lorem ipsum|\[placeholder\]|same as above|see previous)/i;
// The illustrative chart of accounts from scripts/rp_kb.py (COA_LEGEND). A GL account that uses one of
// these numbers must carry the same name (a parenthetical qualifier is fine), so numbers mean one thing.
const COA = {
  1110: 'Operating Cash', 1115: 'Security Deposit Trust Cash', 1120: 'Petty Cash', 1130: 'Undeposited Funds',
  1210: 'Resident/Tenant A/R', 1215: 'Allowance for Doubtful Accounts', 1230: 'Due From Affiliates',
  1250: 'Input VAT/Tax Recoverable', 1310: 'Prepaid Expenses', 1330: 'Tax & Insurance Escrow',
  1340: 'Replacement Reserve Escrow', 1410: 'Construction in Progress', 1520: 'Buildings', 1530: 'Building Improvements',
  1540: 'FF&E', 1590: 'Accumulated Depreciation', 2010: 'Accounts Payable', 2015: 'Retainage Payable',
  2020: 'Accrued Expenses', 2110: 'Resident Security Deposits', 2120: 'Prepaid Rent', 2130: 'Due To Affiliates',
  2140: 'Credit Card Payable', 2150: 'Employee Reimbursements Payable', 2160: 'Sales Tax/VAT Payable',
  2170: 'Unclaimed Property Payable', 2210: 'Mortgage/Construction Loan Payable', 3010: "Partners' Capital",
  3020: 'Distributions', 3100: 'Retained Earnings', 4010: 'Gross Potential Rent', 4040: 'Concessions', 4050: 'Bad Debt',
  4100: 'Other Income', 4110: 'Utility Reimbursement', 6010: 'Payroll', 6110: 'Repairs & Maintenance', 6210: 'Utilities',
  6310: 'Marketing', 6410: 'Administrative', 6420: 'Bank Charges', 6510: 'Management Fees', 6610: 'Insurance',
  6620: 'Real Estate Taxes', 7010: 'Interest Expense', 7110: 'Depreciation Expense',
};

const errors = [];
const err = (m) => errors.push(m);
const seenText = new Map(); // normalized text -> screen id

let total = 0;
let catalog = 0;
for (const moduleId of MODULE_IDS) {
  const map = await loadSmeAnalysis(moduleId);

  // Every part file must be spread into the aggregator, with no key in two parts.
  const partDir = path.join(SME_DIR, moduleId);
  const parts = fs.existsSync(partDir) ? fs.readdirSync(partDir).filter((f) => f.endsWith('.json')).sort() : [];
  const partKeys = new Map();
  for (const f of parts) {
    const part = (await import(pathToFileURL(path.join(partDir, f)).href)).default;
    for (const id of Object.keys(part)) {
      if (partKeys.has(id)) err(`${moduleId}: ${id} is in both ${partKeys.get(id)} and ${f}`);
      partKeys.set(id, f);
      if (!map[id]) err(`${moduleId}: ${f} is not imported by src/data/sme/${moduleId}.js`);
    }
  }

  for (const [id, a] of Object.entries(map)) {
    const where = `${moduleId}/${id}`;
    const entry = getScreenEntry(id);
    if (!entry) err(`${where}: not a catalog screen`);
    else if (entry.moduleId !== moduleId) err(`${where}: screen belongs to module ${entry.moduleId}`);
    for (const [k, min] of Object.entries(TEXT_FIELDS)) {
      if (typeof a[k] !== 'string' || a[k].trim().length < min) err(`${where}: ${k} missing or shorter than ${min} chars`);
      else if (PLACEHOLDER.test(a[k])) err(`${where}: ${k} has placeholder text`);
    }
    for (const k of LIST_FIELDS) {
      if (!Array.isArray(a[k]) || a[k].some((x) => typeof x !== 'string' || !x.trim())) err(`${where}: ${k} must be a list of strings`);
    }
    for (const k of REQUIRED_LISTS) if (!a[k]?.length) err(`${where}: ${k} is empty`);
    for (const acct of a.glAccounts || []) {
      const [, num, name] = /^(\d{4}) (.*)$/.exec(acct) || [];
      if (COA[num] && !name.startsWith(COA[num])) err(`${where}: "${acct}" should be "${num} ${COA[num]}"`);
    }
    if (a.yardi !== undefined && (typeof a.yardi !== 'string' || !a.yardi.trim())) err(`${where}: yardi must be a non-empty string`);
    if (!['high', 'medium'].includes(a.confidence)) err(`${where}: confidence must be "high" or "medium"`);
    for (const k of ['purpose', 'rootCause']) {
      const norm = (a[k] || '').toLowerCase().replace(/\s+/g, ' ').trim();
      if (!norm) continue;
      if (seenText.has(norm)) err(`${where}: ${k} duplicates ${seenText.get(norm)}`);
      else seenText.set(norm, id);
    }
  }

  const count = Object.keys(map).length;
  const screens = MODULES.find((m) => m.id === moduleId).screenCount;
  total += count;
  catalog += screens;
  console.log(`${moduleId.padEnd(13)} ${String(count).padStart(5)} / ${screens} screens`);
}

console.log(`SME analysis: ${total} / ${catalog} screens (${((100 * total) / catalog).toFixed(1)}%)`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  errors.slice(0, 200).forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log('SME analysis OK');
