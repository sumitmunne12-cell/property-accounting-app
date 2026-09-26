"""
RealPage manual parser.

Turns a layout-aware Markdown manual bundle (manuals_markdown/NN_*.md) into a
tree of topic nodes whose bodies are re-segmented on the in-text topic title,
then extracts structured content (navigation paths, numbered procedures,
field/button tables, prose) that the module builder turns into screens.

The Markdown converter inserted a heading for every PDF bookmark at the top of
the page where the bookmark lands, so a heading's raw body usually contains the
tail of the previous topic and, when several bookmarks share one page, the
text of all of them.  `segment_manual` fixes this by locating each topic's own
title line in the page text and cutting bodies at those positions.
"""

import re
import unicodedata

HEADING_RE = re.compile(r'^(#{2,7}) (.+?)\s*$')
MANUAL_RE = re.compile(r'^# MANUAL: (.+?)\s*$')
SOURCE_RE = re.compile(r'^\*Source: `(.+?)`, Page (\d+)\*\s*$')
PAGE_RE = re.compile(r'^<!-- Page (\d+) -->\s*$')
NAV_RE = re.compile(r'> \*\*Navigation Path:\*\* `([^`]+)`', re.S)

# ---------------------------------------------------------------------------
# Text normalisation helpers
# ---------------------------------------------------------------------------


def norm_title(s):
    s = unicodedata.normalize('NFKC', s)
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    s = s.replace('–', '-').replace('—', '-')
    s = re.sub(r'[®™]', '', s)
    s = re.sub(r'\s+', ' ', s).strip().lower()
    s = s.rstrip(' .:')
    return s


def clean_inline(s):
    s = unicodedata.normalize('NFKC', s)
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    s = s.replace('–', '-').replace('—', ' - ').replace(' ', ' ')
    s = s.replace('', '').replace('​', '')
    s = re.sub(r'[®™]', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    # Icon glyphs are lost in the PDF text layer; restore the common ones.
    s = re.sub(r'\b([Cc]lick|[Ss]elect)\s+next to\b', r'\1 the Add (+) icon next to', s)
    s = re.sub(r'\b([Cc]lick)\s+(to the right of|beside)\b', r'\1 the icon \2', s)
    s = re.sub(r'\s+([,.;:])', r'\1', s)
    s = re.sub(r'(\s)&(\w)', r'\1& \2', s)
    return s


NOISE_PATTERNS = [
    re.compile(r'^-{3,}$'),
    re.compile(r'^©\s*\d{4}'),
    re.compile(r'^Chapter \d+\s*:'),
    re.compile(r'^Appendix [A-Z]\s*:'),
    re.compile(r'^(RealPage\s*)?(Accounting|Financial Suite)\b.{0,90}(User Guide|Quick Steps( Guide)?|Quick Help|QS|Guide|Services)\s*$', re.I),
    re.compile(r'^RealPage (Accounting|Financial Suite)( \d(\.\d)?)?\s*$', re.I),
    re.compile(r'^Doc ID:'),
    re.compile(r'^\d{1,2}/\d{1,2}/\d{4}$'),
    re.compile(r'^[ivxlc]{1,6}$'),
    re.compile(r'^\d{1,4}$'),
    re.compile(r'^\S$'),
    re.compile(r'\.{6,}'),
    re.compile(r'^This document and the policies and procedures contained herein'),
    re.compile(r'^distributed, or otherwise disclosed outside of RealPage'),
    re.compile(r'^IMPORTANT NOTICE'),
]


def is_noise(line, running_headers):
    s = re.sub(r'[®™]', '', line).strip()
    if not s:
        return True
    for p in NOISE_PATTERNS:
        if p.search(s):
            return True
    if norm_title(s) in running_headers:
        return True
    return False


# ---------------------------------------------------------------------------
# Manual / heading parsing and re-segmentation
# ---------------------------------------------------------------------------


class Node:
    __slots__ = ('manual', 'level', 'title', 'page', 'hidx', 'start', 'end', 'parent',
                 'children', 'body', 'raw_region', 'pages', 'uid')

    def __init__(self, manual, level, title, page, hidx):
        self.manual = manual
        self.level = level
        self.title = title
        self.page = page
        self.hidx = hidx
        self.start = None
        self.end = None
        self.parent = None
        self.children = []
        self.body = []
        self.raw_region = ''
        self.pages = (page, page)
        self.uid = None

    def chain(self):
        out = []
        n = self.parent
        while n is not None:
            out.append(n)
            n = n.parent
        return out


def split_manuals(path):
    lines = open(path, encoding='utf-8').read().split('\n')
    manuals = []
    cur = None
    for i, l in enumerate(lines):
        m = MANUAL_RE.match(l)
        if m:
            cur = {'name': m.group(1), 'lines': []}
            manuals.append(cur)
            continue
        if cur is not None:
            cur['lines'].append(l)
    return manuals


def segment_manual(manual):
    lines = manual['lines']
    name = manual['name']
    # page of every line
    page_of = [0] * len(lines)
    page = 1
    heads = []
    for i, l in enumerate(lines):
        pm = PAGE_RE.match(l)
        if pm:
            page = int(pm.group(1))
        hm = HEADING_RE.match(l)
        if hm:
            level = len(hm.group(1)) - 1
            title = clean_inline(hm.group(2))
            sp = page
            if i + 1 < len(lines):
                sm = SOURCE_RE.match(lines[i + 1])
                if sm:
                    sp = int(sm.group(2))
                    page = sp
            heads.append(Node(name, level, title, sp, i))
        page_of[i] = page

    # running headers = level-1 chapter titles, standalone labels repeated at page tops, and any
    # line that recurs in the first lines of 3+ pages (chapter/section names printed as page headers)
    running = set(norm_title(h.title) for h in heads if h.level == 1)
    running |= {'fields', 'buttons'}
    top_counts = {}
    for i, l in enumerate(lines):
        if PAGE_RE.match(l):
            seen = 0
            for l2 in lines[i + 1:i + 12]:
                t = l2.strip()
                if not t or t.startswith('#') or t.startswith('*Source'):
                    continue
                seen += 1
                k = norm_title(re.sub(r'^Chapter \d+\s*:\s*', '', t))
                if len(k) < 80:
                    top_counts[k] = top_counts.get(k, 0) + 1
                if seen >= 3:
                    break
    running |= {k for k, c in top_counts.items() if c >= 3 and not re.match(r'^(\d+\.|•|▪)', k)}
    manual['running'] = running

    # locate in-text title lines
    n = len(heads)
    prev_start = -1
    for k, h in enumerate(heads):
        target = norm_title(h.title)
        # window: until first heading whose page > h.page + 1
        lim = len(lines)
        for j in range(k + 1, n):
            if heads[j].page > h.page + 1:
                lim = heads[j].hidx
                break
        lim = min(lim, h.hidx + 6000)
        lo = max(h.hidx + 1, prev_start + 1)
        found = None
        for i in range(lo, lim):
            s = lines[i]
            if not s or s.startswith('#') or s.startswith('*Source') or s.startswith('<!--'):
                continue
            if norm_title(s) == target:
                found = i
                break
            # chapter titles are often printed as "Chapter N: Title"
            if h.level == 1:
                m = re.match(r'^\s*Chapter \d+\s*:\s*(.+)$', s)
                if m and norm_title(m.group(1)) == target:
                    found = i
                    break
        if found is None:
            found = max(h.hidx, prev_start + 1)
        found = min(found, max(len(lines) - 1, 0))
        h.start = found
        prev_start = found

    for k, h in enumerate(heads):
        h.end = heads[k + 1].start if k + 1 < n else len(lines)
        h.end = min(h.end, len(lines))
        if h.end < h.start:
            h.end = h.start
        seg = lines[h.start + 1:h.end] if norm_title(lines[h.start] if h.start < len(lines) else '') == norm_title(h.title) else lines[h.start:h.end]
        raw = '\n'.join(seg)
        h.raw_region = raw
        body = []
        for i in range(h.start, h.end):
            l = lines[i]
            if i == h.start and norm_title(l) == norm_title(h.title):
                continue
            if HEADING_RE.match(l) or SOURCE_RE.match(l) or PAGE_RE.match(l):
                continue
            body.append((page_of[i], l))
        h.body = body
        pgs = [p for p, l in body if l.strip() and not l.startswith('>')]
        h.pages = (min([h.page] + pgs[:1]), max([h.page] + pgs)) if pgs else (h.page, h.page)

    # build tree
    stack = []
    roots = []
    for h in heads:
        while stack and stack[-1].level >= h.level:
            stack.pop()
        if stack:
            h.parent = stack[-1]
            stack[-1].children.append(h)
        else:
            roots.append(h)
        stack.append(h)
    manual['heads'] = heads
    manual['roots'] = roots
    return manual


# ---------------------------------------------------------------------------
# Body -> blocks
# ---------------------------------------------------------------------------

STEP_ALONE = re.compile(r'^\s*(\d{1,2})\.\s*$')
STEP_INLINE = re.compile(r'^\s*(\d{1,2})\.\s+(\S.*)$')
LETTER_ALONE = re.compile(r'^\s*([a-j])\)\s*$')
LETTER_INLINE = re.compile(r'^\s*([a-j])\)\s+(\S.*)$')
BULLET_ALONE = re.compile(r'^\s*[•▪◦●○■□➢\-–]\s*$')
BULLET_INLINE = re.compile(r'^\s*[•▪◦●○■□➢]\s*(\S.*)$')
TERMINAL = re.compile(r'[.!?:;)"]\s*$')


def _procedure_like(raw):
    return bool(re.match(r'^\s*\d{1,2}\.\s', raw) or re.search(r'\n\s*\d{1,2}\.\s', raw) or len(raw) > 260)


NAV_LEAD = re.compile(r'^(\d{1,2}\.\s*)?((go to|navigate to|open|select|from|click|in|on)\s+)+(the\s+)?', re.I)


def clean_nav_parts(raw):
    p = re.sub(r'\s+', ' ', raw).strip()
    parts = [clean_inline(x) for x in p.split('>')]
    if not parts:
        return None
    # first element: keep only the text after the last sentence boundary
    first = re.split(r'(?<=[.:;])\s+|\b\d{1,2}\.\s+', parts[0])[-1]
    first = NAV_LEAD.sub('', first).strip()
    parts[0] = first
    # last element: stop at the first sentence boundary
    last = re.split(r'\.\s|\.$|,\s(?=(and|then|or|to|click|select)\b)', parts[-1])[0]
    parts[-1] = last
    parts = [x.strip(' .,;:') for x in parts]
    parts = [x for x in parts if x]
    if len(parts) < 2 or any(len(x) > 70 for x in parts):
        return None
    return parts


def extract_nav_paths(text):
    out = []
    for m in NAV_RE.finditer(text):
        raw = m.group(1)
        if _procedure_like(raw):
            continue
        for piece in re.split(r'(?<=\S)\s+(?=Applications\s*>)', raw):
            parts = clean_nav_parts(piece)
            if parts and parts not in out:
                out.append(parts)
    return out


def _unwrap_callout(m):
    raw = m.group(1)
    return '\n' + raw + '\n' if _procedure_like(raw) else '\n'


ICON_FIX = [
    (re.compile(r'\b([Cc]lick|[Ss]elect)\s+next to\b'), r'\1 the Add (+) icon next to'),
    (re.compile(r'\b([Cc]lick)\s+(to the right of|beside)\b'), r'\1 the icon \2'),
    (re.compile(r'\b([Cc]lick) the\s+(\.|,)'), r'\1 the icon\2'),
]


def fix_icons(t):
    for rx, rep in ICON_FIX:
        t = rx.sub(rep, t)
    return t


def body_blocks(body, running):
    """Return list of blocks: dict(type=step|bullet|para|label, text, n)."""
    text = '\n'.join(l for _, l in body)
    # remove nav callouts from prose (captured separately)
    text = NAV_RE.sub(_unwrap_callout, text)
    raw_lines = [l for l in text.split('\n')]
    lines = []
    for l in raw_lines:
        if l.startswith('>'):
            l = l.lstrip('> ').strip()
            if not l:
                continue
        if is_noise(l, running):
            continue
        lines.append(l.rstrip())

    blocks = []
    pending_step = None
    pending_bullet = False
    for l in lines:
        s = l.strip()
        m = STEP_ALONE.match(s)
        if m:
            pending_step = int(m.group(1))
            pending_bullet = False
            continue
        m = LETTER_ALONE.match(s)
        if m:
            pending_step = ord(m.group(1)) - 96
            pending_bullet = False
            continue
        m = LETTER_INLINE.match(s)
        if m:
            blocks.append({'type': 'step', 'n': ord(m.group(1)) - 96, 'text': clean_inline(m.group(2))})
            pending_step = None
            pending_bullet = False
            continue
        m = STEP_INLINE.match(s)
        if m and not re.match(r'^\d{1,2}\.\d', s):
            blocks.append({'type': 'step', 'n': int(m.group(1)), 'text': clean_inline(m.group(2))})
            pending_step = None
            pending_bullet = False
            continue
        if BULLET_ALONE.match(s):
            pending_bullet = True
            pending_step = None
            continue
        m = BULLET_INLINE.match(s)
        if m:
            blocks.append({'type': 'bullet', 'text': clean_inline(m.group(1))})
            pending_bullet = False
            pending_step = None
            continue
        t = clean_inline(s)
        if not t:
            continue
        if pending_step is not None:
            blocks.append({'type': 'step', 'n': pending_step, 'text': t})
            pending_step = None
            continue
        if pending_bullet:
            blocks.append({'type': 'bullet', 'text': t})
            pending_bullet = False
            continue
        if blocks:
            prev = blocks[-1]
            pt = prev['text']
            starts_lower = t[:1].islower() or t[:1] in '(,'
            prev_open = not TERMINAL.search(pt)
            dangling = prev_open and re.search(r"\b(the|a|an|click|select|and|or|to|of|in|on|for|with|from|your|this|then)$", pt, re.I)
            if starts_lower or dangling or (prev_open and len(raw_last(pt)) >= 45):
                prev['text'] = pt + ' ' + t
                prev['_last'] = t
                if prev['type'] == 'label':
                    prev['type'] = 'para'
                continue
        typ = 'label' if (len(t) <= 70 and not TERMINAL.search(t) and len(t.split()) <= 9) else 'para'
        blocks.append({'type': typ, 'text': t, '_last': t})
    for b in blocks:
        b.pop('_last', None)
        b['text'] = fix_icons(b['text'])
    return blocks


def raw_last(t):
    # approximate the last physical line length: text after last join
    return t[-100:] if len(t) > 100 else t


# ---------------------------------------------------------------------------
# Content extraction
# ---------------------------------------------------------------------------

FIELD_PATTERNS = [
    re.compile(r"\b[Ii]n the ([A-Z0-9][\w/&\-'., #()]{1,55}?) (field|fields|drop-down list|drop-down|list box|box|text box|column|section|area|check box|option|menu|tab|list)\b[,:]?\s*(.*)"),
    re.compile(r"\b(?:[Ss]elect|[Cc]lear|[Cc]heck) the ([A-Z0-9][\w/&\-'., #()]{1,55}?) (check box|checkbox|option|radio button|toggle)\b[,:]?\s*(.*)"),
    re.compile(r"\b[Ff]rom the ([A-Z0-9][\w/&\-'., #()]{1,55}?) (drop-down list|drop-down|list|menu)\b[,:]?\s*(.*)"),
    re.compile(r"\b[Tt]ype (?:a|an|the)? ?([A-Z0-9][\w/&\-'., #()]{1,40}?) in the (?:[A-Z][\w/&\- ]{1,40}) field(.*)"),
]
BUTTON_PATTERNS = [
    re.compile(r"\b[Cc]lick (?:the )?([A-Z][\w/&\-'.+ ]{0,40}?) (button|link|tab|icon)\b(.*)"),
    re.compile(r"\b[Cc]lick ([A-Z][\w/&\-'.+]*(?: (?:&|and|[A-Z][\w/&\-'.+]*)){0,3})([.,]|$)(.*)"),
]
INLINE_PAIR = re.compile(r"^([A-Z][\w/&\-() ]{1,40}?)\s+(Click|Select|Type|Enter|Displays?|Shows?|Indicates?|Opens?|Lists?)\b(.*)$")
GROUP_HDR = re.compile(r'(\s-\s|Fields$|Buttons$|Filters$|Views$|Actions$|Tabs$|Columns$|Section$|Options$)')
BAD_FIELD = re.compile(r'^(this|that|these|the|a|an|following|appropriate|desired|same|next|previous|new|each|any)\b', re.I)


def sentence_trim(s, n=320):
    s = s.strip()
    if len(s) <= n:
        return s
    cut = s[:n]
    k = max(cut.rfind('. '), cut.rfind('; '))
    if k > n * 0.5:
        return cut[:k + 1]
    k = cut.rfind(' ')
    return cut[:k] + '…'


def table_pairs(blocks):
    """Parse label/description tables (Fields / Buttons pages)."""
    pairs = []
    names = []
    for b in blocks:
        if b['type'] == 'label':
            t = b['text']
            if GROUP_HDR.search(t) and not names:
                continue
            if len(names) >= 2 and GROUP_HDR.search(names[0]):
                names = names[1:]
            names.append(t)
            continue
        if b['type'] in ('para', 'bullet', 'step') and names:
            keep = [n for n in names if not GROUP_HDR.search(n)] or names[-1:]
            if len(keep) >= 2 and any(len(n.split()) > 3 for n in keep):
                keep = keep[-1:]
            nm = ' / '.join(keep)
            pairs.append((nm, b['text']))
            names = []
            continue
        m = INLINE_PAIR.match(b['text']) if b['type'] == 'para' and not names else None
        if m and pairs:
            pairs.append((m.group(1), m.group(2) + m.group(3)))
            continue
        if b['type'] in ('para', 'bullet') and pairs and not names:
            # continuation paragraph of the previous description
            nm, d = pairs[-1]
            if len(d) < 260:
                pairs[-1] = (nm, d + ' ' + b['text'])
    return pairs


def extract_fields(blocks, limit=18):
    out = []
    seen = set()

    def add(name, desc, kind=None):
        name = clean_inline(name).strip(' .,:;"\'')
        name = re.sub(r'^(the|a|an)\s+', '', name, flags=re.I)
        if not name or len(name) > 60 or BAD_FIELD.match(name) or len(name.split()) > 8:
            return
        if not re.search(r'[A-Za-z]', name):
            return
        key = name.lower()
        if key in seen:
            return
        seen.add(key)
        d = sentence_trim(clean_inline(desc), 300)
        if kind and not d.lower().startswith(kind.lower()):
            d = f'{kind} — {d}'
        out.append({'name': name, 'description': d})

    for b in blocks:
        if len(out) >= limit:
            break
        t = b['text']
        if b['type'] == 'bullet':
            m = re.match(r'^([A-Z][\w/&\-\'() .#]{1,50}?)\s*[:\-–]\s+(.{8,})$', t)
            if m:
                add(m.group(1), m.group(2))
                continue
        for p in FIELD_PATTERNS:
            m = p.search(t)
            if m:
                kind = m.group(2) if len(m.groups()) >= 3 else 'field'
                add(m.group(1), t, None)
                break
        else:
            for p in BUTTON_PATTERNS[:1]:
                m = p.search(t)
                if m and m.group(1).lower() not in ('ok', 'here'):
                    add(m.group(1) + (' ' + m.group(2) if m.group(2) != 'button' else ''), t, 'Button' if m.group(2) == 'button' else None)
                    break
    return out


def extract_procedures(blocks):
    """Group consecutive steps into procedures with an optional intro line."""
    procs = []
    cur = None
    last_intro = None
    for idx, b in enumerate(blocks):
        if b['type'] == 'step':
            if cur is None or b['n'] == 1 or b['n'] <= cur['last_n']:
                cur = {'intro': last_intro, 'steps': [], 'last_n': 0}
                procs.append(cur)
                last_intro = None
            cur['steps'].append(b['text'])
            cur['last_n'] = b['n']
            continue
        if b['type'] in ('para', 'label') and b['text'].endswith(':') and len(b['text']) < 200:
            last_intro = b['text'].rstrip(':').strip()
            continue
        if cur is not None and b['type'] in ('para', 'bullet'):
            # a note between steps: attach to the previous step when more steps follow
            if _next_is_step(blocks, idx) and blocks_next_step_n(blocks, idx) != 1:
                if len(b['text']) <= 260 and cur['steps']:
                    cur['steps'][-1] = cur['steps'][-1] + ' ' + ('• ' if b['type'] == 'bullet' else '') + b['text']
                continue
        if b['type'] in ('para', 'label') and not b['text'].endswith(':'):
            last_intro = None if b['type'] == 'para' else last_intro
    return procs


def _next_is_step(blocks, idx):
    for b in blocks[idx + 1:idx + 8]:
        if b['type'] == 'step':
            return True
        if b['type'] == 'label':
            return False
    return False


def blocks_next_step_n(blocks, idx):
    for b in blocks[idx + 1:]:
        if b['type'] == 'step':
            return b['n']
    return None


def _is_prose(b):
    return (b['type'] == 'para' and len(b['text']) > 40 and not b['text'].endswith(':')
            and not re.match(r'^(Note|Tip|Important|Caution|Warning)\b', b['text']))


def _prose_run(blocks):
    """Paragraphs plus 'intro: • a • b' capability lists folded into one sentence."""
    out = []
    i = 0
    while i < len(blocks):
        b = blocks[i]
        def listy(x):
            return x['type'] == 'bullet' or (x['type'] in ('para', 'label') and len(x['text']) < 110 and not x['text'].endswith(':'))
        if b['type'] in ('para', 'label') and b['text'].endswith(':') and i + 1 < len(blocks) and listy(blocks[i + 1]):
            items = []
            j = i + 1
            while j < len(blocks) and listy(blocks[j]) and len(items) < 8:
                items.append(re.sub(r'\s*\(on page \d+\)', '', blocks[j]['text']).rstrip('. '))
                j += 1
            if len(b['text']) > 15 and not re.match(r'^To\b', b['text']):
                out.append(b['text'] + ' ' + '; '.join(items) + '.')
            i = j
            continue
        if _is_prose(b):
            out.append(b['text'])
        i += 1
    return out


def prose(blocks, limit=4):
    """Descriptive paragraphs: the introduction before the first procedure step is preferred,
    then paragraphs after the last step; notes between steps belong to the steps."""
    step_idx = [i for i, b in enumerate(blocks) if b['type'] == 'step']
    if not step_idx:
        return _prose_run(blocks)[:limit]
    first, last = step_idx[0], step_idx[-1]
    return (_prose_run(blocks[:first]) + _prose_run(blocks[last + 1:]))[:limit]


IMPERATIVE_RX = re.compile(r'^(To [a-z].{3,80}?, )?(click|select|type|enter|clear|drag|use|choose|open|go to|navigate|find|check|review|confirm|roll over|expand|scroll|set|add|remove|mark|attach|upload|download|export|print|run|save|submit|approve|post)\b', re.I)


def imperative_bullets(blocks, limit=12):
    out = []
    for b in blocks:
        if b['type'] in ('bullet', 'para') and IMPERATIVE_RX.search(b['text']) and 12 < len(b['text']) < 400:
            out.append(b['text'])
            if len(out) >= limit:
                break
    return out


ACCT_SENT_RX = re.compile(r"\b(debits?|credits?)\b[^.]{0,160}\b(account|funds|payable|receivable|expense|revenue|cash|liabilit|asset|equity|ledger|g/l)|\b(journal entr(y|ies)|g/l entr(y|ies)|gl entr(y|ies))\b[^.]{0,120}\b(post|creat|generat|record|reverse|debit|credit)", re.I)


def accounting_sentences(blocks, limit=2):
    out = []
    for b in blocks:
        for s in re.split(r'(?<=[.!?])\s+(?=[A-Z])', b['text']):
            s = s.strip()
            if 30 < len(s) < 320 and ACCT_SENT_RX.search(s) and s not in out:
                out.append(s)
                if len(out) >= limit:
                    return out
    return out


def notes(blocks):
    out = []
    for b in blocks:
        t = b['text']
        if b['type'] in ('para', 'bullet') and re.match(r'^(Note|Important|Caution|Warning|Tip)\b\s*:?', t):
            out.append(re.sub(r'^(Note|Important|Caution|Warning|Tip)\b\s*:?\s*', '', t))
    return out
