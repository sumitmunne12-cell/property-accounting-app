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

The nine module files hold about 28 MB of screen detail, too much to parse at launch on a 3 GB phone. The builder therefore also writes two small files:

| File | Content |
| --- | --- |
| `src/data/searchIndex.json` | One compact entry per screen: `{ id, name, nav, moduleId, category, authority }` (about 1.8 MB, 175 KB gzipped). `nav` is the navigation path without the leading "Applications" and the trailing screen name. |
| `src/data/moduleManifest.json` | Module titles, colors, icons, descriptions, GL legend and each submodule's id, title and screen count. The index is written in manifest order, so the counts map every entry to its submodule. |

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
