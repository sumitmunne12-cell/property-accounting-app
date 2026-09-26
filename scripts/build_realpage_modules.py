#!/usr/bin/env python3
"""
Build src/data/modules/0N_*.js from manuals_markdown/0N_*.md.

Every bookmark heading of every RealPage manual (the *_checklist.json items)
is accounted for: it becomes a screen, is merged into its parent screen
(Fields / Buttons / Before You Begin / How to Get Here / What's Next pages),
is represented by a submodule (chapter containers), is recorded as a duplicate
of an identical topic in another manual of the same module, or is a glossary
definition.  scripts/output/coverage_report.json lists the outcome per item.

Usage:  python3 scripts/build_realpage_modules.py
"""

import hashlib
import json
import os
import re
import sys
from collections import Counter, OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import rp_parse as P  # noqa: E402
import rp_kb as K     # noqa: E402
import rp_glossary as G  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD_DIR = os.path.join(ROOT, 'manuals_markdown')
OUT_DIR = os.path.join(ROOT, 'src', 'data', 'modules')
REPORT_DIR = os.path.join(ROOT, 'scripts', 'output')
CURATED_PATH = os.path.join(ROOT, 'scripts', 'curated_screens.json')

MODULES = [
    dict(file='01_general_ledger', export='glModule', code='gl', id='gl', title='General Ledger (GL)', shortCode='GL',
         icon='book-outline', color='#818CF8', area='General Ledger',
         description='Complete RealPage General Ledger: G/L workbench, accounting methods, chart of accounts, statistical accounts, account groups, journals and journal entries (standard, adjusting, GAAP, tax, user-defined books, statistical), recurring entries, JE approvals, prepaids, accruals, books open/close, budgets and BVA, allocations, GL setup, GL/financial reports, management fees and the full data-import reference.'),
    dict(file='02_accounts_payable', export='apModule', code='ap', id='ap', title='Accounts Payable (AP)', shortCode='AP',
         icon='receipt-outline', color='#38BDF8', area='Accounts Payable',
         description='Complete RealPage Accounts Payable and Spend: approval workbench, vendors, A/P invoices and invoice research, payments (checks, ACH/EFT, manual, partial), adjustments and advances, periodic tasks (reclasses, subledger close, fees, recurring invoices, expense reports, assets, bids/contracts, Full Service, scanning), A/P setup, A/P reports and charts, Spend Management (POs, contracts, catalogs), AI Finance Agent and the Approval Policy Manager.'),
    dict(file='03_cash_management', export='cashModule', code='cash', id='cash', title='Cash Management', shortCode='Cash',
         icon='wallet-outline', color='#10B981', area='Cash Management',
         description='Complete RealPage Cash Management: bank accounts, bank feeds and matching rules, bank reconciliations, deposits and undeposited funds, other receipts, bank transfers and owner distributions, credit card and PC card programs, petty cash, available cash, escheatment, Positive Pay and electronic payment (ACH) configuration, plus cash reports.'),
    dict(file='04_accounts_receivable', export='arModule', code='ar', id='ar', title='Accounts Receivable (AR)', shortCode='AR',
         icon='cash-outline', color='#F472B6', area='Accounts Receivable',
         description='Complete RealPage Accounts Receivable: customers, billing (A/R invoices, recurring and quick entry, intercompany bill-backs), payments and deposits, adjustments, subledger close, account maintenance, PEX import, A/R setup (terms, taxes, territories, templates) and all A/R reports and charts.'),
    dict(file='05_financial_close', export='closeModule', code='close', id='close', title='Financial Close Management', shortCode='Close',
         icon='lock-closed-outline', color='#F59E0B', area='Financial Close Management',
         description='Complete RealPage Financial Close Management: close checklists and monthly checklists, task generation, workbench and console, work-paper configurations and packages (generate, upload, submit, approve/decline, regenerate) and close reports.'),
    dict(file='06_jobcost_capex_reserves', export='jobcostModule', code='jobcost', id='job_cost', title='Job Cost, CapEx & Replacement Reserves', shortCode='Capex',
         icon='construct-outline', color='#FB923C', area='Job Cost & Reserves',
         description='Complete RealPage Job Cost & Reserves and Replacement Reserves: jobs, cost codes, job budgets and budget change orders, commitments and contracts, permits, draw models and funding sources, draws and draw receipts, reserve accounts and schedules, and job cost/reserve reports.'),
    dict(file='07_fixed_assets', export='fixedAssetsModule', code='fixed_assets', id='fixed_assets', title='Fixed Assets', shortCode='Assets',
         icon='business-outline', color='#A78BFA', area='Fixed Assets',
         description='Complete RealPage Fixed Assets: asset classes and books, adding/importing/activating assets, transfers and reclasses, disposals, depreciation batches and posting, and asset information/reconciliation reports.'),
    dict(file='08_budgeting_forecasting', export='budgetingModule', code='budgeting', id='budgeting', title='Budgeting & Forecasting', shortCode='Budget',
         icon='layers-outline', color='#6366F1', area='Forecasting & Planning',
         description='Complete RealPage Forecasting & Planning: workbench, working budgets, budget import/export, spreadsheet entry, payroll planning (positions, employees, taxes, benefits, workers comp), publishing, comparisons with actuals and budget reports.'),
    dict(file='09_reporting_admin', export='reportingAdminModule', code='reporting', id='reporting', title='Reporting & Administration', shortCode='Reports',
         icon='bar-chart-outline', color='#22D3EE', area='Reports',
         description='Complete RealPage reporting and administration: Accounting Reports and Report Center, Financial Report Writer, Custom Report Wizard, Reporting Portal, Dashboards, Investor Tracking, Financial Suite basics, Company application (entities, users, roles, permissions, configuration), Service Provider setup, Time & Resources, Value Added Tax, Platform (Customization) Services and the Mobile App.'),
]

MERGE_KINDS = [
    ('fields', re.compile(r"^(fields|buttons|fields (&|and) buttons|fields and buttons|buttons and fields|columns|fields \(.*\)|buttons \(.*\))$", re.I)),
    ('byb', re.compile(r"^before you begin", re.I)),
    ('howto', re.compile(r"^how to get here", re.I)),
    ('next', re.compile(r"^what'?s next", re.I)),
]
GLOSSARY_RX = re.compile(r"^glossary", re.I)
SKIP_CONTAINER_RX = re.compile(r"^qs header$", re.I)
BOILERPLATE_PROC_RX = re.compile(r"attach|scan", re.I)

# ---------------------------------------------------------------------------


def slug(s, n=60):
    s = s.lower().replace('&', ' and ').replace('/', ' ')
    s = re.sub(r"[’']", '', s)
    s = re.sub(r'[^a-z0-9]+', '_', s).strip('_')
    return s[:n].strip('_')


def manual_short(name):
    s = name.replace('.pdf', '')
    s = re.sub(r'^RP (Accounting|Financial Suite) ', '', s)
    s = s.replace(' User Guide', ' Guide')
    return s.strip()


def merge_kind(title):
    for k, rx in MERGE_KINDS:
        if rx.search(title.strip()):
            return k
    return None


def in_glossary(node):
    n = node
    while n is not None:
        if GLOSSARY_RX.search(n.title):
            return True
        n = n.parent
    return False


GERUND_KEEP = {'add', 'pass', 'press', 'access', 'process', 'bill', 'fill', 'install', 'enroll', 'call', 'sell',
               'spell', 'roll', 'dispute', 'refill', 'recall', 'poll', 'address'}
GERUND_E = ('at', 'iz', 'os', 'ov', 'iv', 'ag', 'ul', 'ur', 'us', 'ac', 'uc', 'rg', 'bl', 'dl', 'fl', 'gl', 'pl', 'tl',
            'il', 'ang', 'ing', 'ar', 'yz', 'ut', 'id', 'ud', 'ot', 'ib', 'ob', 'rc', 'rs', 'lv', 'rv', 'as', 'ir',
            'ns', 'ic', 'ap', 'ip', 'ag', 'ed', 'ud', 'om', 'iv', 'aw', 'rk', 'ec', 'ov', 'ag', 'ag')
IRREGULAR = {'setting': 'set', 'running': 'run', 'getting': 'get', 'putting': 'put', 'stopping': 'stop',
             'shipping': 'ship', 'mapping': 'map', 'dropping': 'drop', 'splitting': 'split', 'planning': 'plan',
             'scanning': 'scan', 'writing': 'write', 'creating': 'create', 'using': 'use', 'closing': 'close',
             'making': 'make', 'taking': 'take', 'having': 'have', 'receiving': 'receive', 'deleting': 'delete',
             'changing': 'change', 'managing': 'manage', 'saving': 'save', 'moving': 'move', 'viewing': 'view',
             'reviewing': 'review', 'printing': 'print', 'posting': 'post', 'editing': 'edit', 'adding': 'add',
             'entering': 'enter', 'opening': 'open', 'reopening': 'reopen', 'paying': 'pay', 'applying': 'apply',
             'copying': 'copy', 'emailing': 'email', 'viewing,': 'view', 'duplicating': 'duplicate',
             'updating': 'update', 'importing': 'import', 'exporting': 'export', 'reconciling': 'reconcile',
             'reversing': 'reverse', 'voiding': 'void', 'approving': 'approve', 'declining': 'decline',
             'submitting': 'submit', 'configuring': 'configure', 'enabling': 'enable', 'disabling': 'disable',
             'scheduling': 'schedule', 'memorizing': 'memorize', 'storing': 'store', 'generating': 'generate',
             'calculating': 'calculate', 'recalculating': 'recalculate', 'inactivating': 'inactivate',
             'activating': 'activate', 'filtering': 'filter', 'sorting': 'sort', 'grouping': 'group',
             'searching': 'search', 'finding': 'find', 'assigning': 'assign', 'defining': 'define',
             'specifying': 'specify', 'selecting': 'select', 'transferring': 'transfer', 'disposing': 'dispose',
             'depreciating': 'depreciate', 'allocating': 'allocate', 'publishing': 'publish', 'comparing': 'compare',
             'customizing': 'customize', 'installing': 'install', 'refreshing': 'refresh', 'cloning': 'clone',
             'uploading': 'upload', 'downloading': 'download', 'regenerating': 'regenerate', 'resolving': 'resolve',
             'handling': 'handle', 'preparing': 'prepare', 'excluding': 'exclude', 'including': 'include',
             'issuing': 'issue', 'replacing': 'replace', 'increasing': 'increase', 'decreasing': 'decrease',
             'marking': 'mark', 'unmarking': 'unmark', 'matching': 'match', 'unmatching': 'unmatch',
             'escheating': 'escheat', 'reclassing': 'reclass', 'reclassifying': 'reclassify', 'merging': 'merge',
             'inviting': 'invite', 'tracking': 'track', 'working': 'work', 'accessing': 'access',
             'navigating': 'navigate', 'restricting': 'restrict', 'requiring': 'require', 'fixing': 'fix',
             'reprinting': 'reprint', 'partially': 'partially', 'processing': 'process', 'billing': 'bill',
             'building': 'build', 'amortizing': 'amortize', 'setting up': 'set up', 'converting': 'convert',
             'bypassing': 'bypass', 'highlighting': 'highlight', 'showing': 'show', 'hiding': 'hide',
             'rearranging': 'rearrange', 'applying,': 'apply', 'linking': 'link', 'unlinking': 'unlink',
             'requesting': 'request', 'recording': 'record', 'rerunning': 'rerun', 'unposting': 'unpost',
             'running,': 'run', 'finalizing': 'finalize', 'locking': 'lock', 'unlocking': 'unlock',
             'returning': 'return', 'refunding': 'refund', 'depositing': 'deposit', 'filling': 'fill',
             'checking': 'check', 'verifying': 'verify', 'monitoring': 'monitor', 'maintaining': 'maintain',
             'modifying': 'modify', 'renaming': 'rename', 'overriding': 'override', 'splitting,': 'split',
             'understanding': 'understand', 'choosing': 'choose', 'displaying': 'display', 'removing': 'remove'}


def base_verb(word):
    w = word.lower()
    if w in IRREGULAR:
        return IRREGULAR[w]
    if not w.endswith('ing') or len(w) < 5:
        return w
    b = w[:-3]
    if b in GERUND_KEEP:
        return b
    if len(b) >= 3 and b[-1] == b[-2] and b[-1] not in 'lsz':
        return b[:-1]
    if b.endswith(GERUND_E):
        return b + 'e'
    return b


def title_phrase(title):
    """'Adding a Journal Entry from the Workbench' -> ('add', 'a journal entry from the workbench')."""
    words = title.split()
    if not words:
        return '', title
    first = words[0]
    if first.lower().endswith('ing') and first[0].isupper():
        verb = base_verb(first)
        rest = ' '.join(words[1:])
        return verb, lower_keep_acronyms(rest)
    if first.lower() in ('add', 'create', 'view', 'edit', 'delete', 'run', 'post', 'approve', 'reverse', 'import',
                         'set', 'configure', 'print', 'export', 'generate', 'calculate', 'recalculate', 'unpost',
                         'rerun', 'install', 'assign', 'enter', 'submit', 'update', 'upload', 'download', 'use',
                         'open', 'close', 'pay', 'apply', 'void', 'duplicate', 'find', 'search', 'define', 'select',
                         'schedule', 'access', 'regenerate', 'organize', 'filter', 'publish', 'save', 'build',
                         'refresh', 'clone', 'move', 'record', 'reconcile', 'match', 'manage'):
        return first.lower(), lower_keep_acronyms(' '.join(words[1:]))
    return '', lower_keep_acronyms(title)


def lower_keep_acronyms(s):
    out = []
    for w in s.split():
        if re.match(r"^[A-Z0-9/&\-]{2,}s?$", w) or re.match(r'^[A-Z][a-z]*[A-Z]', w):
            out.append(w)
        else:
            out.append(w.lower())
    return ' '.join(out)


def obj_of(title):
    v, rest = title_phrase(title)
    rest = re.sub(r'^(a|an|the)\s+', '', rest)
    return rest or lower_keep_acronyms(title)


def sentence_split(t):
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z])', t.strip())
    return [p.strip() for p in parts if p.strip()]


def first_sentences(texts, limit):
    out = ''
    for t in texts:
        for s in sentence_split(t):
            if len(out) + len(s) + 1 > limit:
                return out.strip() if out else P.sentence_trim(s, limit)
            out += ' ' + s
    return out.strip()


def dedupe_list(items):
    seen = set()
    out = []
    for x in items:
        k = re.sub(r'\W+', ' ', x.lower()).strip()
        if k and k not in seen:
            seen.add(k)
            out.append(x)
    return out


# ---------------------------------------------------------------------------
# Action-driven phrasing
# ---------------------------------------------------------------------------

ACTION_WHY = {
    'create': "{Task} is performed when a new record is needed before downstream approval, posting, payment or reporting can continue.",
    'edit': "{Task} is needed when an existing record has incorrect or outdated information (amounts, coding, dates or settings).",
    'delete': "{Task} is performed when a record is obsolete, duplicated or created in error — posted history must stay intact.",
    'reverse': "{Task} is required when a processed transaction was wrong (amount, account, property, period or payee) and must be undone with a full audit trail.",
    'post': "{Task} is part of the daily processing cycle or the month-end close once the items are ready.",
    'approve': "{Task} applies when transactions are waiting in an approval queue for the next authorized approver.",
    'import': "{Task} is used when bulk data is faster and less error-prone to load from a template than to key (conversions, acquisitions, monthly loads).",
    'export': "{Task} is used when output must be printed, exported, stored or delivered to reviewers, owners, lenders or auditors.",
    'report': "The {Title} is run for month-end review, owner reporting or audit requests for a specific period, book and set of properties.",
    'view': "Records are listed on the {Title} when they match the selected filters; accountants use it to locate, review and drill into them.",
    'setup': "{Task} determines how related transactions default, validate, route and post.",
    'concept': "Understanding {Title} is a prerequisite for performing the related RealPage tasks correctly.",
    'screen': "Accountants open {Title} to work with these records during daily processing or month-end close.",
}

ACTION_WHY_GERUND = {
    'report': "{Task} is done for month-end review, owner reporting or audit requests covering a specific period, book and set of properties.",
    'view': "{Task} lets accountants locate, review and drill into the related records using the filters and links on the page.",
    'screen': "{Task} is part of daily processing or month-end close work in this area.",
    'concept': "{Task} explains behavior that must be understood before performing the related RealPage tasks.",
}

ACTION_SOP_FALLBACK = {
    'create': ["Click Add (or New) to open a blank {obj} record.",
               "Complete the required fields (marked with *) and any dimension fields (location/property, department).",
               "Click Save (or Post / Submit when approvals are enabled) and note the system-assigned ID."],
    'edit': ["Locate the record with the list filters or search and click Edit.",
             "Change the required values; posted records in closed periods cannot be edited — reverse and re-enter instead.",
             "Click Save and confirm the change appears in the record's audit trail."],
    'delete': ["Locate the record in the list and confirm it has no posted history or dependent records.",
               "Click Delete (or clear the Active status to inactivate records that have history).",
               "Confirm the prompt and verify the record no longer appears in active lists."],
    'reverse': ["Open the posted record and confirm it is eligible (the Reverse/Void action appears only when allowed).",
                "Click Reverse (or Void), enter the reversal date in an open period and a memo explaining why.",
                "Confirm and verify the reversing entry and the reopened source items."],
    'post': ["Filter to the items ready for processing (status, date range, location, bank account).",
             "Review amounts, coding and supporting documents; select the items to process.",
             "Click the processing action (Post / Apply / Reconcile / Pay) and review the confirmation."],
    'approve': ["Open the approval queue and filter to transactions pending your approval.",
                "Open each item, review the detail, supporting documents and coding.",
                "Click Approve, or Decline with a comment explaining the required correction."],
    'import': ["Download the import template for {obj} from the Import Data page.",
               "Fill in the template (keep the header row; follow date and ID formats), save as CSV.",
               "Upload the file, run the import and review the error file; correct and re-import rejected rows."],
    'export': ["Run or open the {obj} with the required filters.",
               "Choose the output (Print/PDF, Excel/CSV export, store, email or schedule).",
               "Confirm the recipient/storage target and file format, then complete the action."],
    'report': ["Open the {obj} and set the reporting period / as-of date, book and location filters.",
               "Click View/Run to generate the output on screen; drill into linked amounts for detail.",
               "Export to PDF/Excel or memorize the report for recurring use."],
    'view': ["Use the filters, search box and column sorting to find the records you need.",
             "Click View to open a record, or use the row actions available to your role.",
             "Export the list to Excel/CSV when you need to analyze or share it."],
    'setup': ["Open the setup/configuration page for {obj}.",
              "Complete the configuration options and defaults required by your company policy.",
              "Click Save; test the setting with a sample transaction before rolling it out."],
    'concept': ["Read this topic to understand {obj} and how it affects related transactions.",
                "Review the related task topics in the same chapter before processing transactions.",
                "Confirm company configuration matches the behavior described before relying on it."],
    'screen': ["Open the screen and review the displayed records and available actions.",
               "Use filters and links to drill into the records you need.",
               "Perform the required action and confirm the result."],
}

GENERIC_FIELDS = {
    'report': [("Reporting period / As-of date", "Select the reporting period (e.g., Current Month, Year to Date) or explicit start/end dates the report covers."),
               ("Location / entity filters", "Limit output to a property (location), location group or entity; 'Include subs' adds child locations."),
               ("View / Print / Export / Memorize", "Run on screen, print to PDF, export to Excel/CSV, or memorize/schedule the report with its filters.")],
    'export': [("Output format", "PDF, Excel (XLSX), CSV or Word depending on the report/list."),
               ("Destination", "Download, email recipients, My Stored Reports, Reporting Portal or a cloud-storage target.")],
    'view': [("Filters & search", "Narrow the list by status, dates, location, vendor/customer or free-text search; sort by any column."),
             ("Row actions (View / Edit / Delete)", "Open or act on individual records, subject to role permissions and period status.")],
    'create': [("Required header fields", "Fields marked with an asterisk (*) must be completed before the record can be saved or posted."),
               ("Save / Post / Submit", "Save as draft, post immediately, or submit into the approval workflow when approvals are enabled.")],
    'edit': [("Edit link", "Opens the record for changes; unavailable for posted items in closed periods or approved transactions."),
             ("Save", "Stores the change and adds an entry to the audit trail.")],
    'delete': [("Delete / Inactivate", "Delete removes records without dependencies; inactivate keeps history but hides the record from selection."),
               ("Confirmation prompt", "Confirms the permanent action.")],
    'reverse': [("Reversal / void date", "Date (in an open period) on which the inverse entry posts."),
                ("Memo", "Reason for the reversal recorded in the audit trail.")],
    'post': [("Selection filters", "Filter the eligible items (date, status, location, bank account) before processing."),
             ("Process button", "Post / Apply / Pay / Reconcile — commits the selected items.")],
    'approve': [("Approval queue filters", "Transaction type, location, amount and submitter filters."),
                ("Approve / Decline", "Approve advances the item to the next level or posts it; Decline returns it to the submitter with comments.")],
    'import': [("Import template (CSV)", "Template downloaded from the Import Data page; headers must not be changed."),
               ("Error file", "Rows rejected by validation are returned with error messages for correction.")],
    'setup': [("Configuration options", "Company or application settings that control defaults, validations and posting behavior."),
              ("Save", "Applies the configuration to subsequent transactions.")],
    'concept': [("Key terms", "Terminology and rules explained in this topic that govern the related screens."),
                ("Related tasks", "Task topics in the same chapter that apply this concept.")],
    'screen': [("Screen actions", "Buttons and links available on this screen depend on your role permissions."),
               ("Filters", "Use filters to limit the records displayed.")],
}

MOD_REPORT_YARDI = {
    'gl': "Analytics > Financial Analytics (Trial Balance, GL Detail, Income Statement, Balance Sheet)",
    'ap': "Analytics > Payable Analytics (Aging, Payable Register, Check Register, Vendor Ledger)",
    'cash': "Financials > Bank Reconciliation reports and Analytics > Cash/Bank reports",
    'ar': "Analytics > Receivable Analytics (Aging, Receipt Register, Resident/Tenant Ledger)",
    'close': "Analytics > Financial Analytics with Report Scheduler close packages",
    'jobcost': "Job Cost > Job Cost Reports (Job Cost Summary, Contract Status, Draw Report)",
    'fixed_assets': "Fixed Assets > Reports (Asset Register, Depreciation Schedule, Disposals)",
    'budgeting': "Analytics > Budget Comparison / Forecast IQ variance reports",
    'reporting': "Analytics > Financial Analytics / YSR / Report Designer",
}
REPORTY_TOPICS = {'fin_report', 'report_writer', 'report_distribution', 'dashboard', 'ar_aging', 'audit_trail', 'workpaper'}

GL_NONE = {
    'setup': "No direct GL impact — configuration only. It controls how future {area} transactions default, validate and post.",
    'default': "No GL impact — {what}; it does not create journal entries.",
}


def gl_text(topic, action, module):
    gl = topic['gl']
    rev = topic['rev']
    area = module['area']
    if gl is None:
        if action == 'setup':
            return GL_NONE['setup'].format(area=area)
        what = {
            'create': 'this creates or maintains a master-data/configuration record',
            'edit': 'this maintains a master-data/configuration record',
            'delete': 'this removes or inactivates a master-data/configuration record (posted history is unaffected)',
            'report': 'read-only report/inquiry of posted data',
            'export': 'output/distribution only',
            'view': 'read-only list/inquiry screen',
            'import': 'this imports master data or settings',
            'concept': 'reference topic',
            'approve': 'approval of a non-financial record',
            'reverse': 'this reverses a non-financial status',
            'post': 'this processes a non-financial record',
            'screen': 'navigation/working screen',
        }.get(action, 'no journal entries are created')
        return GL_NONE['default'].format(what=what)
    if gl.startswith('No GL impact') or gl.startswith('No financial GL impact') or gl.startswith('The approval step') \
            or gl.startswith('The agent itself') or gl.startswith('Matching') or gl.startswith('Importing/matching') \
            or gl.startswith('Closing a period') or gl.startswith('No entries') or gl.startswith('No GL impact at order') \
            or gl.startswith('Entries post only') or gl.startswith('Depends on'):
        base = gl
    else:
        base = None
    if base:
        if action == 'delete':
            return "Deleting/inactivating has no effect on posted history. " + base
        if action == 'reverse':
            return rev or base
        return base
    if action in ('create',):
        return base or f"No GL impact while saved as a draft or pending approval. When posted: {gl}"
    if action == 'post':
        return base or gl
    if action == 'approve':
        return base or f"The approval click itself posts nothing until the final approval level; on final approval the transaction posts: {gl}"
    if action == 'edit':
        return base or f"Saving changes to a posted record in an open period re-posts its GL lines with the corrected values ({gl}). Closed-period records cannot be edited — reverse and re-enter instead."
    if action == 'import':
        return base or f"Imported transactions post exactly as if keyed manually: {gl} (master-data imports create no GL entries)."
    if action == 'reverse':
        return rev or ("Posts the exact inverse of the original entry on the reversal/void date (each debit becomes a credit); the original remains in history. Original entry: " + gl)
    if action == 'delete':
        return "Deleting a draft/unposted record has no GL impact. Deleting a posted transaction in an open period removes its GL lines entirely — once posted, prefer Reverse/Void to keep the audit trail. Original posting pattern: " + (base or gl)
    if action == 'setup':
        return "No direct GL impact — configuration only. Governs how related transactions post: " + (base or gl)
    if action in ('report', 'export', 'view', 'concept', 'screen'):
        label = {'report': 'read-only report', 'export': 'output/distribution only', 'view': 'read-only inquiry/list',
                 'concept': 'reference topic', 'screen': 'working screen; actions launched from it post as described'}[action]
        if base:
            return f"No GL impact — {label}. {base}"
        return f"No GL impact — {label}. Underlying posted transactions carry: {gl}"
    return base or gl


def next_text(topic, action, sys_sents, whats_next):
    parts = []
    if whats_next:
        parts.append(whats_next)
    parts.extend(sys_sents[:2])
    tn = topic['next']
    lead = {
        'create': 'After saving/posting: ',
        'edit': 'After saving the change: ',
        'delete': 'After deletion/inactivation the record is no longer selectable; ',
        'reverse': 'After the reversal: ',
        'post': 'After processing: ',
        'approve': 'After the approval decision: ',
        'import': 'After a successful import: ',
        'export': 'After distribution: ',
        'report': 'Report results are used for review and tie-out. ',
        'view': 'From this list, open records to continue their workflow. ',
        'setup': 'After saving the configuration: ',
        'concept': 'Apply this knowledge in the related tasks. ',
        'screen': '',
    }.get(action, '')
    if tn:
        if lead.endswith(': ') or lead.endswith('; '):
            parts.append(lead + tn[0].lower() + tn[1:])
        else:
            parts.append((lead + tn).strip())
    return ' '.join(dedupe_list(parts)).strip()


SYS_SENT_RX = re.compile(r"\b(The system|RealPage( Accounting| Financial Suite)?|The (invoice|transaction|payment|entry|journal entry|record|report|bill|deposit|reconciliation|batch|draw|asset|package|task|checklist)s?) (automatically )?(creates|posts|sends|generates|updates|moves|routes|marks|assigns|adds|calculates|applies|closes|opens|reverses|voids|removes|notifies|emails|changes|appears|appear|displays|returns|becomes|is (posted|sent|routed|moved|marked|created|approved|declined|reversed|closed|added|removed))\b[^.]*\.")


def system_sentences(blocks):
    out = []
    for b in blocks:
        for s in sentence_split(b['text']):
            if SYS_SENT_RX.search(s) and len(s) < 260:
                out.append(s)
                if len(out) >= 3:
                    return out
    return out


BOILER_BYB = re.compile(r"^(Access can vary|If you do not see|ask your System Administrator|Access to this|Before you begin)|depending on your organization's subscriptions", re.I)
USE_RX = re.compile(r"\b(use|used|allows?|lets you|enables?|helps?|when you need|if you need|you can)\b", re.I)


def pick_nav(paths, title):
    if not paths:
        return None
    tw = set(w for w in re.findall(r'[a-z]{3,}', title.lower()) if w not in ('the', 'and', 'for', 'from', 'with'))
    best = None
    best_score = -1
    for p in paths:
        pw = set(re.findall(r'[a-z]{3,}', ' '.join(p).lower()))
        score = len(tw & pw)
        if score > best_score:
            best, best_score = p, score
    return best


# ---------------------------------------------------------------------------
# Screen construction
# ---------------------------------------------------------------------------


class Ctx:
    def __init__(self, module, manual, titles=frozenset()):
        self.module = module
        self.manual = manual
        self.titles = titles


def collect(node, running):
    """Return content dict for a node including merged children."""
    own = P.body_blocks(node.body, running)
    raw = '\n'.join(l for _, l in node.body)
    navs = P.extract_nav_paths(raw)
    field_pairs = []
    byb = []
    howto_navs = []
    whats_next = []
    merged = []
    pages = [node.pages[0], node.pages[1]]
    for c in node.children:
        k = merge_kind(c.title)
        if not k:
            continue
        cb = P.body_blocks(c.body, running)
        craw = '\n'.join(l for _, l in c.body)
        merged.append(c)
        pages[1] = max(pages[1], c.pages[1])
        if k == 'fields':
            kind = 'Button' if re.search(r'button', c.title, re.I) and not re.search(r'field', c.title, re.I) else None
            for nm, d in P.table_pairs(cb):
                field_pairs.append((nm, d, kind))
            navs += P.extract_nav_paths(craw)
        elif k == 'byb':
            byb += [b['text'] for b in cb if b['type'] in ('para', 'bullet', 'step') and len(b['text']) > 25]
            navs += P.extract_nav_paths(craw)
        elif k == 'howto':
            howto_navs += P.extract_nav_paths(craw)
        elif k == 'next':
            whats_next += [b['text'] for b in cb if b['type'] in ('para', 'bullet') and len(b['text']) > 25]
    return dict(blocks=own, navs=navs + howto_navs, field_pairs=field_pairs, byb=byb, whats_next=whats_next,
                merged=merged, pages=pages)


def has_content(c):
    return bool(c['blocks'] or c['field_pairs'] or c['byb'] or c['navs'])


def build_screen(node, content, ctx, nav, texts_for_topic):
    module = ctx.module
    title = node.title
    action = K.classify_action(title)
    topic = K.match_topic(texts_for_topic, module['code'], node.manual)
    blocks = content['blocks']
    obj = obj_of(title)

    # ---- purpose
    paras = P.prose(blocks, limit=6)
    purpose = first_sentences(paras, 620)
    if not purpose:
        v, rest = title_phrase(title)
        if v:
            purpose = f"Use this {'procedure' if action not in ('view', 'report', 'screen', 'concept') else 'screen'} to {v} {rest} in RealPage {module['area']}."
        else:
            kind = {'report': 'report', 'view': 'screen', 'setup': 'setup page', 'concept': 'reference topic'}.get(action, 'screen')
            purpose = f"The {title} {kind} in RealPage {module['area']} ({manual_short(node.manual)})."
        parent = node.parent.title if node.parent is not None and not SKIP_CONTAINER_RX.search(node.parent.title) else None
        if parent and parent.lower() not in purpose.lower():
            purpose += f" It is part of the '{parent}' functionality."
    if topic['ctx']:
        purpose = purpose.rstrip() + ' ' + topic['ctx']

    # ---- why records are here
    why = []
    if content['byb']:
        specific = [x for x in content['byb'] if not BOILER_BYB.search(x)]
        specific = [' '.join(z for z in sentence_split(x) if not BOILER_BYB.search(z)) for x in specific]
        specific = [x for x in specific if len(x) > 25]
        if specific:
            why.append('Prerequisite (Before You Begin): ' + first_sentences(specific, 260))
        else:
            why.append('Prerequisite (Before You Begin): the role must have the permissions/subscription for this feature — ask the System Administrator if the menu option is missing.')
    gerund = bool(re.match(r'^[A-Z][a-z]+ing\b', title))
    if gerund and action in ACTION_WHY_GERUND:
        why.append(ACTION_WHY_GERUND[action].format(Task=title))
    else:
        why.append(ACTION_WHY.get(action, ACTION_WHY['screen']).format(Task=title, Title=title))
    why += topic['why']
    used = purpose.lower()
    for p in paras:
        for s in sentence_split(p):
            words = s.split()
            caps = sum(1 for w in words if w[:1].isupper())
            if caps > 0.5 * len(words):  # concatenated headings, not a sentence
                continue
            if USE_RX.search(s) and s.lower()[:60] not in used and 40 < len(s) < 300:
                why.append(s)
                break
        if len(why) >= 5:
            break
    why = dedupe_list(why)[:5]

    # ---- fields
    fields = []
    seen = set()
    for nm, d, kind in content['field_pairs']:
        nm2 = P.clean_inline(nm).strip(' :')
        if not nm2 or len(nm2) > 70 or nm2.lower() in seen:
            continue
        if re.match(r'^(step \d|for example|example|note|tip|see |related)', nm2, re.I) or \
                (P.norm_title(nm2) in ctx.titles and len(nm2.split()) > 3):
            continue
        seen.add(nm2.lower())
        desc = P.sentence_trim(d, 300)
        if kind and not desc.lower().startswith('button'):
            desc = 'Button — ' + desc
        fields.append({'name': nm2, 'description': desc})
        if len(fields) >= 18:
            break
    if len(fields) < 18:
        for nm, d in P.table_pairs(blocks):
            nm2 = P.clean_inline(nm).strip(' :')
            if not nm2 or len(nm2.split()) > 6 or len(d) < 12 or nm2.lower() in seen or P.BAD_FIELD.match(nm2):
                continue
            if re.match(r'^(step \d|for example|example|note|tip|see |related)', nm2, re.I) or P.norm_title(nm2) in ctx.titles:
                continue
            seen.add(nm2.lower())
            fields.append({'name': nm2, 'description': P.sentence_trim(d, 300)})
            if len(fields) >= 18:
                break
    if len(fields) < 18:
        for f in P.extract_fields(blocks, limit=18):
            if f['name'].lower() in seen:
                continue
            seen.add(f['name'].lower())
            fields.append(f)
            if len(fields) >= 18:
                break
    if len(fields) < 2:
        for nm, d in GENERIC_FIELDS.get(action, GENERIC_FIELDS['screen']):
            if nm.lower() not in seen:
                fields.append({'name': nm, 'description': d})
                seen.add(nm.lower())

    # ---- SOP
    procs = P.extract_procedures(blocks)
    if not re.search(r'attach|scan|document', title, re.I):
        filtered = [p for p in procs if not (p['intro'] and BOILERPLATE_PROC_RX.search(p['intro']))]
        procs = filtered or procs
    steps = []
    for p in procs:
        for j, st in enumerate(p['steps']):
            txt = P.sentence_trim(st, 400)
            if j == 0 and p['intro']:
                txt = f"{P.sentence_trim(p['intro'], 140)} — {txt}"
            steps.append(txt)
    steps = dedupe_list(steps)
    if len(steps) > 30:
        steps = steps[:30]
    nav_str = ' > '.join(nav)
    if not steps:
        steps = [P.sentence_trim(x, 400) for x in P.imperative_bullets(blocks)]
    if not steps:
        steps = [f"Navigate to {nav_str}."] + [s.format(obj=obj) for s in ACTION_SOP_FALLBACK.get(action, ACTION_SOP_FALLBACK['screen'])]
        tasks = [c.title for c in node.children if not merge_kind(c.title)][:8]
        if tasks:
            steps.insert(1, 'Tasks available from here (each has its own screen guide): ' + '; '.join(tasks) + '.')
        key_fields = [f['name'] for f in fields[:6] if f['name'] not in dict(GENERIC_FIELDS.get(action, [])).keys()]
        if key_fields and action not in ('concept',):
            steps.insert(2, 'Key fields/controls on this page: ' + ', '.join(key_fields) + '.')
    elif not re.search(r'applications|menu|navigate|\bopen\b|go to|from the|tab\b', steps[0], re.I):
        steps.insert(0, f"Navigate to {nav_str}.")
    if topic['ctl']:
        steps.append('Control check: ' + topic['ctl'])
    notes = P.notes(blocks)
    if notes:
        steps.append('Manual note: ' + P.sentence_trim(notes[0], 300))
    sop = [f"{i + 1}. {s}" for i, s in enumerate(steps)]

    # ---- GL, next, yardi
    if topic['gl'] and action in ('create', 'edit', 'delete', 'import') and K.is_master_data(obj):
        gl = (f"No GL impact — {'creates' if action == 'create' else 'maintains' if action == 'edit' else 'removes/inactivates' if action == 'delete' else 'imports'} "
              f"master/setup data ({obj}); no journal entries are created. Transactions later tagged with it post as: {topic['gl']}")
    else:
        gl = gl_text(topic, action, module)
    acct = P.accounting_sentences(blocks)
    if acct:
        gl = gl.rstrip() + ' Per the manual: "' + ' '.join(acct) + '"'
    nxt = next_text(topic, action, system_sentences(blocks), first_sentences(content['whats_next'], 300))
    yardi = topic['yardi']
    if topic['key'] == 'company' and action in ('view', 'report', 'concept', 'screen', 'export'):
        yardi = K.Y['workbench']
    if action in ('report', 'export') and topic['key'] not in REPORTY_TOPICS:
        yardi = yardi.rstrip('.') + f". Reporting equivalent: Yardi Voyager {MOD_REPORT_YARDI[module['code']]}."

    p1, p2 = content['pages']
    pages = f"Page {p1}" if p2 <= p1 else f"Pages {p1}-{p2}"
    src = f"{node.manual}, {pages}"

    return OrderedDict([
        ('id', None),
        ('name', title),
        ('navigation', nav),
        ('purpose', purpose),
        ('whyRecordsAreHere', why),
        ('keyFieldsAndFilters', fields),
        ('accountantActionSOP', sop),
        ('glAccountingImpact', gl),
        ('whatHappensNext', nxt),
        ('yardiEquivalent', yardi),
        ('pdfManualSource', src),
    ]), topic['key'], action


def manual_base_nav(manual, module):
    c = Counter()
    for h in manual['heads']:
        for p in P.extract_nav_paths('\n'.join(l for _, l in h.body)):
            if len(p) >= 2:
                c[tuple(p[:2])] += 1
    if c:
        return list(c.most_common(1)[0][0])
    return ['Applications', module['area']]


# ---------------------------------------------------------------------------


def count_screens(node, is_screen):
    n = 1 if is_screen.get(id(node)) else 0
    for c in node.children:
        n += count_screens(c, is_screen)
    return n


def build_module(module, reserved_ids=()):
    md = os.path.join(MD_DIR, module['file'] + '.md')
    manuals = P.split_manuals(md)
    for m in manuals:
        P.segment_manual(m)

    coverage = []  # (manual, title, page, level, status, target)
    screens_by_uid = {}
    groups = []    # list of dict(title, manual, screens(list of uid))
    dedupe_index = {}
    title_index = {}
    uid_counter = [0]

    # Pass 1: build screen candidates per node
    records = {}
    for m in manuals:
        base_nav = manual_base_nav(m, module)
        running = m['running']
        nav_of = {}
        for h in m['heads']:
            uid_counter[0] += 1
            h.uid = uid_counter[0]
        for h in m['heads']:
            rec = {'node': h, 'status': None, 'target': None}
            records[h.uid] = rec
            if in_glossary(h):
                rec['status'] = 'glossary-definition'
                continue
            if SKIP_CONTAINER_RX.search(h.title):
                rec['status'] = 'layout-container'
                continue
            mk = merge_kind(h.title)
            if mk and h.parent is not None and not SKIP_CONTAINER_RX.search(h.parent.title):
                rec['status'] = 'merged'
                continue
            content = collect(h, running)
            rec['content'] = content
            own_nav = pick_nav(content['navs'], h.title)
            if own_nav:
                nav_of[h.uid] = own_nav
                nav = own_nav
            else:
                anc = h.parent
                inherited = None
                while anc is not None:
                    if anc.uid in nav_of:
                        inherited = nav_of[anc.uid]
                        break
                    anc = anc.parent
                if inherited:
                    nav = inherited + [h.title] if inherited[-1].lower() != h.title.lower() else inherited
                else:
                    chain = [a.title for a in reversed(h.chain()) if not SKIP_CONTAINER_RX.search(a.title)]
                    nav = base_nav + chain[:2] + [h.title]
            nav = [x for i, x in enumerate(nav) if i == 0 or x != nav[i - 1]]
            rec['nav'] = nav
            is_leafish = not any(not merge_kind(c.title) for c in h.children)
            if not has_content(content) and not is_leafish:
                rec['status'] = 'container'
                continue
            rec['status'] = 'screen'

    # Pass 2: dedupe (same title & same body text within the module)
    def body_key(rec):
        c = rec['content']
        txt = ' '.join(b['text'] for b in c['blocks'])[:800]
        txt = re.sub(r'\W+', ' ', txt.lower()).strip()
        return hashlib.md5(txt.encode()).hexdigest() if txt else ''

    by_title = {}
    for uid, rec in records.items():
        if rec['status'] != 'screen':
            continue
        t = P.norm_title(rec['node'].title)
        by_title.setdefault(t, []).append(uid)
    for t, uids in by_title.items():
        if len(uids) < 2:
            continue
        reps = {}
        nonempty = [u for u in uids if body_key(records[u])]
        for u in uids:
            k = body_key(records[u])
            if not k:
                # empty topic: fold into the first same-titled topic that has content
                if nonempty and nonempty[0] != u:
                    records[u]['status'] = 'duplicate'
                    records[u]['target'] = nonempty[0]
                    continue
                k = 'empty'
            if k in reps:
                records[u]['status'] = 'duplicate'
                records[u]['target'] = reps[k]
            else:
                reps[k] = u

    # Pass 3: build screens
    all_titles = frozenset(P.norm_title(r['node'].title) for r in records.values())
    also = {}
    for uid, rec in records.items():
        if rec['status'] == 'duplicate':
            also.setdefault(rec['target'], []).append(rec['node'])
    for uid, rec in records.items():
        if rec['status'] != 'screen':
            continue
        h = rec['node']
        texts = [h.title] + [a.title for a in h.chain() if not SKIP_CONTAINER_RX.search(a.title)]
        scr, tkey, action = build_screen(h, rec['content'], Ctx(module, h.manual, all_titles), rec['nav'], texts)
        extra = also.get(uid, [])
        if extra:
            refs = []
            for n in extra:
                r = f"{n.manual}, Page {n.page}"
                if r not in refs and not scr['pdfManualSource'].startswith(n.manual + ', P'):
                    refs.append(r)
            if refs:
                scr['pdfManualSource'] += '; also documented in ' + '; '.join(refs[:4])
        rec['screen'] = scr
        rec['topic'] = tkey
        rec['action'] = action

    # Pass 4: grouping into submodules
    is_screen = {id(rec['node']): rec['status'] == 'screen' for rec in records.values()}

    def group_nodes(nodes, manual_name, prefix=None):
        """Chapters become submodules; huge chapters are split into their large sections and
        consecutive small chapters are bundled so the explorer is not flooded with 1-screen groups."""
        out = []
        bucket = []

        def flush():
            if not bucket:
                return
            if len(bucket) == 1:
                t = bucket[0].title
            else:
                t = f"{bucket[0].title} … {bucket[-1].title}"
            if prefix:
                t = f"{prefix} › {t}"
            out.append({'title': t, 'manual': manual_name, 'items': [(b, True) for b in bucket]})
            bucket.clear()

        for n in nodes:
            if records[n.uid]['status'] in ('glossary-definition',):
                continue
            total = count_screens(n, is_screen)
            if total == 0:
                continue
            if total < 4:
                bucket.append(n)
                if sum(count_screens(b, is_screen) for b in bucket) >= 25:
                    flush()
                continue
            flush()
            children = [c for c in n.children if not merge_kind(c.title)]
            min_big = 8 if total > 150 else 12
            big = [c for c in children if c.children and count_screens(c, is_screen) >= min_big]
            title = n.title if not prefix else f"{prefix} › {n.title}"
            if total > 120 and big:
                rest = [c for c in children if c not in big]
                out.append({'title': title, 'manual': manual_name, 'items': [(n, False)] + [(c, True) for c in rest]})
                out.extend(group_nodes(big, manual_name, prefix=n.title))
            else:
                out.append({'title': title, 'manual': manual_name, 'items': [(n, True)]})
        flush()
        return out

    for m in manuals:
        roots = []
        qs_items = []
        for r in m['roots']:
            if SKIP_CONTAINER_RX.search(r.title):
                qs_items += r.children
                continue
            roots.append(r)
        manual_total = sum(count_screens(r, is_screen) for r in m['roots'])
        if qs_items and not roots:
            groups.append({'title': f"Quick Steps — {manual_short(m['name'])}", 'manual': m['name'],
                           'items': [(c, True) for c in qs_items], 'qs': True})
            continue
        if manual_total <= 40:
            label = manual_short(m['name'])
            if re.search(r'\bQS\b|Quick Steps', m['name']):
                label = f"Quick Steps — {label}"
            groups.append({'title': label, 'manual': m['name'], 'items': [(c, True) for c in qs_items + roots], 'qs': True})
            continue
        if qs_items:
            groups.append({'title': f"Quick Steps — {manual_short(m['name'])}", 'manual': m['name'],
                           'items': [(c, True) for c in qs_items], 'qs': True})
        groups.extend(group_nodes(roots, m['name']))

    def walk(n, deep, acc):
        rec = records[n.uid]
        if rec['status'] == 'screen':
            acc.append(n.uid)
        if deep:
            for c in n.children:
                walk(c, True, acc)

    submodules = []
    used_ids = set()
    title_counts = Counter(g['title'] for g in groups)
    screen_ids = set(reserved_ids)
    GENERIC_GROUP = re.compile(r'^(help and support|common tasks|reports?|appendices|configuration|setup|overview|importing|attachments|currency|periodic tasks|introduction.*|getting started.*)$', re.I)
    for g in groups:
        uids = []
        for n, deep in g['items']:
            walk(n, deep, uids)
        if not uids:
            continue
        gt = g['title']
        if not g.get('qs') and (title_counts[gt] > 1 or GENERIC_GROUP.search(gt)):
            gt = f"{gt} ({manual_short(g['manual'])})"
        sid = f"{module['code']}_{slug(manual_short(g['manual']), 24)}_{slug(g['title'], 40)}"
        base_sid = sid
        k = 2
        while sid in used_ids:
            sid = f"{base_sid}_{k}"
            k += 1
        used_ids.add(sid)
        scr_list = []
        for u in uids:
            rec = records[u]
            scr = rec['screen']
            base = f"scr_{module['code']}_{slug(scr['name'], 64)}"
            i = base
            k = 2
            while i in screen_ids:
                i = f"{base}_{k}"
                k += 1
            screen_ids.add(i)
            scr['id'] = i
            rec['screen_id'] = i
            scr_list.append(scr)
        submodules.append(OrderedDict([('id', sid), ('title', gt), ('manual', g['manual']), ('screens', scr_list)]))

    # coverage
    for uid, rec in records.items():
        h = rec['node']
        st = rec['status']
        target = None
        if st == 'screen':
            target = rec.get('screen_id')
        elif st == 'merged':
            p = h.parent
            target = records[p.uid].get('screen_id') if p is not None else None
            if target is None and p is not None:
                st = 'merged'
        elif st == 'duplicate':
            target = records[rec['target']].get('screen_id')
        elif st == 'container':
            kids = []
            for c in h.children:
                sid = records[c.uid].get('screen_id')
                if sid:
                    kids.append(sid)
            target = kids[:20]
        coverage.append({'manual': h.manual, 'title': h.title, 'page': h.page, 'level': h.level, 'status': st, 'target': target})

    return submodules, coverage, records, manuals


# ---------------------------------------------------------------------------
# Curated screens (hand-authored mastery workflows retained from earlier versions)
# ---------------------------------------------------------------------------


def load_curated():
    if not os.path.exists(CURATED_PATH):
        return {}
    return json.load(open(CURATED_PATH, encoding='utf-8'))


def format_module(obj):
    """Readable but compact JSON: module/submodule keys on their own lines, one screen per line."""
    d = lambda v: json.dumps(v, ensure_ascii=False)
    lines = ['{']
    for k in ('id', 'title', 'shortCode', 'icon', 'color', 'description', 'glAccountLegend'):
        lines.append(f'  {d(k)}: {d(obj[k])},')
    lines.append('  "submodules": [')
    subs = obj['submodules']
    for i, sm in enumerate(subs):
        lines.append('    {')
        lines.append(f'      "id": {d(sm["id"])},')
        lines.append(f'      "title": {d(sm["title"])},')
        lines.append('      "screens": [')
        for j, sc in enumerate(sm['screens']):
            lines.append('        ' + d(sc) + (',' if j < len(sm['screens']) - 1 else ''))
        lines.append('      ]')
        lines.append('    }' + (',' if i < len(subs) - 1 else ''))
    lines.append('  ]')
    lines.append('}')
    return '\n'.join(lines)


def write_js(module, submodules):
    obj = OrderedDict([
        ('id', module['id']),
        ('title', module['title']),
        ('shortCode', module['shortCode']),
        ('icon', module['icon']),
        ('color', module['color']),
        ('description', module['description']),
        ('glAccountLegend', K.COA_LEGEND),
        ('submodules', submodules),
    ])
    n_screens = sum(len(s['screens']) for s in submodules)
    header = (
        f"// RealPage Module: {module['title']}\n"
        f"// Source Manuals: manuals_markdown/{module['file']}.md\n"
        f"// Generated by scripts/build_realpage_modules.py from the RealPage manuals — do not hand-edit;\n"
        f"// edit scripts/rp_kb.py (accounting knowledge base) or scripts/curated_screens.json and re-run.\n"
        f"// Submodules: {len(submodules)} | Screens: {n_screens}\n\n"
    )
    body = format_module(obj)
    path = os.path.join(OUT_DIR, module['file'] + '.js')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(header + f"export const {module['export']} = " + body + ";\n")
    return path, n_screens


GLOSSARY_JS = os.path.join(ROOT, 'src', 'data', 'glossaryData.js')
GLOSS_START = '// <generated:realpage-glossary>'
GLOSS_END = '// </generated:realpage-glossary>'


def write_glossary(terms, entries):
    src = open(GLOSSARY_JS, encoding='utf-8').read()
    a = src.index(GLOSS_START)
    b = src.index(GLOSS_END)
    d = lambda v: json.dumps(v, ensure_ascii=False)
    body = [GLOSS_START + ' — written by scripts/build_realpage_modules.py; do not hand-edit this block',
            'export const REALPAGE_GLOSSARY_TERMS = [']
    for i, t in enumerate(terms):
        body.append('  ' + d(t) + (',' if i < len(terms) - 1 else ''))
    body.append('];')
    body.append(f'export const REALPAGE_GLOSSARY_STATS = {{ entries: {entries}, uniqueTerms: {len(terms)} }};')
    body.append('')
    with open(GLOSSARY_JS, 'w', encoding='utf-8') as f:
        f.write(src[:a] + '\n'.join(body) + src[b:])


def main():
    curated = load_curated()
    os.makedirs(REPORT_DIR, exist_ok=True)
    summary = OrderedDict()
    all_cov = OrderedDict()
    module_manuals = OrderedDict()
    screens_by_module = OrderedDict()
    for module in MODULES:
        cur = curated.get(module['code'])
        reserved = [x['id'] for x in cur['screens']] if cur else []
        submodules, coverage, records, manuals = build_module(module, reserved)
        module_manuals[module['file']] = manuals
        if cur:
            for scr in cur['screens']:
                for k in ('id', 'name', 'navigation', 'purpose', 'whyRecordsAreHere', 'keyFieldsAndFilters',
                          'accountantActionSOP', 'glAccountingImpact', 'whatHappensNext', 'yardiEquivalent',
                          'pdfManualSource'):
                    assert scr.get(k), (module['code'], scr.get('id'), k)
            submodules.insert(0, OrderedDict([('id', cur['id']), ('title', cur['title']), ('manual', 'Curated mastery workflows'), ('screens', cur['screens'])]))
        for s in submodules:
            s.pop('manual', None)
        screens_by_module[module['file']] = [x for sm in submodules for x in sm['screens']]
        path, n = write_js(module, submodules)
        st = Counter(c['status'] for c in coverage)
        summary[module['file']] = {'checklist_items': len(coverage), 'screens': n, 'submodules': len(submodules),
                                   'status_counts': dict(st), 'bytes': os.path.getsize(path)}
        all_cov[module['file']] = coverage
        print(f"{module['file']}: {n} screens in {len(submodules)} submodules; {dict(st)}; {os.path.getsize(path)/1e6:.2f} MB")
    terms, entries = G.build_glossary(module_manuals, screens_by_module)
    write_glossary(terms, entries)
    summary['glossary'] = {'entries': entries, 'unique_terms': len(terms)}
    print(f"glossary: {entries} manual glossary entries -> {len(terms)} unique terms")
    with open(os.path.join(REPORT_DIR, 'coverage_summary.json'), 'w') as f:
        json.dump(summary, f, indent=2)
    with open(os.path.join(REPORT_DIR, 'coverage_report.json'), 'w') as f:
        json.dump(all_cov, f, ensure_ascii=False, indent=0)


if __name__ == '__main__':
    main()
