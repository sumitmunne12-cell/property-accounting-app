// Validates src/data/modules/0*.js: real ES-module syntax, the required export,
// the module/submodule/screen schema, all 10 screen fields populated, unique ids,
// and no placeholder text.  Usage: node scripts/validate_modules.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIR = path.join(ROOT, 'src', 'data', 'modules');
const EXPECTED = {
  '01_general_ledger.js': 'glModule',
  '02_accounts_payable.js': 'apModule',
  '03_cash_management.js': 'cashModule',
  '04_accounts_receivable.js': 'arModule',
  '05_financial_close.js': 'closeModule',
  '06_jobcost_capex_reserves.js': 'jobcostModule',
  '07_fixed_assets.js': 'fixedAssetsModule',
  '08_budgeting_forecasting.js': 'budgetingModule',
  '09_reporting_admin.js': 'reportingAdminModule',
};
const SCREEN_FIELDS = [
  'id', 'name', 'navigation', 'purpose', 'whyRecordsAreHere', 'keyFieldsAndFilters',
  'accountantActionSOP', 'glAccountingImpact', 'whatHappensNext', 'yardiEquivalent', 'pdfManualSource',
  'regulatoryGuardrail',
];
const GUARDRAIL_FIELDS = ['governingAuthority', 'regulationCode', 'plainEnglishRule', 'auditRisk'];
const PLACEHOLDER = /(\/\/\s*\.\.\.|remaining screens|\btodo\b|\btbd\b|lorem ipsum|\[placeholder\]|rest of fields)/i;

const errors = [];
const allIds = new Set();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rpmods-'));
let totalScreens = 0;

for (const [file, exportName] of Object.entries(EXPECTED)) {
  const src = fs.readFileSync(path.join(DIR, file), 'utf8');
  const tmpFile = path.join(tmp, file.replace(/\.js$/, '.mjs'));
  fs.writeFileSync(tmpFile, src);
  const mod = await import(pathToFileURL(tmpFile).href);
  const m = mod[exportName];
  if (!m) { errors.push(`${file}: missing export ${exportName}`); continue; }
  for (const k of ['id', 'title', 'shortCode', 'icon', 'color', 'description']) {
    if (!m[k]) errors.push(`${file}: module field ${k} empty`);
  }
  if (!Array.isArray(m.submodules) || m.submodules.length === 0) errors.push(`${file}: no submodules`);
  let n = 0;
  const subIds = new Set();
  for (const sub of m.submodules || []) {
    if (!sub.id || !sub.title || !Array.isArray(sub.screens) || sub.screens.length === 0) {
      errors.push(`${file}: bad submodule ${sub.id}`);
    }
    if (subIds.has(sub.id)) errors.push(`${file}: duplicate submodule id ${sub.id}`);
    subIds.add(sub.id);
    for (const scr of sub.screens) {
      n += 1;
      for (const f of SCREEN_FIELDS) {
        const v = scr[f];
        const empty = v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && v.length === 0);
        if (empty) errors.push(`${file}: ${scr.id} field ${f} empty`);
      }
      for (const gf of GUARDRAIL_FIELDS) {
        const v = scr.regulatoryGuardrail && scr.regulatoryGuardrail[gf];
        if (typeof v !== 'string' || v.trim().length < 3) errors.push(`${file}: ${scr.id} regulatoryGuardrail.${gf} empty`);
      }
      if (allIds.has(scr.id)) errors.push(`${file}: duplicate screen id ${scr.id}`);
      allIds.add(scr.id);
      if (!/^scr_[a-z0-9_]+$/.test(scr.id)) errors.push(`${file}: bad id ${scr.id}`);
      if (!Array.isArray(scr.navigation) || scr.navigation.some((x) => typeof x !== 'string' || !x)) {
        errors.push(`${file}: ${scr.id} navigation invalid`);
      }
      for (const fld of scr.keyFieldsAndFilters || []) {
        if (!fld.name || !fld.description) errors.push(`${file}: ${scr.id} keyFieldsAndFilters entry incomplete`);
      }
      const blob = JSON.stringify(scr);
      if (PLACEHOLDER.test(blob)) errors.push(`${file}: ${scr.id} contains placeholder text`);
    }
  }
  totalScreens += n;
  console.log(`${file.padEnd(32)} ${exportName.padEnd(22)} submodules=${String(m.submodules.length).padStart(3)} screens=${n}`);
}
fs.rmSync(tmp, { recursive: true, force: true });

console.log(`TOTAL screens: ${totalScreens}`);
if (errors.length) {
  console.error(`${errors.length} validation errors`);
  for (const e of errors.slice(0, 50)) console.error('  ' + e);
  process.exit(1);
}
console.log('All module files valid.');
