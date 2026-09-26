// Screen index + fuzzy search over every screen in the nine RealPage module files.
//
// Built once at import time: one flat entry per screen with pre-normalized text, so
// each keystroke only scans pre-lowercased strings. Pure JS (no React Native imports) so
// it can be unit-tested in Node.

import { REALPAGE_MODULES } from '../data/modules/index';

export const MODULE_FILE_TO_ID = {
  '01_general_ledger': 'gl',
  '02_accounts_payable': 'ap',
  '03_cash_management': 'cash',
  '04_accounts_receivable': 'ar',
  '05_financial_close': 'close',
  '06_jobcost_capex_reserves': 'job_cost',
  '07_fixed_assets': 'fixed_assets',
  '08_budgeting_forecasting': 'budgeting',
  '09_reporting_admin': 'reporting',
};

// "A/P Invoice" -> "ap invoice", "G/L" -> "gl", "1099-NEC" -> "1099 nec"
export const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/(\w)\/(\w)/g, '$1$2')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const ENTRIES = [];
const BY_ID = new Map();

for (const mod of REALPAGE_MODULES) {
  for (const sub of mod.submodules) {
    for (const screen of sub.screens) {
      const name = normalize(screen.name);
      const entry = {
        screen,
        moduleId: mod.id,
        moduleTitle: mod.title,
        moduleShortCode: mod.shortCode,
        moduleColor: mod.color,
        submoduleId: sub.id,
        submoduleTitle: sub.title,
        name,
        nameWords: name.split(' '),
        nav: normalize(screen.navigation.join(' ')),
        purpose: normalize(screen.purpose.slice(0, 400)),
      };
      ENTRIES.push(entry);
      BY_ID.set(screen.id, entry);
    }
  }
}

export const SCREEN_COUNT = ENTRIES.length;

export const getScreenEntry = (id) => BY_ID.get(id) || null;
export const getScreenById = (id) => (BY_ID.has(id) ? BY_ID.get(id).screen : null);
export const hasScreen = (id) => BY_ID.has(id);

// Bounded Levenshtein: returns max+1 as soon as the distance must exceed `max`.
export function editDistance(a, b, max = 2) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

function tokenScore(entry, token) {
  let best = 0;
  for (const w of entry.nameWords) {
    if (w === token) return 10;
    if (w.startsWith(token)) best = Math.max(best, 7);
  }
  if (best) return best;
  if (entry.name.includes(token)) return 5;
  if (entry.nav.includes(token)) return 3;
  if (entry.purpose.includes(token)) return 1;
  // typo tolerance on screen-name words: 1 edit for 4-6 letters, 2 edits for 7+
  if (token.length >= 4) {
    const max = token.length >= 7 ? 2 : 1;
    for (const w of entry.nameWords) {
      if (w.length >= 3 && editDistance(token, w, max) <= max) return 4;
    }
  }
  return 0;
}

/**
 * Fuzzy search across all screens.
 * Every query token must match the screen (name, navigation, purpose or a near-miss name word);
 * results are ranked by name matches first.
 * @returns {{ results: Array, total: number }}
 */
export function searchScreens(query, { moduleId = null, limit = 50 } = {}) {
  const q = normalize(query);
  if (!q) return { results: [], total: 0 };
  const tokens = Array.from(new Set(q.split(' ').filter(Boolean)));
  const scored = [];
  for (const entry of ENTRIES) {
    if (moduleId && entry.moduleId !== moduleId) continue;
    let score = 0;
    let ok = true;
    for (const t of tokens) {
      const s = tokenScore(entry, t);
      if (!s) {
        ok = false;
        break;
      }
      score += s;
    }
    if (!ok) continue;
    if (entry.name.includes(q)) score += 15;
    if (entry.name.startsWith(q)) score += 5;
    // prefer the primary copy of a topic over its "_2" variant from another manual
    if (!/_\d+$/.test(entry.screen.id)) score += 0.5;
    scored.push({ entry, score });
  }
  scored.sort((a, b) => b.score - a.score || a.entry.name.length - b.entry.name.length);
  return { results: scored.slice(0, limit).map((s) => s.entry), total: scored.length };
}

export const ALL_SCREEN_ENTRIES = ENTRIES;
