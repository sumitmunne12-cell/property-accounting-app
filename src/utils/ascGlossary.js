// FASB glossary search and defined-term matching for the official-text reader.
// The glossary file itself is lazy (data/asc/ascLoader → ascGlossary.json); these helpers are pure JS
// so they can be unit-tested in Node.

import { normalize } from './fuzzy';

/**
 * Search glossary terms (and, for longer queries, definitions).
 * Ranking: exact term > term starts with query > a word of the term starts with it > definition match.
 * @returns {{ results: Array, total: number }}
 */
export function searchGlossary(glossary, query, { limit = 20 } = {}) {
  const q = normalize(query);
  if (!glossary || !q) return { results: [], total: 0 };
  const tokens = q.split(' ').filter(Boolean);
  const scored = [];
  for (const e of glossary.terms) {
    const term = e._n || (e._n = normalize(e.term));
    let score = 0;
    if (term === q) score = 100;
    else if (term.startsWith(q)) score = 60;
    else if (tokens.every((t) => term.split(' ').some((w) => w.startsWith(t)))) score = 40;
    else if (q.length >= 4) {
      const def = e._d || (e._d = normalize(e.defs.map((d) => d.text).join(' ') + ' ' + (e.master ? e.master.text : '')));
      if (def.includes(q)) score = 10;
    }
    if (score) scored.push({ e, score });
  }
  scored.sort((a, b) => b.score - a.score || a.e.term.length - b.e.term.length);
  return { results: scored.slice(0, limit).map((s) => s.e), total: scored.length };
}

/** The glossary entry for a term (case-insensitive), or null. */
export function findGlossaryTerm(glossary, term) {
  if (!glossary || !term) return null;
  const n = normalize(term);
  return glossary.terms.find((e) => (e._n || (e._n = normalize(e.term))) === n) || null;
}

const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Matcher for the terms a Topic defines. Longest terms win ("Lease Term" before "Lease"), matching is
 * case-insensitive, whole-word and tolerates a plural "s"/"es".
 * @param terms  defined term names (e.g., the Topic's glossary block titles)
 */
export function buildTermMatcher(terms) {
  const canonical = new Map();
  for (const t of terms) {
    const clean = String(t).trim();
    if (clean.length >= 3 && !canonical.has(clean.toLowerCase())) canonical.set(clean.toLowerCase(), clean);
  }
  if (!canonical.size) return null;
  const alternation = Array.from(canonical.values())
    .sort((a, b) => b.length - a.length)
    .map(escapeRx)
    .join('|');
  return { rx: new RegExp(`\\b(${alternation})(?:e?s)?\\b`, 'gi'), canonical };
}

/**
 * Splits text into plain and term segments: [{ text }, { text, term }]. Each term is marked once per
 * call site: pass a Set in `seen` to skip terms already marked earlier in the same paragraph.
 */
export function splitByTerms(text, matcher, seen = null) {
  if (!matcher || !text) return [{ text }];
  const out = [];
  let last = 0;
  matcher.rx.lastIndex = 0;
  for (let m = matcher.rx.exec(text); m; m = matcher.rx.exec(text)) {
    const term = matcher.canonical.get(m[1].toLowerCase());
    if (!term || (seen && seen.has(term))) continue;
    if (seen) seen.add(term);
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], term });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
