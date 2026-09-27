# RealPage module data pipeline

`src/data/modules/0N_*.js` are generated from the RealPage manuals in
`manuals_markdown/` — do not hand-edit them. Change the inputs below and
re-run the builder.

```bash
npm run build:modules   # regenerate the 9 module files, the search index + manifest, the RealPage glossary block and the coverage report
npm run check           # ESLint + module/cross-link validation + unit tests
python3 scripts/audit_quality.py   # optional: how much content is manual-derived vs. fallback
```

`npm run check` runs:

- `npm run lint`: ESLint (React, hooks and Node rules) over the app and the tooling.
- `npm run validate`: `validate_modules.mjs` checks ES-module syntax, schema, the 10 fields per screen, unique ids and placeholder text. `validate_app_data.mjs` checks that every `screenId` used by the Close Cockpit, exception playbooks, Rosetta Stone and glossary exists, that module references are valid, that adjusting entries balance and that every diagnostic-wizard path ends in a verdict.
- `npm test`: `scripts/test/app.test.mjs` runs Node unit tests for fuzzy search, lazy module loading, index/module consistency, close sequencing, playbooks and the glossary.

## Inputs

| File | Role |
| --- | --- |
| `manuals_markdown/0N_*.md` | Source manuals; every bookmark heading is one checklist item (`0N_*_checklist.json`). |
| `scripts/rp_parse.py` | Splits each manual into topics. It re-segments bodies on the in-text title, because the converter puts every bookmark heading at the top of its page. It then extracts navigation callouts, numbered/lettered procedures, field/button tables and prose. |
| `scripts/rp_kb.py` | Multifamily accounting knowledge base. Each topic (A/P invoice, payment, bank rec, accrual, draw, depreciation…) has a DR/CR pattern, a Yardi Voyager equivalent, reasons records appear, the downstream workflow and a control check. Screen actions are classified as create, post, reverse, report, setup and so on. |
| `scripts/curated_screens.json` | Hand-authored mastery workflows. Each module's first "Mastery Playbook" submodule comes from here, including the 4 budgeting showcase screens. |
| `scripts/rp_guardrails.py` | US legal, tax and accounting rules (GAAP ASC, IRC/Treasury regs, SOX 404/COSO, UCC, NACHA/FinCEN/OFAC, state landlord-tenant, lien and unclaimed-property law, HUD/agency lender rules) for each knowledge-base topic. It fills every screen's `regulatoryGuardrail` and generates `src/data/taskGuardrails.js` for the Daily Hub tasks. |
| `scripts/rp_compass.py` | Deduction Compass. It normalizes every `navigation[]` into application › tab › section › list (label variants folded, manual-chapter paths flagged), holds the filing rules as data (business objects and their lists, stage verbs, record states, tie-breakers T1–T9, exceptions E01–E34), tags every screen, and scores the rules against the real paths. `python3 scripts/rp_compass.py [--misses]` prints the scores. See `docs/DEDUCTION_COMPASS.md`. |
| `scripts/rp_glossary.py` | Extracts every "Glossary of Terms" entry from the manuals, dedupes terms repeated across manuals, and cross-references each term to modules and related screens. The result is written into the generated block of `src/data/glossaryData.js`. |

## How each screen field is filled

| Field | Source |
| --- | --- |
| `navigation` | The manual's *Navigation Path* for the topic, or a *How to Get Here* child. Otherwise the nearest ancestor's path plus the topic title. |
| `purpose` | The manual's introduction or capability list for the topic, plus one line of multifamily context. |
| `whyRecordsAreHere` | *Before You Begin* prerequisites, a reason based on the action, knowledge-base reasons, and a manual "use this to…" sentence. |
| `keyFieldsAndFilters` | The *Fields* / *Buttons* child tables, label/description tables on the page, and "In the X field…" / "Click the X button…" steps. |
| `accountantActionSOP` | The manual's numbered, lettered or imperative steps, plus a control check. Reference pages with no procedure get action-specific steps that use the page's own fields and child tasks. |
| `glAccountingImpact` | The knowledge-base posting pattern phrased for the action (posting, draft, reversal, report, setup, master data), plus a quote from the manual when it states the entry. |
| `whatHappensNext` | The *What's Next?* child, "The system …" sentences from the manual, and the knowledge-base downstream workflow. |
| `yardiEquivalent` | The Yardi Voyager screen or workflow from the knowledge base, with the reporting equivalent added for report screens. |
| `regulatoryGuardrail` | The governing authority, regulation code, plain-English rule and audit risk for the screen's topic (`rp_guardrails.py`). Screens that edit, reverse or delete posted records also get the record-retention rule. |
| `pdfManualSource` | Manual file name and page range. Identical topics in other manuals of the same module are listed as "also documented in". |

## How the app loads the catalog

The nine module files hold about 28 MB of screen detail, too much to parse at launch on a 3 GB phone. The builder therefore also writes small boot-time files:

| File | Content |
| --- | --- |
| `src/data/searchIndex.json` | One compact entry per screen: `{ id, name, nav, moduleId, category, authority }` (about 1.8 MB, 175 KB gzipped). `nav` is the navigation path without the leading "Applications" and the trailing screen name. |
| `src/data/moduleManifest.json` | Module titles, colors, icons, descriptions, GL legend and each submodule's id, title and screen count. The index is written in manifest order, so the counts map every entry to its submodule. |
| `src/data/compassIndex.json` | Deduction Compass tags per screen (app, tab, section, list, stage, object, fit, exception), as positional rows parallel to `searchIndex.json`, plus the measured rule accuracy. |
| `src/data/compassRules.json` | The compass rules exported from `scripts/rp_compass.py` for the in-app matcher (`src/utils/compassEngine.js`). |

Every screen in the module files also carries the same tags as a `compass` block. `scripts/output/compass_report.json` holds per-rule support and precision, miss clusters and exception counts. `scripts/output/compass_parity.json` holds Python predictions; `scripts/test/compass.test.mjs` requires the JS matcher to reproduce them exactly.

`src/utils/screenIndex.js` builds the fuzzy search, the Explorer lists and every cross-link check from these two files. `src/data/moduleLoader.js` imports a module file with `import()` only when a screen in it is opened (`useScreenDetail` / `LazyScreenDetail`). On web, Metro emits each module as its own chunk. On iOS and Android (Hermes), the module stays in the bundle but its factory does not run, so its objects are not allocated, until it is loaded.

Never import the module files statically from app code: that pulls all 28 MB back into the startup path. The unit tests fail if any module is loaded at import time or if the index drifts from the module files.

## Coverage accounting

`scripts/output/coverage_report.json` records the outcome of every checklist item:

- `screen`: the item became its own screen.
- `merged`: *Fields*, *Buttons*, *Before You Begin*, *How to Get Here* and *What's Next?* pages are folded into their parent screen.
- `duplicate`: the same topic text appears in several manuals of one module. It is kept once, with every source cited.
- `glossary-definition`: an entry under a *Glossary of Terms* chapter.
- `container` / `layout-container`: a heading with no text of its own, whose children are screens. This includes the Quick Steps "QS Header".

`scripts/output/coverage_summary.json` holds the per-module totals.

## Hand-written app data (validated against the generated catalog)

| File | Content |
| --- | --- |
| `src/data/glossaryData.js` | Curated US multifamily acronyms (edit freely), followed by the generated RealPage glossary block. |
| `src/data/rosettaStoneData.js` | 50 RealPage ↔ Yardi Voyager operations. The RealPage side links to a catalog screen. |
| `src/data/closePlaybookData.js` | The 7-phase month-end close. Every task links to a catalog screen. |
| `src/data/exceptionsPlaybookData.js` | 15 exception triage playbooks, each with a diagnostic wizard and balanced adjusting entries. |

Screen ids are derived from manual topic titles, so they only change when the manuals or the builder change. Run `npm run validate` after a rebuild; it names any link that broke.

# US GAAP Codex data pipeline (FASB ASC)

`src/data/asc/` is generated from the FASB Accounting Standards Codification markdown library in
`asc_codification/markdown/` (99 Topics) — do not hand-edit it. Change the inputs below and re-run:

```bash
npm run build:asc   # python3 scripts/build_asc_codification.py
npm test            # includes scripts/test/asc.test.mjs
npm run test:py     # parser tests (scripts/test/test_asc_parse.py)
```

The generator writes POSIX paths and LF line endings, so a build on Windows produces the same
files as one on macOS or Linux.

## Inputs

| File | Role |
| --- | --- |
| `asc_codification/markdown/ASC_NNN_*.md` | One file per Topic. `scripts/asc_parse.py` splits it into subtopics → sections (00 Status, 05 Overview, 15 Scope, 20 Glossary, 25 Recognition, 30/35 Measurement, …, S99 SEC Materials) → headings, numbered paragraphs, glossary terms and tables. It strips link markup and glossary tooltips, collapses the export's back-to-back duplicate of every paragraph (18,072 of them; when the two copies differ the longer pending-content copy is kept), and joins inline cross-references ("see paragraphs 842-10-35-4 through 35-5") back into their sentences. No codification wording is dropped. |
| `scripts/asc_kb/` | Curated first-principles card for every Topic: economic truth, everyday analogy, recognition triggers, measurement basis, balanced journal entries, audit & interview traps, the property-accounting lens and cited key paragraphs. |
| `asc_codification/markdown/supplements/*.md` | Optional FASB exports of subtopics the main library lacks (a Subtopic export starting `# FASB ASC Subtopic 970-340: …`, or a whole-Topic re-export). Each is merged into its Topic; a subtopic already present is replaced only when the supplement has more paragraphs. |
| `asc_codification/glossary/Master_Glossary.md` | FASB Master Glossary. Terms no Topic in the export defines are added to the app glossary; legacy source tags (FAS, EITF, SOP, QA, SX …) are listed apart from the definition. |
| `scripts/asc_kb/review.json` | Who has checked each card: `{"842": {"status": "cpa-reviewed", "by": "Jane Doe, CPA", "date": "2026-10-01", "notes": "…"}}`. Status is `ai-draft`, `self-reviewed` or `cpa-reviewed`; the card footer in the app shows it. |
| `asc_codification/README.md` | Declared subtopic counts, used only for the coverage note. |

The build fails if a Topic has no card or a card field is missing, a journal entry does not balance,
the economic truth is not 2–3 sentences, a real-estate card has no property lens, a cited
paragraph does not exist in the parsed official text, or a Codification number written anywhere in
a card's prose (triggers, measurement, entries, traps, lens) is neither in the official text nor a
known missing subtopic. References to missing subtopics are listed on the card as "outside the
export".

### Missing subtopics

Each Topic's Overview paragraph lists the subtopics FASB files under it (e.g., 970-10-05-2). The
generator compares that list with what the export contains and writes
`asc_codification/MISSING_SUBTOPICS.md` — every subtopic the export lacks (225 across 33 Topics,
real-estate ones first: 970-340, 970-360, 970-835, 974-842, 805-740, …). The Official Text tab
shows the same list. To fill a gap, export the subtopic from the FASB Codification, save it in
`asc_codification/markdown/supplements/` and rebuild.

### Card review (CPA sign-off)

`scripts/output/asc_review_sheet.csv` (UTF-8, opens in Excel) has one row per card — truth,
triggers, measurement, journal entries, traps, cited paragraphs — plus empty "Reviewer comments"
and "Sign-off" columns. After a CPA signs a card off, set its entry in `scripts/asc_kb/review.json`
to `cpa-reviewed` with their name and date and rebuild; until then the app labels the card as an
AI-drafted educational synthesis.

## Outputs and how the app loads them

| File | Content | Loaded |
| --- | --- | --- |
| `src/data/asc/ascIndex.json` | Series table plus one compact entry per Topic (number, title, series, real-estate tier, legacy flag, tagline, aliases, subtopic titles, paragraph/word counts) — about 50 KB. | At startup (search, lists, screen links) |
| `src/data/asc/asc_100s.json` … `asc_900s.json` | Master cards per FASB series (9 files, 620 KB in total). | `import()` the first time a card in that series is opened |
| `src/data/asc/text/asc_NNN.json` | Complete official text per Topic (99 files, 13.3 MB; the largest, 815, is 1.7 MB). | `import()` only when the card's Official Text tab is opened |
| `src/data/asc/ascGlossary.json` | FASB glossary: 1,331 terms — each Topic's current definitions (with the subtopics that define them) plus 193 Master Glossary terms no Topic defines (580 KB). | `import()` on the first glossary search, or when the Official Text tab needs a definition |
| `asc_codification/MISSING_SUBTOPICS.md`, `scripts/output/asc_review_sheet.csv` | See above. | — |
| `src/data/asc/ascImporters.js` | Static `import()` maps so Metro emits every file above as its own chunk. | — |
| `scripts/output/asc_coverage.json` | Per-Topic report: subtopics (source vs. declared), paragraphs (live vs. superseded), glossary terms, tables, pending-content paragraphs, words, text size. | — |

`src/data/asc/ascLoader.js` caches each file and shares concurrent loads; `src/utils/ascIndex.js`
builds the fuzzy search (Topic number, title, alias such as "VIE", "ROU" or "stock comp", typo
tolerance, Codification references such as `842-20-25-1`) and the Real Estate / All US GAAP filters;
`src/utils/ascLinks.js` links catalog screens to Topics (Track A): guardrail citations first, then
real-estate rules for 842, 970, 606, 360 and 450. The unit tests fail if any ASC file is loaded at
import time, a Topic is missing, a journal entry does not balance, a cited paragraph is missing from
the official text, or a core property standard links to fewer than 40 screens.

Other places the Codex surfaces in the app:

- **Close Cockpit and exception playbooks** — `src/data/gaapLinksData.js` maps every close task
  and triage playbook to the Topics that govern it (the tests check every id and Topic).
- **Triage & Search** — Topic and paragraph results (`842`, `lease`, `842-20-25-2`) and FASB
  glossary terms, alongside manuals, exceptions and tasks.
- **Official Text tab** — defined terms are underlined; tapping one opens its definition.
- **Study mode** — every audit & interview trap is a flashcard. `src/utils/studyEngine.js` is a
  Leitner scheduler (reviews after 1, 3, 7, 14 and 30 days; box 4+ counts as mastered); progress
  and ☆ saved Topics are stored on the device (`@rp_asc_study_v1` in AsyncStorage). A card's id is
  a hash of its question, so rewording an answer keeps progress but rewording the question
  starts it fresh.
