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


def fail(msg):
    raise SystemExit(f"build_asc_codification: {msg}")


def declared_subtopics():
    try:
        with open(README, encoding="utf-8") as fh:
            text = fh.read()
    except FileNotFoundError:
        return {}
    return {m.group(1): int(m.group(2)) for m in re.finditer(r"^\| \*\*(\d{3})\*\* \| .*? \| (\d+) \|", text, re.M)}


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


def build_topic(path, declared):
    doc = asc_parse.parse_topic(path)
    topic = doc["topic"]
    card = CARDS.get(topic)
    if card is None:
        fail(f"ASC {topic}: no curated card in scripts/asc_kb")
    validate_card(topic, card)

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
        "source": os.path.relpath(path, ROOT),
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
        "words": words,
        "sourceSubtopics": stats["subtopics"],
        "declaredSubtopics": stats["declaredSubtopics"],
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
    with open(path, "w", encoding="utf-8") as fh:
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
    lines += ["};", "", "export const TEXT_IMPORTERS = {"]
    for t in topics:
        lines.append(f"  '{t}': () => import('./text/asc_{t}.json'),")
    lines += ["};", ""]
    path = os.path.join(OUT_DIR, "ascImporters.js")
    with open(path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))


def main():
    files = sorted(glob.glob(os.path.join(MD_DIR, "ASC_*.md")))
    if not files:
        fail(f"no markdown files in {MD_DIR}")
    declared = declared_subtopics()

    index, by_series, report = [], {}, []
    text_bytes = 0
    seen = set()
    for path in files:
        topic, master, entry, text, stats = build_topic(path, declared)
        if topic in seen:
            fail(f"duplicate Topic {topic}")
        seen.add(topic)
        index.append(entry)
        by_series.setdefault(master["series"], {})[topic] = master
        size = dump(os.path.join(TEXT_DIR, f"asc_{topic}.json"), text)
        text_bytes += size
        report.append({"topic": topic, "title": master["title"], "file": master["source"], "textBytes": size, **stats})

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
    }
    os.makedirs(os.path.dirname(REPORT), exist_ok=True)
    with open(REPORT, "w", encoding="utf-8") as fh:
        json.dump({"totals": totals, "topics": report}, fh, ensure_ascii=False, indent=1)
        fh.write("\n")

    print(f"ASC Codex: {totals['topics']} Topics, {totals['paragraphs']:,} paragraphs "
          f"({totals['duplicatesCollapsed']:,} export duplicates collapsed), {totals['journalEntries']} journal entries, "
          f"{totals['auditTraps']} audit traps, {totals['realEstateTopics']} real-estate Topics")
    print(f"  index {index_bytes / 1024:.1f} KB · series cards {sum(series_bytes.values()) / 1024:.0f} KB · "
          f"official text {text_bytes / 1e6:.1f} MB in {len(index)} files")


if __name__ == "__main__":
    main()
