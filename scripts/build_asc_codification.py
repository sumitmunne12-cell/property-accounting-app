#!/usr/bin/env python3
"""Build the US GAAP Codex data from the FASB ASC markdown library.

Inputs
    asc_codification/markdown/ASC_NNN_*.md   one file per Topic (99 Topics), parsed by asc_parse.py
    asc_codification/README.md               declared subtopic counts (for the coverage report)
    scripts/asc_kb/                          curated first-principles cards (one per Topic)

Outputs (all regenerated; do not hand-edit)
    src/data/asc/ascIndex.json               compact index of every Topic — the only file the app
                                             imports at startup (search, lists, screen links)
    src/data/asc/asc_100s.json … asc_900s.json
                                             master cards per FASB series, loaded on demand
    src/data/asc/text/asc_NNN.json           complete official text per Topic, loaded on demand
    src/data/asc/ascImporters.js             static import() maps so Metro splits every file
    scripts/output/asc_coverage.json         per-Topic processing report

Run: npm run build:asc   (python3 scripts/build_asc_codification.py)
Output is byte-identical on macOS, Linux and Windows (POSIX paths, LF line endings).
The build fails if any Topic is missing a card or a card field, a journal entry does not balance,
or a cited paragraph does not exist in the official text.
"""

import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import asc_parse  # noqa: E402
from asc_kb import CARDS  # noqa: E402

MD_DIR = os.path.join(ROOT, "asc_codification", "markdown")
SUPPLEMENT_DIR = os.path.join(MD_DIR, "supplements")
MISSING_DOC = os.path.join(ROOT, "asc_codification", "MISSING_SUBTOPICS.md")
REVIEW = os.path.join(HERE, "asc_kb", "review.json")
MASTER_GLOSSARY = os.path.join(ROOT, "asc_codification", "glossary", "Master_Glossary.md")
REVIEW_SHEET = os.path.join(ROOT, "scripts", "output", "asc_review_sheet.csv")
REVIEW_STATUSES = ("ai-draft", "self-reviewed", "cpa-reviewed")
README = os.path.join(ROOT, "asc_codification", "README.md")
OUT_DIR = os.path.join(ROOT, "src", "data", "asc")
TEXT_DIR = os.path.join(OUT_DIR, "text")
REPORT = os.path.join(ROOT, "scripts", "output", "asc_coverage.json")

SERIES = {
    "100": ("General Principles", "#94A3B8"),
    "200": ("Presentation", "#60A5FA"),
    "300": ("Assets", "#34D399"),
    "400": ("Liabilities", "#F59E0B"),
    "500": ("Equity", "#A78BFA"),
    "600": ("Revenue", "#2DD4BF"),
    "700": ("Expenses", "#FB7185"),
    "800": ("Broad Transactions", "#38BDF8"),
    "900": ("Industry", "#FBBF24"),
}

OPTIONAL = ("re", "lens", "legacy")
REQUIRED = ("tag", "alias", "truth", "analogy", "recog", "meas", "je", "traps", "cites")
RE_TIERS = (None, "core", "support")
EXCERPT = 420

# Paragraph references in card prose ("842-30-25-12", "970-340") must resolve to the official text,
# or to a subtopic the export is known to lack (MISSING_SUBTOPICS.md), or to one of these
# superseded subtopics that a card mentions historically.
SUPERSEDED_REFS = {"976-605"}
PROSE_REF = re.compile(r"\b(\d{3})-(\d{2,3})(?:-(S?\d{2})(?:-(\d+[A-Z]{0,2}))?)?\b")


def fail(msg):
    raise SystemExit(f"build_asc_codification: {msg}")


def declared_subtopics():
    try:
        with open(README, encoding="utf-8") as fh:
            text = fh.read()
    except FileNotFoundError:
        return {}
    return {m.group(1): int(m.group(2)) for m in re.finditer(r"^\| \*\*(\d{3})\*\* \| .*? \| (\d+) \|", text, re.M)}


# ── Subtopics the export is missing ─────────────────────────────────────────────────────────
# Each Topic's Overview paragraph ("… includes the following Subtopics: (a) Overall (b) …") names
# every subtopic FASB files under it. Industry and cross-reference subtopics carry the number of
# the general Topic they relate to (Real Estate—General › Property, Plant, and Equipment = 970-360).
SUBTOPIC_ALIASES = {
    "investments debt and equity securities": "320",
    "investments all other": "325",
    "consolidations": "810",
    "intangibles takeoff and landing slots": "350",
    "revenue recognition cooperatives": "605",
    "revenue recognition provision for losses": "605",
    "business combinations mergers and acquisitions": "805",
    "fair value measurements": "820",
}
LIST_ITEM = re.compile(r"^\t+\(([a-z]{1,3})\)\s*(.+?)\s*$")


def norm_title(s):
    return re.sub(r"[^a-z0-9]+", " ", str(s).lower()).strip()


def listed_subtopics(doc):
    """(paragraph id, [subtopic names]) from the Topic's own Overview list, or (None, [])."""
    for st in doc["subtopics"]:
        if st["code"] != "10":
            continue
        for sec in st["sections"]:
            if sec["code"] != "05":
                continue
            for b in sec["blocks"]:
                if "p" not in b or not b["t"] or not isinstance(b["t"][0], str):
                    continue
                if not re.search(r"(following|several)\s+(?:\w+\s+)?Subtopics?\b", b["t"][0]):
                    continue
                names = []
                for line in b["t"][1:]:
                    m = LIST_ITEM.match(line) if isinstance(line, str) else None
                    if not m or re.match(r"(Sub)?paragraph superseded", m.group(2), re.I):
                        continue
                    name = re.split(r"—Subtopic|\s\(Subtopic|\.\s", m.group(2))[0].strip().rstrip(".")
                    names.append(name)
                if names and names[0].lower().startswith("overall"):
                    return b["p"], names
    return None, []


def missing_subtopics(doc, title_to_topic):
    """Subtopics named in the Overview list but absent from the parsed export."""
    pid, names = listed_subtopics(doc)
    have_titles = [norm_title(st["title"]) for st in doc["subtopics"]]
    have_codes = {st["code"] for st in doc["subtopics"]}
    parent = norm_title(doc["title"] or "") + " "

    def present(n):
        # "Financial Instruments—Credit Losses—Measured at Amortized Cost" vs "Measured at Amortized Cost",
        # "Supplier Finance Programs" vs "Liabilities—Supplier Finance Programs",
        # "Employee Stock Purchase Plans" vs "Employee Share Purchase Plans".
        if n.startswith(parent):
            n = n[len(parent):]
        for h in have_titles:
            if h == n or h.endswith(" " + n) or n.endswith(" " + h):
                return True
            a, b = set(h.split()), set(n.split())
            if len(a & b) / len(a | b) >= 0.6:
                return True
        return False

    missing = []
    for name in names:
        n = norm_title(name)
        if present(n):
            continue
        general = SUBTOPIC_ALIASES.get(n) or title_to_topic.get(n) or title_to_topic.get(norm_title(name.split("—")[0]))
        if general and general in have_codes:
            continue
        code = f"{doc['topic']}-{general}" if general and general != doc["topic"] else None
        missing.append({"code": code, "title": name})
    return pid, missing


def load_docs():
    """Parse every Topic file, then merge any re-exported subtopics from markdown/supplements/."""
    docs, sources = {}, {}
    for path in sorted(glob.glob(os.path.join(MD_DIR, "ASC_*.md"))):
        doc = asc_parse.parse_topic(path)
        if doc["supplement"]:
            fail(f"{os.path.basename(path)} is a Subtopic export — move it to markdown/supplements/")
        if doc["topic"] in docs:
            fail(f"duplicate Topic {doc['topic']} ({os.path.basename(path)})")
        docs[doc["topic"]], sources[doc["topic"]] = doc, path
    merged = {}
    for path in sorted(glob.glob(os.path.join(SUPPLEMENT_DIR, "*.md"))):
        sup = asc_parse.parse_topic(path)
        if sup["topic"] not in docs:
            fail(f"supplement {os.path.basename(path)} is for Topic {sup['topic']}, which has no Topic file")
        for code in asc_parse.merge_subtopics(docs[sup["topic"]], sup, path):
            merged.setdefault(sup["topic"], []).append(f"{sup['topic']}-{code}")
    return docs, sources, merged


def card_texts(card):
    yield card["tag"]
    yield card["truth"]
    yield from card["analogy"]
    yield from card["recog"]
    yield from card["meas"]
    for title, scenario, _lines, memo in card["je"]:
        yield from (title, scenario, memo)
    for q, a in card["traps"]:
        yield from (q, a)
    if card.get("lens"):
        yield card["lens"]


def check_prose_refs(topic, card, ctx):
    """Every Codification reference in a card's prose must exist; returns refs outside the export."""
    outside = set()
    for text in card_texts(card):
        for m in PROSE_REF.finditer(text):
            top, sub, sec, num = m.groups()
            if top not in ctx["topics"]:
                continue  # not a Codification number (e.g., "2016-02" in an ASU name)
            code = f"{top}-{sub}"
            if code in ctx["subtopics"]:
                if sec and num and f"{code}-{sec}-{num}" not in ctx["paragraphs"]:
                    fail(f"ASC {topic}: card text cites {code}-{sec}-{num}, which is not in the official text")
            elif code in ctx["missing"] or code in SUPERSEDED_REFS:
                outside.add(m.group(0))
            else:
                fail(f"ASC {topic}: card text cites {m.group(0)}, which is neither in the export nor a known missing subtopic")
    return sorted(outside)


def load_review():
    try:
        with open(REVIEW, encoding="utf-8") as fh:
            review = json.load(fh)
    except FileNotFoundError:
        review = {}
    for topic, r in review.items():
        if r.get("status") not in REVIEW_STATUSES:
            fail(f"review.json: ASC {topic} has status {r.get('status')!r}; use one of {REVIEW_STATUSES}")
    return review


def write_review_sheet(cards):
    """scripts/output/asc_review_sheet.csv — one row per card for a CPA to review and sign off."""
    import csv

    fields = [
        "Topic", "Title", "Real estate", "Review status", "Reviewed by", "Review date", "Review notes",
        "First-principles truth", "Recognition triggers", "Measurement", "Journal entries", "Audit traps",
        "Cited paragraphs", "References outside the source export", "Reviewer comments", "Sign-off (name, date)",
    ]
    os.makedirs(os.path.dirname(REVIEW_SHEET), exist_ok=True)
    with open(REVIEW_SHEET, "w", encoding="utf-8-sig", newline="") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(fields)
        for c in cards:
            m = c["measurement"]
            jes = []
            for je in c["journalEntries"]:
                lines = "; ".join(
                    f"{'DR' if 'debit' in l else 'CR'} {l['account']} {l.get('debit', l.get('credit')):,}" for l in je["lines"]
                )
                jes.append(f"{je['label']}: {lines}")
            w.writerow([
                c["topic"], c["title"], c["re"] or "", c["review"]["status"], c["review"].get("by", ""),
                c["review"].get("date", ""), c["review"].get("notes", ""), c["truth"],
                "\n".join(f"• {r}" for r in c["recognition"]),
                f"Basis: {m['basis']}\nInitial: {m['initial']}\nSubsequent: {m['subsequent']}",
                "\n".join(jes), "\n".join(f"Q: {t['q']}\nA: {t['a']}" for t in c["auditTraps"]),
                ", ".join(p["id"] for p in c["keyParagraphs"]), ", ".join(c["outsideRefs"]), "", "",
            ])


def is_live(text):
    low = text[:80].lower()
    return not (low.startswith("paragraph superseded") or low.startswith("paragraph not used") or low.startswith("[not used]"))


def excerpt(text, n=EXCERPT):
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= n:
        return text
    cut = text[:n].rsplit(" ", 1)[0]
    return cut.rstrip(",;:") + "…"


def validate_card(topic, card):
    for k in REQUIRED:
        if k not in card:
            fail(f"ASC {topic}: card is missing '{k}'")
    unknown = set(card) - set(REQUIRED) - set(OPTIONAL)
    if unknown:
        fail(f"ASC {topic}: unknown card fields {sorted(unknown)}")
    if card.get("re") not in RE_TIERS:
        fail(f"ASC {topic}: re must be one of {RE_TIERS}")
    if not isinstance(card["analogy"], tuple) or len(card["analogy"]) != 2:
        fail(f"ASC {topic}: analogy must be (title, story)")
    if not isinstance(card["meas"], tuple) or len(card["meas"]) != 3:
        fail(f"ASC {topic}: meas must be (basis, initial, subsequent)")
    if len(card["recog"]) < 2:
        fail(f"ASC {topic}: need at least 2 recognition triggers")
    if len(card["traps"]) < 3:
        fail(f"ASC {topic}: need at least 3 audit/interview traps")
    if not card["je"]:
        fail(f"ASC {topic}: need at least one journal entry")
    sentences = len(re.findall(r"[.!?](?:\s|$)", card["truth"]))
    if not 2 <= sentences <= 4:
        fail(f"ASC {topic}: first-principles truth should be 2-3 sentences (found {sentences})")
    if card.get("re") and not card.get("lens"):
        fail(f"ASC {topic}: real-estate cards need a property lens")


def journal_entries(topic, entries):
    out = []
    for i, entry in enumerate(entries):
        if len(entry) != 4:
            fail(f"ASC {topic}: journal entry {i + 1} must be (title, scenario, lines, memo)")
        title, scenario, lines, memo = entry
        dr = cr = 0
        rows = []
        for side, account, amount in lines:
            if side not in ("DR", "CR") or not account or not isinstance(amount, int) or amount <= 0:
                fail(f"ASC {topic}: bad line in '{title}': {(side, account, amount)}")
            if side == "DR":
                dr += amount
                rows.append({"account": account, "debit": amount})
            else:
                cr += amount
                rows.append({"account": account, "credit": amount})
        if dr != cr:
            fail(f"ASC {topic}: journal entry '{title}' does not balance (DR {dr:,} vs CR {cr:,})")
        if not any("debit" in r for r in rows) or not any("credit" in r for r in rows):
            fail(f"ASC {topic}: journal entry '{title}' needs both debits and credits")
        out.append({"label": title, "scenario": scenario, "lines": rows, "memo": memo, "total": dr})
    return out


def build_topic(doc, path, declared, missing, related_missing, ref_ctx, review):
    topic = doc["topic"]
    card = CARDS.get(topic)
    if card is None:
        fail(f"ASC {topic}: no curated card in scripts/asc_kb")
    validate_card(topic, card)
    outside_refs = check_prose_refs(topic, card, ref_ctx)
    review = review or {"status": "ai-draft"}

    para_index = {}  # id -> (subtopic, section, block)
    outline = []
    glossary = []
    live = superseded = 0
    for st in doc["subtopics"]:
        secs = []
        for sec in st["sections"]:
            n = 0
            for b in sec["blocks"]:
                if "p" in b:
                    n += 1
                    para_index.setdefault(b["p"], (st, sec, b))
                    if is_live(asc_parse.block_text(b)):
                        live += 1
                    else:
                        superseded += 1
                elif "g" in b and b["g"] not in glossary:
                    glossary.append(b["g"])
            secs.append({"code": sec["code"], "title": sec["title"], "paragraphs": n})
        outline.append({"code": st["code"], "title": st["title"], "sections": secs})

    key_paragraphs = []
    for pid in card["cites"]:
        hit = para_index.get(pid)
        if not hit:
            fail(f"ASC {topic}: cited paragraph {pid} does not exist in {os.path.basename(path)}")
        st, sec, b = hit
        key_paragraphs.append(
            {
                "id": pid,
                "subtopic": f"{st['code']} {st['title']}",
                "section": sec["title"],
                "excerpt": excerpt(asc_parse.block_text(b)),
            }
        )

    # Codification anchors: the first live paragraph of the recognition and measurement sections.
    anchors = []
    cited = set(card["cites"])
    for want in ("25", "30", "35", "15", "05"):
        for st in doc["subtopics"]:
            for sec in st["sections"]:
                if sec["code"].lstrip("S") != want:
                    continue
                first = next((b for b in sec["blocks"] if "p" in b and is_live(asc_parse.block_text(b))), None)
                if first and first["p"] not in cited and len(anchors) < 6:
                    anchors.append({"id": first["p"], "label": f"{sec['title']} · {st['code']} {st['title']}"})
                    cited.add(first["p"])

    series = topic[0] + "00"
    category, color = SERIES[series]
    words = asc_parse.word_count(doc)
    stats = {
        "subtopics": len(doc["subtopics"]),
        "declaredSubtopics": declared.get(topic, len(doc["subtopics"])),
        "sections": sum(len(s["sections"]) for s in doc["subtopics"]),
        "paragraphs": doc["stats"]["paragraphs"],
        "liveParagraphs": live,
        "supersededParagraphs": superseded,
        "glossaryTerms": len(glossary),
        "tables": doc["stats"]["tables"],
        "pendingContent": doc["stats"]["pendingContent"],
        "words": words,
        "duplicatesCollapsed": doc["stats"]["duplicatesCollapsed"],
    }
    if stats["declaredSubtopics"] < stats["subtopics"]:
        stats["declaredSubtopics"] = stats["subtopics"]

    title = doc["title"]
    basis, initial, subsequent = card["meas"]
    master = {
        "topic": topic,
        "title": title,
        "series": series,
        "category": category,
        "color": color,
        "area": doc["area"],
        "re": card.get("re"),
        "legacy": bool(card.get("legacy")),
        "tag": card["tag"],
        "truth": card["truth"],
        "analogy": {"title": card["analogy"][0], "story": card["analogy"][1]},
        "recognition": card["recog"],
        "measurement": {"basis": basis, "initial": initial, "subsequent": subsequent},
        "journalEntries": journal_entries(topic, card["je"]),
        "auditTraps": [{"q": q, "a": a} for q, a in card["traps"]],
        "propertyLens": card.get("lens"),
        "keyParagraphs": key_paragraphs,
        "anchors": anchors,
        "outline": outline,
        "glossary": glossary,
        "stats": stats,
        "missingSubtopics": missing,
        "relatedMissing": related_missing,
        "outsideRefs": outside_refs,
        "review": review,
        "source": os.path.relpath(path, ROOT).replace(os.sep, "/"),
    }

    index_entry = {
        "topic": topic,
        "title": title,
        "series": series,
        "re": card.get("re"),
        "legacy": bool(card.get("legacy")),
        "tag": card["tag"],
        "aliases": card["alias"],
        "subtopics": [f"{s['code']} {s['title']}" for s in doc["subtopics"]],
        "paragraphs": stats["paragraphs"],
        "traps": len(card["traps"]),
        "words": words,
        "sourceSubtopics": stats["subtopics"],
        "declaredSubtopics": stats["declaredSubtopics"],
        "review": review["status"],
        "missing": [f"{m['code'] or '—'} {m['title']}" for m in missing],
        "relatedMissing": related_missing,
    }

    text = {
        "topic": topic,
        "title": title,
        "area": doc["area"],
        "notes": doc["notes"],
        "subtopics": doc["subtopics"],
    }
    return topic, master, index_entry, text, stats


def dump(path, obj, pretty_list=False):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        if pretty_list:
            fh.write("[\n")
            fh.write(",\n".join(json.dumps(o, ensure_ascii=False, separators=(",", ":")) for o in obj))
            fh.write("\n]\n")
        else:
            json.dump(obj, fh, ensure_ascii=False, separators=(",", ":"))
            fh.write("\n")
    return os.path.getsize(path)


def write_importers(topics, series_keys):
    lines = [
        "// GENERATED by scripts/build_asc_codification.py — do not edit.",
        "// Static import() calls so Metro emits every ASC file as its own lazily loaded chunk",
        "// (nothing here is evaluated until a loader function is called).",
        "",
        "export const SERIES_IMPORTERS = {",
    ]
    for s in series_keys:
        lines.append(f"  '{s}': () => import('./asc_{s}s.json'),")
    lines += ["};", "", "export const GLOSSARY_IMPORTER = () => import('./ascGlossary.json');", "", "export const TEXT_IMPORTERS = {"]
    for t in topics:
        lines.append(f"  '{t}': () => import('./text/asc_{t}.json'),")
    lines += ["};", ""]
    path = os.path.join(OUT_DIR, "ascImporters.js")
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(lines))


# Pre-Codification source tags embedded in the Master Glossary export ("FAS 087, paragraph 23").
LEGACY_SOURCE = re.compile(
    r"\b(?:FAS \d+(?:\(R\))?|SOP \d{2}-\d+|ASU \d{4}-\d+|EITF (?:D-)?\d{2}-\d+[A-Z]?|APB \d+|ARB \d+|"
    r"FIN \d+(?:\(R\))?|FTB \d{2}-\d+|AAG [A-Z]{3}(?:\(\d{4}\))?|QA \d+(?:/\d+)?|SX [\d.-]*\d|DIG [A-Z]\d+|PB \d+|CON \d+|"
    r"FSP [A-Z]+[ -]?[\w-]+|TB \d{2}-\d+), (?:paragraph|footnote|Appendix|Glossary)(?: [A-Za-z0-9.-]+)?"
)


def _definition_text(lines):
    out = []
    for line in lines:
        if isinstance(line, str):
            out.append(line.replace("\t", ""))
        else:
            out.append("\n".join(" · ".join(c for c in row if c) for row in line["tbl"]))
    return "\n".join(out)


def build_glossary(docs):
    """src/data/asc/ascGlossary.json: every term defined in a Topic glossary (current wording, with the
    subtopics that define it) plus Master Glossary terms not defined in any Topic in the export."""
    terms = {}
    for t in sorted(docs):
        for st in docs[t]["subtopics"]:
            code = f"{t}-{st['code']}"
            for sec in st["sections"]:
                for b in sec["blocks"]:
                    if "g" not in b:
                        continue
                    text = _definition_text(b["t"])
                    entry = terms.setdefault(norm_title(b["g"]), {"term": b["g"], "defs": [], "master": None})
                    same = next((d for d in entry["defs"] if d["text"] == text), None)
                    if same is None:
                        entry["defs"].append({"text": text, "topics": [code]})
                    elif code not in same["topics"]:
                        same["topics"].append(code)
    master_only = 0
    try:
        with open(MASTER_GLOSSARY, encoding="utf-8") as fh:
            raw = fh.read()
    except FileNotFoundError:
        raw = ""
    for m in re.finditer(r"^### (.+?)\s*\n(.*?)(?=^#{2,3} |\Z)", raw, re.M | re.S):
        term = asc_parse.clean_inline(m.group(1))
        key = norm_title(term)
        if key in terms:
            continue
        body = asc_parse.clean_inline(" ".join(m.group(2).split()))
        sources = [src.group(0) for src in LEGACY_SOURCE.finditer(body)]
        text = re.sub(r"\s{2,}", " ", LEGACY_SOURCE.sub(" ", body)).strip()
        text = re.sub(r"\s+([.,;:])", r"\1", text)
        if not text:
            continue
        terms[key] = {"term": term, "defs": [], "master": {"text": text, "sources": sources}}
        master_only += 1
    ordered = sorted(terms.values(), key=lambda e: e["term"].casefold())
    size = dump(os.path.join(OUT_DIR, "ascGlossary.json"), {"terms": ordered})
    return len(ordered), master_only, size


def write_missing_doc(docs, missing_by_topic, overview_para):
    """asc_codification/MISSING_SUBTOPICS.md — the re-export checklist, real-estate Topics first."""
    re_first = sorted(docs, key=lambda t: (CARDS[t].get("re") != "core", not CARDS[t].get("re"), t))
    rows = [(t, m) for t in re_first for m in missing_by_topic[t]]
    lines = [
        "# Subtopics missing from the markdown export",
        "",
        "GENERATED by scripts/build_asc_codification.py — do not edit.",
        "",
        "Each Topic's Overview paragraph lists the subtopics FASB files under it. The ones below are named",
        "there but are not in `asc_codification/markdown/`. To add one, export it from the FASB",
        "Codification in the same markdown format (a Subtopic export starts with",
        "`# FASB ASC Subtopic 970-340: Other Assets and Deferred Costs`, or re-export the whole Topic),",
        "save it in `asc_codification/markdown/supplements/` and run `npm run build:asc`. The generator",
        "merges it into its Topic and the app shows it in the Official Codification Text tab.",
        "",
        f"{len(rows)} subtopics across {len({t for t, _ in rows})} Topics. Real-estate Topics are listed first.",
        "",
        "| Subtopic | Title | Topic | Real estate | Listed in |",
        "| --- | --- | --- | --- | --- |",
    ]
    for t, m in rows:
        tier = {"core": "core", "support": "yes"}.get(CARDS[t].get("re"), "")
        lines.append(f"| {m['code'] or '—'} | {m['title']} | {t} {docs[t]['title']} | {tier} | {overview_para[t]} |")
    with open(MISSING_DOC, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(lines) + "\n")


def main():
    docs, sources, merged = load_docs()
    if not docs:
        fail(f"no markdown files in {MD_DIR}")
    declared = declared_subtopics()

    # Map general Topic titles to numbers (current standard wins over a superseded namesake, e.g. 842 over 840).
    title_to_topic = {}
    for t in sorted(docs, key=lambda t: bool(CARDS.get(t, {}).get("legacy")), reverse=True):
        title_to_topic[norm_title(docs[t]["title"])] = t
    missing_by_topic, overview_para, related = {}, {}, {}
    for t, doc in docs.items():
        overview_para[t], missing_by_topic[t] = missing_subtopics(doc, title_to_topic)
        for m in missing_by_topic[t]:
            general = m["code"].split("-")[1] if m["code"] else None
            if general in docs and general != t:
                related.setdefault(general, []).append(m["code"])

    ref_ctx = {"topics": set(docs), "subtopics": set(), "paragraphs": set(), "missing": set()}
    for t, doc in docs.items():
        ref_ctx["missing"].update(m["code"] for m in missing_by_topic[t] if m["code"])
        for st in doc["subtopics"]:
            ref_ctx["subtopics"].add(f"{t}-{st['code']}")
            for sec in st["sections"]:
                ref_ctx["paragraphs"].update(b["p"] for b in sec["blocks"] if "p" in b)
    review = load_review()

    index, by_series, report = [], {}, []
    text_bytes = 0
    seen = set()
    for topic in sorted(docs):
        _, master, entry, text, stats = build_topic(
            docs[topic], sources[topic], declared, missing_by_topic[topic], sorted(related.get(topic, [])), ref_ctx,
            review.get(topic),
        )
        seen.add(topic)
        index.append(entry)
        by_series.setdefault(master["series"], {})[topic] = master
        size = dump(os.path.join(TEXT_DIR, f"asc_{topic}.json"), text)
        text_bytes += size
        report.append(
            {
                "topic": topic,
                "title": master["title"],
                "file": master["source"],
                "textBytes": size,
                **stats,
                "missingSubtopics": [m["code"] or m["title"] for m in missing_by_topic[topic]],
                "overviewParagraph": overview_para[topic],
                "supplementsMerged": merged.get(topic, []),
            }
        )

    missing = sorted(set(CARDS) - seen)
    if missing:
        fail(f"cards without a markdown Topic: {missing}")

    # Remove stale text files from Topics that no longer exist.
    for stale in glob.glob(os.path.join(TEXT_DIR, "asc_*.json")):
        t = re.match(r".*asc_(\d{3})\.json$", stale)
        if t and t.group(1) not in seen:
            os.remove(stale)

    index.sort(key=lambda e: e["topic"])
    series_keys = sorted(by_series)
    series_meta = []
    series_bytes = {}
    for s in series_keys:
        cards = dict(sorted(by_series[s].items()))
        name, color = SERIES[s]
        series_bytes[s] = dump(os.path.join(OUT_DIR, f"asc_{s}s.json"), {"series": s, "category": name, "cards": cards})
        series_meta.append({"series": s, "category": name, "color": color, "count": len(cards), "topics": list(cards)})

    index_bytes = dump(os.path.join(OUT_DIR, "ascIndex.json"), {"series": series_meta, "topics": index})
    write_importers([e["topic"] for e in index], series_keys)

    totals = {
        "topics": len(index),
        "realEstateTopics": sum(1 for e in index if e["re"]),
        "paragraphs": sum(r["paragraphs"] for r in report),
        "liveParagraphs": sum(r["liveParagraphs"] for r in report),
        "duplicatesCollapsed": sum(r["duplicatesCollapsed"] for r in report),
        "journalEntries": sum(len(c["journalEntries"]) for s in by_series.values() for c in s.values()),
        "auditTraps": sum(len(c["auditTraps"]) for s in by_series.values() for c in s.values()),
        "words": sum(r["words"] for r in report),
        "indexBytes": index_bytes,
        "seriesBytes": series_bytes,
        "textBytes": text_bytes,
        "topicsWithPartialSourceSubtopics": [r["topic"] for r in report if r["declaredSubtopics"] > r["subtopics"]],
        "missingSubtopics": sum(len(v) for v in missing_by_topic.values()),
        "supplementsMerged": sorted(c for v in merged.values() for c in v),
        "review": {st: sum(1 for c in (c for s in by_series.values() for c in s.values()) if c["review"]["status"] == st) for st in REVIEW_STATUSES},
    }
    os.makedirs(os.path.dirname(REPORT), exist_ok=True)
    with open(REPORT, "w", encoding="utf-8", newline="\n") as fh:
        json.dump({"totals": totals, "topics": report}, fh, ensure_ascii=False, indent=1)
        fh.write("\n")

    write_missing_doc(docs, missing_by_topic, overview_para)
    glossary_terms, master_only, glossary_bytes = build_glossary(docs)
    write_review_sheet([c for s in series_keys for c in dict(sorted(by_series[s].items())).values()])

    print(f"ASC Codex: {totals['topics']} Topics, {totals['paragraphs']:,} paragraphs "
          f"({totals['duplicatesCollapsed']:,} export duplicates collapsed), {totals['journalEntries']} journal entries, "
          f"{totals['auditTraps']} audit traps, {totals['realEstateTopics']} real-estate Topics")
    print(f"  index {index_bytes / 1024:.1f} KB · series cards {sum(series_bytes.values()) / 1024:.0f} KB · "
          f"official text {text_bytes / 1e6:.1f} MB in {len(index)} files")
    print(f"  {totals['missingSubtopics']} listed subtopics are not in the export (see asc_codification/MISSING_SUBTOPICS.md)"
          + (f"; merged supplements: {', '.join(totals['supplementsMerged'])}" if totals["supplementsMerged"] else ""))
    print(f"  glossary: {glossary_terms:,} terms ({master_only} from the Master Glossary only), {glossary_bytes / 1024:.0f} KB")
    print("  review: " + ", ".join(f"{n} {st}" for st, n in totals["review"].items()) + " (scripts/output/asc_review_sheet.csv)")


if __name__ == "__main__":
    main()
