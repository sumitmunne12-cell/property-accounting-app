# RealPage module data pipeline

`src/data/modules/0N_*.js` are generated from the RealPage manuals in
`manuals_markdown/` — do not hand-edit them. Change the inputs below and
re-run the builder.

```bash
python3 scripts/build_realpage_modules.py   # regenerate all 9 module files + coverage report
node scripts/validate_modules.mjs           # ES-module syntax, schema, 10 fields per screen, unique ids, no placeholders
python3 scripts/audit_quality.py            # optional: how much content is manual-derived vs. fallback
```

## Inputs

| File | Role |
| --- | --- |
| `manuals_markdown/0N_*.md` | Source manuals; every bookmark heading is one checklist item (`0N_*_checklist.json`). |
| `scripts/rp_parse.py` | Splits each manual into topics. It re-segments bodies on the in-text title, because the converter puts every bookmark heading at the top of its page. It then extracts navigation callouts, numbered/lettered procedures, field/button tables and prose. |
| `scripts/rp_kb.py` | Multifamily accounting knowledge base. Each topic (A/P invoice, payment, bank rec, accrual, draw, depreciation…) has a DR/CR pattern, a Yardi Voyager equivalent, reasons records appear, the downstream workflow and a control check. Screen actions are classified as create, post, reverse, report, setup and so on. |
| `scripts/curated_screens.json` | Hand-authored mastery workflows. Each module's first "Mastery Playbook" submodule comes from here. |

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
| `pdfManualSource` | Manual file name and page range. Identical topics in other manuals of the same module are listed as "also documented in". |

## Coverage accounting

`scripts/output/coverage_report.json` records the outcome of every checklist item:

- `screen`: the item became its own screen.
- `merged`: *Fields*, *Buttons*, *Before You Begin*, *How to Get Here* and *What's Next?* pages are folded into their parent screen.
- `duplicate`: the same topic text appears in several manuals of one module. It is kept once, with every source cited.
- `glossary-definition`: an entry under a *Glossary of Terms* chapter.
- `container` / `layout-container`: a heading with no text of its own, whose children are screens. This includes the Quick Steps "QS Header".

`scripts/output/coverage_summary.json` holds the per-module totals.
