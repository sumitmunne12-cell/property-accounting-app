#!/usr/bin/env python3
"""
Deduction Compass: the filing logic behind RealPage Financial Suite menus.

Three jobs, one source of truth:

1. Normalize every screen's manual-derived `navigation[]` into
   application › tab › home-page section › submenu, folding label variants
   ("Spend management", "Accounts Payable/Spend Management" …) into one place and
   flagging paths that are manual chapters rather than menus.
2. Tag every screen (`compass` field) with app, tab, section, submenu, lifecycle
   stage, business object, action and record state.
3. Hold the deduction rules as data (objects, verbs, tie-breakers, exceptions) and
   score them against the real paths.  The same rules are exported to
   src/data/compassRules.json so the app's matcher (src/utils/compassEngine.js)
   predicts exactly what this script measures.

All regexes are written in the subset shared by Python `re` and JavaScript
RegExp (no lookbehind, no inline flags); they are compiled case-insensitively.

Usage:
    python3 scripts/rp_compass.py            # score the rules, print the report
    python3 scripts/rp_compass.py --json     # same, as JSON
"""

import json
import os
import re
import sys
from collections import Counter, OrderedDict, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------------------
# 1. Path normalization
# ---------------------------------------------------------------------------

# canonical application, pattern found inside a nav token (most specific first)
APP_VARIANTS = [
    ('Spend Management', r'Accounts Payable/Spend Management|Configure \(Spend Management\)|Spend [Mm]anagement'),
    ('Job Cost & Reserves', r'Job Cost & Reserves or Replacement Reserves|Job Cost & Reserves|Replacement Reserves|Job Cost\b'),
    ('Financial Close Management', r'Financial Close Management'),
    ('Forecasting & Planning', r'Forecasting & Planning'),
    ('Cash Management', r'\(?Cash Management\)?(?: Configure)?'),
    ('Accounts Payable', r'(?:Configure \()?Accounts [Pp]ayable\)?|\bPayable\b'),
    ('Accounts Receivable', r'(?:Configure \()?Accounts? [Rr]eceivable\)?|\bReceivable\b'),
    ('General Ledger', r'General [Ll]edger(?: Application)?(?: Setup)?'),
    ('Fixed Assets', r'Fixed Assets'),
    ('Finance Agent', r'Finance Agent'),
    ('Investor Tracking', r'Investor Tracking'),
    ('Time & Resources', r'Time & Resources'),
    ('Platform Services', r'Platform Services/Customization Services|Platform Services'),
    ('Reporting Portal', r'Reporting Portal'),
    ('Dashboards', r'Dashboards(?: \(menu\))?'),
    ('Global Consolidations', r'Global Consolidations'),
    ('Taxes', r'^Taxes$'),
    ('Company', r'^Company\b|\bCompany$'),
    ('Reports', r'^\(?Reports(?: Center)?$|\bReports$|^Reports\b'),
    ('Property Management', r'Property Management'),
    ('(Any application)', r'^\(Application\)$'),
]
_APP_RX = [(a, re.compile(r)) for a, r in APP_VARIANTS]
_ROOT_RX = re.compile(r'^\(?Applications?\)?$')
_MULTI_APP_RX = re.compile(r'\b(Accounts Payable, Accounts Receivable, or|Reports or General Ledger)\b')
_TAIL_JUNK = re.compile(r"(\)\s.*$|\)$|\s+(and then|and enable|and is called|and click|and select|click|to see|on the)\b.*$)")

# Applications whose screens are outside RealPage Financial Suite or have no fixed home
OUT_OF_SCOPE_APPS = {'Property Management', '(Any application)'}

TABS = ('All', 'Setup')
SECTION_TOKENS = {
    'daily tasks': 'Daily Tasks', 'periodic tasks': 'Periodic Tasks', 'search & find': 'Search & Find',
    'reports': 'Reports', 'registers & reports': 'Reports', 'month end': 'Periodic Tasks', 'more': 'More',
}
SECTIONS = ('Daily Tasks', 'Search & Find', 'Periodic Tasks', 'Reports', 'More')

# Non-screen manual topics (chapters, overviews, FAQs, column references …): excluded from rules.
TOPIC_RULES = [
    ('overview/intro', r"^(overview|introduction|intro to|about\b|welcome|getting started|understanding|key concepts|terminology( list)?$|conventions|using the .* application|using realpage|ready to|where to start)|(overview| introduction)$"),
    ('application home page', r"home page$"),
    ('appendix/help', r"^(appendix|appendices|help and support|glossary|client portal help|support and error|contacting|documentation|how to read paths|common tasks$|navigation$|navigating\b)"),
    ('FAQ/troubleshooting', r"^(faqs?\b|frequently asked|troubleshooting|why\b|how (to|do|does)\b|what happens|when to\b|step \d|additional items|summary$|prerequisites$)|(faqs?|questions|\?)$"),
    ('examples/tips', r"^(examples?\b|sample\b|tips\b|best practices|what'?s next|next steps$)"),
    ('workflow narrative', r"^(workflow:|the .* (process|workflow)$|open and close process$|close periods and open periods$|getting started workflow$)|workflow overview$"),
    ('browser how-to', r"(^|from )(microsoft )?(safari|firefox|chrome|edge|internet explorer)$"),
    ('report column reference', r"^(?![A-Z][a-z]+ing\b).*\bcolumns$"),
]
_TOPIC_RX = [(k, re.compile(r, re.I)) for k, r in TOPIC_RULES]


def topic_kind(name):
    n = (name or '').strip()
    for k, rx in _TOPIC_RX:
        if rx.search(n):
            return k
    return None


def _clean(tok):
    t = tok.strip().strip('•').strip()
    if t.count('(') >= t.count(')') and '(' in t:
        # "Draw Detail (RR)" keeps its parenthesis; only trim prose after a balanced label
        t = re.sub(r"\s+(and then|and enable|and is called|and click|and select|click|to see|on the)\b.*$", '', t).strip()
    else:
        t = _TAIL_JUNK.sub('', t).strip()
    t = t.lstrip('(').strip() if t.count('(') > t.count(')') and t.startswith('(') else t
    return t


def split_path(nav):
    """navigation[] -> {app, rawApp, tokens after the app, prose}."""
    toks = [t.strip() for t in nav if t and t.strip()]
    while toks and _ROOT_RX.match(toks[0]):
        toks = toks[1:]
    for i, t in enumerate(toks[:3]):
        if _MULTI_APP_RX.search(t):
            return dict(app=None, rawApp=t, tokens=[_clean(x) for x in toks[i + 1:]], prose=True)
        for a, rx in _APP_RX:
            m = rx.search(t)
            if not m:
                continue
            rest = [_clean(x) for x in toks[i + 1:]]
            if 'Configure' in t:                       # "Configure (Accounts Payable)" = its Setup › Configuration page
                rest = ['Setup', 'Configuration'] + rest
            if a == 'Reports' and 'Reports Center' in t:
                rest = ['Reports Center'] + rest
            if a == 'General Ledger' and t.endswith('Setup'):
                rest = ['Setup'] + rest
            return dict(app=a, rawApp=t[m.start():m.end()], tokens=[x for x in rest if x],
                        prose=m.start() > 2 or i > 0)
    return dict(app=None, rawApp=None, tokens=[_clean(x) for x in toks], prose=True)


def canon(t):
    t = re.sub(r'\s+', ' ', t or '').strip().lower()
    t = t.replace('a/p', 'ap').replace('a/r', 'ar').replace('g/l', 'gl').replace('(', '').replace(')', '')
    return re.sub(r'(ies|s)$', '', t)


def _raw_parse(nav):
    p = split_path(nav)
    t = p['tokens']
    tab = t[0] if t and t[0] in TABS else None
    rest = t[1:] if tab else list(t)
    section = None
    if tab and rest and rest[0].lower() in SECTION_TOKENS:
        section = SECTION_TOKENS[rest[0].lower()]
        rest = rest[1:]
        while rest and rest[0].lower() in ('month end', 'registers & reports') and section in ('Periodic Tasks', 'Reports'):
            rest = rest[1:]
    return dict(app=p['app'], rawApp=p['rawApp'], tab=tab, section=section,
                submenu=rest[0] if rest else None, rest=rest, tokens=t)


_REPORTISH = re.compile(r'report|register|aging|ledger|analysis|analytics|statement|summary|listing', re.I)


class PathIndex:
    """Learns, from paths that state them, which tab/section each submenu belongs to, so a path that
    skips the section ("Accounts Payable › All › A/P Invoices") or the tab ("Reports › More › …")
    can be completed from the menu tree itself."""

    def __init__(self, navs):
        self.home = defaultdict(Counter)
        for nav in navs:
            r = _raw_parse(nav)
            if r['tab'] and r['submenu']:
                self.home[(r['app'], canon(r['submenu']))][(r['tab'], r['section'])] += 1

    def locate(self, nav):
        r = _raw_parse(nav)
        r['tabSource'] = 'menu' if r['tab'] else None
        if r['tab'] and not r['section'] and r['submenu']:
            secs = Counter()
            for (tb, sec), v in self.home.get((r['app'], canon(r['submenu'])), {}).items():
                # Report groups reuse record-list names ("Reports › Customers"); only borrow the
                # Reports section for names that are themselves reports.
                if tb == r['tab'] and sec and (sec != 'Reports' or _REPORTISH.search(r['submenu'])):
                    secs[sec] += v
            if secs:
                r['section'] = secs.most_common(1)[0][0]
        if not r['tab'] and r['tokens']:
            c = self.home.get((r['app'], canon(r['tokens'][0])))
            if c:
                (tb, sec), _ = c.most_common(1)[0]
                r.update(tab=tb, section=sec, submenu=r['tokens'][0], rest=list(r['tokens']), tabSource='implied')
            else:
                r['tabSource'] = 'chapter'
        return r


# ---------------------------------------------------------------------------
# 2. Deduction rules
# ---------------------------------------------------------------------------

# Lifecycle stages (the revised hypothesis): where each shows up in the menus.
STAGES = OrderedDict([
    ('configure', dict(label='Configure', where='Setup tab (small code lists under Setup › More)',
                       question='Am I changing how future transactions default, validate or route?')),
    ('enter', dict(label='Enter & pay', where='All › Daily Tasks',
                   question='Am I creating a high-volume transaction or moving money today?')),
    ('find_fix', dict(label='Find & fix', where='All › Search & Find (the record list)',
                      question='Am I opening, correcting, reversing or deleting a record that already exists?')),
    ('process', dict(label='Process & close', where='All › Periodic Tasks (incl. Month End)',
                     question='Am I running a batch, recurring or period-end process?')),
    ('review', dict(label='Review & report', where='All › Reports (registers, aging, ledgers)',
                    question='Am I reading results rather than changing them?')),
])

# Verbs -> stage.  First match wins, so the specific verbs come before the generic CRUD verbs.
VERB_RULES = [
    ('review', 'report', r"\b(reports?|registers?|aging|ledger|listing|analysis|analytics|inquiry|statements? of|graphs?|charts?|run(ning)? the|customiz(e|ing) and run)\b"),
    ('configure', 'configure', r"\b(configur(e|ing|ation)|set(ting)? ?up|enabl(e|ing)|disabl(e|ing)|defin(e|ing)|setup|settings?|preferences|installing|assign(ing)? .*(roles?|permissions?))\b"),
    ('process', 'close', r"\b(clos(e|ing)|reopen(ing)?|open(ing)? (the )?(books|periods?|subledger)|month[- ]end|year[- ]end|lock(ing)?)\b"),
    ('process', 'reconcile', r"\b(reconcil(e|es|ing|iation)|match(ing)?|unmatch(ing)?)\b"),
    ('process', 'recur', r"\b(recurring|schedul(e|ing)|generat(e|ing)|calculat(e|ing)|recalculat(e|ing)|allocat(e|ing)|depreciat(e|ing)|amortiz(e|ing)|accru(e|al|ing)|summar(y|ies|ize)|process(ing)? (the )?(batch|month))\b"),
    ('find_fix', 'void', r"\b(void(ed|ing|s)?|stop payment|spoiled|ruined)\b"),
    ('find_fix', 'reverse', r"\b(revers(e|ed|al|ing)|unpost(ing)?|back out|undo)\b"),
    ('find_fix', 'delete', r"\b(delet(e|ing)|inactivat(e|ing)|remov(e|ing)|merg(e|ing))\b"),
    ('find_fix', 'edit', r"\b(edit(ing)?|chang(e|ing)|correct(ing)?|updat(e|ing)|fix(ing)?|wrong|incorrect|reclass(ify|ifying|ing)?|reprint(ing)?)\b"),
    ('find_fix', 'view', r"\b(view(ing)?|find(ing)?|search(ing)?|look(ing)? up|research(ing)?|history|audit trail|drill)\b"),
    ('enter', 'pay', r"\b(pay(ing)?|print(ing)? checks?|issu(e|ing)|refund(ing)?|disburs(e|ing))\b"),
    ('enter', 'receive', r"\b(receiv(e|ing)|deposit(ing)?|appl(y|ying) (a )?(payment|credit|advance))\b"),
    ('enter', 'create', r"\b(add(ing)?|creat(e|ing)|enter(ing)?|record(ing)?|upload(ing)?|import(ing)?|submit(ting)?|request(ing)?|post(ing)?|new)\b"),
]

# Record states named in a scenario, and where each state sends you.
STATE_RULES = [
    ('closed_period', r"\b(closed (period|month|books)|prior (period|month|year)|after (the )?close|books? (are|is) closed|locked period)\b",
     'Posted in a closed period: you cannot edit it. Reverse it with a date in the current open period, or have the controller reopen the period in General Ledger › All › Periodic Tasks › Month End (Books).'),
    ('paid', r"\b(paid|check (was|has been) (cut|issued|printed|cleared)|already (cut|printed|issued|cleared)|cleared)\b",
     'Paid: undo the payment first. Void the check from the Check Register (Accounts Payable › All › Reports › Check Register) or the Payments list; voiding restores the invoice to open.'),
    ('posted', r"\b(posted|already (posted|entered|approved)|in the ledger|hit the gl|on the books)\b",
     'Posted: open it from its Search & Find list and use Reverse (or Edit, only while the period is open). Posted history is never deleted.'),
    ('pending_approval', r"\b(pending approval|awaiting approval|in approval|stuck|declined|not approved|needs approval)\b",
     'In approval: it lives in Company › All › Approvals › Approval Workbench until the last approver acts.'),
    ('draft', r"\b(draft|unposted|not (yet )?posted|saved but|future draft)\b",
     'Draft: it is still editable from the object\'s Search & Find list (filter by status = draft); no reversal needed.'),
]

# Business objects: the noun decides the application (Step 1) and names the list (Step 3).
#
# kind   master = reference records kept in a list (vendors, customers, jobs, bank accounts, accounts)
#        txn    = transactions (invoices, payments, journal entries, draws, POs)
#        process= batch / period work (reconciliation, accruals, budgets, recurring, expense reports)
#        code   = setup codes and configuration (types, terms, templates, rules)
#        output = reports and registers
#        service= platform features shared by every application (Company, Reports, Platform)
# home   where the object's own record list lives (tab, section, submenu)
# daily  the Daily Tasks shortcut used to *create* it, when one exists
# report where its reports are grouped
# setup  where its codes / configuration live
# lists  the object's other lists, each picked when its pattern appears in the task (Step 3)
#        submenu '=title' means the list is named after the report itself.
# Order = specificity: specialty applications first, then subledgers, then the General Ledger, then
# the cross-application services, so the first match is the most specific business object.


def L(match, tab, section, submenu):
    return OrderedDict([('match', match), ('tab', tab), ('section', section), ('submenu', submenu)])


OBJECTS = [
    # --- Financial Close Management
    dict(id='bs_rec_report', label='Balance-sheet account report', app='Financial Close Management', kind='output',
         match=r"^(customizing and running the )?(a/r - (multifamily|commercial|other)|allowance for doubtful accounts|security deposits - (multifamily|commercial)|mortgage and escrow|notes (payable|receivable)|prepaid expenses?|accrued expenses|fixed assets|other assets|property tax|rent roll|cash & cash equivalents|accounts payable)( \(no variance\))? report\b",
         home=L(None, 'All', 'Reports', '=title'), lists=[]),
    dict(id='work_paper', label='Close checklist / work paper', app='Financial Close Management', kind='process',
         match=r"\b(checklists?|work ?papers?|close (tasks?|workbench|console|activities)|financial close management|task generation)\b",
         home=L(None, 'All', None, 'Activities'),
         setup=L(None, 'Setup', None, 'Configuration'),
         lists=[L(r"\b(checklists?|task generation|work ?paper configurations?|unrestricted users)\b", 'Setup', None, 'Configuration'),
                L(r"\bconsole\b", 'All', None, 'Console'),
                L(r"\bworkbench\b", 'All', None, 'Workbench')]),
    # --- Fixed Assets
    dict(id='depreciation', label='Depreciation', app='Fixed Assets', kind='process',
         match=r"\b(depreciat(e|ion|ing))\b", home=L(None, 'All', 'Periodic Tasks', 'Post Depreciation'), lists=[]),
    dict(id='fixed_asset', label='Fixed asset', app='Fixed Assets', kind='master',
         match=r"\b(fixed assets?|draft assets?|asset class(es)?|dispos(e|al|ing) (of )?(an )?assets?|asset (info|reconciliation)|(transferring|reclassing|activating) (an |draft )?assets?|assets in bulk)\b",
         home=L(None, 'All', None, 'Assets'), setup=L(None, 'Setup', None, 'Asset Classes'),
         lists=[L(r"\basset class", 'Setup', None, 'Asset Classes'),
                L(r"\bdraft assets?\b", 'All', None, 'Draft Assets'),
                L(r"\basset info", 'All', None, 'Asset Info Reports'),
                L(r"\basset reconciliation", 'All', None, 'Asset Reconciliation Report')]),
    # --- Job Cost & Reserves
    dict(id='draw', label='Draw', app='Job Cost & Reserves', kind='txn',
         match=r"\b(draws?|draw workbench|draw requests?|draw receipts?|draw activity|draw schedules?)\b(?! models?)",
         home=L(None, 'All', 'Search & Find', 'Draw Workbench'),
         lists=[L(r"\bdraw detail\b", 'All', 'Reports', 'Draw Detail')]),
    dict(id='job_setup', label='Draw model / funding source / cost structure', app='Job Cost & Reserves', kind='code',
         match=r"\b(draw models?|funding sources?|reserve account schedules?|cost structures?|cost codes?|job types?|job reporting codes?|permits?|job segments?)\b",
         home=L(None, 'Setup', None, 'Draw Models'), setup=L(None, 'Setup', None, 'Configuration'),
         lists=[L(r"\bfunding source inquiry\b", 'All', 'Daily Tasks', 'Funding Source Inquiry'),
                L(r"\bjob segment budgets?\b", 'All', 'Search & Find', 'Job Segment Budgets'),
                L(r"\bcost code structure report", 'All', 'Reports', 'Cost Code Structure'),
                L(r"\b(closing|reopening|close|reopen)\b.*\bcost codes?\b", 'All', 'Search & Find', 'Jobs'),
                L(r"\bjob types?\b", 'Setup', None, 'Job Types'),
                L(r"\bfunding sources?\b", 'Setup', None, 'Funding Sources'),
                L(r"\breserve account schedules?\b", 'Setup', None, 'Reserve Account Schedule'),
                L(r"\bpermits?\b", 'Setup', None, 'Permits'),
                L(r"\bjob reporting codes?\b", 'Setup', None, 'Job Reporting Codes'),
                L(r"\bcost structures?\b", 'Setup', None, 'Cost Structure Definition'),
                L(r"\bjob segments?\b", 'Setup', None, 'Segments')]),
    dict(id='job_process', label='Job budget / commitment / lien release', app='Job Cost & Reserves', kind='process',
         match=r"\b(job (segment )?budgets?|external commitments?|commitments?|lien releases?|close (a )?job|closing (a )?job|tenant invoices?)\b",
         home=L(None, 'All', 'Periodic Tasks', 'Budgets'),
         lists=[L(r"\bexternal commitments?\b", 'All', 'Periodic Tasks', 'External Commitments'),
                L(r"\b(open|pending) commitments?\b", 'All', 'Daily Tasks', 'Job Status Inquiry'),
                L(r"\bjob budgets?\b", 'All', 'Search & Find', 'Jobs'),
                L(r"\blien releases?\b", 'All', 'Periodic Tasks', 'Lien Releases'),
                L(r"\bclos(e|ing) (a )?job\b", 'All', 'Periodic Tasks', 'Close Job'),
                L(r"\btenant invoices?\b", 'All', 'Periodic Tasks', 'Generate Tenant Invoice')]),
    dict(id='job_report', label='Job cost report', app='Job Cost & Reserves', kind='output',
         match=r"\b(retainage (register|report)|wip account|job (cost|status|setup) (summary|activity|status)|job cost status|job status with|job budget report|open invoices report)\b",
         home=L(None, 'All', 'Reports', '=title'), lists=[]),
    dict(id='job', label='Job / replacement reserve', app='Job Cost & Reserves', kind='master',
         match=r"\b(jobs?|job status inquiry|replacement reserves?|reserve (status|accounts?)|capital projects?|construction projects?|capex)\b",
         home=L(None, 'All', 'Search & Find', 'Jobs'), setup=L(None, 'Setup', None, 'Configuration'),
         lists=[L(r"\b(job|replacement reserve) status inquiry\b", 'All', 'Daily Tasks', 'Job Status Inquiry'),
                L(r"\bjob cost & reserves (all|setup) tab\b", 'All', None, None)]),
    # --- Spend Management
    dict(id='purchase_order', label='Purchase order / contract', app='Spend Management', kind='txn',
         match=r"\b(purchase orders?|p\.?o\.?s?|service contracts?|subcontracts?|change orders?|spend (inquiry|management)|catalogs?|catalog mapping|storefront|requisitions?|saved items|invoice processing upload|invoice exception queue|expense allocations?|punch-?out)\b",
         home=L(None, 'All', None, 'Workbench'), daily=L(None, 'All', 'Daily Tasks', 'Create a Purchase Order'),
         setup=L(None, 'Setup', None, 'Configuration'),
         lists=[L(r"\bsubcontracts?\b", 'All', 'Search & Find', 'Subcontract'),
                L(r"\bservice contracts?\b", 'All', 'Search & Find', 'Service Contract'),
                L(r"\bspend inquiry\b", 'All', 'Periodic Tasks', 'Spend Inquiry'),
                L(r"\bsaved items\b", 'All', 'Periodic Tasks', 'Saved Items'),
                L(r"\binvoice processing upload\b", 'All', None, 'Invoice Processing Upload'),
                L(r"\binvoice exception queue\b", 'All', None, 'Invoice Exception Queue'),
                L(r"\b(catalog mapping|catalogs?)\b", 'Setup', None, 'Configuration'),
                L(r"\bexpense allocations?\b", 'Setup', None, 'Expense Allocations')]),
    # --- Forecasting & Planning
    dict(id='working_budget', label='Working budget / payroll plan', app='Forecasting & Planning', kind='process',
         match=r"\b(working budgets?|forecasting & planning|payroll|job positions?|benefits|worker'?s? comp(ensation)?|federal tax|state tax)\b",
         home=L(None, 'All', 'Periodic Tasks', 'Working Budgets'),
         lists=[L(r"\bpayroll\b", 'All', None, 'Payroll Workbench'),
                L(r"\bworkbench\b", 'All', None, 'Workbench'),
                L(r"\bworker'?s? comp", 'All', None, 'Worker Compensation Class'),
                L(r"\bbenefits\b", 'All', None, 'Benefits'),
                L(r"\bfederal tax\b", 'All', None, 'Federal Tax'),
                L(r"\bstate tax\b", 'All', None, 'State Tax'),
                L(r"\bjob positions?\b", 'All', None, 'Job Positions'),
                L(r"\bworking budget report\b", 'All', None, 'Working Budget Report')]),
    # --- Investor Tracking / Reporting Portal / Dashboards / Time & Resources / Finance Agent / Taxes / Platform
    dict(id='investor', label='Investor / contribution / distribution', app='Investor Tracking', kind='txn',
         match=r"\b(investors?|contributions?|calculate distributions?|bulk distributions?|investor (distributions?|portals?)|owner statements?|capital calls?)\b",
         home=L(None, 'All', 'Search & Find', 'Investor'), daily=L(None, 'All', 'Daily Tasks', 'Contributions'),
         report=L(None, 'All', None, 'Investor Reports'),
         lists=[L(r"\bbulk contributions?\b", 'All', 'Daily Tasks', 'Create Bulk Contributions'),
                L(r"\bbulk distributions?\b", 'All', 'Daily Tasks', 'Create Bulk Distributions'),
                L(r"\bcontributions? register|distributions? register|investors report\b", 'All', None, 'Investor Reports'),
                L(r"\bcontributions?\b", 'All', 'Daily Tasks', 'Contributions'),
                L(r"\bcalculat\w* distributions?\b", 'All', 'Periodic Tasks', 'Calculate Distribution'),
                L(r"\bdistributions?\b", 'All', 'Daily Tasks', 'Distributions'),
                L(r"\binvestor portals?\b", 'All', 'Periodic Tasks', 'Investor Portals'),
                L(r"\bowner statements?\b", 'All', 'Periodic Tasks', 'Owner Statements'),
                L(r"\bupload\w* (reports and )?documents\b", 'All', 'Periodic Tasks', 'Upload Documents'),
                L(r"\bproperty report groups?\b", 'All', 'Reports', 'Property Report Groups')]),
    dict(id='owner_portal', label='Owner portal', app='Reporting Portal', kind='service',
         match=r"\b(owner portals?|reporting portal|portal (users?|documents?|owners?))\b",
         home=L(None, 'All', 'Daily Tasks', 'Owner Portals'),
         lists=[L(r"\b(owners?|contacts?)\b.*\b(search|find|add|edit|password)|\b(add|edit|search)\w* (an )?(owner|contact)\b", 'All', 'Search & Find', 'Owner')]),
    dict(id='dashboard', label='Dashboard', app='Dashboards', kind='output',
         match=r"\b(dashboards?|dashboard components?|smartlinks?|rss)\b", home=L(None, None, None, '[select dashboard]'), lists=[]),
    dict(id='timesheet', label='Timesheet / PTO', app='Time & Resources', kind='txn',
         match=r"\b(timesheets?|pto|paid time off|certifications?|skills|billable time|project types?|employee time)\b",
         home=L(None, 'All', None, 'My Timesheets'), report=L(None, 'All', 'Reports', '=title'),
         lists=[L(r"\bstaff timesheets?\b", 'All', 'Periodic Tasks', 'Staff Timesheets'),
                L(r"\bpto requests?\b|\brequest\w* (paid time off|pto)\b", 'All', 'Daily Tasks', 'PTO Request'),
                L(r"\bpto approvals?|approv\w* (a )?pto\b", 'All', None, 'PTO Approvals'),
                L(r"\b(time|timesheet) approvals?|approv\w* timesheets?\b", 'All', None, 'Time Approvals'),
                L(r"\b(pto|project|certification and skill) types?\b", 'Setup', None, '=noun'),
                L(r"\bbillable time\b(?! report)", 'All', 'Periodic Tasks', 'Billable Time'),
                L(r"\bmy certifications\b|\bcertification or skill to your\b", 'All', None, 'My Certifications and Skills')]),
    dict(id='ai_agent', label='AI Finance Agent', app='Finance Agent', kind='service',
         match=r"\b(finance agent|ai[- ]agent|agent (jobs?|performance|payments?)|lumina|standard vendors?|missing expenses|ai configuration|ai contract screening|monthly job)\b",
         home=L(None, 'All', None, 'Agent Jobs'), setup=L(None, 'Setup', None, 'AI Configuration'),
         report=L(None, 'All', 'Reports', '=title'),
         lists=[L(r"\b(ai configuration|standard vendor types?|ai contract screening|contract screening)\b", 'Setup', None, 'AI Configuration'),
                L(r"\bagent performance\b", 'All', None, 'Agent Performance')]),
    dict(id='vat', label='VAT / tax submission', app='Taxes', kind='txn',
         match=r"\b(vat|value[- ]added tax(es)?|tax submissions?|tax solutions?|tax records?)\b",
         home=L(None, 'All', None, 'Tax Submissions'), report=L(None, 'All', 'Reports', 'Tax Reports'),
         setup=L(None, 'Setup', None, 'Tax Solutions'),
         lists=[L(r"\btax records?\b", 'All', None, 'Tax Records'),
                L(r"\btax solutions?\b", 'Setup', None, 'Tax Solutions')]),
    dict(id='customization', label='Object customization', app='Platform Services', kind='service',
         match=r"\b(object customization|custom (fields?|objects?|relationships?)|smart (events?|rules?|links?)|printed doc(ument)? templates?|platform services|customization services|custom report wizard)\b",
         home=L(None, 'All', None, 'Object Customization'),
         lists=[L(r"\bcustom report", 'All', None, 'Custom Reports'),
                L(r"\bprinted doc", 'All', None, 'Printed Doc Templates')]),
    # --- Cash Management (the bank account and cash itself)
    dict(id='bank_rec', label='Bank reconciliation / bank feed', app='Cash Management', kind='process',
         match=r"\b(bank rec(onciliation)?s?|reconcil(e|es|ing|iation)s?|bank feeds?|bank statements?|matching rules?|reconciliation rules?|quick match|bank transactions?|cleared (checks|items)|outstanding checks?)\b",
         home=L(None, 'All', 'Periodic Tasks', 'Reconciliation'),
         lists=[L(r"\bbank feed configurations?\b", 'Setup', 'More', 'Bank Feed Configurations'),
                L(r"\b(reconciliation|matching) rules?\b", 'Setup', None, 'Reconciliation Rules'),
                L(r"\bbank transactions summary\b", 'All', 'Reports', 'Bank Transactions Summary')]),
    dict(id='funds_transfer', label='Funds transfer / other receipt', app='Cash Management', kind='process',
         match=r"\b(funds? transfers?|transfer(ring)? (funds|cash|money)|between (bank )?accounts|other receipts?|bank interest|charges and fees)\b",
         home=L(None, 'All', 'Periodic Tasks', 'Funds Transfer'),
         lists=[L(r"\bbulk funds", 'All', 'Periodic Tasks', 'Bulk Funds Transfer'),
                L(r"\b(other )?receipts?\b|bank interest", 'All', 'Periodic Tasks', 'Other Receipts'),
                L(r"\bcharges and fees\b", 'All', 'Periodic Tasks', 'Charges and Fees')]),
    dict(id='card', label='Credit card / PC card / petty cash', app='Cash Management', kind='txn',
         match=r"\b(credit cards?|pc cards?|petty cash|debit cards?|charge payoffs?|card (charges|limits?|transactions))\b",
         home=L(None, 'All', 'Search & Find', 'Credit Card'), report=L(None, 'All', 'Reports', '=title'),
         lists=[L(r"\b(pc cards?|petty cash|debit cards?)\b(?! (report|billing|transactions report))", 'All', 'Periodic Tasks', 'Debit Cards for Petty Cash'),
                L(r"\bcharge payoffs?\b", 'All', None, 'Charge Payoffs'),
                L(r"\bcredit card charges and fees\b", 'All', None, 'Credit Card Charges and Fees'),
                L(r"\bcredit card accounts?\b", 'Setup', None, 'Accounts')]),
    dict(id='cash_position', label='Available cash / e-payment files / escheat', app='Cash Management', kind='process',
         match=r"\b(available cash|cash (balances?|visibility|analysis|position)|holdbacks?|escheat(ment)?|unclaimed property|stale[- ]dated|positive pay|payment files?|ach (bank|files?|configurations?)|electronic payment (bank|files?)|electronic payments|bank configurations?|bacs)\b",
         home=L(None, 'All', 'Periodic Tasks', 'Available Cash'), report=L(None, 'All', 'Reports', '=title'),
         lists=[L(r"\bavailable cash location groups?\b", 'All', 'Periodic Tasks', 'Available Cash Location Groups'),
                L(r"\bholdback categor", 'Setup', 'More', 'Holdback Categories'),
                L(r"\bholdbacks?\b", 'All', 'Periodic Tasks', 'Bank Account Holdbacks'),
                L(r"\bach bank configurations?\b", 'Setup', 'More', 'ACH Bank Configurations'),
                L(r"\belectronic payment bank configurations?\b|\bbank configurations?\b", 'Setup', 'More', 'Electronic Payment Bank Configurations'),
                L(r"\bpositive pay configurations?\b", 'Setup', 'More', 'Positive Pay Configuration'),
                L(r"\bpositive pay\b", 'All', None, 'Positive Pay'),
                L(r"\b(ach|payment files?|electronic payments)\b", 'All', None, 'Electronic Payments'),
                L(r"\b(escheat|unclaimed|stale)", 'All', None, 'Escheatment Workbench'),
                L(r"\bcash (balances|visibility|analysis)\b", 'All', 'Reports', '=title')]),
    dict(id='check_setup', label='Check stock / layout (bank-account setting)', app='Cash Management', kind='code',
         match=r"\b(check (layouts?|stock|update|formats?|templates?|alignment|print date|printing)|design custom check|test check|void blank check|checks with a (company )?logo|(ruined|spoiled) check|name or address on printed checks|owner distributions?)\b",
         home=L(None, 'All', 'Search & Find', 'Bank Accounts'),
         lists=[L(r"\b(custom check layouts?|check layouts?|design custom check)\b", 'Setup', 'More', 'Design Custom Check Layouts'),
                L(r"\bcheck (update|templates?)\b", 'Setup', 'More', 'Check Update'),
                L(r"\bowner distributions?\b", 'Setup', 'More', 'Owner Distribution'),
                L(r"\bforeign check formats?\b|\bcheck print date\b", 'Setup', None, 'Configuration')]),
    dict(id='bank_account', label='Bank account', app='Cash Management', kind='master',
         match=r"\b(bank accounts?|operating account|trust account|bai file)\b",
         home=L(None, 'All', 'Search & Find', 'Bank Accounts'),
         lists=[L(r"\b(csv or bai|bai) file\b|\balternate bank accounts\b", 'All', 'Periodic Tasks', 'Reconciliation')]),
    # --- Accounts Receivable (money in, owed by a customer)
    dict(id='ar_setup', label='Sales tax / terms / territories', app='Accounts Receivable', kind='code',
         match=r"\b(sales tax|tax (authorit(y|ies)|schedules?|groups?|codes?)|authorities|territor(y|ies)|shipping methods?|bill ?back templates?|customer (types?|visibility|restrictions?)|a/?r (terms|account labels?)|account label tax groups?)\b",
         home=L(None, 'Setup', None, 'Tax'),
         lists=[L(r"\bterritory groups?\b", 'Setup', 'More', 'Territory Groups'),
                L(r"\bterritor(y|ies)\b", 'Setup', None, 'Territories'),
                L(r"\bshipping methods?\b", 'Setup', 'More', 'Shipping Methods'),
                L(r"\baccount label tax groups?\b", 'Setup', None, 'Account Label Tax Groups'),
                L(r"\baccount labels?\b", 'Setup', None, 'Account Labels'),
                L(r"\bauthorit(y|ies)\b", 'Setup', None, 'Authorities'),
                L(r"\bbill ?back templates?\b", 'Setup', None, 'Bill Back Templates'),
                L(r"\bcustomer (visibility|restrictions?)\b", 'Setup', None, 'Customer Visibility'),
                L(r"\bcustomer types?\b", 'Setup', None, 'Types'),
                L(r"\bterms\b", 'Setup', 'More', 'Terms'),
                L(r"\bsales tax report\b", 'All', 'Reports', 'Sales Tax Report')]),
    dict(id='ar_payment', label='Customer payment / deposit', app='Accounts Receivable', kind='txn',
         match=r"\b(receiv(e|ing) (a )?payments?|enter(ing)? payments?|quick payments?|payment summar(y|ies)|customer payments?|manual deposits?|deposits?|posted payments?|nsf|returned (check|payment)|payment to bank account)\b",
         home=L(None, 'All', 'Search & Find', 'Payments'), daily=L(None, 'All', 'Daily Tasks', 'Enter Payments'),
         report=L(None, 'All', 'Reports', 'Receipts'),
         lists=[L(r"\breceive (a )?payments?\b", 'All', 'Daily Tasks', 'Receive a Payment'),
                L(r"\bmanual deposits?\b", 'All', 'Daily Tasks', 'Manual Deposits'),
                L(r"\bpayment summar", 'All', 'Search & Find', 'Payment Summaries'),
                L(r"\bposted payments?\b", 'All', None, 'Posted Payments'),
                L(r"\b(quick payments|deposits?)\b", 'All', 'Daily Tasks', 'Enter Payments')]),
    dict(id='ar_invoice', label='A/R invoice / billing', app='Accounts Receivable', kind='txn',
         match=r"\b(a/?r (sales )?invoices?|sales invoices?|quick a/?r|bill ?backs?|intercompany bill(ing|s)?|billing|penalt(y|ies)|penalize|late fees?|credit memos?|pex|recurring a/?r|a/?r recurring|recurring transactions?)\b",
         home=L(None, 'All', 'Search & Find', 'A/R Invoices'), daily=L(None, 'All', None, 'A/R Sales Invoices'),
         report=L(None, 'All', 'Reports', 'A/R Invoices Analysis'),
         lists=[L(r"\bquick a/?r\b", 'All', 'Daily Tasks', 'Quick A/R Invoice Entry'),
                L(r"\bintercompany bill(ing)? report\b", 'All', 'Reports', 'Intercompany Billing Report'),
                L(r"\bintercompany bill", 'All', 'Daily Tasks', 'Intercompany Billing'),
                L(r"\bpex\b", 'All', None, 'PEX Import'),
                L(r"\b(penalt|penalize|late fee)", 'All', None, 'Penalties'),
                L(r"\brecurring (a/?r|transactions?)\b.*\breport\b|\brecurring (transaction|report)", 'All', 'Reports', 'Recurring Transaction'),
                L(r"\brecurring\b", 'All', 'Periodic Tasks', 'Recurring A/R Invoices'),
                L(r"\bline items\b|\bbasic information\b", 'All', None, 'A/R Sales Invoices')]),
    dict(id='ar_other', label='A/R adjustment / advance / statement / subledger', app='Accounts Receivable', kind='txn',
         match=r"\b(a/?r (adjustments?|advances?|summar(y|ies)|ledger|aging|books|subledger)|account statements?|final account statements?|customer statements?|print(ing)? statements|statements for customers)\b",
         home=L(None, 'All', 'Daily Tasks', 'Adjustments'), daily=L(None, 'All', 'Daily Tasks', 'Adjustments'),
         lists=[L(r"\badvances?\b", 'All', 'Daily Tasks', 'Advances'),
                L(r"\bclos\w* (the )?a/?r (subledger|summar)|close a/?r subledger\b", 'All', 'Periodic Tasks', 'Close Subledger'),
                L(r"\bopen\w* (the )?a/?r (subledger|summar)|open the a/?r subledger\b", 'All', 'Periodic Tasks', 'Open Subledger'),
                L(r"\bsummar(y|ies)\b", 'All', 'Periodic Tasks', 'Summaries'),
                L(r"\bstatements?\b", 'All', 'Periodic Tasks', 'Account Maintenance'),
                L(r"\ba/?r ledger\b", 'All', 'Reports', 'A/R Ledger')]),
    dict(id='customer', label='Customer / resident', app='Accounts Receivable', kind='master',
         match=r"\b(customers?|residents?|tenants?|lessees?)\b",
         home=L(None, 'All', None, 'Customers'), report=L(None, 'All', 'Reports', 'Customers'),
         lists=[L(r"\bcustomer (aging|listing|list by)\b|\bcustomer a/?r ledger\b", 'All', 'Reports', 'Customers')]),
    # --- Accounts Payable (money out, owed to a payee)
    dict(id='ap_setup', label='A/P terms / types / templates', app='Accounts Payable', kind='code',
         match=r"\b(a/?p (terms|types|account labels?)|vendor (types?|groups?|visibility)|loan types?|contract types?|asset (types?|categor(y|ies))|fee templates?|allocation templates?|schedule payments selection|expense report configuration)\b",
         home=L(None, 'Setup', None, 'Configuration'),
         lists=[L(r"\baccount labels?\b", 'Setup', None, 'Account Labels'),
                L(r"\bcontract types?\b", 'Setup', 'More', 'Contract Type'),
                L(r"\bloan types?\b", 'Setup', 'More', 'Loan Types'),
                L(r"\basset categor", 'Setup', 'More', 'Asset Categories'),
                L(r"\basset types?\b", 'Setup', 'More', 'Asset Types'),
                L(r"\bschedule payments selection\b", 'Setup', 'More', 'Schedule Payments Selection'),
                L(r"\bfee templates?\b", 'Setup', None, 'Fee Template'),
                L(r"\ballocation templates?\b", 'Setup', None, 'Templates'),
                L(r"\bexpense report configuration\b", 'Setup', None, 'Expense Report Configuration'),
                L(r"\bvendor groups?\b", 'Setup', None, 'Groups'),
                L(r"\bvendor visibility\b", 'Setup', None, 'Visibility'),
                L(r"\b(vendor|a/?p) types?\b", 'Setup', None, 'Types'),
                L(r"\ba/?p terms\b", 'Setup', 'More', 'Terms')]),
    dict(id='check', label='Check / vendor payment', app='Accounts Payable', kind='txn',
         match=r"\b(checks?|pay(ing)? (a/?p |the )?(invoices?|bills?|vendors?)|payment requests?|print payment|payment copies|manual payments?|a/?p payments?|vendor payments?|ach payments?|eft|paymode|third party payments?|pay by entity|paying by entity|check run|refund checks?|remittance)\b(?! (budget|of the budget))",
         home=L(None, 'All', 'Search & Find', 'Payments'), daily=L(None, 'All', 'Daily Tasks', 'Pay A/P Invoices'),
         report=L(None, 'All', 'Reports', 'Check Register'),
         lists=[L(r"\bcheck register\b", 'All', 'Reports', 'Check Register'),
                L(r"\b(print payment copies|payment copies|payment notification)", 'All', None, 'Print Payment Copies'),
                L(r"\bcreat\w* payment requests?\b", 'All', 'Daily Tasks', 'Create Payment Requests'),
                L(r"\bpayment requests?\b", 'All', 'Daily Tasks', 'View Payment Requests'),
                L(r"\bpaymode", 'All', None, 'Paymode-X Payments Queue'),
                L(r"\bthird party payments?\b", 'All', 'Daily Tasks', 'Third Party Payments Queue'),
                L(r"\b(pay(ing)? by entity|pay (a/?p )?invoices?|paying (a/?p )?invoices?|pay a/?p)\b", 'All', 'Daily Tasks', 'Pay A/P Invoices'),
                L(r"\bquick check\b|\bchecks list\b", 'All', None, 'Checks'),
                L(r"\b(print\w*|reprint\w*|check run|check number|rejected)\b.*\bchecks?\b|\bchecks?\b.*\b(print|run)\b", 'All', 'Daily Tasks', 'Banking')]),
    dict(id='ap_process', label='Expense report / bid & contract / A/P maintenance', app='Accounts Payable', kind='process',
         match=r"\b(expense reports?|staff expenses|my expenses|bids?|contracts?|loans?|debt maintenance|a/?p summar(y|ies)|account maintenance|a/?p subledger|invoice reclassification|recurring a/?p)\b",
         home=L(None, 'All', 'Periodic Tasks', 'Expense Reports'), report=L(None, 'All', 'Reports', 'A/P Invoices & Registers'),
         lists=[L(r"\b(bids?|contracts?)\b", 'All', 'Periodic Tasks', 'Bids and Contracts'),
                L(r"\b(loans?|debt maintenance)\b", 'All', 'Periodic Tasks', 'Debt Maintenance'),
                L(r"\b(a/?p summar(y|ies)|account maintenance|final account statements?)\b", 'All', 'Periodic Tasks', 'Account Maintenance'),
                L(r"\ba/?p subledger\b", 'All', 'Periodic Tasks', 'Subledger'),
                L(r"\binvoice reclassification\b", 'All', 'Periodic Tasks', 'Invoice Reclassification'),
                L(r"\brecurring\b", 'All', 'Periodic Tasks', 'Recurring AP Invoices')]),
    dict(id='vendor_1099', label='1099 / 1096', app='Accounts Payable', kind='output',
         match=r"\b(1099s?|1096|form 1099)\b",
         home=L(None, 'All', 'Search & Find', 'Vendors'), report=L(None, 'All', 'Reports', '1096/1099'),
         lists=[L(r"\b(1096|1099 report|print\w* 1099|1099s? (forms?|filing|electronic)|e-?fil)", 'All', 'Reports', '1096/1099')]),
    dict(id='vendor', label='Vendor', app='Accounts Payable', kind='master',
         match=r"\b(vendors?|suppliers?|payees?|w-?9)\b",
         home=L(None, 'All', 'Search & Find', 'Vendors'), report=L(None, 'All', 'Reports', 'Vendor Reports'),
         lists=[L(r"\bapprov\w* vendors?\b|\bapprove vendors\b|\bvendor record details during approval\b", 'All', 'Daily Tasks', 'Approve Vendors'),
                L(r"\bvendor requests?\b", 'All', 'Daily Tasks', 'View Vendor Requests'),
                L(r"\bmerg", 'All', None, 'Merge History'),
                L(r"\bvendor insurance\b", 'All', 'Reports', 'Vendor Insurance'),
                L(r"\bvendor (aging|ledger|list report|activity)\b", 'All', 'Reports', 'Vendor Reports')]),
    dict(id='ap_invoice', label='A/P invoice', app='Accounts Payable', kind='txn',
         match=r"\b(a/?p invoices?|invoices?|bills?|utility bills?|ai[- ]invoices?|invoice research|a/?p adjustments?|a/?p advances?|fees?|management fees?|document (queue|dashboard)|scann\w* invoices?)\b",
         home=L(None, 'All', 'Search & Find', 'A/P Invoices'), daily=L(None, 'All', 'Daily Tasks', 'Create an A/P Invoice'),
         report=L(None, 'All', 'Reports', 'A/P Invoices & Registers'),
         lists=[L(r"\b(ai[- ]invoices?|scann\w*|ai invoice queue)\b", 'All', 'Daily Tasks', 'AI-Invoice Queue'),
                L(r"\binvoice research\b", 'All', 'Search & Find', 'Invoice Research'),
                L(r"\bfees?\b", 'All', None, 'Fees'),
                L(r"\bdocument (queue|dashboard)\b", 'All', None, 'Document Dashboard'),
                L(r"\badjustments?\b", 'All', 'Daily Tasks', 'Adjustments'),
                L(r"\badvances?\b", 'All', 'Daily Tasks', 'Advances'),
                L(r"\b(invoice register|a/?p invoice analysis|selected a/?p invoices report|top expense|unit cost)\b", 'All', 'Reports', 'A/P Invoices & Registers')]),
    # --- General Ledger
    dict(id='gl_setup', label='Journal definitions / templates / allocation setup', app='General Ledger', kind='code',
         match=r"\b(journals?(?! entr)|accrual templates?|transaction templates?|allocation definitions?|g/?l allocation definitions?|chart types?|segment rules?|segment rule set|account titles? by entity|account group purposes?|custom (account )?categor(y|ies)|user[- ]defined (books|journals)|bva users|reporting periods?)\b",
         home=L(None, 'Setup', None, 'Journals'),
         lists=[L(r"\bstatistical adjustment journals?\b", 'Setup', None, 'Statistical Adjustment'),
                L(r"\bstatistical journals?\b", 'Setup', None, 'Statistical'),
                L(r"\bgaap adjust", 'Setup', None, 'GAAP Adjustment'),
                L(r"\btax adjust", 'Setup', None, 'Tax Adjustment'),
                L(r"\badjust\w* journals?\b", 'Setup', None, 'Adjustment'),
                L(r"\buser[- ]defined (books|journals)\b", 'Setup', 'More', 'User-Defined Books'),
                L(r"\baccrual templates?\b", 'Setup', None, 'Accrual Template'),
                L(r"\btransaction templates?\b", 'Setup', 'More', 'Transaction Templates'),
                L(r"\ballocation definitions?\b", 'Setup', None, 'G/L Allocation Definitions'),
                L(r"\bchart types?\b", 'Setup', None, 'Chart Types'),
                L(r"\bsegment rule", 'Setup', 'More', 'Segment Rule Set'),
                L(r"\baccount titles? by entity\b", 'Setup', 'More', 'Account Title by Entity'),
                L(r"\baccount group purposes?\b", 'Setup', 'More', 'Account Group Purposes'),
                L(r"\bcustom (account )?categor", 'Setup', 'More', 'Custom Categories'),
                L(r"\bbva users\b", 'Setup', None, 'BVA Users'),
                L(r"\breporting periods?\b", 'Setup', 'More', 'Reporting Periods')]),
    dict(id='period', label='Books / periods', app='General Ledger', kind='process',
         match=r"\b(books?|periods?|year[- ]end|month[- ]end|fiscal year)\b",
         home=L(None, 'All', 'Periodic Tasks', 'Books'),
         lists=[L(r"\banalysis periods?\b|\bbudget variance analysis\b", 'All', 'Periodic Tasks', 'Budget Variance Analysis'),
                L(r"\bworkbench\b", 'All', None, 'Workbench')]),
    dict(id='gl_process', label='Accrual / prepaid / allocation / budget', app='General Ledger', kind='process',
         match=r"\b(accruals?|accrual workbench|prepaids?|prepaid (expenses?|journal)|allocations?|budgets?|budget variance|bva|site view)\b",
         home=L(None, 'All', 'Periodic Tasks', 'Budgets'),
         lists=[L(r"\bbudget variance|\bbva\b", 'All', 'Periodic Tasks', 'Budget Variance Analysis'),
                L(r"\baccrual workbench\b|\bposting and unposting accruals\b", 'All', None, 'Accrual Workbench'),
                L(r"\baccruals?\b", 'All', 'Periodic Tasks', 'Accrual'),
                L(r"\bprepaid", 'All', 'Periodic Tasks', 'Prepaids'),
                L(r"\ballocation log\b|\bprocessed g/?l allocation\b", 'All', None, 'View Allocation Log'),
                L(r"\bgenerat\w* (an? )?(g/?l )?allocations?\b", 'All', None, 'Generate Allocation'),
                L(r"\ballocations?\b", 'Setup', None, 'Allocations'),
                L(r"\bsite view\b", 'All', 'Periodic Tasks', 'Site View')]),
    dict(id='journal_entry', label='Journal entry', app='General Ledger', kind='txn',
         match=r"\b(journal entr(y|ies)|jes?|adjusting (journal )?entr(y|ies)|adjusting journals?|gaap adjust(ing|ment)|tax adjust(ing|ment)|statistical (journal|adjusting)|memorized transactions?|reclass entry)\b",
         home=L(None, 'All', 'Search & Find', 'Journal Entry'),
         lists=[L(r"\brecurring statistical\b", 'All', 'Periodic Tasks', 'Recurring Statistical Journal Entry'),
                L(r"\brecurring\b", 'All', 'Periodic Tasks', 'Recurring Journal Entries'),
                L(r"\b(adjusting|gaap|tax adjust|user[- ]defined)\b", 'All', 'Periodic Tasks', 'Adjusting Entry'),
                L(r"\bstatistical\b", 'All', None, 'Statistical Journal Entry'),
                L(r"\bworkbench\b", 'All', None, 'Workbench')]),
    dict(id='gl_account', label='G/L account / account group', app='General Ledger', kind='master',
         match=r"\b(g/?l accounts?|chart of accounts|account groups?|statistical accounts?|reporting accounts?|account sets?|accounts?)\b",
         home=L(None, 'All', 'Search & Find', 'Accounts'),
         lists=[L(r"\baccount groups?\b", 'All', 'Search & Find', 'Account Groups'),
                L(r"\b(reporting accounts?|account sets?)\b", 'All', 'Search & Find', 'Reporting Accounts'),
                L(r"\bstatistical accounts?\b", 'All', 'Search & Find', 'Statistical Accounts'),
                L(r"\bchart of accounts\b", 'All', None, 'Chart of Accounts'),
                L(r"\baccount balances\b", 'All', 'Reports', 'Financial Analytics')]),
    dict(id='gl_report', label='G/L report / analytics', app='General Ledger', kind='output',
         match=r"\b(trial balance|cash flow|general ledger report|financial analytics|deferred revenue|(location|department|unit|segment|journal) activity|dimension balances|g/?l workbench|general ledger workbench)\b",
         home=L(None, 'All', 'Reports', 'Financial Analytics'),
         lists=[L(r"\bworkbench\b", 'All', None, 'Workbench'),
                L(r"\bdeferred revenue (forecast|details?|revaluation)\b", 'All', 'Reports', '=title'),
                L(r"\bgeneral ledger report\b", 'All', 'Daily Tasks', 'General Ledger Report'),
                L(r"\btrial balance\b", 'All', None, 'Trial Balance')]),
    # --- Reports (the report-building layer shared by every application)
    dict(id='fin_statement', label='Financial statement (report library)', app='Reports', kind='output',
         match=r"\b(income statement|balance sheet|budget comparison|annual budget statement|financial reports library|statement of cash flows)\b",
         home=L(None, 'All', None, 'Financial Reporting'), lists=[]),
    dict(id='report_builder', label='Report writer / report setup', app='Reports', kind='service',
         match=r"\b(financial reports?|report writer|computations?|rows tab|columns tab|format tab|filters tab|report groups?|cover letters?|reports? center|custom reports?|operational reports?|onesite reports?|dimension (groups?|structures?)|dimensions|customer groups?|location groups?|financial graphs?|report (audiences?|types?|schedules?)|stored reports?|memorized reports?|scheduled reports?|storage options)\b",
         home=L(None, 'All', None, 'Reports Center'),
         lists=[L(r"\bdimension groups?\b|\b(customer|location|vendor|department) groups?\b", 'Setup', None, 'Dimension Groups'),
                L(r"\bdimension structures?\b", 'Setup', None, 'Dimension Structures'),
                L(r"\b(report groups?|cover letters?|report types?|report audiences?)\b", 'Setup', 'More', 'Report'),
                L(r"\b(stored reports?|storage options|storing)\b", 'Setup', None, 'My Stored Reports'),
                L(r"\bcustom reports?\b", 'All', None, 'Custom Reports'),
                L(r"\boperational reports?\b", 'All', None, 'Operational Reports'),
                L(r"\bfinancial graphs?\b", 'All', None, 'Financial Graphs'),
                L(r"\bdimensions\b", 'All', None, 'Dimensions'),
                L(r"\b(financial reports?|report writer|computations?|rows tab|columns tab|format tab|filters tab)\b", 'All', None, 'Financial Reporting')]),
    # --- Company (platform services shared by every application)
    dict(id='approval', label='Transaction approval', app='Company', kind='service',
         match=r"\b(approval (workbench|workflows?|polic(y|ies)|configuration|setup wizard|history)|approvals?|approv(e|ing)|declin(e|ing)|delegates?|spend polic(y|ies))\b",
         home=L(None, 'All', None, 'Approvals'),
         lists=[L(r"\bapproval setup wizard\b", 'All', None, 'Approval Setup Wizard')]),
    dict(id='import', label='Data import', app='Company', kind='service',
         match=r"\b(import data|data templates?|import(ing)? (templates?|master lists?|beginning balances|historical|opening balances)|data import wizard|conversion|imports?|importing)\b",
         home=L(None, 'All', None, 'Import Data'),
         lists=[L(r"\bdata import wizard\b", 'All', None, 'Data Import Wizard')]),
    dict(id='user_role', label='User / role / permission / subscription', app='Company', kind='service',
         match=r"\b(users?|roles?|permissions?|passwords?|sign[- ]?in|web services|subscriptions?|subscrib(e|ing)|external authorizations?)\b",
         home=L(None, 'Setup', None, 'Users'),
         lists=[L(r"\broles?\b", 'Setup', None, 'Roles'),
                L(r"\bweb services\b", 'Setup', None, 'Web Services Users'),
                L(r"\bexternal users?\b", 'Setup', None, 'External users'),
                L(r"\bexternal authorizations?\b", 'Setup', None, 'External Authorizations'),
                L(r"\bsubscri", 'Setup', None, 'Subscriptions'),
                L(r"\buser permissions report\b", 'All', None, 'User Permissions Report'),
                L(r"\bgroups?\b", 'Setup', None, 'Groups')]),
    dict(id='entity', label='Entity / location / department', app='Company', kind='service',
         match=r"\b(entit(y|ies)|locations?|departments?|segments?|property transfer|multi[- ]?entity|inter[- ]entity|management reporting codes?)\b",
         home=L(None, 'All', None, 'Entities'),
         lists=[L(r"\blocations?\b", 'All', None, 'Locations'),
                L(r"\bdepartments?\b", 'All', None, 'Departments'),
                L(r"\bsegments?\b", 'All', None, 'Segments'),
                L(r"\bmanagement reporting codes?\b", 'Setup', None, 'Management Reporting Codes'),
                L(r"\binter[- ]entity account mapping\b", 'Setup', None, 'Inter-Entity Account Mapping'),
                L(r"\bmulti[- ]?entity (console|restrictions?)\b", 'Setup', None, 'Subscriptions')]),
    dict(id='company_config', label='Company configuration / storage / contacts', app='Company', kind='service',
         match=r"\b(central configuration|notifications?|email templates?|document numbering|multi[- ]?currency|currenc(y|ies)|attachments?|storage|cloud[- ]storage|kpis?|key performance|close calendar|ledger sentry|service tickets?|terminology|holiday|contacts?|my preferences|company setup wizard|customer utility tool|audit event|access log|company messages|units)\b",
         home=L(None, 'All', None, 'Configuration'),
         lists=[L(r"\bcentral configuration\b", 'All', None, 'Central Configuration'),
                L(r"\bcloud[- ]storage\b", 'All', None, 'Cloud Storage'),
                L(r"\b(storage|attachments?)\b", 'All', None, 'Storage'),
                L(r"\bcontacts?\b", 'All', None, 'Contacts'),
                L(r"\b(multi[- ]?currency|currenc(y|ies))\b", 'All', None, 'Multi-currency'),
                L(r"\bservice tickets?\b", 'All', None, 'Service Tickets'),
                L(r"\bclose calendar\b", 'All', None, 'Close Calendar'),
                L(r"\bemail templates?\b", 'All', None, 'Email Templates'),
                L(r"\bkpis?\b|key performance", 'All', None, 'KPIs Setup'),
                L(r"\bledger sentry\b", 'All', None, 'Ledger Sentry'),
                L(r"\bterminology\b", 'All', None, 'Terminology'),
                L(r"\bdocument numbering\b", 'All', None, 'Document Numbering'),
                L(r"\bunits\b", 'All', None, 'Units'),
                L(r"\bcompany messages\b", 'All', None, 'Company Messages'),
                L(r"\bcustomer utility tool\b", 'Setup', None, 'Customer Utility Tool'),
                L(r"\b(audit event|access log)\b", 'Setup', None, 'History and Reports'),
                L(r"\bcompany setup wizard\b", 'All', None, 'Company Setup Wizard')]),
]
_OBJ_RX = [(o, re.compile(o['match'], re.I)) for o in OBJECTS]
OBJECT_BY_ID = {o['id']: o for o in OBJECTS}
_LIST_RX = {o['id']: [(li, re.compile(li['match'], re.I)) for li in o['lists']] for o in OBJECTS}

# Step 2 signal independent of the object: classifier nouns name setup code lists.
CODE_NOUN = r"\b(types?|terms|categor(y|ies)|class(es)?|templates?|labels?|methods?|purposes|rules?|configurations?)( (list|page|information page))?$"
_CODE_NOUN_RX = re.compile(CODE_NOUN, re.I)
STRONG_CONFIG = r"\b(configur\w*|enabl\w*|disabl\w*|settings?|preferences|turn(ing)? (on|off))\b"
_STRONG_CONFIG_RX = re.compile(STRONG_CONFIG, re.I)

# Tie-breakers applied on top of "the first (most specific) object wins".
TIE_BREAKERS = [
    dict(id='T1', name='The most specific business object wins',
         rule='Match the task against the object list in order (specialty apps, then subledgers, then the General Ledger, then Company/Reports services). The first hit decides the application: a job beats an invoice, an invoice beats an account, any business object beats a platform service.',
         trigger=None, unless=None, force=None),
    dict(id='T2', name='Transaction approvals go to the Approval Workbench',
         rule='Approving, declining or routing a transaction (invoice, payment, PO, journal entry) happens in Company › All › Approvals › Approval Workbench. Approving a non-transaction record (vendor record, bank rec, work paper, expense report, timesheet/PTO) stays in that record\'s own application.',
         trigger=r"\b(approv(e|al|als|ing)|declin(e|ing)|unapproved)\b",
         unless=r"\b(vendors?|reconciliations?|work ?papers?|pto|timesheets?|time approvals?|expense reports?|staff expenses|budget check|virtual refunds?)\b",
         force='approval'),
    dict(id='T3', name='Bulk loads and conversions go to Import Data',
         rule='Loading records from a template (master lists, opening balances, history, open items) happens in Company › All › Import Data. An import button on one working list (a budget, a bank feed/BAI file, a funds-transfer or payment file, staff expenses) stays on that list.',
         trigger=r"\b(import(ing|s)?|data templates?|template/import)\b|\bdata$",
         unless=r"\b(budgets?|bank feeds?|bai|csv or bai|bank statements?|funds transfers?|payments?|expenses|segment rules?|catalog|draws?|draw models?|cost codes?|transaction allocations?|investor data|summary|working budgets?|pex|prepaids?|account groups?|account group members|reporting accounts?)\b",
         force='import'),
    dict(id='T4', name='Money direction decides AP vs AR vs Cash',
         rule='Money leaving to anyone (vendors, resident deposit refunds, owner payouts by check) is an A/P payment. Money arriving against a customer charge is an A/R payment/deposit. Money arriving with no customer charge, or moving between your own bank accounts, is Cash Management (Other Receipts / Funds Transfer).',
         trigger=r"\b(refund(s|ing)?|return(ing)? (the |a )?(security )?deposit|deposit refund|move-?out)\b",
         unless=r"\b(configur|enabl)\w*", force='check'),
    dict(id='T5', name='Groups and structures are reporting setup',
         rule='Customer / location / vendor groups and dimension structures are maintained in Reports › Setup (Dimension Groups / Structures), not in the application that owns the records.',
         trigger=r"\b(customer groups?|location groups?|dimension (groups?|structures?)|report groups?)\b",
         unless=r"\bavailable cash\b", force='report_builder'),
    dict(id='T6', name='Balance-sheet account reports belong to Financial Close',
         rule='A report named after a balance-sheet account (Prepaid Expenses, Accrued Expenses, Notes Payable, A/R - Multifamily, Security Deposits …) is a close work-paper report in Financial Close Management › All › Reports.',
         trigger=None, unless=None, force='bs_rec_report'),
    dict(id='T7', name='"Create X from Y": the Y list hosts the action',
         rule='When a task starts from an existing record ("create a PO from a contract", "an intercompany bill from an A/P invoice", "a journal entry from the workbench"), go to the source record\'s list.',
         trigger=None, unless=None, force=None),
    dict(id='T8', name='Moving money between your own accounts is a funds transfer',
         rule='Moving cash between two of your own bank accounts (operating to reserve, sweep to trust) is Cash Management › Periodic Tasks › Funds Transfer, even when one account is a reserve or escrow account.',
         trigger=r"\btransfer(ring)? (funds|cash|money)\b|\bfunds? transfers?\b", unless=r"\b(entity data|property transfer|asset)\b", force='funds_transfer'),
    dict(id='T9', name='A period-end process beats the document it is about',
         rule='When the verb is a period-end process (accrue, amortize a prepaid, allocate), the General Ledger process list wins over the invoice or bill it concerns: accruals, prepaids and allocations are worked in General Ledger › All › Periodic Tasks.',
         trigger=r"\b(accru(e|es|al|als|ing)|amortiz\w*|allocat(e|ing))\b", unless=r"\b(templates?|agent|finance agent|expense allocations?|allocation (definitions?|templates?|log)|g/?l allocations workflow|accrual activity)\b", force='gl_process'),
]
# Everyday phrasing -> RealPage vocabulary.  Applied to typed scenarios only (screen titles already
# use RealPage's words), before the objects are matched.
SYNONYMS = [
    (r"\b(vendor|supplier|utility) (bill|invoice)s?\b", 'A/P invoice'),
    (r"\bbills?\b", 'A/P invoice'),
    (r"\b(cut|write|issue) (a |the )?checks?\b", 'print checks'),
    (r"\bwire transfers?\b|\bwires?\b", 'manual payment'),
    (r"\b(interest (income|earned)|bank interest|misc(ellaneous)? (income|receipt)|non-customer receipt)\b", 'other receipt'),
    (r"\b(move|moving|sweep|sweeping) (cash|money|funds)\b", 'transfer funds'),
    (r"\b(bank rec|bank recon)\b", 'bank reconciliation'),
    (r"\b(gl entry|journal|je)s?\b(?! entr)", 'journal entry'),
    (r"\breclass(ify|ification)?\b", 'reclass entry'),
    (r"\b(write[- ]?offs?|writing off|bad debt)\b", 'A/R adjustment'),
    (r"\b(late fees?|late charges?)\b", 'penalties'),
    (r"\b(bounced|returned|nsf) (check|payment)s?\b", 'NSF payment'),
    (r"\b(owner|investor) (draw|contribution|capital call)s?\b", 'contribution'),
    (r"\b(capex|capital (project|improvement)s?|renovation|rehab)\b", 'construction job'),
    (r"\b(undo|back out|take back)\b", 'reverse'),
    (r"\b(accrue|accruing)\b", 'accrual'),
    (r"\b(rent|resident) (payment|receipt)s?\b", 'customer payment'),
    (r"\b(prepay|prepaid insurance|prepaid tax(es)?)\b", 'prepaid'),
    (r"\b(month[- ]end close|close the month|period close)\b", 'close the books'),
    (r"\bpo\b", 'purchase order'),
    (r"\b(load|loading|migrat\w*|bring(ing)? (in|over)|convert(ing)?)\b", 'import'),
]
_SYN_RX = [(re.compile(rx, re.I), rep) for rx, rep in SYNONYMS]


def normalize_scenario(text):
    out = text or ''
    for rx, rep in _SYN_RX:
        out = rx.sub(rep, out)
    return out


_TIE_RX = [(t, re.compile(t['trigger'], re.I), re.compile(t['unless'], re.I) if t.get('unless') else None)
           for t in TIE_BREAKERS if t.get('trigger')]
_FROM_RX = re.compile(r"\bfrom (a |an |an existing |the |existing )?(.+)$", re.I)

_VERB_RX = [(stage, action, re.compile(rx, re.I)) for stage, action, rx in VERB_RULES]
_STATE_RX = [(s, re.compile(rx, re.I), hint) for s, rx, hint in STATE_RULES]


def objects_in(text):
    return [o for o, rx in _OBJ_RX if rx.search(text or '')]


def action_of(text):
    for stage, action, rx in _VERB_RX:
        if rx.search(text or ''):
            return stage, action
    return None, None


def state_of(text):
    for s, rx, _ in _STATE_RX:
        if rx.search(text or ''):
            return s
    return None


def pick_object(full, text=None):
    """Step 1: the business object that decides the application, and the tie-breaker that fired.

    Tie-breakers read the full task; objects are matched on `text` (the task without its
    record-state phrases, when it has one)."""
    full = full or ''
    text = full if text is None else text
    for t, rx, unless in _TIE_RX:
        if rx.search(full) and not (unless and unless.search(full)):
            return OBJECT_BY_ID[t['force']], t['id']
    objs = objects_in(text)
    if not objs:
        return None, None
    m = _FROM_RX.search(text)
    if m:
        src = objects_in(m.group(2))
        if src and src[0]['kind'] not in ('service',) and src[0]['app'] != objs[0]['app']:
            return src[0], 'T7'
    first = objs[0]
    if first['id'] == 'bs_rec_report':
        return first, 'T6'
    if len({o['app'] for o in objs}) > 1:
        return first, 'T1'
    return first, None


def _title_submenu(text):
    t = re.sub(r"^(customizing and running|customizing and creating|customizing|running|printing|viewing|using) (the |a )?", '', text, flags=re.I)
    return re.sub(r"\s+(report|chart|graph|list|page)s?(\s+options)?$", '', t, flags=re.I).strip()


def _noun_submenu(text, li):
    m = re.search(li['match'], text, re.I)
    return m.group(0).title() if m else li['submenu']


def strip_states(text):
    """Remove record-state phrases ("posted in a closed period") so they are not read as objects."""
    out = text
    for _, rx, _ in _STATE_RX:
        out = rx.sub(' ', out)
    return re.sub(r'\s+', ' ', out).strip()


def deduce(text, scenario=False):
    """Run the 3-step compass on a screen title, or (scenario=True) on a typed situation.

    Returns {object, app, stage, action, state, tab, section, submenu, rules[]}."""
    text = (text or '').strip()
    state = state_of(text)
    if scenario:
        text = normalize_scenario(text)
    obj, tie = pick_object(text, strip_states(text) if state else text)
    stage, action = action_of(text)
    rules = [tie] if tie else []
    if not obj:
        return OrderedDict([('object', None), ('app', None), ('stage', stage), ('action', action), ('state', state),
                            ('tab', None), ('section', None), ('submenu', None), ('rules', rules)])
    rules.append('A:' + obj['id'])
    landing, why = None, None
    # Step 3 first when the task names one of the object's own lists …
    for i, (li, rx) in enumerate(_LIST_RX[obj['id']]):
        if rx.search(text):
            landing, why = li, 'L:%s:%d' % (obj['id'], i)
            break
    # … but "configure / enable" always means the Setup tab.
    if _STRONG_CONFIG_RX.search(text) and (landing is None or landing['tab'] != 'Setup'):
        landing, why = obj.get('setup') or L(None, 'Setup', None, 'Configuration'), 'S:configure'
    if landing is None:
        # Step 2: tab / section from the verb and the kind of object
        if obj['kind'] == 'code' or _CODE_NOUN_RX.search(text) and obj['kind'] != 'output':
            landing, why = (obj['home'] if obj['kind'] == 'code' else obj.get('setup') or L(None, 'Setup', None, 'Configuration')), 'S:configure'
        elif stage == 'review' and obj.get('report'):
            landing, why = obj['report'], 'S:review'
        elif stage == 'enter' and obj.get('daily') and action in ('create', 'pay', 'receive'):
            landing, why = obj['daily'], 'S:enter'
        else:
            landing, why = obj['home'], 'S:' + STAGE_OF_KIND[obj['kind']]
    rules.append(why)
    tab, section, submenu = landing['tab'], landing['section'], landing['submenu']
    if submenu == '=title':
        submenu = _title_submenu(text) if not scenario else obj['label'] + ' reports'
    elif scenario and submenu is None:
        submenu = obj['label']
    elif submenu == '=noun':
        submenu = _noun_submenu(text, landing)
    # Corrections to paid items: voiding a check is done from the Check Register (A/P › Reports).
    if obj['id'] in ('check', 'ap_invoice') and action == 'void':
        tab, section, submenu = 'All', 'Reports', 'Check Register'
        rules.append('X:void-from-register')
    return OrderedDict([('object', obj['id']), ('app', obj['app']), ('stage', stage_of_location(tab, section) or STAGE_OF_KIND[obj['kind']]),
                        ('action', action), ('state', state), ('tab', tab), ('section', section), ('submenu', submenu),
                        ('rules', rules)])


STAGE_OF_KIND = {'code': 'configure', 'master': 'find_fix', 'txn': 'find_fix', 'process': 'process',
                 'output': 'review', 'service': 'configure'}


def stage_of_location(tab, section):
    if tab == 'Setup':
        return 'configure'
    return {'Daily Tasks': 'enter', 'Search & Find': 'find_fix', 'Periodic Tasks': 'process',
            'Reports': 'review', 'More': 'configure'}.get(section)

# ---------------------------------------------------------------------------
# Exceptions: where the rules above give the wrong answer.
#
# `where` is matched against the screen's real location "App › Tab › Section › Submenu"
# (a dash for a missing level) and `name` (optional) against its title.  A screen whose
# prediction misses and that matches an exception is tagged with it, so the app can show the
# exception instead of the rule when a learner guesses wrong.
# ---------------------------------------------------------------------------

EXCEPTION_GROUPS = OrderedDict([
    ('company', 'Lives in Company, not in its functional application'),
    ('reports', 'Lives in Reports / a reporting layer, not in the application\'s own menu'),
    ('crossapp', 'A workflow that spans applications'),
    ('split', 'One feature, two homes'),
    ('naming', 'A misleading name'),
])

EXCEPTIONS = [
    # --- Company holds it
    dict(id='E01', group='company', title='Transaction approvals and budget checks',
         cue=r"\b(approv\w*|declin\w*|stuck|workflow|available budget|budget check)\b",
         where=r"^Company › All › - › (Approvals|Approval Workbench|Approval Configuration)",
         trap='You look for invoice, payment, PO or journal-entry approvals (and the "available budget" check) inside AP, Spend or GL.',
         why='Approval routing is one engine shared by every transaction type, so it is configured and worked once, in Company.',
         hook='Anything waiting for a signature sits on one desk: Company › Approvals.'),
    dict(id='E02', group='company', title='Bulk imports and opening balances',
         cue=r"\b(import\w*|convert\w*|conversion|go[- ]live|opening balances?|beginning balances?|onboard\w*|new property|acquisition)\b",
         where=r"^Company › (All|Setup) › - › (Import Data|Import data|Data Import Wizard)",
         trap='You look for "import vendors / A/P invoices / journal entries / bank rec items" in the owning application.',
         why='Conversions and go-live loads use one template engine (Import Data) so every file is validated the same way.',
         hook='Moving in? The loading dock is in Company.'),
    dict(id='E03', group='company', title='Central Configuration tabs for AP, AR, Cash and Site View',
         cue=r"\b(central configuration|all entities|company[- ]wide|every property)\b",
         where=r"^Company › All › - › Central Configuration",
         trap='You open Accounts Payable › Setup › Configuration to change payment priority, inline credits or A/R formatting across entities.',
         why='Multi-entity companies set cross-entity defaults once in Company; each application\'s Setup › Configuration holds only its own local switches.',
         hook='Local switch = app Setup; company-wide switch = Central Configuration.'),
    dict(id='E04', group='company', title='App-specific permissions and user flags',
         cue=r"\b(permission\w*|access|role|user)\b",
         where=r"^Company › Setup › - › (Users|Roles|Users/Roles|Groups)",
         trap='You look for "BVA user", chart-type permission or expense-report approver settings in GL or AP.',
         why='A permission is a property of the user, and users live in Company.',
         hook='If it is about a person, it is in Company › Setup › Users/Roles.'),
    dict(id='E05', group='company', title='Subscription switches (vendor restrictions, 1099 by tax ID, multi-entity, full service)',
         cue=r"\b(subscription|enable vendor restrictions|1099 by tax id|multi[- ]entity)\b",
         where=r"^Company › Setup › - › Subscriptions",
         trap='You look for "enable vendor restrictions" or "validate 1099 by tax ID" in AP Setup.',
         why='Features that change how an application is licensed or shared across entities are turned on from the subscription, in Company.',
         hook='Turning a whole feature on? Subscriptions, in Company.'),
    dict(id='E06', group='company', title='Customer Utility Tool (mass inactivate vendors, change default bank G/L)',
         cue=r"\b(mass|bulk) (inactivat\w*|update|change)|\binactive vendors\b|\bstale vendors\b",
         where=r"^Company › Setup › - › Customer Utility Tool",
         trap='You try to inactivate stale vendors or change a bank account\'s G/L from the vendor or bank list.',
         why='Bulk data-maintenance utilities run outside the normal record lists.',
         hook='Mass clean-up = Company utility, not the list.'),
    dict(id='E07', group='company', title='Tax codes and contact tax groups',
         cue=r"\btax codes?\b",
         where=r"^Company › All › - › (Tax Codes|Contact Tax Groups|Settings|Company)",
         name=r"\btax\b",
         trap='You expect tax codes under Accounts Receivable › Setup › Tax.',
         why='Tax codes are shared by A/P, A/R and Spend lines, so the code list is a company setting; A/R Setup keeps the authorities and schedules.',
         hook='Code in Company, authority in A/R.'),
    dict(id='E08', group='company', title='Close Calendar generates close work and posts depreciation',
         cue=r"\b(close calendar|schedule\w* (the )?close|generate checklists?)\b",
         where=r"^Company › All › - › Close Calendar",
         trap='You look for "generate FCM checklists", "open BVA periods" or "post depreciation for fixed assets" in FCM, GL or Fixed Assets.',
         why='The Close Calendar is the company-wide scheduler that triggers period tasks in several applications.',
         hook='Scheduled month-end triggers hang on the Company calendar.'),
    dict(id='E09', group='company', title='Entity record settings (default bank, vendor/customer link, posting date)',
         cue=r"\b(entity|property) (default|settings?|bank)\b|\bdefault bank\b",
         where=r"^Company › All › - › Entities",
         trap='You look for an entity\'s default bank account or its linked vendor/customer in Cash, AP or AR.',
         why='The entity (property) record owns its defaults; applications read them.',
         hook='Property-level defaults live on the entity card.'),
    dict(id='E10', group='company', title='Contract-expiration and other Ledger Sentry alerts',
         cue=r"\b(alert|expir\w*)\b",
         where=r"^Company › All › - › Ledger Sentry",
         trap='You look for contract-expiration alerts under AP › Bids and Contracts.',
         why='Ledger Sentry is the company-wide rules/alert engine.',
         hook='Alerts = Ledger Sentry.'),
    dict(id='E11', group='company', title='AI configuration',
         cue=r"\b(ai|scann\w*|finance agent)\b",
         where=r"^(Company › All › - › AI Configuration|Finance Agent › Setup › - › AI Configuration)",
         trap='You look for AI-invoice scanning or standard vendor types in AP Setup.',
         why='AI features are configured once for the agent that serves several applications.',
         hook='AI knobs: Company › AI Configuration / Finance Agent › Setup.'),
    # --- Reports holds it
    dict(id='E12', group='reports', title='Named financial statements (Income Statement, Balance Sheet, budget comparisons)',
         cue=r"\b(income statement|balance sheet|budget comparison|owner package|financial statements?)\b",
         where=r"^Reports › All › - › (Financial Reporting|Financial Reports)",
         trap='You look for the Income Statement or Annual Budget Statement under General Ledger › Reports.',
         why='Statements are Financial Report Writer layouts, so they live in the report library shared by all applications; GL keeps Trial Balance and analytics.',
         hook='Trial balance in GL; the statements you hand an owner in Reports.'),
    dict(id='E13', group='reports', title='Locations, departments and groups maintained as dimensions',
         cue=r"\b(location groups?|customer groups?|department list|dimension|roll[- ]?up|regional)\b",
         where=r"^Reports › (Setup › - › Dimension [Gg]roups|Setup › - › Dimension Structures|All › - › Dimensions)",
         trap='You look for location groups, customer groups or the department list in Company or AR.',
         why='Grouping exists for reporting roll-ups, so the Reports application owns dimension groups and structures.',
         hook='If it only exists to roll up a report, it is in Reports › Setup.'),
    dict(id='E14', group='reports', title='Stored, scheduled and exported report output',
         cue=r"\b(stored reports?|schedul\w* reports?|email\w* (a |the )?reports?|save (a |the )?reports?)\b",
         where=r"^(Reports › Setup › (-|More) › (My Stored Reports|Report)|Reports › All › - › Reports Center)",
         name=r"\b(stor(e|ing|ed)|schedul|cloud|portal|export|email)",
         trap='You look for where a stored or scheduled report went inside the application that ran it.',
         why='Every application hands output to the same Process & Store service.',
         hook='Output goes to one shelf: My Stored Reports.'),
    dict(id='E15', group='reports', title='OneSite resident reports (rent roll, deposits, resident balances)',
         cue=r"\b(rent roll|resident (ledger|balance)|security deposits? (audit|report)|onesite)\b",
         where=r"^(Reports › All › - › Reports Center|General Ledger › All › Reports › Financial Statements)",
         name=r"\b(rent roll|security deposits?|resident|bank deposit|lost rent|units? report|onesite)",
         trap='You look for the rent roll or resident deposit audit in Accounts Receivable.',
         why='Resident ledgers live in OneSite (property management); Financial Suite only reports them through Reports Center › OneSite Reports.',
         hook='Residents are OneSite\'s; you only read them in Reports Center.'),
    dict(id='E16', group='reports', title='Custom report builder in Platform Services (incl. Positive Pay files)',
         cue=r"\b(custom reports?|positive pay (file|report))\b",
         where=r"^(Platform Services › All › - › Custom Reports|Reports › All › - › (Operational Reports|Custom Reports))",
         trap='You look for the Custom Report Wizard or the Positive Pay report under Reports or Cash Management.',
         why='Custom reports are built on the customization platform, so the wizard lives with object customization.',
         hook='Build-your-own report = Platform Services.'),
    dict(id='E17', group='naming', title='"Document Dashboard" is AP\'s scanning queue',
         cue=r"\bdocument (queue|dashboard)\b",
         where=r"^Accounts Payable › All › - › Document Dashboard",
         trap='The name sends you to the Dashboards application.',
         why='It is the inbox of scanned invoice documents before they become A/P invoices.',
         hook='Documents waiting to become invoices = AP.'),
    # --- Cross-application workflows
    dict(id='E18', group='crossapp', title='Customer refunds start in AR, are paid through AP',
         cue=r"\b(refund\w*|move[- ]?out|deposit refund|credit balance)\b",
         where=r"^(Accounts Receivable › All › (Daily Tasks › Receive a Payment|Search & Find › Payments)|Accounts Payable › All › (Search & Find › Payments|Daily Tasks › Third Party Payments Queue|- › Third Party Payments Queue))",
         name=r"\b(refund|credit to an invoice|writing off|reversing a paid invoice|applying)",
         trap='A resident/customer refund: AR or AP?',
         why='The credit balance is cleared on the customer (AR › Receive a Payment › Refunding a Customer); the cash leaves as an A/P payment (check, virtual refund or third-party queue).',
         hook='Decide it in AR, pay it in AP.'),
    dict(id='E19', group='crossapp', title='Bank reconciliation: Cash does it, FCM files it, Finance Agent can pre-approve it',
         cue=r"\b(bank rec\w*|reconcil\w*)\b",
         where=r"^(Finance Agent › All › - › Cash Management|Financial Close Management › All › Reports › Cash)",
         trap='You look for the bank rec in General Ledger, or for the AI\'s pending recs in Cash Management.',
         why='Matching and approval happen in Cash › Periodic Tasks › Reconciliation; the close work paper (Cash & Cash Equivalents) is an FCM report; AI-prepared recs queue in Finance Agent.',
         hook='Match in Cash, file in FCM, let the Agent queue.'),
    dict(id='E20', group='crossapp', title='Capital projects: PO/contract → A/P invoice → job draw → fixed asset',
         cue=r"\b(retainage|construction|capital|capex|draw|subcontract\w*|renovation|job)\b",
         where=r"^(Job Cost & Reserves › All › (Search & Find › Subcontracts|Periodic Tasks › Budgets)|Accounts Payable › All › - › (Subcontracts|Purchase Orders|Assets)|Accounts Payable › All › Periodic Tasks › Assets)",
         trap='A construction invoice with retainage: Spend, AP or Job Cost?',
         why='The commitment starts in Spend/AP Bids and Contracts, the invoice is an A/P invoice coded to a job and cost code, draws and retainage are tracked in Job Cost, and the finished asset is created from AP then activated in Fixed Assets.',
         hook='Commit in Spend, bill in AP, draw in Job Cost, capitalize in Fixed Assets.'),
    dict(id='E21', group='crossapp', title='Contracts are an AP periodic task; POs made from them are too',
         cue=r"\b(contract|bid)s?\b",
         where=r"^Accounts Payable › All › Periodic Tasks › Bids and Contracts",
         trap='"Create a PO / subcontract / service contract from a contract" sends you to Spend Management.',
         why='Bids and Contracts is the A/P contract register; the PO it spawns then lives in Spend.',
         hook='The contract is AP\'s; the PO it spawns is Spend\'s.'),
    dict(id='E22', group='crossapp', title='Check stock, alignment and ACH set-up help sit in AP Banking',
         cue=r"\b(check stock|alignment|printer|signature)\b",
         where=r"^Accounts Payable › All › Daily Tasks › Banking",
         name=r"\b(stock|alignment|electronic payments|ach|signature|printer)",
         trap='Bank-facing check settings sound like Cash Management.',
         why='AP Banking is where checks are printed, so the printing prerequisites are documented there; the bank\'s check layout itself is Cash › Setup › More.',
         hook='Printing problems: AP Banking. Layout design: Cash Setup.'),
    dict(id='E23', group='crossapp', title='Vendor e-payment enrollment is on the vendor, not in Cash',
         cue=r"\b(ach|eft|electronic payments?|direct deposit) (for|to) (a |the )?vendors?\b|\bvendor (ach|eft|bank details)\b",
         where=r"^Accounts Payable › All › Search & Find › Vendors",
         name=r"\b(electronic payments?|ach|eft)\b",
         trap='"Set up vendors for ACH" sounds like a bank configuration.',
         why='The remittance method and bank details are fields on the vendor record; Cash only holds your side of the file.',
         hook='Their bank details = vendor record; your bank file = Cash.'),
    # --- One feature, two homes
    dict(id='E24', group='split', title='Four kinds of budget',
         cue=r"\bbudgets?\b",
         where=r"^(Forecasting & Planning › All › (- › Budgets|Periodic Tasks › Working Budgets)|Job Cost & Reserves › All › (Periodic Tasks › Budgets|Search & Find › Jobs))",
         name=r"\bbudget",
         trap='Every "budget" task goes to General Ledger › Budgets.',
         why='GL holds the posted operating budget and BVA; Forecasting & Planning builds working budgets before publishing; Job Cost holds job and change-order budgets; Company approvals check available budget.',
         hook='Operating = GL, draft = F&P, capital = Job Cost, spending check = Company.'),
    dict(id='E25', group='split', title='Opening and closing books from FCM Console',
         cue=r"\b(open|close|reopen) (the )?books\b",
         where=r"^Financial Close Management › All › - › Console",
         name=r"\b(open|close) books\b",
         trap='Books open/close is a GL month-end task.',
         why='It is (GL › Periodic Tasks › Month End › Books), but FCM\'s Console exposes the same Open/Close Books boxes for the close team.',
         hook='Same switch, two panels: GL Month End and FCM Console.'),
    dict(id='E26', group='split', title='Account labels are kept per subledger',
         cue=r"\baccount labels?\b",
         where=r"^(Accounts Receivable|Accounts Payable) › Setup › - › Account Labels",
         trap='Labels map to G/L accounts, so you look in General Ledger.',
         why='A label is the subledger\'s friendly name for a G/L account; each subledger keeps its own label list.',
         hook='Labels belong to the subledger that uses them.'),
    dict(id='E27', group='split', title='Customer types exist in AR and in Cash Management',
         cue=r"\bcustomer types?\b",
         where=r"^Cash Management › All › - › Customer Management",
         trap='Customer types must be an A/R setup code.',
         why='Cash Management keeps its own customers and types for credit-card and PC-card billing.',
         hook='Card-program customers belong to Cash.'),
    dict(id='E28', group='split', title='Job positions are payroll planning, not Job Cost',
         cue=r"\bjob positions?\b",
         where=r"^(Forecasting & Planning › All › - › Job Positions|Time & Resources › All › Periodic Tasks › Job Positions)",
         trap='"Job" sends you to Job Cost & Reserves.',
         why='A job position is an HR/payroll object (Forecasting & Planning payroll, Time & Resources staffing).',
         hook='A job *position* is a person\'s role, not a construction job.'),
    dict(id='E29', group='naming', title='"Agent Jobs" and "Agent Accruals" belong to the Finance Agent',
         cue=r"\bagent\b",
         where=r"^Finance Agent › All › - › (Agent Jobs|Accounts Payable)",
         trap='"Job" or "accrual" sends you to Job Cost or GL.',
         why='These are the AI agent\'s scheduled work and proposed accruals, reviewed before anything posts.',
         hook='Agent-prefixed = Finance Agent.'),
    dict(id='E30', group='naming', title='A/R keeps an "Invoices" list without the A/R prefix',
         cue=r"\b(a/?r|customer|sales) invoices?\b",
         where=r"^Accounts Receivable › All › (- › (Invoices|A/R Sales Invoices)|Reports › A/R Invoices Analysis|Search & Find › Payments)",
         trap='A bare "invoice" defaults to A/P.',
         why='Inside the A/R menu the sales-invoice list is simply called Invoices.',
         hook='Check which menu you are in before trusting a bare "invoice".'),
    dict(id='E31', group='naming', title='"Posted Payments" and payment requests are A/P',
         cue=r"\bposted payments?\b|\bpayment requests?\b",
         where=r"^Accounts Payable › All › Search & Find › Payments",
         name=r"\b(posted payments?|payment requests?|notification)",
         trap='"Posted payment" sounds like cash received in A/R.',
         why='Posted Payments is the list of A/P disbursements after the check run.',
         hook='A/P posts payments out; A/R enters payments in.'),
    dict(id='E32', group='split', title='Spend Management setup reaches into GL and AP',
         cue=r"\b(catalog|site view)\b",
         where=r"^Spend Management › Setup › - › Configuration",
         trap='Mapping G/L accounts to catalog categories or the Site View A/P close calendar sounds like GL or AP setup.',
         why='Both only matter to purchasing, so Spend owns them.',
         hook='Only purchasing cares? Spend Setup.'),
    dict(id='E33', group='split', title='Multi-currency switches are in GL and AR configuration',
         cue=r"\b(currenc\w*|foreign)\b",
         where=r"^(General Ledger|Accounts Receivable) › Setup › - › Configuration",
         name=r"\b(currenc|multi-currency|segments?|foreign)",
         trap='Currency and segment settings sound like Company-wide options.',
         why='Company defines currencies; GL (Accounting Settings) and AR decide how they post and revalue.',
         hook='Define in Company, post-behaviour in GL/AR Setup.'),
    dict(id='E34', group='naming', title='Voiding a check is done from the Check Register',
         cue=r"\bvoid\w*\b",
         where=r"^Accounts Payable › All › Reports › Check Register",
         name=r"\bvoid",
         trap='A register is a report, so you do not expect an action there.',
         why='The Check Register lists every issued payment, so it carries the Void action; voiding restores the invoices to open.',
         hook='Void where the checks are listed: the Check Register.'),
]
_EXC_RX = [(e, re.compile(e['where']), re.compile(e['name'], re.I) if e.get('name') else None) for e in EXCEPTIONS]


def location_string(loc):
    return ' › '.join([loc['app'] or '-', loc['tab'] or '-', loc['section'] or '-', loc['submenu'] or '-'])


def exception_for(name, loc):
    where = location_string(loc)
    for e, wrx, nrx in _EXC_RX:
        if wrx.search(where) and (nrx is None or nrx.search(name or '')):
            return e['id']
    return None


# ---------------------------------------------------------------------------
# 3. Screen tags
# ---------------------------------------------------------------------------

def tag_screen(scr, index):
    """The `compass` block the build writes onto every screen.

    app/tab/section/submenu are the screen's real (normalized) location; stage is the lifecycle
    stage that location stands for; object/action/state are read from the title by the rules;
    fit says how well the rules predict this screen and exc names the exception that explains a miss."""
    loc = index.locate(scr['navigation'])
    topic = topic_kind(scr['name'])
    on_menu = bool(loc['app']) and loc['tabSource'] in ('menu', 'implied')
    pred = deduce(scr['name'])
    r = score_screen(scr, index)
    fit = r['fit'] if r else None
    if on_menu and loc['tab'] == 'All' and not loc['section']:
        # Applications without home-page sections: the verb says the stage; a bare list is Find & fix.
        verb_stage = action_of(scr['name'])[0]
        stage = verb_stage or 'find_fix'
    elif on_menu:
        stage = stage_of_location(loc['tab'], loc['section'])
    else:
        stage = None if topic else pred['stage']
    tag = OrderedDict([
        ('app', loc['app']),
        ('tab', loc['tab'] if on_menu else None),
        ('section', loc['section'] if on_menu else None),
        ('submenu', loc['submenu'] if on_menu else None),
        ('pathKind', 'topic' if topic else ('menu' if on_menu else ('chapter' if loc['app'] else 'none'))),
        ('stage', stage),
        ('object', pred['object']),
        ('action', pred['action']),
        ('state', pred['state']),
        ('fit', fit),
        ('exc', exception_for(scr['name'], loc) if fit in ('miss', 'app', 'location') else None),
        ('topicKind', topic),
    ])
    # Absent key = null; keeps ~7,100 tags small in the module files.
    return OrderedDict((k, v) for k, v in tag.items() if v is not None)


# ---------------------------------------------------------------------------
# 4. Scoring
# ---------------------------------------------------------------------------

def submenu_match(pred, actual):
    if not pred or not actual:
        return False
    a, p = canon(actual), canon(pred)
    if a == p or a.startswith(p) or p.startswith(a):
        return True
    aw, pw = set(re.findall(r'[a-z0-9]+', a)), set(re.findall(r'[a-z0-9]+', p))
    return bool(aw and pw) and len(aw & pw) / len(aw | pw) >= 0.5


def score_screen(scr, index):
    """Compare the compass prediction for one screen title with its real path.

    Returns None when the screen is not scorable (topic, no application, out of scope), else a dict
    with the location, the prediction and fit = exact | location | app | miss | unmatched."""
    if topic_kind(scr['name']):
        return None
    loc = index.locate(scr['navigation'])
    if not loc['app'] or loc['app'] in OUT_OF_SCOPE_APPS:
        return None
    pred = deduce(scr['name'])
    on_menu = loc['tabSource'] in ('menu', 'implied')
    r = dict(loc=loc, pred=pred, onMenu=on_menu)
    if not pred['app']:
        r['fit'] = 'unmatched'
    elif pred['app'] != loc['app']:
        r['fit'] = 'miss'
    elif not on_menu:
        r['fit'] = 'app'
    else:
        tab_ok = pred['tab'] == loc['tab']
        sec_ok = tab_ok and (pred['section'] == loc['section'] or not loc['section'])
        sub_ok = tab_ok and submenu_match(pred['submenu'], loc['submenu'])
        r.update(tabOk=tab_ok, sectionOk=sec_ok, submenuOk=sub_ok)
        r['fit'] = 'exact' if sub_ok else ('location' if tab_ok else 'app')
    return r


def evaluate(screens):
    """Score every rule against the screens' real paths.  `screens` = [{name, navigation}]."""
    index = PathIndex([s['navigation'] for s in screens])
    st = dict(total=len(screens), topics=Counter(), noApp=0, outOfScope=0, chapter=Counter(), menu=Counter())
    per_app, per_obj, per_rule = defaultdict(Counter), defaultdict(Counter), defaultdict(Counter)
    clusters = defaultdict(list)
    excs = defaultdict(lambda: dict(n=0, paths=Counter()))
    variants = defaultdict(Counter)
    for s in screens:
        loc = index.locate(s['navigation'])
        if loc['app']:
            variants[loc['app']][loc['rawApp']] += 1
        tk = topic_kind(s['name'])
        if tk:
            st['topics'][tk] += 1
            continue
        if not loc['app']:
            st['noApp'] += 1
            continue
        if loc['app'] in OUT_OF_SCOPE_APPS:
            st['outOfScope'] += 1
            continue
        r = score_screen(s, index)
        bucket = st['menu'] if r['onMenu'] else st['chapter']
        bucket['n'] += 1
        if r['fit'] == 'unmatched':
            bucket['unmatched'] += 1
            continue
        bucket['fired'] += 1
        app_ok = r['fit'] != 'miss'
        bucket['app'] += app_ok
        if not r['onMenu']:
            continue
        pred = r['pred']
        a = per_app[loc['app']]
        a['n'] += 1
        a['app'] += app_ok
        o = per_obj[pred['object']]
        o['n'] += 1
        o['app'] += app_ok
        for rid in pred['rules']:
            per_rule[rid]['n'] += 1
            per_rule[rid]['app'] += app_ok
        if r['fit'] in ('miss', 'app', 'location'):
            eid = exception_for(s['name'], loc)
            if eid:
                excs[eid]['n'] += 1
                excs[eid]['paths'][' › '.join([loc['app']] + loc['tokens'][:4]) + ' ‖ ' + s['name']] += 1
        if not app_ok:
            key = (pred['app'], loc['app'], loc['tab'] or '-', loc['section'] or '-', loc['submenu'] or '-')
            clusters[key].append(s['name'])
            continue
        for c in (bucket, a, o):
            c['tab'] += r['tabOk']
            c['sub'] += r['submenuOk']
        stage = stage_of_location(loc['tab'], loc['section'])
        if stage and loc['section'] != 'More':
            sr = per_rule['stage:' + stage]
            sr['n'] += 1
            sr['app'] += r['sectionOk']
            bucket['secN'] += 1
            bucket['sec'] += r['sectionOk']
        for rid in pred['rules']:
            per_rule[rid]['loc'] += r['submenuOk']
    return dict(stats=st, apps=per_app, objects=per_obj, rules=per_rule, clusters=clusters, exceptions=excs,
                labelVariants=variants, index=index)


def load_screens_from_modules():
    out = []
    mod_dir = os.path.join(ROOT, 'src', 'data', 'modules')
    for f in sorted(os.listdir(mod_dir)):
        if not f.endswith('.js'):
            continue
        with open(os.path.join(mod_dir, f), encoding='utf-8') as fh:
            src = fh.read()
        body = src[src.index('export const'):]
        body = body[body.index('=') + 1:].strip().rstrip(';')
        m = json.loads(body)
        for sm in m['submodules']:
            for s in sm['screens']:
                out.append(dict(id=s['id'], name=s['name'], navigation=s['navigation'], moduleId=m['id']))
    return out


def pct(a, b):
    return round(100.0 * a / b, 1) if b else 0.0


def report(ev):
    st = ev['stats']
    m, ch = st['menu'], st['chapter']

    def row(c):
        return OrderedDict([('support', c['n']), ('appPrecision', pct(c['app'], c['n'])),
                            ('tabPrecision', pct(c['tab'], c['app'])), ('submenuPrecision', pct(c['sub'], c['app']))])

    clusters = sorted(ev['clusters'].items(), key=lambda kv: -len(kv[1]))
    return OrderedDict([
        ('screens', st['total']),
        ('excluded', OrderedDict([
            ('topics', OrderedDict(sorted(st['topics'].items(), key=lambda x: -x[1]))),
            ('topicsTotal', sum(st['topics'].values())),
            ('noApplication', st['noApp']),
            ('outOfScope', st['outOfScope']),
        ])),
        ('menuPaths', OrderedDict([
            ('screens', m['n']), ('ruleCoverage', pct(m['fired'], m['n'])),
            ('appPrecision', pct(m['app'], m['fired'])),
            ('tabPrecisionGivenApp', pct(m['tab'], m['app'])),
            ('sectionPrecisionGivenApp', pct(m['sec'], m['secN'])),
            ('submenuPrecisionGivenApp', pct(m['sub'], m['app'])),
            ('endToEnd', pct(m['sub'], m['fired'])),
        ])),
        ('chapterPaths', OrderedDict([
            ('screens', ch['n']), ('ruleCoverage', pct(ch['fired'], ch['n'])), ('appPrecision', pct(ch['app'], ch['fired'])),
        ])),
        ('byApplication', OrderedDict((k, row(v)) for k, v in sorted(ev['apps'].items(), key=lambda kv: -kv[1]['n']))),
        ('rules', OrderedDict((k, OrderedDict([('support', v['n']), ('precision', pct(v['app'], v['n']))]))
                              for k, v in sorted(ev['rules'].items()))),
        ('objects', OrderedDict((o['id'], row(ev['objects'][o['id']])) for o in OBJECTS if o['id'] in ev['objects'])),
        ('exceptions', OrderedDict((e['id'], OrderedDict([('title', e['title']), ('group', e['group']),
                                                           ('screensExplained', ev['exceptions'][e['id']]['n'] if e['id'] in ev['exceptions'] else 0),
                                                           ('examples', [p for p, _ in ev['exceptions'][e['id']]['paths'].most_common(3)] if e['id'] in ev['exceptions'] else [])]))
                                   for e in EXCEPTIONS)),
        ('missClusters', [OrderedDict([('predicted', k[0]), ('actual', ' › '.join(k[1:])), ('count', len(v)),
                                       ('examples', sorted(set(v))[:4])]) for k, v in clusters[:80]]),
        ('labelVariants', OrderedDict((k, dict(v)) for k, v in sorted(ev['labelVariants'].items()) if len(v) > 1)),
    ])


def rules_json():
    """Everything the in-app matcher (src/utils/compassEngine.js) needs, for src/data/compassRules.json."""
    return OrderedDict([
        ('version', 1),
        ('stages', STAGES),
        ('verbs', [OrderedDict([('stage', st), ('action', a), ('match', rx)]) for st, a, rx in VERB_RULES]),
        ('states', [OrderedDict([('state', st), ('match', rx), ('hint', h)]) for st, rx, h in STATE_RULES]),
        ('objects', OBJECTS),
        ('tieBreakers', TIE_BREAKERS),
        ('outOfScopeApps', sorted(OUT_OF_SCOPE_APPS)),
        ('stageOfKind', STAGE_OF_KIND),
        ('stageOfSection', OrderedDict([('Daily Tasks', 'enter'), ('Search & Find', 'find_fix'), ('Periodic Tasks', 'process'),
                                        ('Reports', 'review'), ('More', 'configure')])),
        ('fromClause', _FROM_RX.pattern),
        ('synonyms', [OrderedDict([('match', rx), ('replace', rep)]) for rx, rep in SYNONYMS]),
        ('codeNoun', CODE_NOUN),
        ('strongConfig', STRONG_CONFIG),
        ('exceptionGroups', EXCEPTION_GROUPS),
        ('exceptions', EXCEPTIONS),
    ])


def main():
    rep = report(evaluate(load_screens_from_modules()))
    if '--json' in sys.argv:
        print(json.dumps(rep, indent=1, ensure_ascii=False))
        return
    for k in ('screens', 'excluded', 'menuPaths', 'chapterPaths'):
        print(f"{k}: {json.dumps(rep[k])}")
    print('\napplication                     n    app%   tab%   sub%')
    for k, v in rep['byApplication'].items():
        print(f"{k[:30]:30} {v['support']:5} {v['appPrecision']:6} {v['tabPrecision']:6} {v['submenuPrecision']:6}")
    print('\nrules (support, precision; stage:* = section precision, others = app precision)')
    for k, v in rep['rules'].items():
        if not k.startswith(('A:', 'L:')):
            print(f"  {k:24} {v['support']:5} {v['precision']:6}")
    print('\nexceptions')
    for k, v in rep['exceptions'].items():
        print(f"  {k} {v['screensExplained']:4}  {v['title']}")
    if '--misses' in sys.argv:
        for c in rep['missClusters']:
            print(f"{c['count']:4}  {c['predicted']} -> {c['actual']}  {c['examples'][:3]}")


if __name__ == '__main__':
    main()
