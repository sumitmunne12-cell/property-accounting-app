"""
Extract the "Glossary of Terms" chapters of every RealPage manual and merge them
into one deduplicated term list with module cross-references.

Glossary pages are laid out as a term line followed by definition lines, so the
text is split on the known term titles (the glossary's bookmark headings) rather
than on the page-level heading positions.
"""

import re
from collections import OrderedDict

import rp_parse as P
import rp_kb as K

GLOSSARY_RX = re.compile(r'^glossary', re.I)

# Keyword → module-file cross references (in addition to the module whose manual defines the term)
MODULE_KEYWORDS = [
    ('01_general_ledger', r"\b(g/l|general ledger|journal|ledger|account(s|ing)?\b|chart of accounts|allocation|accrual|prepa(id|yment)|period|books?|trial balance|statistical|dimension|segment|entity|consolidat|revaluation|currency|retained earnings|fiscal|debit|credit|reversal)"),
    ('02_accounts_payable', r"\b(a/p|payables?|vendors?|suppliers?|invoices?|1099|purchase|po\b|requisition|receiv(e|ing) goods|approval|approver|delegate|check run|payments?|expense reports?|staff expenses?|punchout|catalog|storefront|contract|subcontract|einvoice|full service|remit)"),
    ('03_cash_management', r"\b(bank|cash|deposit|reconcil|cleared|outstanding check|in-transit|undeposited|petty cash|pc card|credit card|charge card|wire|ach|eft|positive pay|escheat|transfer|statement balance|book balance)"),
    ('04_accounts_receivable', r"\b(a/r|receivables?|customers?|tenants?|residents?|charges?|late fee|concession|unapplied|billing|bill-?back|dunning|aging|deferred revenue|security deposit|lease|rent)"),
    ('05_financial_close', r"\b(close|closing|checklist|work ?papers?|console|task|period close|monthly checklist|preparer|reviewer|sign-?off)"),
    ('06_jobcost_capex_reserves', r"\b(job|cost code|cost coding|commitment|change order|draw|funding source|retainage|reserve|replacement|permit|capital|capex|construction|wip|work in process|lien)"),
    ('07_fixed_assets', r"\b(asset|depreciat|placed in service|useful life|disposal|straight line|accumulated)"),
    ('08_budgeting_forecasting', r"\b(budget|forecast|target|driver|spread method|version control|working budget|multi year|payroll|bva|variance)"),
    ('09_reporting_admin', r"\b(report|dashboard|component|performance card|smart ?link|smart rule|obfuscat|role|rights|permission|user|investor|reit|remic|whfit|vat|tax|timesheet|pto|mobile|portal|audience|data source|platform|custom)"),
]
MODULE_TITLES = {
    '01_general_ledger': 'General Ledger',
    '02_accounts_payable': 'Accounts Payable & Spend',
    '03_cash_management': 'Cash Management',
    '04_accounts_receivable': 'Accounts Receivable',
    '05_financial_close': 'Financial Close',
    '06_jobcost_capex_reserves': 'Job Cost, CapEx & Reserves',
    '07_fixed_assets': 'Fixed Assets',
    '08_budgeting_forecasting': 'Budgeting & Forecasting',
    '09_reporting_admin': 'Reporting & Administration',
}
MODULE_CODE = {
    '01_general_ledger': 'gl', '02_accounts_payable': 'ap', '03_cash_management': 'cash',
    '04_accounts_receivable': 'ar', '05_financial_close': 'close', '06_jobcost_capex_reserves': 'jobcost',
    '07_fixed_assets': 'fixed_assets', '08_budgeting_forecasting': 'budgeting', '09_reporting_admin': 'reporting',
}


def glossary_nodes(manual):
    out = []
    for h in manual['heads']:
        n = h
        while n is not None and not GLOSSARY_RX.search(n.title):
            n = n.parent
        if n is not None:
            out.append((n, h))
    return out


def extract_manual_glossary(manual):
    """Return OrderedDict norm_term -> {term, definition, page}."""
    pairs = glossary_nodes(manual)
    if not pairs:
        return OrderedDict()
    roots = []
    for root, h in pairs:
        if root not in roots:
            roots.append(root)
    lines = manual['lines']
    running = manual['running'] | {'glossary of terms', 'glossary'}
    out = OrderedDict()
    for root in roots:
        members = [h for r, h in pairs if r is root and h is not root]
        if not members:
            continue
        terms = {P.norm_title(h.title): h for h in members}
        start = root.hidx
        # region ends at the first heading after the last member that is not part of this glossary
        last = max(h.hidx for h in members)
        end = len(lines)
        for h in manual['heads']:
            if h.hidx > last and h not in members:
                end = h.hidx
                break
        page = root.page
        cur = None
        buf = []

        def flush():
            if cur is not None:
                text = P.clean_inline(' '.join(buf))
                text = re.sub(r'\s+', ' ', text).strip()
                key = P.norm_title(cur.title)
                if key not in out or len(text) > len(out[key]['definition']):
                    out[key] = {'term': P.clean_inline(cur.title), 'definition': text, 'page': cur.page}

        skip = set()
        for i in range(start, end):
            if i in skip:
                continue
            l = lines[i]
            pm = P.PAGE_RE.match(l)
            if pm:
                page = int(pm.group(1))
                continue
            if P.HEADING_RE.match(l) or P.SOURCE_RE.match(l) or l.startswith('>'):
                continue
            s = l.strip()
            if not s:
                continue
            k = P.norm_title(s)
            if k not in terms and len(k) >= 8 and any(t.startswith(k) for t in terms):
                # term wrapped onto a second line
                j = i + 1
                while j < end and not lines[j].strip():
                    j += 1
                if j < end and P.norm_title(s + ' ' + lines[j].strip()) in terms:
                    k = P.norm_title(s + ' ' + lines[j].strip())
                    skip.add(j)
            if k in terms:
                flush()
                cur = terms[k]
                buf = []
                continue
            if P.is_noise(s, running):
                continue
            if cur is not None:
                buf.append(s)
        flush()
    return out


def infer_modules(term, definition, home_modules):
    """Modules a term belongs to. The glossary chapter is shared boilerplate across many manuals,
    so the defining manual is only a fallback: the term's own words decide first, then the definition."""
    tl = term.lower()
    dl = definition.lower()
    by_term = [mod for mod, rx in MODULE_KEYWORDS if re.search(rx, tl)]
    by_def = [mod for mod, rx in MODULE_KEYWORDS if mod not in by_term and len(re.findall(rx, dl)) >= 2]
    if not by_def and not by_term:
        by_def = [mod for mod, rx in MODULE_KEYWORDS if re.search(rx, dl)][:2]
    mods = (by_term + by_def)[:4]
    return mods or list(home_modules[:1])


ACRONYM_RX = re.compile(r'^([A-Z][A-Z0-9/&\-]{1,9})$')


def acronym_of(term):
    m = re.search(r'\(([A-Z][A-Z0-9/&\-]{1,9})\)', term)
    if m:
        return m.group(1)
    head = term.split(' ')[0].split('(')[0].strip()
    if ACRONYM_RX.match(head) and len(head) <= 6:
        return head
    return None


def category_for(modules):
    return MODULE_TITLES[modules[0]] if modules else 'General'


def build_glossary(module_manuals, screens_by_module):
    """module_manuals: {module_file: [manual, ...]}; screens_by_module: {module_file: [screen, ...]}"""
    merged = OrderedDict()
    for mod_file, manuals in module_manuals.items():
        for m in manuals:
            for key, item in extract_manual_glossary(m).items():
                if not item['definition']:
                    continue
                e = merged.setdefault(key, {'term': item['term'], 'definitions': [], 'sources': [], 'home': []})
                e['definitions'].append(item['definition'])
                src = f"{m['name']}, Page {item['page']}"
                if src not in e['sources']:
                    e['sources'].append(src)
                if mod_file not in e['home']:
                    e['home'].append(mod_file)
    # screen lookup for related screens
    screen_names = {mod: [(s['id'], s['name'].lower()) for s in scr] for mod, scr in screens_by_module.items()}
    out = []
    for key, e in merged.items():
        # prefer the most frequent definition, then the longest
        defs = e['definitions']
        best = max(set(defs), key=lambda d: (defs.count(d), len(d)))
        modules = infer_modules(e['term'], best, e['home'])
        mod_for_topic = MODULE_CODE[modules[0]]
        topic = K.match_topic([e['term']], mod_for_topic, '')
        related = []
        term_rx = re.compile(r'\b' + re.escape(e['term'].lower()) + r'\b')
        for mod in modules:
            for sid, name in screen_names.get(mod, []):
                if term_rx.search(name):
                    related.append(sid)
                    if len(related) >= 3:
                        break
            if len(related) >= 3:
                break
        n_src = len(e['sources'])
        context = f"Defined in {e['sources'][0]}" + (f" and {n_src - 1} other manual glossar{'y' if n_src == 2 else 'ies'}" if n_src > 1 else '') + '.'
        out.append(OrderedDict([
            ('term', e['term']),
            ('acronym', acronym_of(e['term'])),
            ('category', category_for(modules)),
            ('definition', best),
            ('context', context),
            ('whyItMatters', topic['ctx'] or 'Shared RealPage terminology used across the Financial Suite applications.'),
            ('yardiEquivalent', topic['yardi']),
            ('modules', modules),
            ('relatedScreenIds', related),
            ('sources', e['sources'][:8]),
            ('sourceCount', n_src),
            ('origin', 'RealPage manual glossary'),
        ]))
    out.sort(key=lambda x: x['term'].lower())
    total_entries = sum(len(e['sources']) for e in merged.values())
    return out, total_entries
