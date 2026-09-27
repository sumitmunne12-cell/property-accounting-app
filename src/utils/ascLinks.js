// Track A: links catalog screens to the First-Principles GAAP cards.
//
// A screen links to an ASC Topic when
//   1. its regulatory guardrail cites the Topic ("ASC 842-30-25-11", "ASC 360-10 …"), or
//   2. its name / navigation / category matches a real-estate rule below (leases, capital
//      projects, fixed assets, accruals and contingencies, non-lease revenue), or
//   3. it lives in a module that is governed by the Topic (Fixed Assets → 360, Job Cost → 970).
// The five core property standards (842, 970, 606, 360, 450) are listed first.
//
// Pure JS (no React Native imports) so it can be unit-tested in Node against all 7,107 screens.

import { getAscEntry } from './ascIndex';

export const PRIMARY_RE_TOPICS = ['842', '970', '606', '360', '450'];

export const LINK_REASONS = {
  cited: 'Cited in this screen’s legal & audit guardrail',
  capital: 'Capital project / development cost screen',
  keyword: 'Screen subject matches this standard',
  module: 'Module governed by this standard',
};

const RULES = [
  {
    topic: '842',
    rx: /\b(leases?|leasing|lessee|lessor|rents?|rental|residents?|tenants?|concessions?|move[- ]?ins?|move[- ]?outs?|straight[- ]?line|security deposits?|ground leases?)\b/i,
  },
  {
    topic: '970',
    modules: ['job_cost'],
    rx: /\b(job cost|construction|development|capital projects?|capex|draws?|retainage|change orders?|pre-?acquisition|lien releases?|subcontracts?|project costs?)\b/i,
  },
  {
    topic: '606',
    rx: /\b(revenue|ancillary income|other income|utility billing|rubs|bill-?backs?|deferred revenue|contract liabilit\w*|sales register|management fees? (revenue|income))\b/i,
  },
  {
    topic: '360',
    modules: ['fixed_assets'],
    rx: /\b(fixed assets?|depreciat\w*|capitaliz\w*|impairment|useful li(fe|ves)|asset disposals?|dispose of assets?|placed in service|asset retirements?|capital improvements?)\b/i,
  },
  {
    topic: '450',
    rx: /\b(accruals?|accrued liabilit\w*|contingen\w*|litigation|lawsuits?|legal claims?|insurance claims?|loss reserves?|warrant(y|ies))\b/i,
  },
];

// Guardrail citations that describe capital-project cost capitalization (development/renovation).
const CAPITAL_PROJECT_RX = /ASC 360-10 \(capital projects\)|ASC 835-20/;

const citedTopics = (code) => Array.from(new Set([...String(code || '').matchAll(/\bASC (\d{3})\b/g)].map((m) => m[1])));

/**
 * ASC Topics linked to a catalog screen.
 * @param entry   screen index entry (utils/screenIndex) — name, nav, category, moduleId
 * @param screen  optional full screen object; its regulatoryGuardrail.regulationCode adds citations
 * @returns Array<{ topic, title, re, reason }> — core property standards first, at most `limit`
 */
export function ascLinksForScreen(entry, screen = null, { limit = 5 } = {}) {
  if (!entry) return [];
  const found = new Map(); // topic -> reason
  const add = (topic, reason) => {
    if (!found.has(topic) && getAscEntry(topic)) found.set(topic, reason);
  };

  const code = screen && screen.regulatoryGuardrail ? screen.regulatoryGuardrail.regulationCode : '';
  for (const t of citedTopics(code)) add(t, 'cited');
  if (CAPITAL_PROJECT_RX.test(code)) add('970', 'capital');

  const text = `${entry.name} ${entry.nav || ''} ${entry.category || ''}`;
  for (const rule of RULES) {
    if (rule.modules && rule.modules.includes(entry.moduleId)) add(rule.topic, 'module');
    else if (rule.rx.test(text)) add(rule.topic, 'keyword');
  }

  const primary = PRIMARY_RE_TOPICS.filter((t) => found.has(t));
  const others = Array.from(found.keys())
    .filter((t) => !PRIMARY_RE_TOPICS.includes(t))
    .sort();
  return primary
    .concat(others)
    .slice(0, limit)
    .map((topic) => {
      const e = getAscEntry(topic);
      return { topic, title: e.title, re: e.re, reason: found.get(topic) };
    });
}

/** ASC Topics cited in any free-text regulation code (e.g., a Daily Hub task guardrail). */
export function ascLinksForCitation(code, { limit = 5 } = {}) {
  const topics = citedTopics(code).filter((t) => getAscEntry(t));
  const ordered = PRIMARY_RE_TOPICS.filter((t) => topics.includes(t)).concat(topics.filter((t) => !PRIMARY_RE_TOPICS.includes(t)).sort());
  return ordered.slice(0, limit).map((topic) => {
    const e = getAscEntry(topic);
    return { topic, title: e.title, re: e.re, reason: 'cited' };
  });
}
