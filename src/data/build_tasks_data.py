import json
import re

with open('02-property-accounting/src/data/extracted_raw_tasks.json', 'r', encoding='utf-8') as f:
    raw_tasks = json.load(f)

print(f"Loaded {len(raw_tasks)} raw tasks.")

# Knowledge mapping by task category and name keywords
def generate_mastery_details(task):
    name = task['name']
    cat = task['category']
    phase = task['phase']
    freq = task['freq']
    prio = task['priority'] or 'Medium'
    notes = task['notes']

    # Default module and navigations
    rp_module = "AP"
    rp_nav = ["Accounts Payable", "Invoices", "Manage Invoices"]
    yardi_nav = ["AP", "Invoices", "Review Invoices"]
    purpose = ""
    root_cause = ""
    sop = []
    gl_impact = ""
    next_step = ""
    stakeholders = ["Site Team (PM)", "Property Accountant", "Onshore Reviewer"]
    reports = ["AME Preliminary Package", "Trial Balance"]
    pro_tips = []
    pitfalls = []

    # Specific Category / Task rules
    if "Invoice approval - 4th Workflow - Yardi" in name:
        rp_module = "AP"
        rp_nav = ["Accounts Payable", "Approval Policy Manager", "Approval Workbench"]
        yardi_nav = ["AP", "Invoice Processing", "Approve Invoices", "Workflow 4 - Accounting Review"]
        purpose = "Review and grant final accounting approval for property invoices in Yardi Workflow 4 before they are posted to the AP ledger and staged for check/ACH payment."
        root_cause = "Invoices entered by the site team (Workflow 1) and approved by PM (Workflow 2) and RPM (Workflow 3) queue here for accounting review of GL coding, tax calculation, PO matching, and budget compliance."
        sop = [
            "Navigate to Yardi AP > Approve Invoices > select Workflow 4 (Offshore/Regional Accounting).",
            "Open each invoice batch and inspect attached PDF invoice against entered header and line-item details.",
            "Verify GL Account number, Property Code, Unit Number (if applicable), and Job Cost codes.",
            "Check invoice date vs. current accounting period; ensure invoice is not backdated into closed periods.",
            "Click 'Approve' to advance invoice to posted AP status, or 'Reject' with clear comments to return to site team."
        ]
        gl_impact = "DR 6000-6999 (Operating Expense GL / R&M) / CR 2000-00 (Accounts Payable Subledger)"
        next_step = "Invoice posts to AP subledger and appears on the Cash Requirements Report for weekly payment run."
        stakeholders = ["Property Accountant", "Property Manager (PM)", "Regional PM (RPM)"]
        reports = ["Yardi AP Invoice Register", "Cash Requirements Report", "Unposted Invoice Report"]
        pro_tips = ["Always verify W-9 and 1099 eligibility check-boxes before approving new vendors.", "Double-check utility bills for disconnect notices or late penalty additions."]
        pitfalls = ["Approving an invoice where the job cost code does not tie out to an approved PO revision.", "Approving invoices dated in a closed accounting month without adjusting posting date."]

    elif "Pending 1st/2nd Approval queue - intimate site team" in name:
        rp_module = "Approvals"
        rp_nav = ["Accounts Payable", "Approval Policy Manager", "Approval Workbench", "Pending Approvals Queue"]
        yardi_nav = ["AP", "Reports", "Invoice Workflow Status Report", "Filter: Workflow 1 & 2"]
        purpose = "Identify invoices currently stalled in PM (1st) or RPM (2nd) approval queues and send formal daily reminders to site teams to maintain compliance."
        root_cause = "Property Managers and Regional Managers face heavy operational workloads and overlook their approval workbench queues, causing vendor payment delays."
        sop = [
            "Navigate to RealPage AP > Approvals > Approval Workbench.",
            "Filter status by 'Pending Approval 1 (PM)' and 'Pending Approval 2 (RPM)'.",
            "Export aged queue to Excel; highlight invoices older than 48 hours.",
            "Send standard notification template to PM/RPM with Invoice #, Vendor, Amount, and Age in Days.",
            "Document follow-up in the offshore tracking log."
        ]
        gl_impact = "No GL entry yet (Invoices remain unposted in approval staging tables until all approval tiers sign off)."
        next_step = "Site PM/RPM approves the invoice in RealPage, advancing it to Accounting Review."
        stakeholders = ["Property Manager", "Regional Property Manager", "Offshore Accountant"]
        reports = ["Unapproved Invoice Aging Report", "Daily Queue Status Tracker"]
        pro_tips = ["Group invoices by PM to make it easy for them to review in bulk during morning standups.", "Flag utility bills over $1,000 as urgent to avoid late fee penalties."]
        pitfalls = ["Failing to follow up prior to weekly payment run cut-off, causing missed discount terms."]

    elif "Checks void and re-issue" in name:
        rp_module = "AP"
        rp_nav = ["Accounts Payable", "Payments", "Void Payments / Re-issue"]
        yardi_nav = ["AP", "Payments", "Void Checks / Re-issue Payment"]
        purpose = "Void lost, damaged, stale-dated, or incorrect checks and re-issue payments to vendors or former residents."
        root_cause = "Vendor reported lost check in transit, incorrect remit address, incorrect payee name, or check stale-dated (>90 days)."
        sop = [
            "Obtain written Stop Payment confirmation from the bank portal before voiding.",
            "In RealPage, navigate to Accounts Payable > Payments > Manage Payments.",
            "Search check number; click 'Void Payment'.",
            "Select void date: use Current Accounting Period (never backdate into closed months).",
            "Choose whether to 'Void & Re-issue' (generates new check number) or 'Void & Reinstate Invoice' (returns bill to AP queue).",
            "Attach bank stop-payment PDF support to the void transaction record."
        ]
        gl_impact = "Reversal: DR 1010-00 (Operating Cash) / CR 2000-00 (Accounts Payable) [Then re-issue: DR 2000-00 / CR 1010-00]"
        next_step = "Voided check clears bank rec outstanding list; reissued check appears on next AP check run."
        stakeholders = ["Property Accountant", "Banking Operations", "Vendor / Resident Payee"]
        reports = ["Check Register", "Bank Reconciliation Outstanding Check List", "Void Check Audit Report"]
        pro_tips = ["Always verify the bank stop payment is confirmed active BEFORE voiding in RealPage to prevent double-clearing.", "If re-issuing a resident deposit refund, verify current forwarding address in leasing records."]
        pitfalls = ["Voiding with an old date in a closed month, which will alter historical retained earnings and tie-outs."]

    elif "Clearing BS Rec items" in name:
        rp_module = "GL"
        rp_nav = ["General Ledger", "Inquiries & Reports", "Account Inquiry / Reconciliation Ledger"]
        yardi_nav = ["Financials", "General Ledger", "Account Details", "Balance Sheet Accounts"]
        purpose = "Investigate, substantiate, and clear reconciling items sitting in Balance Sheet clearing accounts (AP Other, AR Other, Clearing Cash, CMA)."
        root_cause = "Timing differences, manual unmapped sweeps, unidentified wire credits, bank fees posted without GL coding, or rounding differences during merchant processing."
        sop = [
            "Run GL Account Detail for the clearing accounts (e.g., 1099-00 Cash Clearing, 2099-00 AP Other).",
            "Export transactions to Excel and cross-reference with bank statements and merchant statements.",
            "Identify the offsetting entry: match clearing transactions to corresponding subledger invoices or deposits.",
            "Draft clearing Journal Entry in RealPage GL > Journals > Standard Journal.",
            "Attach bank support and tie-out proof; submit for Onshore Reviewer sign-off."
        ]
        gl_impact = "DR/CR Clearing Account (1099/2099) to Zero balance / CR/DR Target Operating GL (e.g., 6850-00 Bank Fees or 1010-00 Cash)"
        next_step = "Clearing account balance returns to zero ($0.00) on the Monthly Balance Sheet Package."
        stakeholders = ["Property Accountant", "Internal Xshore Reviewer", "Onshore Reviewer"]
        reports = ["Balance Sheet Detail Report", "Bank Reconciliation Tie-Out", "Clearing Account Schedule"]
        pro_tips = ["Never let items age past 30 days in clearing accounts—onshore reviewers treat uncleared items as audit flags.", "Always annotate the bank transaction reference number in the JE description."]
        pitfalls = ["Lumping multiple unexplained variances into miscellaneous expense instead of investigating root causes."]

    elif "Invoice approval + Exception queue clearing" in name:
        rp_module = "AP"
        rp_nav = ["Accounts Payable", "Invoices", "Manage Invoices", "Filter: Status = Exception"]
        yardi_nav = ["AP", "Invoice Processing", "Invoice Exceptions Workbench"]
        purpose = "Investigate, resolve, and clear all invoices caught in the RealPage Exception Queue so they can resume the approval workflow and be paid on schedule."
        root_cause = "Invoices land in exception due to: 1) PO dollar/quantity mismatch > 5%, 2) Missing Receipt of Goods (ROG), 3) Missing vendor W-9 or expired COI, 4) Inactive GL account, 5) Duplicate invoice number."
        sop = [
            "Navigate to RealPage AP > Invoices > Manage Invoices > select 'Exception' filter.",
            "Click on the Exception Code / Message for each stuck invoice to identify root cause.",
            "If PO mismatch: check with site team if a PO change order was submitted; adjust distribution line or request PO revision.",
            "If ROG missing: ping PM/maintenance supervisor to receive items in the procurement module.",
            "If Vendor compliance hold: contact vendor management to upload valid Certificate of Insurance (COI) or W-9.",
            "Once rectified, click 'Re-evaluate / Release Exception' to move invoice to 1st Approval Queue."
        ]
        gl_impact = "Pending release: No GL posting. Upon release & final approval: DR Expense GL / CR 2000-00 AP Subledger."
        next_step = "Invoice leaves Exception Queue and enters PM 1st Level Approval Workbench."
        stakeholders = ["Property Accountant", "Property Manager", "Vendor Compliance Team"]
        reports = ["AP Invoice Exception Report", "Unapproved Invoice Report", "Vendor Compliance Audit"]
        pro_tips = ["Sort exception queue by dollar amount descending—clear large vendor invoices first to avoid supply holds.", "Check for duplicate invoice warnings: vendors often resubmit PDFs with slight space variations."]
        pitfalls = ["Manually overriding an exception without documenting supporting approval from the Regional PM."]

    elif "Pending ROG Approval queue - intimate site team" in name:
        rp_module = "AP"
        rp_nav = ["Accounts Payable", "Purchasing", "Receipt of Goods", "Pending Receipts Queue"]
        yardi_nav = ["Purchasing", "PO Receipts", "Unreceived Purchase Orders"]
        purpose = "Identify purchase order invoices where goods/services have been delivered but the site team has not marked 'Receipt of Goods' (ROG) in RealPage."
        root_cause = "Maintenance supervisors or PMs received physical items (e.g., HVAC units, paint, appliances) but forgot to perform digital receiving in RealPage."
        sop = [
            "Navigate to RealPage Purchasing / AP > Invoices > Filter 'Pending ROG'.",
            "Extract list of pending ROG items with PO number, vendor name, description, and dollar amount.",
            "Email site maintenance supervisor and PM requesting physical delivery verification and digital receipting.",
            "Once site team clicks 'Receive', system automatically clears the ROG exception."
        ]
        gl_impact = "Upon receiving: DR 1300-00 Inventory/Expense / CR 2050-00 Accrued PO Clearing"
        next_step = "Invoice automatically matches with the ROG and advances to PM Approval Workbench."
        stakeholders = ["Site Maintenance Supervisor", "Property Manager", "Property Accountant"]
        reports = ["Pending ROG Status Report", "Open Purchase Order Report"]
        pro_tips = ["Remind site staff that they can take a picture of packing slips on mobile to support digital receiving.", "Always cross-check unit turnovers (turns) to identify appliance deliveries quickly."]
        pitfalls = ["Letting ROG queues age past Friday cut-off, delaying essential vendor payments."]

    elif "AP Check run" in name:
        rp_module = "AP"
        rp_nav = ["Accounts Payable", "Payments", "Payment Processing", "Select Invoices for Payment"]
        yardi_nav = ["AP", "Payments", "Select Invoices / Process Payments"]
        purpose = "Generate and process the weekly payment run for approved vendor invoices and resident security deposit refunds via physical check, ACH, or wire."
        root_cause = "Weekly obligation to satisfy accounts payable, maintain vendor trade credit, adhere to discount terms, and comply with statutory resident refund timelines."
        sop = [
            "Check operating bank account available cash balance from morning bank activity report.",
            "Navigate to RealPage AP > Payments > Select Invoices for Payment.",
            "Filter by Due Date (e.g., invoices due within next 7-10 days) and Property ID.",
            "Review Cash Requirements Summary; ensure total proposed disbursements do not exceed cash threshold.",
            "Exclude any invoices on dispute or pending vendor credit memos.",
            "Generate payment batch; review check/ACH preview register; submit for Onshore sign-off and release."
        ]
        gl_impact = "DR 2000-00 (Accounts Payable Subledger) / CR 1010-00 (Operating Cash Account)"
        next_step = "Checks printed or ACH NACHA file uploaded to bank portal; disbursements posted to Cash Book."
        stakeholders = ["Property Accountant", "Asset Manager", "Treasury / Onshore Signer"]
        reports = ["Cash Requirements Report", "Payment Register", "Pre-Check Run Summary"]
        pro_tips = ["Always verify resident refund forwarding addresses and ensure deduction supports are attached.", "Verify that the operating bank account has sufficient collected funds including overnight sweep minimums."]
        pitfalls = ["Releasing payments for vendors with expired compliance or unverified tax IDs."]

    elif "STYL/MCMC Billback" in name:
        rp_module = "GL"
        rp_nav = ["General Ledger", "Journals", "Standard Journal", "Billback Intercompany Processing"]
        yardi_nav = ["Financials", "Intercompany", "Process Billbacks"]
        purpose = "Process intercompany billbacks and wire settlements for corporate payroll, shared insurance, or technology fees paid centrally on behalf of properties."
        root_cause = "Central corporate entities (STYL/MCMC) disburse shared operating expenses (e.g. centralized marketing, IT, specialized maintenance) that must be allocated to property books."
        sop = [
            "Obtain weekly billback schedule and supporting corporate invoices from the RF team.",
            "Review allocation percentages across properties based on unit counts or specific usage metrics.",
            "Post billback Journal Entry or AP invoice in RealPage against appropriate property expense GL.",
            "Prepare wire funding authorization to reimburse STYL/MCMC corporate account.",
            "Ensure Intercompany Due To/From accounts tie to penny."
        ]
        gl_impact = "Property: DR 6500-00 (Shared Service Expense) / CR 2150-00 (Due to Affiliate/MCMC) [Wire: DR 2150-00 / CR 1010-00 Cash]"
        next_step = "RF corporate team confirms wire receipt; intercompany reconciliation schedules match."
        stakeholders = ["Property Accountant", "RF Team", "Corporate Accounting Team"]
        reports = ["Intercompany Reconciliation Schedule", "Wire Transfer Authorization", "General Ledger Detail"]
        pro_tips = ["Maintain an ongoing Excel roll-forward of Due To/From STYL/MCMC to prevent month-end out-of-balance.", "Always confirm allocation formula approved by Asset Management."]
        pitfalls = ["Posting the billback without verifying if prior month accrual needs to be reversed, causing double expense."]

    elif "Bank Activity" in name or "Maintain cash log" in name or "Update Cash log" in name:
        rp_module = "Cash Management"
        rp_nav = ["Cash Management", "Bank Accounts", "Bank Transactions / Cash Log"]
        yardi_nav = ["Financials", "Cash Management", "Bank Activity Log"]
        purpose = "Download daily bank statements, record receipts and disbursements, update the property cash position, and monitor liquidity."
        root_cause = "Ensure daily visibility into operating cash, detect unauthorized debits, verify resident payment deposits, and track sweep transactions."
        sop = [
            "Log in to the bank portal (e.g., PNC, KeyBank, Wells Fargo) and download previous day's activity statement.",
            "Enter opening balance, total ACH deposits, credit card merchant batches, check clearings, and wires in Cash Log.",
            "Identify any unknown debit/credit; notify property manager or bank representative.",
            "In RealPage Cash Management, post daily bank activity transactions (merchant fees, interest earned, bank charges).",
            "Confirm calculated ending cash agrees with bank statement ledger balance."
        ]
        gl_impact = "Bank Fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Operating Cash) | Interest: DR 1010-00 Cash / CR 7100-00 Interest Income"
        next_step = "Cash log updated in shared drive; feeds weekly funding projections and monthly bank reconciliation."
        stakeholders = ["Property Accountant", "Asset Manager", "Onshore Treasury"]
        reports = ["Daily Cash Position Report", "Bank Activity Summary", "Treasury Liquidity Forecast"]
        pro_tips = ["Reconcile merchant processor batches (RentPayment, ClickPay) to net bank deposits daily.", "Highlight NSF (non-sufficient funds) chargebacks and notify site team to reverse tenant ledger credits."]
        pitfalls = ["Failing to log unmapped bank sweep entries, causing fictitious book overdrafts."]

    elif "Insurance accrual" in name or "Property tax accrual" in name or "Payroll Accrual" in name:
        rp_module = "GL"
        rp_nav = ["General Ledger", "Journals", "Standard Journal / Auto-Reversing Accrual"]
        yardi_nav = ["Financials", "Journal Entries", "Standard Accrual (Auto-Reverse)"]
        purpose = "Accrue operating expenses incurred during the month where actual third-party invoices or payroll registers have not yet been billed or paid."
        root_cause = "GAAP matching principle: expenses must be recognized in the period they occur regardless of billing or payment timing."
        sop = [
            "Review prior month actuals, annual approved budget, and contract schedules for recurring obligations.",
            "For Property Tax: Calculate monthly accrual = Total Annual Assessed Tax / 12 months.",
            "For Insurance: Calculate monthly expense = Total Annual Policy Premium / 12 months.",
            "For Payroll: Calculate unbilled days at month-end based on site staff payroll schedule.",
            "Draft Auto-Reversing Journal Entry in RealPage with effective date as last day of month.",
            "Set auto-reversal date to Day 1 of subsequent month."
        ]
        gl_impact = "DR 6400-00 (Property Tax Exp) or DR 6300-00 (Insurance Exp) / CR 2100-00 (Accrued Expenses)"
        next_step = "Journal entry posts to trial balance; automatically reverses next month to prevent double-counting upon invoice entry."
        stakeholders = ["Property Accountant", "Reviewer", "Asset Manager"]
        reports = ["Monthly Accrual Schedule", "Trial Balance Detail", "Budget vs Actual Variance Report"]
        pro_tips = ["Always verify whether property taxes are paid via lender escrow or direct payment before booking escrow entries.", "Use auto-reversing flags in RealPage to eliminate manual reversal mistakes."]
        pitfalls = ["Forgetting to flag entry as auto-reversing, resulting in duplicate expenses when the actual invoice arrives."]

    elif "Bank Reconciliation" in name:
        rp_module = "Cash Management"
        rp_nav = ["Cash Management", "Reconciliations", "Bank Reconciliation", "Select Account & Period"]
        yardi_nav = ["Financials", "Cash Management", "Reconcile Bank Account"]
        purpose = "Reconcile the property's general ledger cash account with the official bank statement, accounting for outstanding checks and deposits in transit."
        root_cause = "Ensure internal accounting books match actual bank cash, prevent fraud, identify unrecorded bank fees or sweeps, and substantiate Balance Sheet Cash."
        sop = [
            "Download month-end bank statement and pull RealPage Bank Reconciliation module for target account.",
            "Input bank statement ending balance and statement cut-off date.",
            "Clear cleared checks, ACH payments, and wires matching the bank statement.",
            "Clear matching deposits and customer payments in transit.",
            "Verify that 'Difference to Balance' equals exactly $0.00.",
            "Print Bank Reconciliation Summary, Outstanding Check List, and Deposits in Transit support.",
            "Submit signed rec package for Onshore review."
        ]
        gl_impact = "No GL posting from rec itself; adjusting entries booked for fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Cash)"
        next_step = "Bank Rec approved by Onshore Reviewer; included as Schedule 1 in MOR package."
        stakeholders = ["Property Accountant", "Xshore Reviewer", "Onshore Reviewer", "Lender"]
        reports = ["Bank Reconciliation Report", "Outstanding Check List", "Deposits in Transit Ledger"]
        pro_tips = ["Always investigate outstanding deposits older than 3 days—they often indicate missed NSF reversals or bank errors.", "Checks outstanding over 90 days should be flagged for void/reissue or escheatment review."]
        pitfalls = ["Forcing a bank reconciliation balance with an unexplained plug entry instead of locating the exact missing transaction."]

    elif "GPR entry posting and tie out" in name:
        rp_module = "GL"
        rp_nav = ["General Ledger", "Journals", "Standard Journal", "GPR Posting & Rent Roll"]
        yardi_nav = ["Financials", "Journal Entries", "Gross Potential Rent Tie-Out"]
        purpose = "Post Gross Potential Rent (GPR) and tie out the property's rent roll to the general ledger to verify total potential revenue, vacancy loss, and concessions."
        root_cause = "US multifamily accounting records revenue at Gross Potential Rent (100% occupancy at market rent) minus vacancy, concessions, and employee units."
        sop = [
            "Generate month-end Rent Roll and GPR Summary report from RealPage Leasing & Rents module.",
            "Extract Market Rent, Gross Potential Rent, Vacancy Loss, Gain/Loss to Lease, and Rent Concessions.",
            "Draft GPR journal entry in GL module matching rent roll totals exactly.",
            "Verify that Net Rental Income on Income Statement ties to Rent Roll Net Billed Rent.",
            "Document any variances between resident ledger billings and GL posting."
        ]
        gl_impact = "DR 5100-00 (Vacancy Loss) / DR 5150-00 (Concessions) / DR 1100-00 (Accounts Receivable - Residents) / CR 5000-00 (Gross Potential Rent)"
        next_step = "Rental revenue certified for AME package; supports Asset Management operational review."
        stakeholders = ["Property Accountant", "Property Manager", "Asset Management"]
        reports = ["Rent Roll Summary", "Gross Potential Rent Tie-Out Schedule", "Income Statement"]
        pro_tips = ["Ensure month-end gross potential rent ties to total unit count * average market rent.", "Cross-reference model units and employee discounts with approved HR lists."]
        pitfalls = ["Posting GPR without matching current month market rent changes made by the leasing office."]

    elif "Management Fees calculation" in name or "Management Fees Accrual" in name or "PM Fees" in name:
        rp_module = "GL"
        rp_nav = ["General Ledger", "Journals", "Standard Journal", "Management Fee Calculation"]
        yardi_nav = ["Financials", "Management Fees", "Calculate & Post Fees"]
        purpose = "Calculate and post the monthly property management fee owed to the third-party property management company based on the management agreement."
        root_cause = "Management agreements mandate a contractual fee (typically 2.5% to 4.0% of Total Operating Collections or Gross Revenue)."
        sop = [
            "Review Management Agreement to confirm agreed fee percentage (e.g. 3.0%) and collection base.",
            "Run Cash Collections Report or Net Operating Revenue Report for the month.",
            "Multiply eligible collected revenue by management fee percentage.",
            "Deduct any exclusions specified in contract (e.g., insurance claim proceeds, security deposit forfeitures).",
            "Post Journal Entry in RealPage: Debit Management Fee Expense, Credit Accrued Management Fees / Due to PM.",
            "Stage management fee invoice or wire for payment approval."
        ]
        gl_impact = "DR 6200-00 (Management Fees Expense) / CR 2120-00 (Accrued Management Fees / Due to Management Co)"
        next_step = "Management fee approved in AME review and disbursed via wire in following month AP check run."
        stakeholders = ["Property Accountant", "Asset Manager", "Property Management Executive"]
        reports = ["Management Fee Calculation Schedule", "Cash Collections Report", "Income Statement"]
        pro_tips = ["Confirm whether fee is based on Cash Collections or Accrual Revenue—misinterpreting this is a very common audit finding.", "Check for monthly minimum fee clauses during lease-up phases."]
        pitfalls = ["Including capital contribution proceeds or insurance recovery checks in eligible revenue for fee calculations."]

    elif "Bad debt calculation" in name:
        rp_module = "GL"
        rp_nav = ["General Ledger", "Journals", "Standard Journal", "Bad Debt Allowance Schedule"]
        yardi_nav = ["Financials", "Journal Entries", "Bad Debt Calculation & Reserve"]
        purpose = "Calculate and record monthly Bad Debt Expense and Allowance for Uncollectible Accounts based on delinquent resident balances aged 60+ and 90+ days."
        root_cause = "Accounts receivable from current and past residents over 60/90 days have low collection probability and must be reserved under GAAP conservatism."
        sop = [
            "Run Delinquency Aging Report from RealPage Leasing & Rents module as of month-end.",
            "Separate delinquent balances into: Current Residents vs. Evicted/Moved-Out Residents.",
            "Apply ownership policy reserve rates (e.g. 50% for 60-89 days, 100% for 90+ days and all skipped/evicted residents).",
            "Calculate required ending balance in Allowance for Doubtful Accounts (GL 1150-00).",
            "Post Journal Entry for the delta between current GL allowance balance and required reserve balance."
        ]
        gl_impact = "DR 6350-00 (Bad Debt Expense) / CR 1150-00 (Allowance for Doubtful Accounts - Contra Asset)"
        next_step = "Delinquency schedule and reserve calculation added to AME workpapers for Onshore Review."
        stakeholders = ["Property Accountant", "Property Manager", "Onshore Reviewer"]
        reports = ["Delinquency Aging Report", "Bad Debt Reserve Roll-Forward", "Rent Roll Detail"]
        pro_tips = ["Verify if former resident security deposits have already been applied against outstanding charges before calculating bad debt.", "Check for active payment plans before fully reserving 60-day balances."]
        pitfalls = ["Directly writing off resident balances to Bad Debt Expense instead of booking through the Allowance contra-asset account."]

    elif "GL scrutiny" in name or "Self Analysis" in name or "Budget Variance" in name or "T12" in name:
        rp_module = "GL"
        rp_nav = ["General Ledger", "Reports", "General Ledger Detail / Comparative Income Statement"]
        yardi_nav = ["Financials", "Reports", "Trial Balance / Budget Variance Analysis"]
        purpose = "Perform detailed line-by-line review of all balance sheet and income statement accounts, detecting miscoded entries, unexpected variances, and anomalies before review submission."
        root_cause = "Ensures financial integrity, catches miscoded invoices, verifies accrual reversals, and prepares the accountant to explain operational variances to management."
        sop = [
            "Generate GL Detail Report for the month and export to Excel alongside Approved Budget.",
            "Run Comparative Income Statement (Current Month Actual vs. Budget vs. Prior Month).",
            "Highlight all revenue variances > $1,000 and expense variances > $2,500 or 10%.",
            "Inspect underlying journal entries and invoice distributions for any highlighted anomalies.",
            "Correct miscoded entries via reclassifying journal entry before period close.",
            "Draft clear, concise variance explanations for the Onshore Review team."
        ]
        gl_impact = "Reclassification entries if needed: DR Correct Expense GL / CR Miscoded Expense GL"
        next_step = "Clean financials ready for Xshore Internal Review and Preliminary AME package submission."
        stakeholders = ["Property Accountant", "Internal Xshore Reviewer", "Asset Manager"]
        reports = ["General Ledger Detail Report", "Budget Variance Report", "Trailing 12-Month (T12) Income Statement"]
        pro_tips = ["Look for debit balances in liability accounts or credit balances in expense accounts—they almost always signal miscoding.", "Scan the T12 horizontally to spot missing monthly recurring bills (e.g. trash, landscaping)."]
        pitfalls = ["Writing vague variance explanations like 'higher expenses due to timing' without investigating specific invoices."]

    elif "AME reports" in name or "MOR package" in name or "Financial Report update" in name or "Month end reporting" in name:
        rp_module = "Reporting Portal"
        rp_nav = ["Reporting Portal", "Financial Packages", "AME Package / Monthly Operating Report (MOR)"]
        yardi_nav = ["Financials", "Reports", "Financial Package Publisher", "MOR Package"]
        purpose = "Generate, assemble, balance, and publish the complete monthly financial reporting package for property owners, asset managers, and lenders."
        root_cause = "Monthly contractual reporting deadline to deliver certified financial statements to institutional investors and compliance partners."
        sop = [
            "Verify all subledgers (AP, AR, Cash Management) are locked and posted in RealPage.",
            "Navigate to Reporting Portal > Financial Packages > select AME / MOR Package.",
            "Run report generator for target month; verify Balance Sheet balances (Assets = Liabilities + Equity).",
            "Assemble required supporting schedules: Bank Recs, Rent Roll, Delinquency, Escrows, Capex Schedule.",
            "Check that Net Income on Income Statement ties to Balance Sheet Current Year Earnings.",
            "Publish compiled PDF package to shared drive / SharePoint for executive distribution."
        ]
        gl_impact = "Finalizes financial ledger; locks accounting period to prevent retroactive changes."
        next_step = "Transmitted to Onshore Reviewers, Asset Managers, and Institutional Investors (e.g., Goldman Sachs, OSSO)."
        stakeholders = ["Property Accountant", "Onshore Reviewer", "Asset Manager", "Lender"]
        reports = ["Balance Sheet", "Income Statement (Month & YTD)", "Cash Flow Statement", "MOR Package Complete"]
        pro_tips = ["Always verify the 'Tie-Out Triangle': Net Income on Income Statement == Change in Retained Earnings == Cash Flow Operating Net.", "Double-check header dates and property name formatting before PDF publishing."]
        pitfalls = ["Publishing reports before confirming that all late reclassification entries have been posted to the general ledger."]

    elif "Escrows Tie out" in name:
        rp_module = "GL"
        rp_nav = ["General Ledger", "Inquiries & Reports", "Account Inquiry - Escrow Ledger"]
        yardi_nav = ["Financials", "General Ledger", "Escrow Account Details"]
        purpose = "Reconcile property tax, insurance, and replacement reserve escrow balances held by mortgage lenders with lender monthly mortgage statements."
        root_cause = "Lenders collect monthly escrow deposits with mortgage payments and pay taxes/insurance on property's behalf; book balances must match lender records."
        sop = [
            "Obtain latest monthly mortgage lender billing statement showing escrow account balances.",
            "Run RealPage GL Detail for Escrow Accounts (1210-00 Tax Escrow, 1220-00 Insurance Escrow, 1230-00 Replacement Reserve Escrow).",
            "Match monthly lender escrow deposits to mortgage wire payment breakdown.",
            "Record lender disbursements for property taxes or insurance premiums against the escrow asset.",
            "Draft adjustment journal entry for lender escrow interest earned or servicing fees.",
            "Ensure ending RealPage escrow balance matches lender statement to the penny."
        ]
        gl_impact = "Disbursement by lender: DR 2100-00 (Accrued Taxes/Insurance) / CR 1210-00 (Tax Escrow Asset)"
        next_step = "Escrow tie-out schedule included in monthly balance sheet workpapers for review."
        stakeholders = ["Property Accountant", "Mortgage Lender", "Onshore Reviewer"]
        reports = ["Escrow Tie-Out Schedule", "Lender Mortgage Statement", "Balance Sheet Detail"]
        pro_tips = ["Lenders often take 30-60 days to reflect tax payments; track local county tax collector receipts as interim proof.", "Verify interest earned on escrow accounts is booked to Interest Income."]
        pitfalls = ["Expensing insurance or taxes when the lender pays them, rather than reducing the prepaid/escrow asset account."]

    elif "Replacement Reserve Draw" in name or "Funding" in name:
        rp_module = "GL"
        rp_nav = ["General Ledger", "Job Cost & Reserves", "Replacement Reserves / Capital Draws"]
        yardi_nav = ["Financials", "Job Cost", "Draw Requests & Funding"]
        purpose = "Compile capital expenditure (Capex) invoices, proofs of payment, and lien waivers to request reimbursement funds from lender escrow or investor partners."
        root_cause = "Capital improvement projects (roof replacement, exterior paint, clubhouse remodel) are funded from reserved escrow accounts upon verified completion."
        sop = [
            "Gather paid Capex vendor invoices, cancelled checks/wire confirmations, and contractor lien waivers.",
            "Verify all items meet capital expenditure threshold (typically > $1,000 and life > 1 year).",
            "Prepare formal Lender Reserve Draw Request Form matching lender-approved work categories.",
            "Submit draw package to Onshore Reviewer and Lender inspector.",
            "Upon receipt of wire funding: post deposit to operating cash and reduce receivable from lender reserve."
        ]
        gl_impact = "Wire received: DR 1010-00 (Operating Cash) / CR 1230-00 (Replacement Reserve Escrow / Due from Lender)"
        next_step = "Lender releases escrow funds to operating account; replenishes operating cash reserves."
        stakeholders = ["Property Accountant", "Asset Manager", "Lender Inspector", "General Contractor"]
        reports = ["Replacement Reserve Draw Schedule", "Capex Budget Tracking Ledger", "Bank Statement"]
        pro_tips = ["Keep unconditional final lien waivers organized per vendor—lenders reject draw packages missing even a single waiver.", "Tie out drawn amounts to cumulative capital project GL balances."]
        pitfalls = ["Submitting routine repair and maintenance (R&M) operating expenses as capital reserve draws, which will be rejected by lender auditors."]

    else:
        # Default comprehensive fallback
        rp_module = "GL"
        rp_nav = ["General Ledger", "Processes", "Monthly Accounting Tasks"]
        yardi_nav = ["Financials", "General Ledger", "Standard Processing"]
        purpose = f"Execute and verify {name} in accordance with offshore US property accounting standards and operational calendars."
        root_cause = f"Essential control requirement for {cat} to maintain timely, balanced property books and investor compliance."
        sop = [
            f"Review standard operating procedure instructions for {name}.",
            "Open target property in RealPage and verify subledger period status.",
            "Gather supporting documentation, third-party confirmations, or site team reports.",
            "Execute required calculations, journal entries, or file uploads.",
            "Verify trial balance integrity and archive workpapers in shared property folder."
        ]
        gl_impact = f"Balances appropriate {cat} GL accounts in accordance with US GAAP matching principles."
        next_step = "Updates financial workpapers and advances property status towards monthly review sign-off."
        stakeholders = ["Property Accountant", "Internal Xshore Reviewer", "Onshore Reviewer"]
        reports = ["Trial Balance", "General Ledger Detail", "AME Supporting Workpapers"]
        pro_tips = ["Always save working Excel files with clear formula links and date stamps.", "Promptly flag any material variances to your team lead."]
        pitfalls = ["Skipping self-review before submitting task completion status."]

    return {
        'id': f"task_{abs(hash(name)) % 100000:05d}",
        'name': name,
        'phase': phase,
        'category': cat,
        'frequency': freq,
        'priority': prio if prio in ['High', 'Medium', 'Low'] else 'Medium',
        'notes': notes,
        'rpModule': rp_module,
        'navigation': {
            'realpage': rp_nav,
            'yardi': yardi_nav
        },
        'purpose': purpose,
        'rootCause': root_cause,
        'actionSOP': sop,
        'downstreamImpact': {
            'glImpact': gl_impact,
            'nextWorkflowStep': next_step,
            'keyStakeholders': stakeholders,
            'downstreamReports': reports
        },
        'proTips': pro_tips,
        'commonPitfalls': pitfalls
    }

mastery_tasks = [generate_mastery_details(t) for t in raw_tasks]
print(f"Generated {len(mastery_tasks)} mastery tasks.")

# Write to tasksData.js
js_content = f'''// Generated 5-Point Mastery Task Database for RealPage & Yardi Property Accounting
// Total Tasks: {len(mastery_tasks)} covering all 77 real offshore tasks from Daily Task Tracker.xlsx

export const ALL_TASKS = {json.dumps(mastery_tasks, indent=2)};

export const TASK_PHASES = [
  'All',
  'Ongoing - Daily',
  'Ongoing - Weekly',
  'Pre-AME',
  'Post-AME',
  'Review',
  'Reporting',
  'Ongoing - Monthly',
  'Ongoing - Quarterly'
];

export const TASK_CATEGORIES = Array.from(new Set(ALL_TASKS.map(t => t.category))).sort();

export const PROPERTIES = [
  'All Properties',
  'Arcadian (Goldman Sachs - Yardi)',
  'OSSO Portfolio',
  'Wholly Owned / GS-RP'
];
'''

with open('02-property-accounting/src/data/tasksData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Saved tasksData.js successfully!")
