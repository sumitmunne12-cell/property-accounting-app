"""
US multifamily property-accounting knowledge base used by the module builder.

Every RealPage topic node is classified by (1) TOPIC - what accounting object
it concerns - and (2) ACTION - what the user does on the screen.  The topic
supplies the posting pattern (DR/CR), the Yardi Voyager equivalent, the
operational reasons records land on the screen, and the downstream workflow.
The action decides how that knowledge is phrased (posting vs. inquiry vs.
configuration vs. reversal).

Account numbers follow an illustrative multifamily chart of accounts
(see COA_LEGEND); accountants map them to each owner's chart.
"""

import re

COA_LEGEND = (
    "GL examples use an illustrative multifamily chart of accounts: 1110 Operating Cash, "
    "1115 Security Deposit Trust Cash, 1120 Petty Cash, 1130 Undeposited Funds, 1210 Resident/Tenant A/R, "
    "1215 Allowance for Doubtful Accounts, 1230 Due From Affiliates, 1250 Input VAT/Tax Recoverable, "
    "1310 Prepaid Expenses, 1330 Tax & Insurance Escrow, 1340 Replacement Reserve Escrow, 1410 Construction in Progress, "
    "1520 Buildings, 1530 Building Improvements, 1540 FF&E, 1590 Accumulated Depreciation, 2010 Accounts Payable, "
    "2015 Retainage Payable, 2020 Accrued Expenses, 2110 Resident Security Deposits, 2120 Prepaid Rent, "
    "2130 Due To Affiliates, 2140 Credit Card Payable, 2150 Employee Reimbursements Payable, 2160 Sales Tax/VAT Payable, "
    "2170 Unclaimed Property Payable, 2210 Mortgage/Construction Loan Payable, 3010 Partners' Capital, 3020 Distributions, "
    "3100 Retained Earnings, 4010 Gross Potential Rent, 4040 Concessions, 4050 Bad Debt, 4100 Other Income (late/NSF/fees), "
    "4110 Utility Reimbursement, 6010 Payroll, 6110 Repairs & Maintenance, 6210 Utilities, 6310 Marketing, "
    "6410 Administrative, 6420 Bank Charges, 6510 Management Fees, 6610 Insurance, 6620 Real Estate Taxes, "
    "7010 Interest Expense, 7110 Depreciation Expense. Map to each owner's chart of accounts."
)

# ---------------------------------------------------------------------------
# ACTIONS (evaluated against the node title, first match wins)
# ---------------------------------------------------------------------------

ACTIONS = [
    ('report', r"^(customizing and running|running and exporting|running|customizing|generating)\b.*\b(reports?|charts?|graphs?|statements?|registers?|ledgers?|aging|inquiry|analysis)\b"),
    ('concept', r"^(about|overview|introduction|what('s| is| are| does)|why|who|when|types? of|understanding|before you|key features|summary|faq|how to read|best practices|welcome|getting started|ready to|common errors|troubleshoot|tips|additional items|example|sample|workflow overview|periodic tasks overview|.* overview$|.* workflow$|.* faqs?$)"),
    ('reverse', r"^(void|revers|unpost|unappl|unapprov|undo|cancel|reopen|re-open|unreconcil|unmatch|unclear|recall|declin|reject|unmark|unlock|unpublish|rescind|withdraw|returning|refund|writ(e|ing)[- ]off|fixing and reprint)"),
    ('delete', r"^(delet|remov|inactivat|deactivat|purg|archiv|discard|clear(ing)? (all|the))|^(deleting|inactivating) "),
    ('import', r"^(import|upload|bulk|automating imports|issuing .* via import)|\bimport(ing)?\b"),
    ('export', r"^(export|download|print|email|send|stor(e|ing)|schedul|memoriz|distribut|shar|publish|subscrib(e|ing) to report|sav(e|ing) (a )?report)"),
    ('approve', r"^(approv|submit|certif|sign(ing)?[- ]off|accept|disput|delegat|escalat|rout|review(ing)? and approv|releas)"),
    ('post', r"^(post|pay(ing)?\b|record|process|apply|applying|reconcil|match|clear|transfer|deposit|receiv|clos(e|ing)|open(ing)? (books|period|a new period)|run(ning)? (depreciation|allocation|fees|the (allocation|fee))|generat(e|ing) (payments?|checks?|ach|invoices?|fees?|draws?|charges?|work papers?|tasks?)|calculat|recalculat|rerun|re-run|allocat|amortiz|depreciat|bill(ing)?\b|invoic|charg|convert|revalu|consolidat|reclass|finaliz|lock|escheat|dispos|activat(e|ing) draft|mark(ing)? .* (paid|escheat|aged)|split|partially pay|making .* payments?|creat(e|ing) (a |an )?(payment|deposit|check|draw|credit|debit|adjustment|summary))"),
    ('create', r"^(add|creat|enter|new|duplicat|copy|copying|clon|build|defin|mak|writ|generat|requesting|request|issu|invit|register|captur|assign(ing)? .* to)"),
    ('edit', r"^(edit|chang|updat|modif|correct|mov|renam|rearrang|replac|merg|reassign|maintain|manag|overrid|increas|decreas|putting|reactivat|resend|re-send|resubmit|regenerat|refresh|limit|restrict|splitting)"),
    ('setup', r"(configur|setting up|set up|setup|enabl|disabl|install|subscrib|preferenc|permission|rights|\broles?\b|securit|customiz|mapping|defaults?\b|template|rules?\b|rule set|\boptions?\b|\bterms\b|polic(y|ies)|sequenc|numbering|calendar|periods?\b|codes?\b|types?\b|classes\b|labels?\b|settings?\b)"),
    ('report', r"(report|register|aging|analysis|statements?\b|chart\b|charts\b|graph|dashboard|inquiry|ledger\b|listing|forecast|trial balance|history|audit trail|log\b|columns$|analytics|performance card)"),
    ('view', r"^(view|search|find|filter|sort|group|using|work(ing)? with|access|navigat|display|show|hid|look|research|track|monitor|check|verif|compar|drill|highlight|select|specif|choos|set(ting)? the|entering|fill)|(list|page|workbench|queue|console|tab|menu|home page|box|views?|section|screen|inbox|center|portal)$"),
]
ACTIONS = [(a, re.compile(r, re.I)) for a, r in ACTIONS]


IMPERATIVE_WORDS = {
    'add', 'create', 'view', 'edit', 'delete', 'run', 'post', 'approve', 'reverse', 'import', 'set', 'configure',
    'print', 'export', 'generate', 'calculate', 'recalculate', 'unpost', 'rerun', 'install', 'assign', 'enter',
    'submit', 'update', 'upload', 'download', 'use', 'open', 'close', 'pay', 'apply', 'void', 'duplicate', 'find',
    'search', 'define', 'select', 'schedule', 'access', 'regenerate', 'organize', 'filter', 'publish', 'save',
    'build', 'refresh', 'clone', 'move', 'record', 'reconcile', 'match', 'manage', 'transfer', 'dispose', 'deposit',
    'receive', 'reclassify', 'reclass', 'bill', 'write', 'mark', 'split', 'merge', 'copy', 'change', 'remove',
    'inactivate', 'activate', 'enable', 'disable', 'decline', 'reject', 'release', 'escheat', 'depreciate', 'allocate',
}
VERB_ACTIONS = {'reverse', 'delete', 'export', 'approve', 'post', 'create', 'edit'}


def classify_action(title):
    t = title.strip()
    first = re.sub(r'[^a-z-]', '', t.split()[0].lower()) if t.split() else ''
    is_verb = first.endswith('ing') or first in IMPERATIVE_WORDS
    for a, rx in ACTIONS:
        m = rx.search(t)
        if not m:
            continue
        if a in VERB_ACTIONS and not is_verb and m.start() == 0:
            continue
        return a
    return 'screen'


TRANSACTION_NOUNS = re.compile(r"\b(invoices?|bills?|payments?|checks?|deposits?|entr(y|ies)|journal entr|adjustments?|receipts?|transfers?|draws?|charges?|fees?|allocations?|accruals?|prepaids?|depreciation|disposals?|reclass\w*|credit memo|debit memo|advances?|expense reports?|expenses?|transactions?|distributions?|contributions?|capital calls?|refunds?|write-?offs?|amortization|summar(y|ies)|batch(es)?|reversals?)\b", re.I)
MASTER_NOUNS = re.compile(r"\b(job|jobs|vendors?|suppliers?|customers?|accounts?|account groups?|class(es)?|locations?|departments?|templates?|types?|codes?|models?|polic(y|ies)|users?|roles?|dimensions?|groups?|sets?|categor(y|ies)|terms?|reports?|views?|dashboards?|components?|checklists?|configurations?|funding sources?|projects?|permits?|employees?|positions?|contacts?|banks?|bank accounts?|books?|journals?|periods?|segments?|units?|entit(y|ies)|rules?|labels?|structures?|audiences?|investors?|properties|property|assets? class(es)?|cards?|budgets?)\b", re.I)


def is_master_data(obj):
    return bool(MASTER_NOUNS.search(obj)) and not TRANSACTION_NOUNS.search(obj)


# ---------------------------------------------------------------------------
# YARDI reference strings (reused by several topics)
# ---------------------------------------------------------------------------

Y = {
    'je': "Yardi Voyager: Financials > Journal Entry (single) or Journal Entry Batch (Add / Find Batch > Post). Recurring entries: Financials > Recurring Journal Entry.",
    'je_rev': "Yardi Voyager: Financials > Journal Entry > Find the JE > 'Reverse' function (enter reversal date/period); auto-reversing accruals via the 'Auto Reverse' flag on the JE.",
    'je_recurring': "Yardi Voyager: Financials > Recurring Journal Entry (set frequency, start/end period) and Tools > Post Recurring Journal Entries.",
    'je_approval': "Yardi Voyager: Journal entry workflow (Administration > Workflow setup) with approvers on the JE batch; unposted JE batches reviewed via Financials > Journal Entry Batch > Find Batch.",
    'alloc': "Yardi Voyager: Financials > Recurring Journal Entry using an allocation/percent table, or Commercial 'GL Allocation' / Payables 'Expense Pool' allocation of shared invoices across properties.",
    'prepaid': "Yardi Voyager: Financials > Recurring Journal Entry (monthly amortization DR expense / CR prepaid) or Payables 'Amortize' option on the payable detail line.",
    'accrual': "Yardi Voyager: Financials > Journal Entry with 'Auto Reverse' checked (accrual books), or Payables > Payable with 'Accrual' posting that reverses next period.",
    'books': "Yardi Voyager: Accrual vs Cash books are posted simultaneously (Book selector on JE/reports); adjusting/tax/GAAP books via Setup > Book (user-defined books) and 'Books' filter in Financial Analytics.",
    'stat': "Yardi Voyager: statistical (non-financial) accounts such as units, occupied units and square feet posted via Financials > Journal Entry to 'Statistical' account types or via Property > Unit statistics used in Financial Analytics ratios.",
    'coa': "Yardi Voyager: Setup > Chart of Accounts > Account (Add/Edit) and Financials > Account Trees (GL account trees/report groupings).",
    'dimension': "Yardi Voyager: property/entity hierarchy via Setup > Property and Property Lists (Setup > Property List), plus segments/attributes used as report filters.",
    'close': "Yardi Voyager: Financials > Closing > Post Month (AP and AR post-month per property) and Financials > Closing > Year End Close (closes P&L to retained earnings).",
    'budget': "Yardi Voyager: Financials > Budget (Budget Import / Budget editor by account and period) and Yardi Forecast IQ / Budgeting & Forecasting for workflow-driven budgets; variance via Financial Analytics > Budget Comparison.",
    'fx': "Yardi Voyager (international): Setup > Currency / Exchange Rates with realized/unrealized FX revaluation via Financials > Currency Revaluation.",
    'intercompany': "Yardi Voyager: Due To / Due From intercompany entries generated automatically by Payables (pay from a different cash property) or via Financials > Journal Entry with 'Intercompany' mapping (Setup > Intercompany Accounts).",
    'mgmt_fee': "Yardi Voyager: Financials > Management Fees (Management Fee setup per property with income account basis) > Calculate/Post Management Fees, which creates payables to the management company.",
    'fin_report': "Yardi Voyager: Analytics > Financial Analytics (Trial Balance, Income Statement, Balance Sheet, Budget Comparison, 12-Month Statement) or custom YSR/Report Designer financial packages.",
    'report_writer': "Yardi Voyager: Financial report formats via Setup > Report Formats / Account Trees with YSR (Yardi Spreadsheet Reports) or Report Designer; custom SQL reports via Yardi Toolkit/ETL.",
    'report_sched': "Yardi Voyager: Report Scheduler (Analytics > Report Scheduler / Task Runner) to email or save PDF/Excel financial packages on a schedule.",
    'import': "Yardi Voyager: Administration > Import (ETL / Yardi ETL templates such as GL journal, vendor, payable and budget CSV imports).",
    'audit': "Yardi Voyager: Audit trail via the 'History'/'Audit' function on each record and Administration > User Activity / Change Log reports.",
    'attach': "Yardi Voyager: Document Management (DMS) attachments via the 'Attach' / 'Documents' button on payables, journal entries and vendor records.",
    'ap_bill': "Yardi Voyager: Payables > Payable Entry (single invoice) or Payable Batch; OCR-scanned invoices via PAYscan > Invoice Register > Workflow.",
    'ap_recurring': "Yardi Voyager: Payables > Recurring Payable (set frequency, vendor, amount and expense account) and Tools > Post Recurring Payables.",
    'ap_adjust': "Yardi Voyager: Payables > Payable Entry with negative amount (credit memo) and apply in check processing; debit memos via a positive payable adjustment.",
    'ap_payment': "Yardi Voyager: Payables > Check Processing (Create Checks / Auto Pay with bank & property filters) > Print Checks; ACH/EFT via Payables > EFT (ACH) file generation.",
    'ap_manual': "Yardi Voyager: Payables > Manual Check (record a hand-written check or wire against open payables).",
    'ap_void': "Yardi Voyager: Payables > Check (find check) > Void Check (choose void date/period; option to reverse the payable as well).",
    'vendor': "Yardi Voyager: Payables > Vendor (Add/Edit vendor profile: remit-to, 1099, terms, insurance) and VendorCafe for vendor self-service onboarding & compliance.",
    '1099': "Yardi Voyager: Payables > 1099 Processing (1099 adjustments, 1099 Report/Export) driven by the vendor's 1099 flag and box on each payable.",
    'ap_aging': "Yardi Voyager: Analytics > Payable Analytics > Aging / Payable Register / Check Register reports.",
    'approval': "Yardi Voyager: PAYscan/Procure to Pay invoice & PO workflow approvals (Administration > Workflow setup, approval by amount/property) and 'My Approvals' inbox.",
    'po': "Yardi Procure to Pay: Purchase Order > PO Entry / PO Workflow, Receiving (Receive Items) and 3-way match into Payables; catalog ordering via Yardi Marketplace.",
    'contract': "Yardi Voyager / Procure to Pay: Service Contracts and Contract (Job Cost > Contract) with change orders; vendor bids via Yardi Construction Manager (Bid Management).",
    'expense_report': "Yardi Voyager: no native expense-report module; employee reimbursements are entered as Payables > Payable Entry to an employee vendor (or via PAYscan / Procure to Pay expense workflow).",
    'credit_card': "Yardi Voyager: Payables > Credit Card (credit card vendor/payable with card transactions coded to expense) and PAYscan credit card statement processing.",
    'petty_cash': "Yardi Voyager: petty cash replenishment via Payables > Payable Entry / Manual Check to the petty-cash custodian coded to expense accounts; petty cash GL account on Setup > Bank.",
    'escheat': "Yardi Voyager: Payables > Check Register (aged outstanding checks) > Void Check to unclaimed-property liability; state unclaimed property (escheatment) reporting via Payables reports.",
    'ai_ap': "No 1:1 Yardi Voyager equivalent. Closest: PAYscan OCR invoice capture with auto-coding (Yardi Virtuoso AI assistance) feeding the Payables invoice workflow.",
    'bank_rec': "Yardi Voyager: Financials > Bank Reconciliation (Bank Rec / Advanced Bank Rec) with Bank Rec Import (BAI2/CSV) and Auto-Match; reports via Bank Rec Report / Outstanding Items.",
    'bank_acct': "Yardi Voyager: Setup > Bank (bank GL cash account, check layout/MICR, next check number, Positive Pay and ACH origination settings) and Property > Bank assignment.",
    'deposit': "Yardi Voyager: Residents/Receivables > Receipt Batch > Deposit (Bank Deposit / Deposit Slip) and Financials > Bank Deposit reports.",
    'transfer': "Yardi Voyager: cash-to-cash transfer via Financials > Journal Entry (DR destination cash / CR source cash) or Payables pay-from-other-property generating Due To/Due From.",
    'other_receipt': "Yardi Voyager: Receivables > Receipt (Miscellaneous/Other Receipt to a GL account) or Residents > Receipt Batch for non-rent income.",
    'positive_pay': "Yardi Voyager: Payables > Positive Pay (export check issue file per bank from Setup > Bank Positive Pay format).",
    'ach_setup': "Yardi Voyager: Setup > Bank > ACH/EFT settings (NACHA origination) and Payables > EFT for vendor ACH payments; vendor bank info on Payables > Vendor > EFT tab.",
    'cash_forecast': "Yardi Voyager: Analytics > Cash Flow / Cash Position reports (Available Cash) and Yardi Forecast IQ cash projections.",
    'ar_charge': "Yardi Voyager: Residents > Charge / Charge Batch (one-time charges) and recurring charges on the resident/tenant ledger (Tenant > Charges tab); commercial billing via Receivables > Charge.",
    'ar_receipt': "Yardi Voyager: Residents > Receipt / Receipt Batch (apply to open charges by priority) and RentCafe / ePayments auto-posted receipts.",
    'ar_adjust': "Yardi Voyager: Residents > Charge (negative adjustment/credit), Concession charge codes, and Residents > Write Off (Collections) for bad debt.",
    'ar_nsf': "Yardi Voyager: Residents > Receipt > Reverse (NSF) which re-opens the charges and can auto-post the NSF fee charge.",
    'ar_customer': "Yardi Voyager: Residents/Tenants > Tenant (resident profile, lease, contacts) or Receivables > Customer for non-resident (other) receivables.",
    'ar_aging': "Yardi Voyager: Analytics > Receivable Analytics > Aging (Resident Aging / Delinquency) and Resident Ledger reports.",
    'ar_deposit_sec': "Yardi Voyager: Residents > Move Out > Deposit Accounting / Final Account Statement (FAS) applying security deposits, with refund checks generated in Payables.",
    'deferred_rev': "Yardi Voyager: prepaid rent / deferred revenue handled via prepayment charge codes and Commercial revenue straight-line (Commercial > Straight-Line Rent).",
    'tax': "Yardi Voyager: Setup > Charge Codes / Tax setup (sales tax, VAT/GST codes for international) applied on charges and payables.",
    'fcm': "No dedicated Yardi Voyager close-management workspace. Closest: Yardi Task Runner / workflow checklists plus Financials > Closing > Post Month; many owners use BlackLine or FloQast alongside Voyager.",
    'workpaper': "No native Yardi Voyager work-paper packager. Closest: Report Scheduler financial packages plus Document Management (DMS) for reconciliations and supporting schedules.",
    'jobcost': "Yardi Voyager Job Cost: Job Cost > Job (job setup, category/cost codes, budget), Contract, Change Order, Draw; Yardi Construction Manager for bids and project management.",
    'jobcost_draw': "Yardi Voyager Job Cost: Job Cost > Draw (build draw from contract/job costs, draw report, AIA G702/G703) and lender draw receipts via Receivables/JE.",
    'reserve': "Yardi Voyager: replacement reserve escrow tracked via Job Cost jobs funded by reserve accounts and escrow GL accounts; reserve draw requests produced from Job Cost > Draw reports.",
    'fixed_asset': "Yardi Voyager Fixed Assets: Fixed Assets > Asset (Add/Edit, class, method, life), Fixed Assets > Depreciation (calculate & post), Asset Disposal / Transfer.",
    'investor': "Yardi Investment Manager (IM): investors, commitments, capital calls, distributions & waterfalls, investor portal; Voyager GL receives the equity entries.",
    'dashboard': "Yardi Voyager: role-based Dashboards (Voyager Dashboard/Home page widgets) and Yardi Business Intelligence (YBI) / Orion analytics.",
    'security': "Yardi Voyager: Administration > Security (User, Role/Group, menu and property-list permissions) and Administration > Password/SSO settings.",
    'company': "Yardi Voyager: Administration > System Settings / Setup (Property, Entity, fiscal calendar, system options) and Property setup screens.",
    'platform': "Yardi Voyager: custom fields/filters via Setup > Custom Fields & Yardi Toolkit (SQL scripts, custom reports), plus Administration > Workflow setup for event-driven rules.",
    'time': "No native timesheet module in Yardi Voyager property accounting. Closest: Yardi Corporate Solutions / Yardi Time & Expense and payroll allocation journal entries.",
    'vat': "Yardi Voyager (international/commercial): VAT/GST tax codes on charge codes and payables with VAT returns via tax reports.",
    'mobile': "Yardi Voyager mobile: PAYscan Mobile and Procure to Pay mobile approvals, Yardi Maintenance Mobile, and Voyager mobile dashboards.",
    'help': "Yardi Client Central (support portal/knowledge base) and Yardi Aspire (training) — equivalent support channels for Voyager users.",
    'spend': "Yardi Procure to Pay (VendorCafe + PAYscan + Marketplace): requisition → PO → receipt → invoice match → Payables workflow.",
    'full_service': "No direct Yardi equivalent; closest is outsourced invoice processing through PAYscan invoice capture (Yardi Invoice Processing Services).",
    'loan': "Yardi Voyager: Financials > Loan/Debt tracking (Commercial 'Debt Management' / Yardi Investment Manager debt module) with interest/principal payables.",
    'workbench': "Yardi Voyager: Filter-based 'Find' screens and Analytics grids (e.g., Financials > Journal Entry > Find Batch, Payables > Payable > Find) with Excel export.",
    'site_view': "Yardi Voyager: property-level role security (site staff menus via Administration > Security with property lists) and property dashboards.",
    'storefront': "Yardi Marketplace (catalog purchasing with punchout suppliers) feeding Procure to Pay purchase orders.",
}

# ---------------------------------------------------------------------------
# TOPICS: ordered, first match wins.  rx is matched against the node title;
# when no title match exists the parents' titles are tried, then the manual
# default.  `mods` limits where a topic can match (None = anywhere).
#   gl   : entry created when the transaction posts (None = no GL entry)
#   rev  : reversal / void entry
#   yardi: Yardi Voyager equivalent
#   why  : operational reasons the accountant is on this screen / records appear
#   next : downstream workflow after the action
#   ctx  : one-line multifamily context appended to the purpose
#   ctl  : control check added to the SOP
# ---------------------------------------------------------------------------

T = []


def topic(key, rx, gl=None, rev=None, yardi='workbench', why=(), next='', ctx='', ctl='', mods=None, weak=False, flags=re.I):
    T.append({
        'key': key, 'rx': re.compile(rx, flags), 'gl': gl, 'rev': rev,
        'yardi': Y.get(yardi, yardi), 'why': list(why), 'next': next, 'ctx': ctx, 'ctl': ctl,
        'mods': set(mods) if mods else None, 'weak': weak,
    })


NO_GL_RPT = None

# --- Help / platform basics ------------------------------------------------
topic('help', r"help and support|client portal|support and error|downloading realpage|guides?$|how to read paths|unified platform help|notation|conventions|release notes",
      yardi='help',
      why=["Accountant needs product documentation, a support case, or an error ID to escalate a system issue.",
           "Onboarding offshore staff who must learn RealPage navigation conventions before processing transactions."],
      next="Support case or documentation lookup; no transactional workflow is triggered.",
      ctx="Knowing how to reach support quickly shortens month-end blockers such as posting errors or locked periods.",
      ctl="Capture the Support/Error ID and screenshot before opening a ticket so the issue can be reproduced.")

topic('attachments', r"attach|scann|document(s)? (section|management)|supporting document|files? (list|page)|cloud-?storage",
      yardi='attach',
      why=["Audit support (invoice images, bank statements, JE calculations) must be stored with the transaction.",
           "External auditors and asset managers request backup for every material entry during quarterly/annual reviews."],
      next="The file is linked to the record and travels with it into approval queues, audit trails and work-paper packages.",
      ctx="Every JE, invoice and reconciliation in an institutional multifamily portfolio needs retrievable backup for audit.",
      ctl="Confirm the attachment opens and is the final, signed/approved version before posting the related transaction.")

topic('audit_trail', r"audit trail|transaction log|activity log|change log|history\b|execution log|approval history",
      yardi='audit',
      why=["Investigating who created, edited, approved or posted a record and when.",
           "Auditor or controller request to evidence segregation of duties and approval before posting."],
      next="Findings feed the audit PBC list, variance explanations, or a correcting/reversing entry.",
      ctx="Audit trails evidence SOX-style controls expected by institutional owners and lenders.",
      ctl="Export the audit trail to PDF/Excel and file it with the month-end work papers when used as audit evidence.")

# --- Import ----------------------------------------------------------------
topic('import_generic', r"import (preparation|boxes?|instructions|errors?)|resolving import|handling import|import error|csv file|data import wizard|template from the import|filling in an import|automating imports|import (box|page|data)",
      gl="Depends on the imported object: transaction imports (journal entries, A/P or A/R invoices, payments) post their own DR/CR lines exactly as if keyed; master-data imports (accounts, vendors, customers, locations) create no GL entries.",
      yardi='import',
      why=["Conversions/onboarding of new properties (beginning balances, open A/P and A/R, vendors) from a prior system such as Yardi.",
           "High-volume monthly loads (payroll JEs, utility billing, bank files) that are faster to import than to key."],
      next="Imported rows appear in their target list or journal; errors are listed in the import error file for correction and re-import.",
      ctx="Property take-overs and acquisitions require bulk loading of opening balances and open items with a clean cut-off date.",
      ctl="Always test with a small file first; RealPage does not check for duplicate journal entries on import, so confirm the file has not already been loaded.")

# --- Glossary-like fallback handled by builder -----------------------------

# --- AI Finance Agent --------------------------------------------------------
topic('ai_agent', r"\bAI\b|finance agent|lumina|daily brief|agent (workforce|performance|roles)|machine learning|auto-?coding|smart (coding|match)",
      gl="The agent itself posts nothing; invoices it captures/codes post on final approval: DR 6xxx Operating Expense (e.g., 6110 Repairs & Maintenance) / CR 2010 Accounts Payable.",
      yardi='ai_ap',
      why=["Invoices captured by AI (email/upload OCR) are waiting for coding confirmation, duplicate checks or exception handling.",
           "Monitoring AI accuracy (auto-coded vs. corrected) and processing throughput for the AP team."],
      next="Validated AI invoices move into the standard A/P approval workflow and then into payment selection.",
      ctx="AI capture reduces manual keying for high-volume multifamily AP (utilities, turn costs, contract services) but still requires human review of coding and property allocation.",
      ctl="Spot-check AI-suggested GL codes, property/location and invoice dates against the invoice image before approving.")

# --- Approvals ---------------------------------------------------------------
topic('approval', r"approv|approval (policy|policies|workbench|queue|levels?|workflow)|delegat|reviewer polic|requester|policy type|declin|dispute|escalat|approver",
      gl="The approval step itself creates no GL entry; final approval releases the transaction to post (e.g., A/P bill: DR 6xxx Expense / CR 2010 Accounts Payable; journal entry: its balanced DR/CR lines).",
      yardi='approval',
      why=["Transactions (invoices, POs, JEs, payments, bank recs) exceed an approval threshold and are routed to the next approver.",
           "Items are stuck because an approver is out of office, lacks rights for the property, or the policy has no eligible approver."],
      next="Approved items post (or move to the next approval level); declined items return to the submitter's draft/declined list for correction.",
      ctx="Approval matrices by property and dollar limit enforce owner/asset-manager authority limits in institutional multifamily portfolios.",
      ctl="Never approve your own transaction; verify backup and coding before approving because final approval posts to the GL.")

# --- Spend management / Purchasing -------------------------------------------
topic('storefront', r"storefront|punch-?out|catalog|marketplace|shopping|cart\b|saved items|product configurator",
      gl="No GL impact at order; the resulting vendor invoice posts DR 6xxx Operating Expense (or 1410 CIP for capital) / CR 2010 Accounts Payable when approved.",
      yardi='storefront',
      why=["Site teams order supplies (make-ready, HVAC parts, appliances) through approved catalogs and punchout vendors.",
           "Catalog mapping or pricing issues prevent orders from converting to purchase orders."],
      next="Cart converts to a purchase order, then to a received PO and finally to a matched A/P invoice.",
      ctx="Catalog purchasing enforces national pricing agreements and budget control at the property.",
      ctl="Confirm the catalog item maps to the correct GL account (R&M vs. capital) before the PO is approved.")

topic('purchase_order', r"purchas(e|ing)|requisition|\bPOs?\b|receiv(e|ing) (items|goods)|receipt of goods|package purchase|service order|invoice matching|3-way|three-way|match(ing)? .*purchase",
      gl="No GL impact when a PO is created or approved (commitment only). Receiving may accrue if configured (DR 6xxx Expense / CR 2020 Accrued Expenses); the matched vendor invoice posts DR 6xxx Expense (or 1410 CIP) / CR 2010 Accounts Payable.",
      rev="Closing or cancelling a PO releases the open commitment/budget reservation; no GL entry unless a receipt accrual exists, which is reversed (DR 2020 / CR 6xxx).",
      yardi='po',
      why=["Purchases above the property's PO threshold require an approved purchase order before the vendor performs work.",
           "Open POs awaiting receipt or invoice match show committed spend against the budget."],
      next="Approved PO → receipt → vendor invoice matched to the PO (2- or 3-way match) → A/P approval → payment.",
      ctx="PO control prevents unbudgeted spend and supports budget-vs-actual commitments reporting to owners.",
      ctl="Check remaining budget and vendor compliance (W-9, COI) before approving; close short-shipped POs so commitments do not overstate.")

topic('contract', r"contract|subcontract|\bbids?\b|bidding|commitment|change order|service contract|job type polic",
      gl="No GL impact for the contract/commitment itself (tracked as committed cost). Invoices billed against it post DR 1410 Construction in Progress (capital) or 6xxx Contract Services (operating) / CR 2010 Accounts Payable, with retainage withheld to CR 2015 Retainage Payable.",
      rev="Voiding/closing a contract or change order releases the remaining commitment; posted invoices are unaffected.",
      yardi='contract',
      why=["Capital projects, renovations and recurring service agreements (landscaping, pest, trash) are tracked against a contracted amount.",
           "Change orders increase/decrease the committed amount and must be approved before additional billing."],
      next="Contract drives commitment reporting (committed vs. billed vs. remaining) and limits vendor billing; retainage is released at completion.",
      ctx="Contract and change-order control is essential for renovation (value-add) programs and lender-funded capital projects.",
      ctl="Reconcile billed-to-date plus retainage to the contract value; block invoices that exceed the approved contract plus change orders.")

topic('full_service', r"full service|invoice processing upload|exception queue|invoice exception",
      gl="No GL impact while in processing/exception; once the outsourced team completes the invoice and it is approved: DR 6xxx Expense / CR 2010 Accounts Payable.",
      yardi='full_service',
      why=["Invoices uploaded for outsourced (Full Service) processing need missing data, vendor setup, or coding resolved.",
           "Exception items (unknown vendor, duplicate, missing PO/receipt) are quarantined until the property responds."],
      next="Resolved invoices return to the A/P workflow for approval and payment scheduling.",
      ctx="Outsourced AP processing depends on fast site-team responses to exceptions to avoid late fees and utility shut-off notices.",
      ctl="Age the exception queue weekly; utility and insurance invoices must be cleared before due date.")

# --- Expense reports / staff expenses ----------------------------------------
topic('expense_report', r"expense report|staff expense|employee expense|reimburs|expense type|expenses?\b.*(mobile|app)|draft expense|unapproving \(expense",
      gl="On approval/posting: DR 6xxx Expense (e.g., 6410 Administrative, 6310 Marketing) / CR 2150 Employee Reimbursements Payable; on reimbursement payment: DR 2150 / CR 1110 Operating Cash.",
      rev="Reversal re-opens the liability: DR 2150 Employee Reimbursements Payable / CR 6xxx Expense (or reverses the reimbursement payment: DR 1110 / CR 2150 if the payment is voided).",
      yardi='expense_report',
      why=["Site and regional staff submit out-of-pocket purchases (mileage, supplies, resident events) for reimbursement.",
           "Expense reports awaiting approval or reimbursement are aging and need follow-up."],
      next="Approved expense reports become payable to the employee and are selected for reimbursement in the payment run.",
      ctx="Employee reimbursements must be coded to the correct property and GL, and receipts retained for audit.",
      ctl="Verify receipts, business purpose and property coding; personal or non-reimbursable items must be rejected.")

# --- Credit cards / PC cards ---------------------------------------------------
topic('pc_card', r"\bPC (card|charges?)\b|petty cash (card|debit)|debit card|card limit|lost or stolen|issuing pc",
      gl="Card purchases post DR 6xxx Expense (property R&M, supplies) / CR 1120 Petty Cash (debit-card funding account) or CR 2140 Credit Card Payable; card funding/replenishment posts DR 1120 Petty Cash / CR 1110 Operating Cash.",
      rev="Reversing a card charge posts DR 1120 Petty Cash (or 2140) / CR 6xxx Expense.",
      yardi='petty_cash',
      why=["Site teams use prepaid/debit purchasing cards for small maintenance purchases instead of petty cash.",
           "Card transactions need coding, receipts and approval before month-end."],
      next="Coded card charges post to the GL and the card account is reconciled like a bank account.",
      ctx="Purchasing cards replace cash boxes at properties and give real-time visibility of site spend.",
      ctl="Every card charge needs a receipt and property/GL coding; reconcile card statements monthly.")

topic('credit_card', r"credit card|charge card|card transaction|card account|card statement",
      gl="Card charges post DR 6xxx Expense / CR 2140 Credit Card Payable; paying the card statement posts DR 2140 Credit Card Payable / CR 1110 Operating Cash (or DR 2140 / CR 2010 A/P when paid as an invoice).",
      rev="Reversing a charge or fee: DR 2140 Credit Card Payable / CR 6xxx Expense.",
      yardi='credit_card',
      why=["Corporate/regional card purchases (software subscriptions, travel, online supplies) must be coded to properties.",
           "Card statement reconciliation and payment are month-end tasks."],
      next="Posted card charges appear on the card account register for reconciliation and are paid via the card statement payment.",
      ctx="Card spend at the property/regional level must be allocated to the right property GLs for owner reporting.",
      ctl="Reconcile the card register to the issuer statement; unreconciled charges older than 30 days need follow-up.")

# --- Escheatment ---------------------------------------------------------------
topic('escheat', r"escheat|aged payable|unclaimed",
      gl="Marking an outstanding check escheated: void/transfer DR 1110 Operating Cash (reinstates the uncashed check) / CR 2170 Unclaimed Property Payable; remitting to the state: DR 2170 Unclaimed Property Payable / CR 1110 Operating Cash.",
      rev="Un-marking restores the original outstanding item; reverses DR 2170 / CR 1110 if already recorded.",
      yardi='escheat',
      why=["Vendor or resident refund checks remain uncashed beyond the state dormancy period (commonly 1–5 years).",
           "Annual state unclaimed-property filing requires identifying, noticing and remitting dormant items."],
      next="Escheated items drop off the outstanding-check list and the liability is reported/remitted to the state.",
      ctx="Uncashed resident deposit refunds and vendor checks are a common escheatment exposure for multifamily owners.",
      ctl="Perform due-diligence outreach before escheating and keep the state filing receipt with the work papers.")

# --- 1099 / vendors ------------------------------------------------------------
topic('1099', r"1099|tax id|\bW-?9\b|tin match|form 1096|backup withholding",
      yardi='1099',
      why=["Year-end 1099-NEC/1099-MISC reporting requires correct vendor tax IDs, 1099 flags and box assignments.",
           "Payments were coded to the wrong 1099 box or a vendor's 1099 status changed mid-year."],
      next="1099 totals feed the year-end 1099 forms and e-file; corrections flow into the next 1099 run.",
      ctx="Property owners (often LPs/LLCs) must issue 1099s to contractors and attorneys paid over the IRS threshold.",
      ctl="TIN-match vendor tax IDs and reconcile 1099 totals to the vendor payment register before filing.")

topic('vendor', r"vendor|supplier|payee|pay-?to|remit|contact(s)?\b|merging duplicate|visibility",
      gl=None,
      yardi='vendor',
      why=["A new vendor must be set up (W-9, remit-to address, ACH info, insurance) before invoices can be entered or paid.",
           "Duplicate, inactive or non-compliant vendors (expired COI/W-9) block invoice processing and payment."],
      next="Active, approved vendors become selectable on invoices, POs and contracts and eligible for payment runs.",
      ctx="Vendor master data controls fraud risk (bank-change requests) and 1099 compliance in multifamily AP.",
      ctl="Verify bank-account changes by call-back to a known number; never change remit/ACH details from an email request alone.",
      mods=['ap', 'gl', 'cash', 'jobcost', 'reporting', 'budgeting', 'close'])

# --- Recurring AP ---------------------------------------------------------------
topic('ap_recurring', r"recurring (a/p|ap|invoice|bill|payable)|recurring invoices?\b",
      gl="Each generated occurrence posts DR 6xxx Expense (e.g., 6210 Utilities, 6110 Contract Services) / CR 2010 Accounts Payable on its scheduled date.",
      rev="Stopping a schedule has no GL impact; reversing a generated occurrence posts DR 2010 A/P / CR 6xxx Expense.",
      yardi='ap_recurring', mods=['ap', 'gl', 'cash', 'reporting', 'close'],
      why=["Fixed monthly obligations (service contracts, leases, loan payments) are generated automatically.",
           "A recurring schedule failed, needs a price change, or should be ended at contract expiration."],
      next="Generated invoices enter the A/P approval workflow (if enabled) and then payment selection.",
      ctx="Recurring payables keep fixed monthly contract costs from being missed at month-end.",
      ctl="Review recurring schedules quarterly against current contracts; end-date them when contracts terminate.")

topic('mgmt_fee', r"management fee|\bfees?\b|fee template|percentage fees|rerun a posted fee|unpost a fee",
      gl="Calculated fee posts DR 6510 Management Fees Expense / CR 2010 Accounts Payable (payable to the management company) or CR 2130 Due To Affiliates; the management company side records DR 1230 Due From / CR 4xxx Fee Income.",
      rev="Unposting/recalculating a fee reverses the fee invoice: DR 2010 Accounts Payable / CR 6510 Management Fees, then re-posts the corrected amount.",
      yardi='mgmt_fee', mods=['ap', 'gl', 'reporting'],
      why=["Monthly management fees are calculated as a percentage of collected income (per management agreement).",
           "Fees must be recalculated after late receipts, corrections or reclasses to the income base."],
      next="Fee invoices enter A/P for payment to the management company and appear on the owner's income statement.",
      ctx="Management agreements typically set fees at 2–4% of effective gross income; the fee base must follow the agreement definition.",
      ctl="Tie the fee base to the income statement accounts named in the management agreement before posting.")

# --- AP adjustments / advances ---------------------------------------------------
topic('ap_adjust', r"(a/p|ap) adjustment|credit memo|debit memo|debit adjustment|credit adjustment|adjustment number|vendor credit",
      gl="Credit adjustment (vendor credit memo): DR 2010 Accounts Payable / CR 6xxx Expense (reduces cost). Debit adjustment: DR 6xxx Expense / CR 2010 Accounts Payable.",
      rev="Reversing the adjustment posts the opposite entry and re-opens/reduces the vendor balance.",
      yardi='ap_adjust', mods=['ap', 'gl', 'cash', 'reporting', 'jobcost'],
      why=["Vendor issued a credit (overbilling, returned goods, rebate) that must reduce the open balance.",
           "Small balance differences or finance charges need to be adjusted to match the vendor statement."],
      next="Adjustments are applied against open invoices in the next payment run and appear on the vendor aging.",
      ctx="Vendor statement reconciliations at month-end surface credits that must be recorded and applied.",
      ctl="Apply credits to specific invoices; unapplied vendor credits distort the aging and can be double-paid.")

topic('ap_advance', r"advance",
      gl="Vendor advance/prepayment: DR 1310 Prepaid Expenses (Vendor Advances) / CR 1110 Operating Cash; when applied to the invoice: DR 2010 Accounts Payable / CR 1310 Prepaid Expenses.",
      rev="Reversing an advance: DR 1110 Operating Cash / CR 1310 Prepaid Expenses (or re-opens the applied invoice).",
      yardi='ap_manual', mods=['ap'],
      why=["Vendor requires a deposit before work starts (e.g., appliance order, contractor mobilization).",
           "Advances are awaiting application to the final invoice."],
      next="Advance sits as an asset until the vendor invoice arrives and the advance is applied.",
      ctx="Deposits to contractors must be tracked so they are not expensed twice when the final invoice posts.",
      ctl="Review unapplied advances monthly and apply or collect them.")

# --- AP payments -----------------------------------------------------------------
topic('ap_void', r"void|reprint|fixing and reprinting|stop payment",
      gl="Void: DR 1110 Operating Cash / CR 2010 Accounts Payable (bill re-opened for payment); if the bill is voided too, the expense is also reversed (DR 2010 / CR 6xxx).",
      rev="Voiding is itself the reversal of the payment entry DR 2010 A/P / CR 1110 Cash.",
      yardi='ap_void', mods=['ap', 'cash', 'gl'],
      why=["Check lost, stale-dated, printed with errors, or payee requests a re-issue.",
           "Payment sent to the wrong vendor/amount or duplicate payment detected."],
      next="The invoice returns to open status for re-payment (or is closed if also voided); the item leaves the bank rec outstanding list.",
      ctx="Void dates matter: void in the current open period, not the original period, when that period is closed.",
      ctl="Confirm the check has not cleared the bank (check bank portal/positive pay) before voiding; place a stop-payment if it was mailed.")

topic('ap_manual_pay', r"manual (payment|check)|hand-?written|wire (payment|transfer)|record(ing)? (a )?payment|payment request",
      gl="DR 2010 Accounts Payable (or directly DR 6xxx Expense for a quick payment) / CR 1110 Operating Cash.",
      rev="Reversal: DR 1110 Operating Cash / CR 2010 Accounts Payable.",
      yardi='ap_manual', mods=['ap', 'cash', 'gl', 'jobcost'],
      why=["Payment made outside the system check run (wire, hand check, bank debit) must be recorded.",
           "Emergency vendor payment (utility disconnect, insurance premium) was released before entry."],
      next="The payment clears the invoice and appears in the bank reconciliation as an outstanding item until it clears.",
      ctx="Wires and auto-debits (utilities, loan payments, taxes) are common at multifamily properties and must be recorded before the bank rec.",
      ctl="Match the payment date and amount to the bank confirmation; avoid paying the same invoice again in the next check run.")

topic('ap_payment', r"pay(ing)?\b|payments?\b|check run|checks?\b|print(ing)? checks|ACH|EFT|BACS|disburse|payment method|payment (provider|services)|outbound|remittance|partial(ly)? pay|separate payments|auto(matic)? pay|check (alignment|stub|layout|configuration)|signature",
      gl="Payment posts DR 2010 Accounts Payable / CR 1110 Operating Cash (per bank account). Discounts taken: CR 6xxx Expense or 4xxx Discounts Earned; cross-entity payments add DR 1230 Due From / CR 2130 Due To.",
      rev="Void/reversal posts DR 1110 Operating Cash / CR 2010 Accounts Payable and re-opens the invoice.",
      yardi='ap_payment', mods=['ap', 'cash', 'gl', 'reporting', 'jobcost', 'close'],
      why=["Approved, due invoices are selected for the weekly check/ACH run.",
           "Payment exceptions (insufficient available cash, vendor on hold, missing ACH details) must be resolved before release."],
      next="Payments print/transmit, the invoices close, and the payments appear as outstanding items in the bank reconciliation until cleared.",
      ctx="Weekly payment runs must respect property available cash, owner funding and vendor terms to avoid late fees.",
      ctl="Review the payment proposal against available cash and the approved invoice list; send Positive Pay files the same day checks print.")

topic('ap_bill', r"(a/p|ap) invoice|invoice research|enter ap invoice|bill\b|bills\b|invoices?\b|einvoice|oinvoice|reclassif|missing expenses|accrued expenses? report|invoice data|split(ting)? .*invoice",
      gl="Posted A/P invoice: DR 6xxx Operating Expense (e.g., 6110 Repairs & Maintenance, 6210 Utilities) or 1410/1530 Capital / 1310 Prepaid / CR 2010 Accounts Payable. Reclass moves the debit between accounts/properties without touching A/P.",
      rev="Reversing/voiding an unpaid invoice posts DR 2010 Accounts Payable / CR 6xxx Expense in the reversal period.",
      yardi='ap_bill', mods=['ap', 'gl', 'reporting', 'mobile', 'close', 'cash', 'budgeting'],
      why=["Vendor invoices (utilities, contract services, turn costs, capital work) must be entered, coded and approved.",
           "Invoices are held for coding corrections, missing approvals, duplicate checks or wrong property/period."],
      next="Posted invoices appear on the A/P aging and payment selection; reclasses update the income statement by property.",
      ctx="Accurate invoice coding by property and GL drives the owner's operating statement and budget variance commentary.",
      ctl="Check for duplicate invoice numbers per vendor, confirm service period for accrual cut-off, and verify capital vs. expense coding.",
      )

topic('ap_subledger', r"subledger|close calendar|a/p close|period close|close (the )?(a/p|ap) ",
      gl="No entries are created; closing the A/P subledger blocks further A/P postings (invoices, payments, adjustments) into the closed period.",
      yardi='close',
      why=["Month-end cut-off: A/P must be closed after all invoices and accruals for the period are posted.",
           "A late invoice requires re-opening the subledger with controller approval."],
      next="Closed subledgers let the GL period be closed and financial statements issued.",
      ctx="Locking subledgers prevents backdated postings after owner reports are delivered.",
      ctl="Obtain controller approval before re-opening any closed subledger period.",
      mods=['ap', 'cash', 'ar', 'gl', 'close'])

# --- Cash management ---------------------------------------------------------------
topic('bank_rec', r"reconcil|bank rec|open items|outstanding|cleared|adjusted items|statement balance|in-transit|matching rule|rule set|auto-?match|unmatch",
      gl="Matching/clearing items creates no GL entry. Reconciling adjustments recorded from the rec post normally, e.g., bank fees DR 6420 Bank Charges / CR 1110 Operating Cash; interest income DR 1110 Operating Cash / CR 4190 Interest Income.",
      rev="Reopening/unreconciling a statement creates no GL entry but reverts cleared items to outstanding; adjustments must be reversed separately.",
      yardi='bank_rec', mods=['cash', 'gl', 'close', 'ap', 'ar', 'reporting'],
      why=["Monthly bank reconciliation for every operating, security-deposit and reserve account.",
           "Unmatched bank activity (bank fees, returned items, deposits in transit, outstanding checks) must be explained."],
      next="The completed, approved reconciliation is finalized and the adjusted book balance ties to the Trial Balance cash account.",
      ctx="Bank recs are the #1 month-end control reviewed by owners, lenders and auditors; unreconciled differences are escalated.",
      ctl="Reconciled book balance must equal the GL cash balance and bank statement ending balance adjusted for outstanding items; investigate items older than 90 days.")

topic('bank_feed', r"bank (feed|file|transaction|statement)s?|upload bank|bank transactions|excluding bank|exclude|bai2?|bank data",
      gl="Importing/matching bank transactions creates no GL entry. Creating a transaction from an unmatched bank line posts it, e.g., DR 6420 Bank Charges / CR 1110 Operating Cash or DR 1110 Operating Cash / CR 4190 Interest Income.",
      yardi='bank_rec', mods=['cash', 'gl', 'ap', 'close', 'reporting'],
      why=["Daily bank activity feeds are matched to recorded deposits and payments.",
           "Bank-only items (fees, auto-debits, wires) need GL transactions created."],
      next="Matched items clear in the reconciliation; created transactions post to the GL and clear the bank line.",
      ctx="Daily bank matching shortens month-end close for large multifamily portfolios.",
      ctl="Do not exclude bank lines without documented reason; excluded items drop out of the reconciliation.")

topic('security_deposit', r"security deposit|resident deposit|pet deposit|deposit (refund|accounting|audit)|move[- ]out|\bFAS\b",
      gl="Collection: DR 1115 Security Deposit Cash / CR 2110 Resident Security Deposits. Move-out application: DR 2110 Security Deposits / CR 1210 A/R (charges) and refund DR 2110 / CR 1115 Cash.",
      rev="Reversal of a deposit refund: DR 1115 Cash / CR 2110 Security Deposits.",
      yardi='ar_deposit_sec', mods=['ar', 'cash', 'ap', 'gl', 'close', 'reporting'],
      why=["Resident moved out; deposit must be applied to damages/unpaid rent and the balance refunded within the state deadline.",
           "Security deposit liability must reconcile to the trust bank account."],
      next="Refund checks are paid through A/P; remaining balances go to collections.",
      ctx="State laws impose strict deadlines (often 14–30 days) for deposit disposition letters.",
      ctl="Security deposit liability (2110) should reconcile to the resident deposit listing monthly.")


topic('deposit', r"(?<!security )(?<!resident )(?<!pet )deposit(s|ing)?\b|undeposited|deposit slip|reversing deposits|payment in a deposit",
      gl="Deposit: DR 1110 Operating Cash / CR 1130 Undeposited Funds (receipts previously recorded DR 1130 / CR 1210 A/R or income).",
      rev="Reversing a deposit: DR 1130 Undeposited Funds / CR 1110 Operating Cash (payments return to undeposited funds).",
      yardi='deposit', mods=['cash', 'ar', 'gl', 'reporting', 'close'],
      why=["Receipts collected at the property or through lockbox must be grouped into the bank deposit.",
           "Deposit totals must match the bank's daily credits for reconciliation."],
      next="Deposits appear in the bank reconciliation as deposits in transit until cleared.",
      ctx="Daily deposits of rent receipts must tie to the bank to detect missing or diverted cash.",
      ctl="Deposit total must equal the bank credit; investigate any deposit not cleared within 3 business days.")

topic('transfer', r"transfer|sweep|funds? movement|wiring instructions|owner distribution|distribution",
      gl="Bank transfer: DR 1110 destination cash (e.g., 1340 Reserve Escrow) / CR 1110 source cash. Cross-entity transfers add DR 1230 Due From Affiliates / CR 2130 Due To Affiliates. Owner distributions: DR 3020 Distributions / CR 1110 Operating Cash.",
      rev="Reversal posts the mirror image entry and re-opens the transfer in the bank reconciliation.",
      yardi='transfer', mods=['cash', 'gl', 'reporting', 'ap'],
      why=["Operating cash sweeps to a concentration account, reserve funding, or owner distributions.",
           "Transfers between properties/entities to cover payables or payroll."],
      next="Both sides appear in their bank reconciliations; cross-entity transfers create intercompany balances to settle.",
      ctx="Cash sweeps and distributions must follow the partnership agreement and lender cash-management rules.",
      ctl="Confirm both sides of the transfer are recorded in the same period and intercompany balances net to zero.")

topic('other_receipt', r"other receipt|receipts? register|miscellaneous receipt|interest and charges|bank interest",
      gl="Other receipt: DR 1110 Operating Cash (or 1130 Undeposited Funds) / CR 4xxx Other Income (e.g., 4190 Interest Income, 4100 Other Income) or a balance sheet account. Bank charges: DR 6420 Bank Charges / CR 1110 Operating Cash.",
      rev="Reversal: DR 4xxx Other Income / CR 1110 Operating Cash.",
      yardi='other_receipt', mods=['cash', 'ar', 'gl', 'reporting', 'close'],
      why=["Non-A/R cash (interest, insurance claims, laundry income, refunds) must be recorded.",
           "Bank interest and service charges appear on the statement and must be booked before reconciling."],
      next="Receipts are deposited and clear in the bank reconciliation.",
      ctx="Ancillary income (laundry, vending, cable revenue share) is often received outside the resident ledger.",
      ctl="Code other receipts to the correct income/liability account — insurance proceeds are not operating income.")

topic('petty_cash', r"petty cash|cash box|replenish",
      gl="Replenishment: DR 6xxx Expenses (per receipts) / CR 1110 Operating Cash; establishing the fund: DR 1120 Petty Cash / CR 1110 Operating Cash.",
      rev="Reversal of a replenishment: DR 1110 Operating Cash / CR 6xxx Expense.",
      yardi='petty_cash', mods=['cash', 'ap'],
      why=["Site petty cash fund is replenished based on receipts.", "Petty cash count/reconciliation at month-end."],
      next="Replenishment check/payment restores the imprest balance.",
      ctx="Imprest petty cash funds at properties must be counted and reconciled monthly.",
      ctl="Receipts + cash on hand must equal the imprest amount.")

topic('available_cash', r"available cash|cash (forecast|flow|position|requirements)|funding",
      gl="No GL impact — calculates cash available to pay invoices after reserves/minimum balances.",
      yardi='cash_forecast', mods=['cash', 'ap', 'reporting', 'budgeting'],
      why=["Deciding which invoices can be paid this week given property cash and minimum balance requirements.",
           "Requesting owner funding (cash call) when a property cannot cover payables."],
      next="Drives payment selection and owner funding requests.",
      ctx="Many multifamily owners require minimum operating cash balances; payments beyond available cash need a cash call.",
      ctl="Reconcile available cash to the bank balance less outstanding checks before releasing payments.")

topic('positive_pay', r"positive pay",
      yardi='positive_pay', mods=['cash', 'ap', 'gl'],
      why=["Banks require an issued-check file to prevent check fraud.", "A check was rejected by the bank as an exception item."],
      next="Bank compares presented checks to the issued file and flags exceptions for decision.",
      ctx="Positive Pay is a standard fraud control required by most institutional owners.",
      ctl="Transmit the Positive Pay file the same day checks are printed; decision exceptions before the bank cut-off.")

topic('bank_account', r"bank account|checking account|savings account|bank g/l|electronic payment bank|ach bank|banking configuration|bank configuration|private .*bank|restricting a bank|micr|check printing",
      gl=None, yardi='bank_acct', mods=['cash', 'gl', 'ap', 'ar', 'reporting'],
      why=["New property/bank account onboarding requires linking the bank to its GL cash account and check/ACH settings.",
           "Bank account changes (new account number, restricted entities, default GL change)."],
      next="The bank account becomes available for payments, deposits and reconciliation.",
      ctx="Separate operating, security-deposit trust and reserve bank accounts are typical per multifamily property.",
      ctl="Dual-control bank account setup and changes; verify routing/account numbers with the bank letter.")

# --- A/R ----------------------------------------------------------------------------
topic('ar_nsf', r"\bnsf\b|returned (payment|check)|chargeback|reversing (a )?payment|reverse (a )?payment",
      gl="NSF/returned payment: DR 1210 Resident/Tenant A/R / CR 1110 Operating Cash (charges re-open); NSF fee: DR 1210 A/R / CR 4100 Other Income (NSF Fees).",
      rev="This is the reversal of the original receipt DR 1110 Cash / CR 1210 A/R.",
      yardi='ar_nsf', mods=['ar', 'cash'],
      why=["Resident check or ACH was returned by the bank for insufficient funds or closed account.",
           "Payment was posted to the wrong customer/resident and must be reversed and re-applied."],
      next="Charges re-open on the ledger, delinquency increases, and the returned item clears against the bank debit in the bank rec.",
      ctx="Repeated NSFs typically trigger certified-funds-only status per the lease.",
      ctl="Post the NSF in the period the bank debited the account so the bank rec ties.")

topic('ar_writeoff', r"write[- ]?off|bad debt|allowance|doubtful|collections?\b|dunning",
      gl="Write-off: DR 4050 Bad Debt Expense (or 1215 Allowance for Doubtful Accounts) / CR 1210 Resident A/R. Recovery of written-off balances: DR 1110 Cash / CR 4050 Bad Debt Recovery.",
      rev="Reversing a write-off: DR 1210 A/R / CR 4050 Bad Debt.",
      yardi='ar_adjust', mods=['ar', 'reporting', 'close'],
      why=["Former residents' uncollectible balances after deposit application are written off and sent to collections.",
           "Allowance for doubtful accounts must be trued up at month/quarter end."],
      next="Written-off balances leave the aging and are tracked for collection-agency recoveries.",
      ctx="Bad debt policy (e.g., write off balances > 60 days after move-out) should be applied consistently for owner reporting.",
      ctl="Apply security deposits before writing off; obtain property manager approval per policy.")

topic('ar_adjust', r"(a/r|ar) adjustment|credit memo|debit adjustment|credit adjustment|concession|adjustments?\b|refund(ing)? (a )?credit",
      gl="Credit adjustment: DR 4xxx Income/contra-revenue (e.g., 4040 Concessions) / CR 1210 Resident A/R. Debit adjustment: DR 1210 A/R / CR 4xxx Income.",
      rev="Reversal posts the opposite entry and restores the customer balance.",
      yardi='ar_adjust', mods=['ar', 'gl', 'reporting', 'close'],
      why=["Correcting billing errors, granting concessions or waiving fees approved by the property manager.",
           "Credit balances need to be refunded or applied to future charges."],
      next="Adjustments update the customer/resident balance and aging; credits can be applied to open invoices.",
      ctx="Concessions and fee waivers must be tracked separately from rent to measure effective rent.",
      ctl="Adjustments over the site's authority limit require PM/regional approval and documentation.")

topic('ar_payment', r"payment|receipt|receiv(e|ing)|apply|applying|overpayment|unapplied|advance|lockbox|pex|payment summar",
      gl="Receipt: DR 1130 Undeposited Funds (or 1110 Operating Cash) / CR 1210 Resident/Tenant A/R. Unapplied/advance payments: CR 2120 Prepaid Rent (Customer Advances) until applied.",
      rev="Reversal: DR 1210 A/R / CR 1130 Undeposited Funds or 1110 Cash; charges re-open.",
      yardi='ar_receipt', mods=['ar', 'cash', 'reporting', 'close'],
      why=["Customer/resident payments received by check, ACH, lockbox or online portal must be applied to open charges.",
           "Unapplied cash and prepayments need application before month-end aging."],
      next="Applied receipts reduce the aging; payments are grouped into bank deposits for reconciliation.",
      ctx="Payment application order (fees → utilities → rent) is often dictated by state law and lease terms.",
      ctl="Clear unapplied cash before month-end; prepaid rent must be reported as a liability, not negative A/R.")

topic('ar_invoice', r"(a/r|ar) invoice|sales invoice|billing|bill-?backs?|intercompany bill|charges?\b|invoices?\b|recurring (invoice|transaction)|quick (a/r )?entry|document template|printed document|word merge|statement",
      gl="Posted A/R invoice/charge: DR 1210 Resident/Tenant A/R / CR 4xxx Revenue (e.g., 4010 Rent, 4110 Utility Reimbursement, 4100 Other Income); sales tax to CR 2160. Intercompany bill-back: DR 1230 Due From Affiliates / CR 6xxx expense recovery.",
      rev="Reversing an unpaid invoice: DR 4xxx Revenue / CR 1210 A/R in the reversal period.",
      yardi='ar_charge', mods=['ar', 'reporting', 'gl', 'close'],
      why=["Billing customers/tenants for rent, reimbursements (RUBS/CAM), bill-backs and one-time charges.",
           "Recurring invoices failed to generate or billing needs correction."],
      next="Invoices appear on the customer aging and statements; receipts are applied against them.",
      ctx="Utility and expense bill-backs recover costs from residents/affiliates and must tie to the underlying expense.",
      ctl="Tie monthly billing totals to the rent roll/charge schedule and reconcile bill-back revenue to the related expense.")

topic('deferred_rev', r"deferred revenue|revenue recognition|revaluation|straight[- ]line",
      gl="Deferral: DR 1210 A/R or 1110 Cash / CR 2120 Deferred Revenue (Prepaid Rent); recognition each period: DR 2120 Deferred Revenue / CR 4xxx Revenue.",
      rev="Reversal re-defers revenue: DR 4xxx Revenue / CR 2120 Deferred Revenue.",
      yardi='deferred_rev', mods=['ar', 'reporting', 'gl'],
      why=["Billed amounts that relate to future periods must be deferred (GAAP revenue recognition).",
           "Forecasting how deferred balances will be recognized."],
      next="Scheduled recognition entries post monthly until the deferred balance is zero.",
      ctx="Prepaid rent and annual fees must be recognized in the period earned for GAAP owner reporting.",
      ctl="Deferred revenue balance should tie to the schedule detail each month-end.")

topic('ar_customer', r"customer|tenant|resident|territor|shipping method|customer (type|group)",
      gl=None, yardi='ar_customer', mods=['ar', 'reporting', 'gl'],
      why=["A new customer/tenant must exist before invoicing.", "Customer contact, terms, tax or delivery information changed."],
      next="Customer becomes available for invoices, receipts, statements and aging.",
      ctx="Non-resident receivables (commercial tenants, affiliates, insurance) are tracked as customers in RealPage Accounting A/R.",
      ctl="Avoid duplicate customer records — search before adding.")

topic('ar_aging', r"aging|delinquen|customer (listing|ledger)|a/r ledger",
      gl=None, yardi='ar_aging', mods=['ar', 'reporting', 'close'],
      why=["Month-end review of delinquent balances and collection status.", "Tie-out of the A/R subledger to the GL A/R control account."],
      next="Drives collection actions, allowance/bad-debt estimates and the owner delinquency report.",
      ctx="Delinquency and bad debt are key KPIs in multifamily asset management reports.",
      ctl="A/R aging total must equal the GL A/R control account balance at period end.")

topic('tax', r"\btax(es)?\b|tax (schedule|authorit|group|code|detail|record|solution)|sales tax|withholding",
      gl="Tax on sales: DR 1210 A/R / CR 2160 Sales Tax Payable; tax on purchases: DR 6xxx Expense (non-recoverable) or 1250 Tax Recoverable / CR 2010 A/P; remittance: DR 2160 / CR 1110 Cash.",
      yardi='tax', mods=['ar', 'ap', 'reporting', 'budgeting', 'close'],
      why=["Tax rates/authorities must be configured for taxable charges or purchases.", "Periodic tax filing requires tax detail by jurisdiction."],
      next="Tax lines calculate automatically on transactions and accumulate in tax liability accounts for remittance.",
      ctx="Some jurisdictions tax commercial rent, short-term rentals or certain services.",
      ctl="Reconcile the tax liability account to the tax report before filing.")

# --- GL -----------------------------------------------------------------------------
topic('statistical', r"statistical|dimension count|kpi|key performance",
      gl="No financial GL impact: statistical entries increase/decrease non-monetary accounts (units, occupied units, square feet, headcount) used for per-unit and occupancy ratios; they do not need to balance.",
      rev="Reversal inverts the statistical quantity (no financial impact).",
      yardi='stat', mods=['gl', 'reporting', 'budgeting', 'close'],
      why=["Monthly occupancy, unit counts and square footage are recorded for per-unit KPIs and allocations.",
           "Statistical data drives allocation bases and financial report ratios (cost per unit, occupancy %)."],
      next="Statistical balances feed financial reports, dashboards and allocation calculations.",
      ctx="Per-unit metrics (expense per unit, NOI per unit) are standard in multifamily asset management reporting.",
      ctl="Tie statistical unit counts to the rent roll/occupancy report before month-end reporting.")

topic('allocation', r"allocat|split(ting)? (costs?|expenses?)|dynamic allocation|allocation templates?",
      gl="Allocation entry: DR 6xxx Expense at each receiving property/location (by allocation basis) / CR 6xxx Expense (or clearing account) at the source pool; cross-entity allocations add DR 1230 Due From / CR 2130 Due To.",
      rev="Reversing the allocation posts the mirror entry, returning costs to the source pool.",
      yardi='alloc', mods=['gl', 'ap', 'reporting', 'budgeting', 'close'],
      why=["Shared costs (regional payroll, insurance, software, corporate overhead) must be spread across properties.",
           "Allocation bases (units, square footage, revenue) changed and allocations must be recalculated."],
      next="Allocated amounts appear in each property's income statement; source pool nets to zero.",
      ctx="Allocations must follow the management agreement — owners often challenge unsupported cost allocations.",
      ctl="Confirm allocation percentages sum to 100% and the source clearing account nets to zero after posting.")

topic('prepaid', r"prepaid|prepayment|amortiz",
      gl="Initial payment: DR 1310 Prepaid Expenses / CR 2010 A/P or 1110 Cash. Monthly amortization: DR 6xxx Expense (e.g., 6610 Insurance, 6620 Real Estate Taxes) / CR 1310 Prepaid Expenses.",
      rev="Reversing an amortization entry: DR 1310 Prepaid / CR 6xxx Expense.",
      yardi='prepaid', mods=['gl', 'ap', 'reporting', 'close'],
      why=["Annual insurance premiums, property taxes, software and service contracts paid in advance.",
           "Monthly amortization must match the prepaid schedule."],
      next="Scheduled amortization entries post each month until the prepaid balance is fully expensed.",
      ctx="Insurance and real estate taxes are the largest prepaid items in multifamily and are reviewed by lenders.",
      ctl="Prepaid GL balance must tie to the prepaid schedule's remaining unamortized balance each month.")

topic('accrual', r"accru",
      gl="Accrual: DR 6xxx Expense (e.g., 6210 Utilities, 6010 Payroll) / CR 2020 Accrued Expenses; auto-reversal on day 1 of the next period: DR 2020 Accrued Expenses / CR 6xxx Expense.",
      rev="The automatic reversal is the mirror entry DR 2020 / CR 6xxx dated the first day of the next period.",
      yardi='accrual', mods=['gl', 'ap', 'reporting', 'close', 'jobcost'],
      why=["Month-end cut-off: services received but not yet invoiced (utilities, payroll, contract services) must be expensed in the correct period.",
           "Recurring accruals are generated from templates each close."],
      next="Accruals reverse in the next period when the actual invoice posts, so expense lands once in the correct month.",
      ctx="Accrual-basis owner reporting (GAAP) requires utilities and payroll to be accrued each month-end.",
      ctl="Support each accrual with a calculation (e.g., prior-month usage, days unbilled) and confirm the reversal date.")

topic('recurring_je', r"recurring|memorized transaction|transaction template|post using a transaction template",
      gl="Each occurrence posts its balanced DR/CR lines on the scheduled date (e.g., monthly mortgage interest accrual DR 7010 Interest Expense / CR 2030 Accrued Interest).",
      rev="Ending a schedule has no GL impact; posted occurrences are reversed individually.",
      yardi='je_recurring', mods=['gl', 'reporting'],
      why=["Monthly recurring entries (interest accruals, amortization, standard reclasses) are generated automatically.",
           "A schedule needs an amount/date change or should end."],
      next="Generated entries post (or route to approval) and appear on the GL detail and Trial Balance.",
      ctx="Recurring entries reduce keying risk for fixed monthly entries across dozens of properties.",
      ctl="Review recurring schedules quarterly; confirm end dates for loan and contract-driven entries.")

topic('je_reverse', r"revers",
      gl="Posts the exact inverse of the original entry (each debit becomes a credit) on the reversal date; the original remains for audit trail.",
      rev="Posts the exact inverse of the original entry (each debit becomes a credit) on the reversal date; the original remains for audit trail.",
      yardi='je_rev', mods=['gl'],
      why=["An entry was posted with the wrong account, property, amount or period.",
           "Accruals and estimates must be reversed in the following period."],
      next="Both original and reversal show in GL detail; post a corrected entry if needed.",
      ctx="Reversing (rather than deleting) preserves the audit trail required by owners and auditors.",
      ctl="Reverse in an open period and post the corrected entry immediately so the period is not understated.")

topic('intercompany', r"inter-?(entity|company)|due to|due from|consolidat|elimination",
      gl="Inter-entity transaction: originating entity DR 1230 Due From Affiliates / CR expense or cash; receiving entity DR expense or cash / CR 2130 Due To Affiliates; balances eliminate on consolidation.",
      yardi='intercompany', mods=['gl', 'ar', 'ap', 'reporting', 'cash', 'close'],
      why=["Shared payments or costs between properties/entities create due-to/due-from balances.",
           "Consolidated reporting requires intercompany balances to eliminate."],
      next="Intercompany balances are settled by cash transfer and eliminated in consolidated statements.",
      ctx="Pooled payroll and centralized payables create frequent due-to/due-from balances across multifamily entities.",
      ctl="Due To and Due From must net to zero across entities at every month-end.")

topic('currency', r"currenc|exchange rate|revalu|multi-currency",
      gl="Revaluation: DR/CR 7xxx Unrealized FX Gain/Loss / CR/DR the foreign-currency balance sheet account; settlement differences post to Realized FX Gain/Loss.",
      yardi='fx', mods=['gl', 'reporting', 'ap', 'ar', 'cash'],
      why=["Entities holding balances in another currency must be revalued at period-end rates.", "Exchange rates must be maintained for transaction entry."],
      next="Revalued balances appear in the base-currency financial statements.",
      ctx="Mostly relevant to cross-border owners/funds; US multifamily entities usually operate in USD only.",
      ctl="Use the approved period-end rate source and document it.")

topic('period_close', r"clos(e|ing)\b|open(ing)? (books|periods?)|reopen|year[- ]end|retained earnings|accounting periods?|period close|subledger",
      gl="Closing a period creates no entries (locks posting). Year-end close rolls P&L: DR 4xxx Revenue / CR 6xxx–7xxx Expenses with the net to 3100 Retained Earnings.",
      rev="Re-opening a period creates no entries but allows backdated postings; requires controller authorization.",
      yardi='close', mods=['gl', 'close', 'reporting', 'ap', 'ar', 'cash', 'budgeting'],
      why=["Month-end close: after subledgers are reconciled, the GL period is closed to prevent backdated entries.",
           "A late correction requires re-opening a closed period."],
      next="Closed periods are locked for reporting; the next period becomes the default posting period.",
      ctx="Owners expect financials 10–15 days after month-end; closing locks the numbers delivered.",
      ctl="Close only after bank recs, A/P, A/R and accruals are complete; document any re-open with approval.")


topic('books', r"\bbooks?\b|accounting method|cash basis|accrual basis|dual-method|user-defined book|gaap|tax adjust|adjusting (entr|journal)|adjustment journal",
      gl="Entries post only to the selected book (Accrual, Cash, GAAP/Compliance adjusting, Tax adjusting or user-defined book); reports combine the reporting book with selected adjustment books.",
      yardi='books', mods=['gl', 'reporting', 'close'],
      why=["Owners require both cash-basis and accrual-basis statements, plus GAAP or tax adjustments.",
           "Audit or tax adjustments must be isolated from the operating books."],
      next="Adjusted books roll into GAAP/tax financial statements without altering operating-book history.",
      ctx="Lenders often want accrual statements while partnerships file tax returns on a tax basis — separate books keep both correct.",
      ctl="Confirm the target book before posting; entries in the wrong book misstate either operating or GAAP statements.")

topic('reporting_period', r"reporting periods?|fiscal (year|calendar)|period (type|name)|odd-sized|system reporting period",
      gl=None, yardi="Yardi Voyager: fiscal calendar and period selection (Setup > Fiscal Calendar; 'Post Month'/period range filters in Financial Analytics and budget screens).",
      mods=['gl', 'reporting', 'budgeting', 'close', 'ap', 'ar', 'cash'],
      why=["Financial reports, budgets and BVA need named reporting periods (Current Month, YTD, trailing 12, fiscal quarters).",
           "Owners with non-calendar fiscal years or 4-4-5 calendars need custom periods."],
      next="Reporting periods become selectable in report filters, budgets and dashboards.",
      ctx="Consistent reporting periods ensure MTD/YTD columns in owner packages match the fiscal calendar in the operating agreement.",
      ctl="Check period start/end dates against the owner's fiscal year before reporting.")

topic('budget_payroll', r"payroll|employee|job position|benefit|worker comp|federal tax|state tax|earning|wage|salary",
      gl="No GL impact — payroll planning data (positions, wages, taxes, benefits) calculates budgeted payroll expense that is published into the working budget (e.g., budgeted 6010 Payroll by property and month).",
      yardi='budget', mods=['budgeting'],
      why=["Annual budget preparation requires on-site staffing plans (positions, wages, raises, benefits, payroll taxes).",
           "Payroll assumptions changed and the payroll budget must be recalculated and republished."],
      next="Published payroll flows into the working budget's payroll accounts for review and approval.",
      ctx="Payroll is typically the largest controllable operating expense in a multifamily budget (often 20-30% of OpEx).",
      ctl="Tie budgeted headcount and wage rates to the approved staffing plan; include payroll tax and benefit burden.")

topic('budget', r"budget|forecast|planning|working budget|payroll (workbench|budget)|driver|assumption|spread method|version|publish|bva|budget variance|variance analysis",
      gl="No GL impact — budget amounts are stored in the budget (not the actual ledger) and are used for budget-vs-actual (BVA) variance reporting.",
      yardi='budget', mods=['gl', 'budgeting', 'reporting', 'jobcost', 'ap', 'close'],
      why=["Annual operating and capital budgets are prepared and approved by the owner/asset manager.",
           "Monthly variance analysis compares actuals to the approved budget."],
      next="Published budgets feed BVA reports, budget checks on POs/invoices and forecast re-projections.",
      ctx="Owners require variance explanations for line items exceeding thresholds (e.g., ±10% and $5,000) each month.",
      ctl="Confirm the published budget version matches the owner-approved budget before variance reporting.")

topic('je', r"journal|\bje\b|general ledger|g/l workbench|site view|adjusting entr",
      gl="Posted journal entry: balanced DR/CR lines to the accounts, locations and dimensions entered (total debits = total credits), e.g., reclass DR 6110 Repairs / CR 6120 Turnover.",
      rev="Reversal posts the inverse entry on the reversal date.",
      yardi='je', mods=['gl', 'reporting', 'close'],
      why=["Non-subledger activity (accruals, reclasses, payroll, depreciation, corrections) must be recorded.",
           "Draft or declined journal entries await correction, approval or posting."],
      next="Posted entries update the GL, Trial Balance and financial statements; approval-enabled journals route to the approver first.",
      ctx="Journal entries drive most month-end adjustments in multifamily accounting and are the focus of audit testing.",
      ctl="Debits must equal credits; attach support and include the period and reason in the description.", weak=True)

topic('coa', r"accounts?\b|account groups?|chart of accounts|reporting account|account (label|title|categor)|chart types?|account group purpose|custom categor|close account",
      gl=None, yardi='coa', mods=['gl', 'reporting', 'budgeting', 'ap', 'ar', 'close'],
      why=["New GL accounts or account groups are needed for a new property, owner reporting format or statement line.",
           "Account attributes (normal balance, type, category, restrictions) must be corrected."],
      next="Accounts become available for posting and account groups drive financial report rows.",
      ctx="Owners often require a standard chart of accounts with mapping to their reporting format.",
      ctl="Never delete accounts with history; inactivate instead and remap reporting groups.", weak=True)

topic('dimension', r"dimension|location|department|segment|class(es)?\b|project|entity|entities|units?\b|territor",
      gl=None, yardi='dimension', mods=['gl', 'reporting', 'budgeting', 'ap', 'ar', 'close', 'jobcost', 'cash'],
      why=["Properties, buildings, departments or segments must exist to tag transactions for reporting.",
           "Dimension hierarchies (location groups/portfolios) drive consolidated reporting."],
      next="Dimensions become selectable on transactions and filters on reports.",
      ctx="Location = property is the core reporting dimension in multifamily portfolios.",
      ctl="Keep dimension IDs consistent with property codes used by the owner.", weak=True)

# --- Financial close management --------------------------------------------------
topic('workpaper', r"work ?paper|package",
      gl="No GL impact — work papers package reconciliations, schedules and reports as close evidence.",
      yardi='workpaper', mods=['close', 'reporting', 'ap'],
      why=["Month-end close requires a reviewer-approved work-paper package per property/entity.",
           "Declined work papers need correction and regeneration."],
      next="Approved packages are archived as close evidence and delivered to reviewers/owners.",
      ctx="Institutional owners expect a monthly close package: bank recs, subledger tie-outs, accrual support and variance commentary.",
      ctl="Every balance sheet account should have a reconciliation work paper signed by preparer and reviewer.")

topic('close_checklist', r"checklist|close task|tasks?\b|console|close calendar|monthly checklist|sign[- ]?off|preparer|reviewer|financial close|close management",
      gl="No GL impact — checklist/task tracking; the underlying tasks (accruals, recs) post their own entries.",
      yardi='fcm', mods=['close', 'reporting'],
      why=["Month-end close tasks are assigned by property with due dates, preparers and reviewers.",
           "Overdue or rejected tasks must be escalated to meet the reporting deadline."],
      next="Completed and approved tasks roll up to close status dashboards; the period can be closed once all tasks are signed off.",
      ctx="A standardized close checklist keeps offshore and onshore teams aligned on day-by-day close deadlines.",
      ctl="Do not mark tasks complete without attaching the evidence (reconciliation, report, JE).")

# --- Job cost & reserves ------------------------------------------------------------
topic('retainage', r"retainage|retention",
      gl="Retainage withheld: DR 1410 Construction in Progress / CR 2010 A/P (net) and CR 2015 Retainage Payable (withheld); release: DR 2015 Retainage Payable / CR 2010 Accounts Payable.",
      yardi='jobcost', mods=['jobcost', 'ap'],
      why=["Contractors' pay applications withhold retainage (commonly 5–10%) until completion.", "Retainage release at substantial completion/final lien waiver."],
      next="Released retainage is paid in the next payment run.",
      ctx="Retainage protects the owner until punch-list completion on renovation projects.",
      ctl="Obtain final lien waivers before releasing retainage.")

topic('reserve', r"reserve|escrow",
      gl="Reserve funding: DR 1340 Replacement Reserve Escrow / CR 1110 Operating Cash. Reserve draw/reimbursement: DR 1110 Operating Cash / CR 1340 Replacement Reserve Escrow. Reserve-funded capital work: DR 1530 Building Improvements (or 1410 CIP) / CR 2010 A/P.",
      rev="Reversing a draw receipt: DR 1340 Reserve Escrow / CR 1110 Cash.",
      yardi='reserve', mods=['jobcost', 'gl', 'reporting', 'close'],
      why=["Lender/HUD-required replacement reserves are funded monthly and drawn to reimburse approved capital work.",
           "Draw requests require invoice support, lien waivers and inspection before lender release."],
      next="Approved draws are received from the lender and reconcile against reserve escrow statements.",
      ctx="Agency (Fannie/Freddie/HUD) loans require replacement reserve deposits per unit per year.",
      ctl="Reconcile the reserve escrow GL to the lender/servicer escrow statement monthly.")

topic('draw', r"draw|funding source|pay application|\baia\b|draw model|draw receipt",
      gl="Draw receipt from lender/fund: DR 1110 Operating Cash / CR 2210 Construction Loan Payable (or CR 1340 Reserve Escrow for reserve draws). Costs funded by the draw were recorded DR 1410 CIP / CR 2010 A/P.",
      rev="Reversing a draw receipt: DR 2210 Loan (or 1340 Reserve) / CR 1110 Cash.",
      yardi='jobcost_draw', mods=['jobcost', 'gl'],
      why=["Monthly construction/renovation draws are assembled from paid and unpaid job costs by funding source.",
           "Draw activity must be allocated to funding sources (loan, equity, reserves)."],
      next="Draw package goes to the lender; receipts are recorded and matched to the draw.",
      ctx="Construction and renovation lenders fund against draw requests supported by invoices and lien waivers.",
      ctl="Draw totals must tie to job cost detail by cost code and funding source.")

topic('jobcost', r"job|cost code|cost type|commitment|change order|permit|project|construction|capex|capital",
      gl="Job costs post through A/P and JEs: DR 1410 Construction in Progress (capital) or 6xxx Expense (non-capital) / CR 2010 Accounts Payable, tagged with job and cost code. Budgets and commitments have no GL impact.",
      rev="Reversing a job cost transaction posts the inverse entry and reduces job-to-date cost.",
      yardi='jobcost', mods=['jobcost', 'gl', 'ap', 'reporting', 'budgeting', 'close'],
      why=["Capital projects (unit renovations, roofs, parking lots) are tracked by job and cost code against budget.",
           "Job cost reports show budget, committed, actual and remaining costs for owner/lender reporting."],
      next="Completed jobs are capitalized/placed in service (CIP → fixed assets) and closed.",
      ctx="Value-add multifamily programs track per-unit renovation cost and premium achieved against budget.",
      ctl="Capital vs. operating classification must follow the owner's capitalization policy.")

# --- Fixed assets ----------------------------------------------------------------------
topic('depreciation', r"depreciat",
      gl="Depreciation: DR 7110 Depreciation Expense / CR 1590 Accumulated Depreciation (per asset class/book).",
      rev="Deleting/reversing a depreciation batch posts DR 1590 Accumulated Depreciation / CR 7110 Depreciation Expense.",
      yardi='fixed_asset', mods=['fixed_assets', 'gl', 'ap', 'reporting', 'jobcost'],
      why=["Monthly depreciation must be calculated and posted for all active assets.",
           "Assets missed in prior months need catch-up depreciation."],
      next="Depreciation posts to the GL and updates each asset's net book value.",
      ctx="GAAP depreciation (27.5/39-year residential/commercial buildings, 5–15-year improvements) differs from tax depreciation.",
      ctl="Accumulated depreciation per the asset register must equal the GL 1590 balance.")

topic('asset_dispose', r"dispos|retire|write[- ]?down",
      gl="Disposal: DR 1590 Accumulated Depreciation, DR 1110 Cash (proceeds) and DR/CR Loss/Gain on Disposal / CR 1530/1540 Asset cost.",
      yardi='fixed_asset', mods=['fixed_assets', 'ap'],
      why=["Replaced appliances, roofs or HVAC units must be removed from the asset register.", "Casualty loss or sale of an asset."],
      next="Asset status changes to disposed and it stops depreciating.",
      ctx="Replacing capital components (e.g., roofs, HVAC) requires disposing of the replaced component's remaining NBV.",
      ctl="Confirm remaining NBV and proceeds before posting; document the disposal approval.")

topic('asset', r"\bassets?\b|asset class|asset book|placed in service|activating draft|transferr?ing an asset|reclass(ing)? an asset|facilities",
      gl="Capitalization: DR 1530 Building Improvements / 1540 FF&E / CR 2010 Accounts Payable or 1410 Construction in Progress (placing CIP in service). Transfers/reclasses move cost and accumulated depreciation between accounts/locations.",
      rev="Deleting a draft asset has no GL impact; reversing an activated asset reverses its capitalization entry.",
      yardi='fixed_asset', mods=['fixed_assets', 'ap', 'gl', 'reporting', 'jobcost', 'close'],
      why=["Capital purchases above the capitalization threshold must be recorded as assets.",
           "Draft assets created from A/P invoices await activation."],
      next="Active assets depreciate monthly and appear on asset reports.",
      ctx="Multifamily capitalization policies (e.g., > $2,500 and useful life > 1 year) determine asset vs. expense.",
      ctl="Asset register cost must tie to GL fixed-asset accounts each month.")

# --- Investor tracking ------------------------------------------------------------------
topic('investor', r"investor|capital call|contribution|distribution|waterfall|ownership|partner|commitment|k-?1|owner portal",
      gl="Capital contribution: DR 1110 Cash / CR 3010 Partners' Capital. Distribution: DR 3020 Distributions / CR 1110 Cash. Preferred return accruals per the operating agreement.",
      yardi='investor', mods=['reporting'],
      why=["Investors fund capital calls and receive distributions per the partnership waterfall.",
           "Investor ownership percentages and commitments must be current for allocations."],
      next="Investor statements and portal documents are published after contributions/distributions post.",
      ctx="Multifamily syndications and funds require accurate investor capital accounts and distributions.",
      ctl="Tie investor capital accounts to the GL equity accounts each quarter.")

# --- VAT ----------------------------------------------------------------------------------
topic('vat', r"vat|value added|tax (return|solution|submission)|gst",
      gl="Purchases: DR 6xxx Expense + DR 1250 Input VAT Recoverable / CR 2010 A/P. Sales: DR 1210 A/R / CR 4xxx Revenue + CR 2160 Output VAT Payable. Settlement: DR 2160 / CR 1250 and cash.",
      yardi='vat', mods=['reporting'],
      why=["Entities in VAT jurisdictions must calculate and report VAT on purchases and sales.",
           "VAT returns require reconciliation of input and output VAT."],
      next="VAT balances feed the periodic VAT return and settlement.",
      ctx="Mostly relevant to non-US entities in a global portfolio; US properties use sales tax instead.",
      ctl="Reconcile VAT control accounts to the VAT return before submission.")

# --- Time & resources -----------------------------------------------------------------------
topic('time', r"time ?sheet|time &|time and|pto|employee|resource|position|earning|labor|certification|skill|worker comp|benefit|payroll",
      gl="Approved labor cost (if cost posting enabled): DR 6010 Payroll Expense (by property/job) / CR 2020 Accrued Payroll; billable time invoiced via A/R: DR 1210 A/R / CR 4xxx Revenue.",
      yardi='time', mods=['reporting', 'budgeting'],
      why=["Employees record time by property/job for payroll allocation and billing.", "Timesheets and PTO requests await approval."],
      next="Approved time feeds payroll allocation, job cost and billing.",
      ctx="Site-staff time allocation supports correct payroll cost by property.",
      ctl="Approve timesheets before the payroll cut-off; allocate shared staff time by property.")

# --- Dashboards / reporting ----------------------------------------------------------------
topic('dashboard', r"dashboard|component|performance card|widget|home page",
      gl=None, yardi='dashboard', mods=['reporting', 'gl', 'ap', 'ar', 'cash', 'close', 'budgeting', 'jobcost'],
      why=["Executives and accountants monitor KPIs (cash, aging, close status) without running reports.", "Dashboard components need adding, permissions or refresh."],
      next="Dashboards display live data; drill-down opens the underlying reports and transactions.",
      ctx="Portfolio dashboards give asset managers occupancy, delinquency and NOI at a glance.",
      ctl="Confirm component filters (entity/location/period) before relying on dashboard figures.")

topic('report_writer', r"financial report writer|report writer|custom report|report wizard|report (group|type|audience|structure)|cover letter|rows?\b|columns?\b|computations?|calculation|runtime prompt|report format|fonts?|shading|graphs? library|financial graph|report library|expressions?",
      gl=None, yardi='report_writer', mods=['reporting', 'gl', 'ap', 'ar', 'cash', 'budgeting', 'close', 'jobcost'],
      why=["Owner-specific financial report formats (12-month statements, BVA, NOI reports) must be built or modified.",
           "Custom reports are required for data not available in standard reports."],
      next="Saved report definitions can be run, scheduled, grouped into packages and shared.",
      ctx="Institutional owners mandate their own monthly reporting package formats.",
      ctl="Validate new report formats against the Trial Balance before distribution.", weak=True)

topic('report_distribution', r"memoriz|schedul|stor(e|ed|ing) (report|a report)|my stored|stored reports?|storage options|reporting portal|publish|distribut|email(ing)? (a )?report|favorites|file types",
      gl=None, yardi='report_sched', mods=['reporting', 'gl', 'ap', 'ar', 'cash', 'budgeting', 'close', 'jobcost', 'fixed_assets'],
      why=["Monthly owner/asset-manager report packages are scheduled and distributed automatically.",
           "Stored/memorized reports preserve period-end versions for audit."],
      next="Reports are delivered to the recipients/storage target on schedule.",
      ctx="Automated distribution meets the owner's reporting deadline consistently across the portfolio.",
      ctl="Confirm recipients and entity filters — never distribute one owner's financials to another owner.")

topic('fin_report', r"trial balance|income statement|balance sheet|cash flow|financial (statement|report|analytics|chart)|general ledger report|gl detail|12[- ]month|budget variance report|report",
      gl=None, yardi='fin_report', mods=['gl', 'reporting', 'ap', 'ar', 'cash', 'close', 'jobcost', 'fixed_assets', 'budgeting'],
      why=["Month-end review of balances, trends and variances before financial statements are issued.",
           "Tie-out of subledgers (A/P, A/R, fixed assets) to GL control accounts."],
      next="Reviewed reports go into the monthly owner reporting package with variance commentary.",
      ctx="Owner packages typically include Balance Sheet, Income Statement (MTD/YTD vs. budget), Trial Balance and GL detail.",
      ctl="Confirm the report book (accrual/cash), period and entity filters before exporting.", weak=True)

# --- Generic list / workbench UI features ---------------------------------------------------
topic('ui', r"^(finding|searching|filtering|sorting|grouping|rearranging|showing and hiding|using (the )?(column|multi-select|workbench|list|views?|filters?|search|bookmarks?|keyboard|breadcrumbs?|select multiple)|managing lists|opening a bookmark|bookmark|custom views?|exporting lists|printing (a )?list|pinning|selecting fonts|enabling shading|highlighting|applying mathematical)|column menus|workbench (views|features|actions)|list views?|multi-select box|saved views?|^data entry|^lists$|^workbenches$|^navigation$|^transactions$",
      gl=None, yardi='workbench',
      why=["Accountants must quickly find, filter and export records across many properties and entities.",
           "Saved views, column layouts and filters standardize daily processing and month-end review lists."],
      next="Saved views, filters and exports are reused in daily processing, reconciliations and month-end review.",
      ctx="Efficient list and workbench use is what lets an offshore team process high multifamily volumes accurately.",
      ctl="Clear filters and check the entity/location context before concluding a record does not exist — hidden filters are the most common cause of 'missing' transactions.")

# --- Admin / company ---------------------------------------------------------------------------
topic('security', r"user|role|permission|rights|password|security|sso|single sign|login|ip (address|filter)|service provider|external user|web services|restricted|unrestricted|access",
      gl=None, yardi='security', mods=['reporting', 'gl', 'ap', 'ar', 'cash', 'close', 'jobcost', 'fixed_assets', 'budgeting'],
      why=["New staff (onshore/offshore) need access limited to their properties and duties.", "Segregation of duties requires removing conflicting rights."],
      next="User access takes effect at next login; access reviews are evidenced for audit.",
      ctx="Owners and auditors test user access and segregation of duties (e.g., vendor setup vs. payment release).",
      ctl="Perform quarterly user-access reviews; deactivate departing users the same day.", weak=True)

topic('platform', r"platform|custom (field|object|view)|smart (rule|event|link)|trigger|workflow|customiz|object|lookup|formula|injection|obfuscat",
      gl=None, yardi='platform', mods=['reporting', 'gl', 'ap', 'ar', 'cash'],
      why=["Business rules (required fields, validations, notifications) are enforced through platform customizations.",
           "Custom fields capture owner-specific data not in standard screens."],
      next="Customizations apply to all users on the affected objects immediately after activation.",
      ctx="Smart rules can enforce policies such as blocking invoices without a PO above a threshold.",
      ctl="Test customizations in a sandbox and document the change for audit.", weak=True)

topic('mobile', r"mobile|app\b|smartphone|tablet",
      gl=None, yardi='mobile', mods=['reporting', 'ap'],
      why=["Property managers approve invoices, POs and expenses from the field.", "Site staff capture receipts and PC charges on mobile."],
      next="Mobile actions sync to the web application and continue the normal workflow.",
      ctx="Mobile approvals keep invoice cycle times short for property managers who are rarely at a desk.",
      ctl="Approvals on mobile carry the same authority as web approvals — review the invoice image before approving.", weak=True)

topic('company', r"company|configur|preference|notification|subscription|application|setup|settings|lists?\b|navigation|data entry|multi-entity|entity|industry|document sequenc|numbering|terms|smart links?|contacts?",
      gl=None, yardi='company', mods=None,
      why=["Company-level configuration controls how every application behaves (entities, periods, numbering, notifications).",
           "New property/entity onboarding or policy changes require configuration updates."],
      next="Settings take effect for subsequent transactions and users.",
      ctx="Consistent configuration across multifamily entities keeps reporting comparable.",
      ctl="Document configuration changes with date, requester and approval for audit.", weak=True)

# Fallback per module (used when nothing matches)
MODULE_DEFAULT = {
    'gl': 'je', 'ap': 'ap_bill', 'cash': 'bank_rec', 'ar': 'ar_invoice', 'close': 'close_checklist',
    'jobcost': 'jobcost', 'fixed_assets': 'asset', 'budgeting': 'budget', 'reporting': 'fin_report',
}

# Manual-level default topics (used before the module default)
MANUAL_DEFAULT = [
    (r"Financial Close", 'close_checklist'),
    (r"Replacement Reserves", 'reserve'),
    (r"Job Cost", 'jobcost'),
    (r"Fixed Assets", 'asset'),
    (r"Forecasting|Budget", 'budget'),
    (r"Investor", 'investor'),
    (r"Value Added Tax", 'vat'),
    (r"Time & Resources", 'time'),
    (r"Platform", 'platform'),
    (r"Mobile", 'mobile'),
    (r"Dashboards", 'dashboard'),
    (r"Spend Management", 'purchase_order'),
    (r"AI Finance Agent", 'ai_agent'),
    (r"Approval", 'approval'),
    (r"Cash Management|Bank Reconciliation", 'bank_rec'),
    (r"Management Fees", 'mgmt_fee'),
    (r"Importing Data", 'import_generic'),
    (r"Company|Getting Started|Basics|Service Provider", 'company'),
    (r"Reporting Portal", 'report_distribution'),
    (r"Report", 'fin_report'),
    (r"AR ", 'ar_invoice'),
    (r"AP ", 'ap_bill'),
    (r"General Ledger|GL ", 'je'),
    (r"Vendor Aging", 'ap_bill'),
]

TOPIC_BY_KEY = {t['key']: t for t in T}

MODULE_PREFERRED = {
    'close': ['workpaper', 'close_checklist'],
    'jobcost': ['retainage', 'draw', 'reserve', 'jobcost'],
    'fixed_assets': ['depreciation', 'asset_dispose', 'asset'],
    'budgeting': ['budget_payroll', 'budget'],
}
MANUAL_PREFERRED = [
    (r"Investor", ['investor']),
    (r"Value Added Tax", ['vat']),
    (r"Time & Resources", ['time']),
    (r"Platform", ['platform']),
    (r"Dashboards", ['dashboard']),
    (r"AI Finance Agent", ['ai_agent']),
    (r"Approval Policy|Approval Workbench|Approval History", ['approval']),
    (r"Management Fees", ['mgmt_fee']),
    (r"Replacement Reserves", ['reserve']),
    (r"Reporting Portal", ['report_distribution']),
]


def match_topic(texts, module, manual):
    """texts: [title, parent1, parent2, ...]; returns the best topic."""
    pref = []
    for rx, keys in MANUAL_PREFERRED:
        if re.search(rx, manual):
            pref += keys
    pref += MODULE_PREFERRED.get(module, [])
    pref_topics = [TOPIC_BY_KEY[k] for k in pref]
    strong = [t for t in T if not t['weak'] and t['key'] not in pref]
    weak = [t for t in T if t['weak'] and t['key'] not in pref]

    def ok(t):
        return not t['mods'] or module in t['mods']

    for group in ([pref_topics + strong] if pref_topics else [strong]):
        for text in texts:
            for t in group:
                if t['key'] in pref or ok(t):
                    if t['rx'].search(text):
                        return t
    for text in texts:
        for t in weak:
            if ok(t) and t['rx'].search(text):
                return t
    for rx, key in MANUAL_DEFAULT:
        if re.search(rx, manual):
            return TOPIC_BY_KEY[key]
    return TOPIC_BY_KEY[MODULE_DEFAULT[module]]
