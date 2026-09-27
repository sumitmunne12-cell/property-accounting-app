// Unit tests for the US GAAP Codex: ASC index, lazy loading, master cards, official text,
// fuzzy search and the Track A screen links. Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  ASC_TOPICS,
  ASC_SERIES,
  ASC_TOPIC_COUNT,
  ASC_FILTERS,
  getAscEntry,
  searchAsc,
  parseAscReference,
  groupBySeries,
  matchesFilter,
  filterCount,
} from '../../src/utils/ascIndex.js';
import {
  ASC_SERIES_KEYS,
  ASC_TEXT_TOPICS,
  isSeriesLoaded,
  isTextLoaded,
  loadedSeries,
  loadedTexts,
  loadCard,
  loadSeries,
  loadText,
  getLoadedCard,
  isGlossaryLoaded,
  loadGlossary,
} from '../../src/data/asc/ascLoader.js';
import { searchGlossary, findGlossaryTerm, buildTermMatcher, splitByTerms } from '../../src/utils/ascGlossary.js';
import { ascLinksForScreen, ascLinksForCitation, PRIMARY_RE_TOPICS } from '../../src/utils/ascLinks.js';
import { ALL_SCREEN_ENTRIES, getScreenEntry, loadScreenById } from '../../src/utils/screenIndex.js';
import { ascLinksForTopics } from '../../src/utils/ascLinks.js';
import { CLOSE_TASK_ASC, EXCEPTION_ASC } from '../../src/data/gaapLinksData.js';
import {
  INTERVALS,
  MAX_BOX,
  MASTERED_BOX,
  emptyStudy,
  trapId,
  todayIso,
  addDays,
  grade,
  isMastered,
  buildDeck,
  progressFor,
  masteredByTopic,
  toggleBookmark,
  normalizeStudy,
} from '../../src/utils/studyEngine.js';
import { CLOSE_PHASES } from '../../src/data/closePlaybookData.js';
import { EXCEPTION_PLAYBOOKS } from '../../src/data/exceptionsPlaybookData.js';

const MD_DIR = fileURLToPath(new URL('../../asc_codification/markdown/', import.meta.url));
const MARKDOWN_TOPICS = readdirSync(MD_DIR)
  .map((f) => /^ASC_(\d{3})_/.exec(f))
  .filter(Boolean)
  .map((m) => m[1])
  .sort();

const balanced = (je) => {
  const dr = je.lines.reduce((n, l) => n + (l.debit || 0), 0);
  const cr = je.lines.reduce((n, l) => n + (l.credit || 0), 0);
  return dr > 0 && dr === cr;
};

// Must run first: nothing may be loaded just by importing the index, loader or link rules.
test('boot is lightweight: no ASC card or text file is loaded at import time', () => {
  assert.deepEqual(loadedSeries(), []);
  assert.deepEqual(loadedTexts(), []);
  assert.ok(ASC_SERIES_KEYS.every((s) => !isSeriesLoaded(s)));
  assert.equal(getLoadedCard('842'), null);
  assert.equal(isGlossaryLoaded(), false);
  // Linking screens and searching use only the index.
  ascLinksForScreen(getScreenEntry('scr_cash_bank_reconciliation_new'));
  searchAsc('lease');
  assert.deepEqual(loadedSeries(), []);
});

test('all 99 standards in the markdown library are indexed — none dropped', () => {
  assert.equal(MARKDOWN_TOPICS.length, 99);
  assert.equal(ASC_TOPIC_COUNT, 99);
  assert.deepEqual(ASC_TOPICS.map((e) => e.topic).sort(), MARKDOWN_TOPICS);
  assert.deepEqual([...ASC_TEXT_TOPICS].sort(), MARKDOWN_TOPICS);
  assert.equal(new Set(ASC_TOPICS.map((e) => e.topic)).size, 99);
});

test('index is organized into the nine FASB series (100s–900s)', () => {
  assert.deepEqual(
    ASC_SERIES.map((s) => s.series),
    ['100', '200', '300', '400', '500', '600', '700', '800', '900']
  );
  assert.deepEqual(ASC_SERIES_KEYS, ['100', '200', '300', '400', '500', '600', '700', '800', '900']);
  assert.equal(
    ASC_SERIES.reduce((n, s) => n + s.count, 0),
    99
  );
  const cats = Object.fromEntries(ASC_SERIES.map((s) => [s.series, s.category]));
  assert.equal(cats['100'], 'General Principles');
  assert.equal(cats['300'], 'Assets');
  assert.equal(cats['800'], 'Broad Transactions');
  assert.equal(cats['900'], 'Industry');
  for (const e of ASC_TOPICS) {
    assert.equal(e.series, `${e.topic[0]}00`, e.topic);
    assert.ok(e.title && e.tag && e.aliases.length && e.subtopics.length, e.topic);
    assert.ok(e.paragraphs > 0, e.topic);
  }
  const groups = groupBySeries(ASC_TOPICS);
  assert.equal(groups.length, 9);
  assert.equal(groups.reduce((n, g) => n + g.data.length, 0), 99);
});

test('real-estate filter marks the property standards', () => {
  for (const t of PRIMARY_RE_TOPICS) assert.equal(getAscEntry(t).re, 'core', t);
  for (const t of ['970', '974', '810', '815', '835', '470', '805', '323']) assert.ok(getAscEntry(t).re, t);
  for (const t of ['908', '944', '932', '260']) assert.equal(getAscEntry(t).re, null, t);
  assert.equal(filterCount('all'), 99);
  assert.ok(filterCount('re') > filterCount('core'));
  assert.ok(filterCount('core') >= 5);
  assert.deepEqual(
    ASC_FILTERS.map((f) => f.key).sort(),
    ['all', 'core', 're']
  );
  const re = searchAsc('', { filter: 're' }).results;
  assert.equal(re.length, filterCount('re'));
  assert.ok(re.every((e) => matchesFilter(e, 're')));
});

test('fuzzy search finds standards by number, name, alias and typo', () => {
  const top = (q, opts) => searchAsc(q, opts).results[0]?.topic;
  assert.equal(top('842'), '842');
  assert.equal(top('ASC 606'), '606');
  assert.equal(top('Lease'), '842');
  assert.equal(top('leases'), '842');
  assert.equal(top('Derivatives'), '815');
  assert.equal(top('derivitives'), '815'); // typo
  assert.equal(top('VIE'), '810');
  assert.equal(top('Stock Comp'), '718');
  assert.equal(top('CECL'), '326');
  assert.equal(top('ROU'), '842');
  assert.equal(top('goodwill impairment'), '350');
  assert.equal(top('capitalized interest'), '835');
  assert.equal(top('contingencies'), '450');
  assert.equal(top('real estate'), '970');
  assert.equal(top('REIT'), '974');
  assert.deepEqual(
    searchAsc('84').results.map((e) => e.topic),
    ['840', '842', '845', '848']
  );
  assert.equal(searchAsc('zzqx nothing').total, 0);
  // Superseded legacy Topics rank below the current standard.
  const lease = searchAsc('leases').results.map((e) => e.topic);
  assert.ok(lease.indexOf('842') < lease.indexOf('840'));
  // Filters apply to search results.
  assert.equal(searchAsc('Stock Comp', { filter: 'core' }).total, 0);
  assert.equal(top('Stock Comp', { filter: 're' }), '718');
  assert.equal(searchAsc('Airlines', { filter: 're' }).total, 0);
  assert.equal(top('Airlines'), '908');
});

test('Codification references resolve to a Topic and paragraph', () => {
  assert.deepEqual(parseAscReference('842'), { topic: '842' });
  assert.deepEqual(parseAscReference('ASC 842-20-25-1'), {
    topic: '842',
    subtopic: '20',
    section: '25',
    paragraph: '842-20-25-1',
  });
  assert.equal(parseAscReference('970-10-s99-1').paragraph, '970-10-S99-1');
  assert.equal(parseAscReference('123'), null);
  assert.equal(parseAscReference('lease'), null);
  const r = searchAsc('842-20-25-1');
  assert.equal(r.results[0].topic, '842');
  assert.equal(r.reference.paragraph, '842-20-25-1');
});

test('search stays fast', () => {
  const queries = ['lease', 'derivitives', 'stock comp', 'vie', '84', 'real estate', 'zzqx'];
  const t0 = performance.now();
  for (let i = 0; i < 50; i++) queries.forEach((q) => searchAsc(q));
  const avg = (performance.now() - t0) / (50 * queries.length);
  assert.ok(avg < 5, `average ASC search ${avg.toFixed(2)}ms`);
});

test('lazy loading pulls in one series at a time and shares concurrent loads', async () => {
  const [a, b] = await Promise.all([loadCard('842'), loadCard('842')]);
  assert.equal(a, b);
  assert.equal(a.topic, '842');
  assert.ok(isSeriesLoaded('800'));
  assert.ok(!isSeriesLoaded('300'), 'opening an 800s card must not load the 300s');
  assert.ok(!isTextLoaded('842'), 'official text loads only when its tab opens');
  assert.equal(getLoadedCard('842'), a);
  assert.equal(await loadCard('999'), null);
  await assert.rejects(() => loadText('999'));
});

test('every master card is complete, matches the index and has balanced journal entries', async () => {
  let entries = 0;
  for (const s of ASC_SERIES_KEYS) {
    const file = await loadSeries(s);
    assert.equal(file.series, s);
    const topics = Object.keys(file.cards).sort();
    assert.deepEqual(topics, ASC_TOPICS.filter((e) => e.series === s).map((e) => e.topic).sort(), s);
    for (const t of topics) {
      const c = file.cards[t];
      const e = getAscEntry(t);
      assert.equal(c.title, e.title, t);
      assert.equal(c.re, e.re, t);
      assert.equal(c.tag, e.tag, t);
      assert.ok(c.truth.length > 120, `${t} truth`);
      assert.ok(c.analogy.title && c.analogy.story.length > 120, `${t} analogy`);
      assert.ok(c.recognition.length >= 2, `${t} recognition`);
      assert.ok(c.measurement.basis && c.measurement.initial && c.measurement.subsequent, `${t} measurement`);
      assert.ok(c.auditTraps.length >= 3 && c.auditTraps.every((x) => x.q && x.a), `${t} traps`);
      assert.equal(c.auditTraps.length, e.traps, `${t} index trap count`);
      // flashcard ids must be unique within a Topic or two traps would share progress
      assert.equal(new Set(c.auditTraps.map((x) => trapId(t, x.q))).size, c.auditTraps.length, `${t} trap ids`);
      assert.ok(c.journalEntries.length >= 1, `${t} journal entries`);
      for (const je of c.journalEntries) {
        assert.ok(balanced(je), `${t}: ${je.label} does not balance`);
        assert.ok(je.lines.some((l) => l.debit) && je.lines.some((l) => l.credit), `${t}: ${je.label}`);
        entries++;
      }
      if (c.re) assert.ok(c.propertyLens, `${t} property lens`);
      assert.ok(['ai-draft', 'self-reviewed', 'cpa-reviewed'].includes(c.review.status), `${t} review status`);
      assert.equal(e.review, c.review.status, `${t} index review status`);
      if (c.re) assert.notEqual(c.review.status, 'ai-draft', `${t}: real-estate cards must be at least self-reviewed`);
      assert.ok(c.outline.length === e.sourceSubtopics, `${t} outline`);
    }
  }
  assert.ok(entries >= 99);
});

test('official text is complete for all 99 Topics and every cited paragraph exists', async () => {
  let paragraphs = 0;
  for (const e of ASC_TOPICS) {
    const doc = await loadText(e.topic);
    assert.equal(doc.topic, e.topic);
    assert.equal(doc.title, e.title);
    assert.equal(doc.subtopics.length, e.sourceSubtopics, e.topic);
    const ids = new Set();
    for (const st of doc.subtopics) for (const sec of st.sections) for (const b of sec.blocks) if (b.p) ids.add(b.p);
    let count = 0;
    for (const st of doc.subtopics) for (const sec of st.sections) count += sec.blocks.filter((b) => b.p).length;
    assert.equal(count, e.paragraphs, `${e.topic} paragraph count`);
    paragraphs += count;
    const card = await loadCard(e.topic);
    for (const p of card.keyParagraphs) assert.ok(ids.has(p.id), `${e.topic}: key paragraph ${p.id}`);
    for (const a of card.anchors) assert.ok(ids.has(a.id), `${e.topic}: anchor ${a.id}`);
  }
  assert.ok(paragraphs > 18000, `${paragraphs} paragraphs`);
  // Spot-check the official wording survived the export clean-up (links, duplicates, inline refs).
  const leases = await loadText('842');
  const p = leases.subtopics.flatMap((s) => s.sections).flatMap((s) => s.blocks).find((b) => b.p === '842-20-35-4');
  assert.match(p.t[0], /as described in paragraphs 842-10-35-4 through 35-5\. A lessee shall recognize/);
  assert.ok(!/\]\(|fasb-asc-publication/.test(JSON.stringify(leases)), 'link markup must be stripped');
});

test('missing-subtopic manifest names exactly what the export lacks', () => {
  const miss = (t) => getAscEntry(t).missing.map((m) => m.split(' ')[0]);
  for (const code of ['970-230', '970-323', '970-340', '970-360', '970-470', '970-720', '970-810', '970-835']) {
    assert.ok(miss('970').includes(code), code);
  }
  assert.ok(miss('974').includes('974-842'));
  assert.ok(miss('805').includes('805-740'));
  assert.ok(getAscEntry('360').relatedMissing.includes('970-360'));
  assert.ok(getAscEntry('842').relatedMissing.includes('974-842'));
  // Subtopics that are in the export are never reported missing.
  for (const e of ASC_TOPICS) {
    for (const m of e.missing) {
      const code = m.split(' ')[0];
      assert.ok(!e.subtopics.some((s) => `${e.topic}-${s.split(' ')[0]}` === code), `${e.topic}: ${m}`);
    }
  }
  assert.deepEqual(getAscEntry('842').missing, []);
});

test('Track A: screens link to the real-estate standards', async () => {
  const linksOf = async (id) => ascLinksForScreen(getScreenEntry(id), await loadScreenById(id)).map((l) => l.topic);
  assert.ok((await linksOf('scr_fixed_assets_post_depreciation')).includes('360'));
  assert.ok((await linksOf('scr_gl_security_deposits_multifamily')).includes('842'));
  const jobCost = ALL_SCREEN_ENTRIES.find((e) => e.moduleId === 'job_cost');
  assert.ok((await linksOf(jobCost.id)).includes('970'));
  const accrual = ALL_SCREEN_ENTRIES.find((e) => /accrual workbench/i.test(e.name));
  assert.ok((await linksOf(accrual.id)).includes('450'));

  const perTopic = {};
  let linked = 0;
  for (const e of ALL_SCREEN_ENTRIES) {
    const links = ascLinksForScreen(e, await loadScreenById(e.id));
    if (links.length) linked++;
    assert.ok(links.length <= 5);
    const topics = links.map((l) => l.topic);
    assert.equal(new Set(topics).size, topics.length, e.id);
    // Core property standards are always listed first.
    const firstOther = topics.findIndex((t) => !PRIMARY_RE_TOPICS.includes(t));
    if (firstOther >= 0) assert.ok(topics.slice(firstOther).every((t) => !PRIMARY_RE_TOPICS.includes(t)), e.id);
    for (const l of links) {
      assert.ok(getAscEntry(l.topic), l.topic);
      perTopic[l.topic] = (perTopic[l.topic] || 0) + 1;
    }
  }
  assert.ok(linked > 3000, `${linked} of ${ALL_SCREEN_ENTRIES.length} screens linked`);
  for (const t of PRIMARY_RE_TOPICS) assert.ok(perTopic[t] >= 40, `ASC ${t} linked to ${perTopic[t] || 0} screens`);
  assert.equal(ascLinksForScreen(null).length, 0);
});

test('Track A: Daily Hub guardrail citations link to cards', () => {
  const links = ascLinksForCitation('ASC 815-10 (derivatives at fair value); ASC 842-30 (lessor); IRC § 163');
  assert.deepEqual(
    links.map((l) => l.topic),
    ['842', '815']
  );
  assert.deepEqual(ascLinksForCitation('SOX 404 only'), []);
});

test('Track A: every close task and exception playbook maps to real ASC Topics', () => {
  const taskIds = CLOSE_PHASES.flatMap((p) => p.tasks.map((t) => t.id)).sort();
  assert.deepEqual(Object.keys(CLOSE_TASK_ASC).sort(), taskIds, 'close map must cover exactly the close tasks');
  assert.deepEqual(Object.keys(EXCEPTION_ASC).sort(), EXCEPTION_PLAYBOOKS.map((x) => x.id).sort());
  for (const [id, topics] of [...Object.entries(CLOSE_TASK_ASC), ...Object.entries(EXCEPTION_ASC)]) {
    for (const t of topics) assert.ok(getAscEntry(t), `${id}: ASC ${t}`);
    assert.equal(new Set(topics).size, topics.length, id);
    assert.equal(ascLinksForTopics(topics, 'close').length, topics.length, id);
  }
  const linkedTasks = taskIds.filter((id) => CLOSE_TASK_ASC[id].length).length;
  assert.ok(linkedTasks >= taskIds.length - 2, `${linkedTasks} of ${taskIds.length} close tasks linked`);
  assert.ok(EXCEPTION_PLAYBOOKS.filter((x) => EXCEPTION_ASC[x.id].length).length >= 14);
  assert.equal(EXCEPTION_ASC.ex_gpr_variance[0], '842');
  assert.equal(CLOSE_TASK_ASC.p4_depreciation[0], '360');
  assert.equal(CLOSE_TASK_ASC.p4_accrued_expense_review[0], '450');
  assert.equal(EXCEPTION_ASC.ex_retainage[0], '970');
  assert.ok(Object.values(CLOSE_TASK_ASC).some((t) => t.includes('606')));
});

test('FASB glossary: current Topic definitions plus Master Glossary terms, searchable', async () => {
  const g = await loadGlossary();
  assert.ok(g.terms.length > 1300, `${g.terms.length} terms`);
  assert.equal(new Set(g.terms.map((t) => t.term.toLowerCase())).size, g.terms.length, 'terms are unique');
  for (const t of g.terms) {
    assert.ok(t.defs.length || t.master, t.term);
    for (const d of t.defs) {
      assert.ok(d.text.length > 0 && d.topics.length > 0, t.term);
      for (const code of d.topics) assert.ok(getAscEntry(code.split('-')[0]), `${t.term}: ${code}`);
    }
    if (t.master) assert.ok(!/\b(FAS|SOP|APB) \d+[^,]*, paragraph \d/.test(t.master.text), `${t.term}: legacy source tag left in text`);
  }
  const lease = findGlossaryTerm(g, 'lease');
  assert.ok(lease.defs[0].topics.includes('842-10'));
  assert.match(lease.defs[0].text, /right to control the use of identified property, plant, or equipment/);
  assert.equal(searchGlossary(g, 'lease term').results[0].term, 'Lease Term');
  assert.equal(searchGlossary(g, 'primary beneficiary').results[0].term, 'Primary Beneficiary');
  assert.ok(searchGlossary(g, 'variable interest entity').total >= 1);
  assert.equal(searchGlossary(g, '').total, 0);
  assert.ok(g.terms.some((t) => t.master && !t.defs.length), 'Master-Glossary-only terms are included');
});

test('defined terms are marked longest-first, case-insensitive, once per paragraph', () => {
  const m = buildTermMatcher(['Lease', 'Lease Term', 'Lessee', 'ab']);
  const seen = new Set();
  const parts = splitByTerms('The lease term of the Lease is set by the lessee; leases and the lease term again.', m, seen);
  const terms = parts.filter((p) => p.term).map((p) => `${p.text}=${p.term}`);
  assert.deepEqual(terms, ['lease term=Lease Term', 'Lease=Lease', 'lessee=Lessee']);
  assert.equal(parts.map((p) => p.text).join(''), 'The lease term of the Lease is set by the lessee; leases and the lease term again.');
  // plural tolerance when not yet seen
  assert.deepEqual(
    splitByTerms('Two leases.', m).filter((p) => p.term).map((p) => p.term),
    ['Lease']
  );
  assert.equal(buildTermMatcher([]), null);
  assert.deepEqual(splitByTerms('plain', null), [{ text: 'plain' }]);
});

test('study mode: Leitner boxes space reviews out and a miss resets to tomorrow', () => {
  const day = '2026-01-30';
  const id = trapId('842', 'Is a lease with a purchase option always a finance lease?');
  let s = emptyStudy();
  const boxes = [];
  for (let i = 0; i < MAX_BOX + 2; i++) {
    s = grade(s, id, true, day);
    boxes.push(s.cards[id].box);
  }
  assert.deepEqual(boxes, [1, 2, 3, 4, 5, 5, 5]); // capped at the top box
  assert.equal(s.cards[id].due, addDays(day, INTERVALS[MAX_BOX]));
  assert.equal(s.cards[id].seen, MAX_BOX + 2);
  assert.ok(isMastered(s.cards[id]));

  const missed = grade(s, id, false, day);
  assert.equal(missed.cards[id].box, 1);
  assert.equal(missed.cards[id].due, '2026-01-31');
  assert.equal(missed.cards[id].correct, s.cards[id].correct);
  assert.equal(s.cards[id].box, MAX_BOX, 'grade() must not mutate its input');

  // a first-time "Review again" also lands in box 1, due tomorrow
  const fresh = grade(emptyStudy(), id, false, day);
  assert.deepEqual([fresh.cards[id].box, fresh.cards[id].due], [1, '2026-01-31']);
  assert.equal(MASTERED_BOX, 4);
  assert.ok(!isMastered(grade(grade(grade(emptyStudy(), id, true, day), id, true, day), id, true, day).cards[id]));

  // dates roll over months and years in local time
  assert.equal(addDays('2026-12-25', 14), '2027-01-08');
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.match(todayIso(), /^\d{4}-\d{2}-\d{2}$/);
});

test('study mode: deck puts overdue cards first, then new ones, and counts progress', () => {
  const items = ['a', 'b', 'c', 'd', 'e'].map((q) => ({ id: trapId('606', q), topic: '606', q, a: 'x' }));
  const [a, b, c, d] = items.map((i) => i.id);
  const state = {
    bookmarks: [],
    cards: {
      [a]: { box: 2, due: '2026-03-10', seen: 2, correct: 2 }, // due today
      [b]: { box: 1, due: '2026-03-01', seen: 1, correct: 0 }, // overdue
      [c]: { box: 3, due: '2026-03-20', seen: 3, correct: 3 }, // not due
      [d]: { box: 5, due: '2026-04-01', seen: 5, correct: 5 }, // mastered, not due
    },
  };
  const today = '2026-03-10';
  assert.deepEqual(
    buildDeck(items, state, { today }).map((i) => i.q),
    ['b', 'a', 'e']
  );
  assert.deepEqual(
    buildDeck(items, state, { today, limit: 2 }).map((i) => i.q),
    ['b', 'a']
  );
  assert.deepEqual(progressFor(state, items.map((i) => i.id), today), { total: 5, seen: 4, mastered: 1, due: 2, fresh: 1 });
  assert.deepEqual(masteredByTopic({ cards: { ...state.cards, [trapId('842', 'q')]: { box: 4, due: today } } }), { 606: 1, 842: 1 });
});

test('study mode: ids are stable, bookmarks toggle and stored state is sanitized', () => {
  assert.equal(trapId('842', 'Same question'), trapId('842', 'Same question'));
  assert.notEqual(trapId('842', 'Same question'), trapId('842', 'Same question?'));
  assert.notEqual(trapId('842', 'Same question'), trapId('606', 'Same question'));
  assert.match(trapId('842', 'Q'), /^842:[0-9a-z]+$/);

  let s = toggleBookmark(emptyStudy(), 842);
  assert.deepEqual(s.bookmarks, ['842']);
  s = toggleBookmark(toggleBookmark(s, '606'), '842');
  assert.deepEqual(s.bookmarks, ['606']);

  assert.deepEqual(normalizeStudy(null), emptyStudy());
  assert.deepEqual(normalizeStudy('garbage'), emptyStudy());
  assert.deepEqual(normalizeStudy({ cards: 5, bookmarks: [842, '606'] }), { cards: {}, bookmarks: ['842', '606'] });
});
