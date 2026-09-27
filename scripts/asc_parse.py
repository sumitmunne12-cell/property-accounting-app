"""Parser for the FASB ASC markdown library in asc_codification/markdown/.

Each file is one Topic exported from the FASB Codification website. The export has three
artifacts this parser removes without dropping any codification text:

* Every paragraph is emitted twice in a row (paragraph number + body, then again). Identical
  copies are collapsed; when the copies differ (pending-content paragraphs), the longer copy is
  kept, and both are kept if neither contains the other.
* Glossary links carry the full definition as a tooltip: `[term](/url "definition")`. The link
  markup and tooltip are stripped to the link text (the definitions live in the Glossary
  sections and in the Master Glossary).
* Inline cross-references ("see paragraphs 842-10-35-4 through 35-5 for ...") are split onto
  their own lines. They are joined back into the sentence.

Structure produced for one Topic:

    {topic, title, area, notes: {sectionCode: generalNote},
     subtopics: [{code, title, sections: [{code, title, blocks: [...]}]}]}

Blocks (compact, rendered by the app's official-text reader):

    {"h": text, "l": level}          heading (2 = subsection, 3.. = nested "> " headings)
    {"p": "842-20-25-1", "t": [...]} codification paragraph
    {"g": term, "t": [...]}          glossary term and definition
    {"t": [...]}                     text outside a numbered paragraph

`t` holds lines. A line is a string (list items are prefixed with one tab per nesting level,
e.g. "\\t(a) ...") or {"tbl": [[cell, ...], ...]} for a table.
"""

import re

PARA_ID = re.compile(r"^\s*(\d{3}-\d{2,3}-S?\d{2}-\d+[A-Z]{0,2})\s*$")
SECTION = re.compile(r"^#\s+(S?\d{2})\s+(.+?)\s*$")
HEADING = re.compile(r"^(#{2,6})\s+(.+?)\s*$")
LIST_MARK = re.compile(r"^(\s*)\d+\.\s+(\S+)\s*$")
BULLET = re.compile(r"^(\s*)\*(?:\s+(.*))?$")
SUBTOPIC = re.compile(r"^(\d{2,3})\s+(.+?)\s*$")
LINK = re.compile(r'\[([^\]]*)\]\((?:[^()\s"]|\([^()\s]*\))*(?:\s+"(?:[^"\\]|\\.)*")?\)')
REF_ONLY = re.compile(
    r"^(?:paragraphs?\s+|sections?\s+|subtopic\s+|topic\s+)?"
    r"\d{3}(?:-\d{2,3}(?:-S?\d{2}(?:-\d+[A-Z]{0,2})?)?)?(?:\([a-z0-9]+\))*"
    r"(?:\s*(?:through|and|or|,)\s*[\dA-Za-z\-()]+)*[.,;:]?$",
    re.I,
)

# Section codes → canonical FASB section names (used when a file spells one differently).
SECTION_NAMES = {
    "00": "Status",
    "05": "Overview and Background",
    "10": "Objectives",
    "15": "Scope and Scope Exceptions",
    "20": "Glossary",
    "25": "Recognition",
    "30": "Initial Measurement",
    "32": "Measurement",
    "35": "Subsequent Measurement",
    "40": "Derecognition",
    "45": "Other Presentation Matters",
    "50": "Disclosure",
    "55": "Implementation Guidance and Illustrations",
    "60": "Relationships",
    "65": "Transition and Open Effective Date Information",
    "70": "Grandfathered Guidance",
    "75": "XBRL Elements",
    "99": "SEC Materials",
}


def clean_inline(s):
    """Strip link markup/tooltips, bold/italic markers and markdown escapes from one line."""
    s = LINK.sub(lambda m: m.group(1), s)
    s = s.replace("**", "")
    s = re.sub(r"(^|[\s(])_(\S.*?\S|\S)_(?=$|[\s).,;:])", r"\1\2", s)
    s = re.sub(r"\\([\\`*_{}\[\]()#+\-.!|>])", r"\1", s)
    s = s.replace(" ", " ")
    s = re.sub(r"[ \t]+", " ", s)
    return s.strip()


def _chunks(lines):
    """Group raw lines into blank-line separated chunks (tables stay one chunk)."""
    out, cur = [], []
    for raw in lines:
        if raw.strip() == "":
            if cur:
                out.append(cur)
                cur = []
        else:
            cur.append(raw.rstrip("\n"))
    if cur:
        out.append(cur)
    return out


def _is_table(chunk):
    return len(chunk) >= 2 and any(re.match(r"^\s*-{3,}\|", l) for l in chunk[:3])


def _parse_table(chunk):
    rows = []
    for l in chunk:
        if re.match(r"^\s*-{3,}(\|-{3,})*\|?\s*$", l):
            continue
        cells = [clean_inline(c) for c in l.rstrip().rstrip("|").split("|")]
        if any(cells):
            rows.append(cells)
    return {"tbl": rows}


class _Para:
    """Accumulates the lines of one block while tracking list labels and inline joins."""

    def __init__(self, kind, key=None, level=0):
        self.kind = kind  # 'p' paragraph, 'g' glossary term, 't' loose text
        self.key = key
        self.level = level
        self.lines = []
        self.label = None  # pending "(a)" list label
        self.label_level = 0
        self.join_next = False

    def _append_inline(self, text, glue=" "):
        if self.lines and isinstance(self.lines[-1], str):
            prev = self.lines[-1]
            if re.match(r"^[.,;:)\]]", text) or prev.endswith(("(", "[", "\t")):
                glue = ""
            self.lines[-1] = prev + glue + text
        else:
            self.lines.append(text)

    def add_chunk(self, chunk):
        first = chunk[0]
        if _is_table(chunk):
            self.lines.append(_parse_table(chunk))
            self.join_next = False
            return
        m = LIST_MARK.match(first) if len(chunk) == 1 else None
        if m:
            self.label = m.group(2)
            self.label_level = 1 + max(0, len(m.group(1)) - 2) // 3
            self.join_next = False
            return
        m = BULLET.match(first)
        if m and first.strip() != "* * *":
            body = clean_inline(" ".join([m.group(2) or ""] + chunk[1:]))
            if body:
                lvl = 1 + max(0, len(m.group(1)) - 2) // 3
                self.lines.append("\t" * lvl + "• " + body)
            self.join_next = False
            return
        raw = " ".join(l.strip() for l in chunk)
        text = clean_inline(raw)
        if not text:
            return
        is_ref = bool(REF_ONLY.match(text)) or bool(re.fullmatch(r"\s*\[[^\]]*\]\([^)]*\)\s*", raw))
        if self.label is not None:
            self.lines.append("\t" * self.label_level + f"({self.label}) " + text)
            self.label = None
            self.join_next = is_ref
            return
        if is_ref and self.lines and isinstance(self.lines[-1], str):
            self._append_inline(text)
            self.join_next = True
            return
        if self.join_next and self.lines and isinstance(self.lines[-1], str) and re.match(r"^[.,;:)\]a-z]", text):
            self._append_inline(text)
            self.join_next = False
            return
        if self.lines and isinstance(self.lines[-1], str) and re.match(r"^[.,;:)\]]", text):
            self._append_inline(text, "")
            self.join_next = False
            return
        self.lines.append(text)
        self.join_next = is_ref

    def block(self):
        lines = _dedupe_consecutive(self.lines) if self.kind != "p" else self.lines
        if self.kind == "p":
            return {"p": self.key, "t": lines}
        if self.kind == "g":
            return {"g": self.key, "t": lines}
        return {"t": lines}


def _dedupe_consecutive(lines):
    out = []
    for l in lines:
        if out and out[-1] == l:
            continue
        out.append(l)
    # Glossary definitions are exported twice in a row, sometimes as a multi-line run.
    n = len(out)
    if n % 2 == 0 and n >= 2 and out[: n // 2] == out[n // 2 :]:
        out = out[: n // 2]
    return out


def _flat(lines):
    return " ".join(l if isinstance(l, str) else " ".join(" ".join(r) for r in l["tbl"]) for l in lines)


def _merge_duplicate(blocks, new):
    """Collapse the export's back-to-back duplicate of a paragraph."""
    if blocks and "p" in new and blocks[-1].get("p") == new["p"]:
        prev = blocks[-1]
        if prev["t"] == new["t"]:
            return True
        a, b = _flat(prev["t"]), _flat(new["t"])
        if b in a:
            return True
        if a in b:
            blocks[-1] = new
            return True
    return False


def parse_topic(path):
    with open(path, encoding="utf-8") as fh:
        raw_lines = fh.read().split("\n")

    head = re.match(r"^#\s+FASB ASC Topic (\d{3}):\s*(?:\d{3}\s+)?(.+?)\s*$", raw_lines[0])
    if not head:
        raise ValueError(f"{path}: missing '# FASB ASC Topic NNN:' header")
    topic, title = head.group(1), head.group(2)
    chunks = _chunks(raw_lines[1:])

    area = clean_inline(" ".join(chunks[0])) if chunks else ""
    result = {"topic": topic, "title": title, "area": area, "notes": {}, "subtopics": []}

    subtopic = None
    section = None
    para = None
    pending_note = False
    stats = {"paragraphs": 0, "glossaryTerms": 0, "tables": 0, "duplicatesCollapsed": 0, "pendingContent": 0}

    def flush():
        nonlocal para
        if para is None:
            return
        if para.lines:
            blk = para.block()
            if section is None:
                raise ValueError(f"{path}: content before the first section: {str(blk)[:120]}")
            if _merge_duplicate(section["blocks"], blk):
                stats["duplicatesCollapsed"] += 1
            else:
                section["blocks"].append(blk)
        para = None

    i = 1  # chunks[0] is the area line
    while i < len(chunks):
        chunk = chunks[i]
        first = chunk[0]
        joined = " ".join(l.strip() for l in chunk)

        # Subtopic banner: "842 Leases" / "20 Lessee" / "* * *"
        if (
            len(chunk) == 1
            and first.strip().startswith(f"{topic} ")
            and i + 2 < len(chunks)
            and SUBTOPIC.match(chunks[i + 1][0].strip())
            and len(chunks[i + 1]) == 1
            and chunks[i + 2][0].strip() == "* * *"
        ):
            flush()
            m = SUBTOPIC.match(chunks[i + 1][0].strip())
            subtopic = {"code": m.group(1), "title": clean_inline(m.group(2)), "sections": []}
            result["subtopics"].append(subtopic)
            section = None
            i += 3
            continue

        if joined == "* * *":
            flush()
            i += 1
            continue

        m = SECTION.match(first)
        if m and len(chunk) == 1:
            flush()
            if subtopic is None:
                raise ValueError(f"{path}: section before subtopic banner")
            code = m.group(1)
            name = clean_inline(m.group(2))
            section = {"code": code, "title": name, "blocks": []}
            subtopic["sections"].append(section)
            pending_note = False
            i += 1
            continue

        if joined == "General Note:":
            flush()
            pending_note = True
            i += 1
            continue
        if pending_note:
            note = clean_inline(joined)
            key = section["code"] if section else "_"
            prev = result["notes"].get(key)
            if prev is None:
                result["notes"][key] = note
            elif prev != note:
                section["note"] = note
            pending_note = False
            i += 1
            continue

        m = HEADING.match(first)
        if m and len(chunk) == 1:
            flush()
            level = len(m.group(1))
            text = clean_inline(re.sub(r"^(?:[·•]\s*)*>\s*", "", m.group(2)))
            in_glossary = section is not None and section["code"].lstrip("S") == "20"
            if in_glossary and level >= 4 and ">" not in m.group(2):
                para = _Para("g", text)
                stats["glossaryTerms"] += 1
            else:
                section["blocks"].append({"h": text, "l": level})
            i += 1
            continue

        m = PARA_ID.match(first) if len(chunk) == 1 and not first.lstrip().startswith("[") else None
        if m:
            flush()
            para = _Para("p", m.group(1))
            i += 1
            continue

        if section is None:
            # Stray text between a subtopic banner and its first section: keep it as loose text.
            i += 1
            continue
        if para is None:
            para = _Para("t")
        para.add_chunk(chunk)
        i += 1

    flush()

    # Stats over the final structure
    for st in result["subtopics"]:
        for sec in st["sections"]:
            for b in sec["blocks"]:
                if "p" in b:
                    stats["paragraphs"] += 1
                if "t" in b:
                    for l in b["t"]:
                        if isinstance(l, dict):
                            stats["tables"] += 1
                        elif "PENDING CONTENT" in l:
                            stats["pendingContent"] += 1
    result["stats"] = stats
    return result


def iter_paragraphs(topic_doc):
    """Yield (subtopic, section, block) for every numbered paragraph."""
    for st in topic_doc["subtopics"]:
        for sec in st["sections"]:
            for b in sec["blocks"]:
                if "p" in b:
                    yield st, sec, b


def block_text(block):
    return _flat(block.get("t", []))


def word_count(topic_doc):
    n = 0
    for st in topic_doc["subtopics"]:
        for sec in st["sections"]:
            for b in sec["blocks"]:
                if "h" in b:
                    n += len(b["h"].split())
                else:
                    n += len(_flat(b.get("t", [])).split())
    return n
