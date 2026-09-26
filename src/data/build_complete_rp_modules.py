import json

# Full suite of RealPage modules based on all 57 manuals
modules = [
  {
    "id": "ap",
    "title": "Accounts Payable (AP)",
    "shortCode": "AP",
    "icon": "receipt-outline",
    "color": "#38BDF8",
    "description": "Invoice processing, exception queues, approval workbench, payment check runs, vendor compliance, and AP subledger reporting.",
    "submodules": [
      {
        "id": "ap_invoices",
        "title": "Invoice Processing & Queues",
        "screens": [
          {
            "id": "scr_ap_exception_queue",
            "name": "Invoice Exception Queue",
            "navigation": ["Accounts Payable", "Invoices", "Manage Invoices", "Status: Exception"],
            "purpose": "Quarantine and resolve vendor invoices that failed automated validation rules (PO variance, missing ROG, vendor block, invalid GL).",
            "whyRecordsAreHere": [
              "PO line-item variance exceeds 5% or $100 dollar threshold.",
              "Goods have not been marked as received in the system (Missing Receipt of Goods / ROG).",
              "Vendor has expired Certificate of Insurance (COI) or missing W-9 tax identification form.",
              "Invoice distribution line contains an inactive, closed, or restricted GL code.",
              "System identified a duplicate invoice number from the same vendor within the past 12 months."
            ],
            "keyFieldsAndFilters": [
              {"name": "Exception Code", "description": "Standard RealPage code explaining the exact rule failure (e.g., EX_PO_VAR, EX_NO_ROG, EX_VEND_HOLD)."},
              {"name": "Invoice Status", "description": "Displays quarantine status: Exception - Action Required."},
              {"name": "Property ID", "description": "Filter by specific multifamily asset code."},
              {"name": "Amount & Variance", "description": "Shows invoice total vs PO authorized amount."}
            ],
            "accountantActionSOP": [
              "Click on the hyperlinked Exception Code to review the automated failure log.",
              "If missing ROG: notify the property maintenance supervisor to digitally receive goods in the purchasing module.",
              "If PO variance: request a formal PO Change Order or PM approval if additional scope was authorized.",
              "If vendor hold: coordinate with vendor management to obtain current W-9 or renewed insurance policy.",
              "Once root cause is cleared, click 'Re-evaluate Exception' to route invoice into the PM Approval Workbench."
            ],
            "glAccountingImpact": "No GL entries are posted while in exception. Upon resolution and final approval: DR Operating Expense GL / CR 2000-00 Accounts Payable Subledger.",
            "whatHappensNext": "Invoice leaves quarantine and enters the Property Manager (PM) 1st Level Approval Queue. Once approved by PM and Accounting, it stages for payment.",
            "proTips": "Always sort by Age in Days and dollar amount. Invoices over 30 days in exception severely hurt vendor credit terms and prompt warning flags during onshore audits."
          },
          {
            "id": "scr_ap_manage_invoices",
            "name": "Manage Invoices & Batch Entry",
            "navigation": ["Accounts Payable", "Invoices", "Manage Invoices"],
            "purpose": "Central dashboard to search, view, edit, reclassify, or track the real-time workflow status of all property vendor invoices.",
            "whyRecordsAreHere": [
              "Every invoice scanned, imported via EDI, or manually entered by site staff or offshore processing teams resides here."
            ],
            "keyFieldsAndFilters": [
              {"name": "Status Filter", "description": "Pending Approval, Approved, Paid, Exception, Void, In Process."},
              {"name": "Invoice Date Range", "description": "Crucial for isolating invoices by target accounting period."},
              {"name": "Vendor Search", "description": "Look up by vendor trade name or RealPage vendor ID."}
            ],
            "accountantActionSOP": [
              "Use Status = 'Approved' to forecast cash disbursements for the weekly payment run.",
              "Verify invoice image quality and ensure sales tax is coded to appropriate tax GL or operational line.",
              "Check that invoices are not backdated into closed accounting periods without prior controller permission."
            ],
            "glAccountingImpact": "Approved invoices post to the AP Subledger and immediately reflect on the Trial Balance and General Ledger (DR Expense / CR AP 2000-00).",
            "whatHappensNext": "Invoices appear on the Cash Requirements Report and are selected for check or ACH payment during the weekly AP payment run.",
            "proTips": "Use the 'Batch ID' search when reconciling vendor statements to see all invoices submitted in a single upload."
          }
        ]
      },
      {
        "id": "ap_payments",
        "title": "Payments & Check Processing",
        "screens": [
          {
            "id": "scr_ap_check_run",
            "name": "Select Invoices for Payment (Check Run)",
            "navigation": ["Accounts Payable", "Payments", "Payment Processing", "Select Invoices"],
            "purpose": "Select approved vendor bills and resident security deposit refunds to prepare physical check batches, ACH files, or wire transfers.",
            "whyRecordsAreHere": [
              "Invoices that have completed all approval tiers (1st, 2nd, and Accounting) and reached their due date appear in the eligible payment pool."
            ],
            "keyFieldsAndFilters": [
              {"name": "Payment Date", "description": "The check or ACH value date posted to the general ledger."},
              {"name": "Bank Account", "description": "Operating Account from which funds will be disbursed."},
              {"name": "Due Date Cutoff", "description": "Filters invoices due on or before specified calendar date."}
            ],
            "accountantActionSOP": [
              "Check morning collected cash balance in operating account to establish total payment limit.",
              "Select eligible invoices; generate the 'Cash Requirements Summary' report for review.",
              "Exclude disputed invoices or vendors with open credit memos.",
              "Generate payment batch and route to Onshore Signer for release authorization."
            ],
            "glAccountingImpact": "DR 2000-00 (Accounts Payable Subledger) / CR 1010-00 (Operating Cash Account).",
            "whatHappensNext": "Payment batch creates checks or NACHA file. Disbursed checks appear on the Bank Reconciliation Outstanding Checks list.",
            "proTips": "Always ensure credit memos are selected alongside vendor invoices to avoid overpaying vendors."
          },
          {
            "id": "scr_ap_void_reissue",
            "name": "Void & Re-issue Payments",
            "navigation": ["Accounts Payable", "Payments", "Manage Payments", "Void Payment"],
            "purpose": "Void lost, expired, returned, or erroneous vendor checks and re-issue or restore the underlying invoice.",
            "whyRecordsAreHere": [
              "Checks returned as undeliverable, stale-dated (>90 days), or lost in transit by vendors or past residents."
            ],
            "keyFieldsAndFilters": [
              {"name": "Void Date", "description": "Must be within the current open accounting period; never backdate into closed periods."},
              {"name": "Void Reason", "description": "Required audit note (e.g., Stale Dated, Wrong Payee Name, Stop Payment Placed)."},
              {"name": "Re-issue Option", "description": "Choose whether to immediately generate a new check or restore invoice to unpaid status."}
            ],
            "accountantActionSOP": [
              "Verify stop-payment confirmation is active in bank portal.",
              "Enter check number in RealPage Manage Payments and select 'Void'.",
              "Set void date to current month; attach stop-payment confirmation letter.",
              "Confirm book cash balance is credited and bank rec outstanding list updates."
            ],
            "glAccountingImpact": "DR 1010-00 (Operating Cash) / CR 2000-00 (Accounts Payable Subledger).",
            "whatHappensNext": "Cleared from Bank Rec outstanding check schedule. If re-issued, a new check number is generated on the next AP check run.",
            "proTips": "If voiding resident refund checks, check local state unclaimed property (escheatment) laws if older than 180 days."
          }
        ]
      },
      {
        "id": "ap_reports",
        "title": "AP Reports & Audit Tools",
        "screens": [
          {
            "id": "scr_ap_exception_report",
            "name": "Invoice Exception Report",
            "navigation": ["Accounts Payable", "Reports", "Invoice Exception Report"],
            "purpose": "Executive report listing all invoices currently blocked from payment, grouped by exception reason and property.",
            "whyRecordsAreHere": [
              "Used by accountants, PMs, and onshore managers during weekly AP reviews to ensure no critical bills are stalled."
            ],
            "keyFieldsAndFilters": [
              {"name": "Property Selection", "description": "Run by individual asset or portfolio-wide."},
              {"name": "Aging Buckets", "description": "0-30 days, 31-60 days, 61-90 days, 90+ days."},
              {"name": "Exception Category", "description": "PO Variance, ROG, Compliance, GL Mismatch."}
            ],
            "accountantActionSOP": [
              "Run every Monday morning before the weekly team calls.",
              "Highlight utility invoices, contractor draw bills, and tax assessments in exception.",
              "Assign action items to site team members with explicit resolution deadlines."
            ],
            "glAccountingImpact": "Informational report; highlights potential unrecorded liabilities needing month-end accrual.",
            "whatHappensNext": "Site team resolves exceptions; invoices move to approval queue. If unresolved at month-end, accountant records unbilled invoice accrual.",
            "proTips": "If an invoice remains in exception past month-end cutoff, you MUST book an unbilled invoice accrual (DR Expense / CR Accrued Expenses)."
          },
          {
            "id": "scr_ap_aging_report",
            "name": "Vendor Aging & Trial Balance",
            "navigation": ["Accounts Payable", "Reports", "Vendor Aging Report"],
            "purpose": "Displays all unpaid vendor invoices categorized into 30, 60, 90, and 120+ day aging columns.",
            "whyRecordsAreHere": [
              "Essential month-end schedule to tie out the AP subledger to the General Ledger AP control account."
            ],
            "keyFieldsAndFilters": [
              {"name": "As of Date", "description": "Always set to last calendar day of the accounting month."},
              {"name": "Summary vs Detail", "description": "Detail view shows individual invoice numbers and dates."}
            ],
            "accountantActionSOP": [
              "Run as of month-end date.",
              "Verify total ending vendor aging ties exactly to GL Account 2000-00 (Accounts Payable).",
              "Investigate any debit balances (vendor credit balances) and request refunds or offset against upcoming bills."
            ],
            "glAccountingImpact": "Total Vendor Aging must equal GL Account 2000-00 to the penny. Zero variance allowed.",
            "whatHappensNext": "Schedule is signed off and included as Schedule 2 in the Monthly Operating Report (MOR) package for the asset manager.",
            "proTips": "Never close the AP subledger if Vendor Aging does not tie to GL 2000-00."
          }
        ]
      }
    ]
  },
  {
    "id": "ar",
    "title": "Accounts Receivable (AR) & Resident Accounting",
    "shortCode": "AR",
    "icon": "people-outline",
    "color": "#10B981",
    "description": "Gross Potential Rent (GPR), delinquency aging, bad debt write-offs, security deposit accounting, and resident ledgers.",
    "submodules": [
      {
        "id": "ar_delinquency",
        "title": "Delinquency & Collections",
        "screens": [
          {
            "id": "scr_ar_delinquency_report",
            "name": "Delinquency Aging Report",
            "navigation": ["Accounts Receivable", "Reports", "Delinquency Aging Report"],
            "purpose": "Track past-due resident balances aged 30, 60, and 90+ days to calculate bad debt reserves and initiate legal notices.",
            "whyRecordsAreHere": [
              "Residents who missed rent payments, failed to pay utility rebills, or incurred uncollected lease termination fees.",
              "Moved-out residents with damage charges exceeding their security deposit."
            ],
            "keyFieldsAndFilters": [
              {"name": "Resident Status", "description": "Current, Notice, Eviction, Moved Out."},
              {"name": "Aging Columns", "description": "Current, 30-59 days, 60-89 days, 90+ days."},
              {"name": "Exclude Inactive", "description": "Exclude residents whose accounts have been sent to third-party collections."}
            ],
            "accountantActionSOP": [
              "Run report on the 10th of the month and at month-end.",
              "Apply ownership reserve policy (e.g. 50% for 60-89 days, 100% for 90+ days and all skipped/evicted units).",
              "Compare total required allowance against current balance in GL 1150-00.",
              "Post Bad Debt adjustment entry in the general ledger."
            ],
            "glAccountingImpact": "DR 6350-00 (Bad Debt Expense) / CR 1150-00 (Allowance for Doubtful Accounts).",
            "whatHappensNext": "Delinquency schedule is sent to Property Manager and Asset Manager for eviction strategy; bad debt reflects on income statement.",
            "proTips": "Always ensure security deposits have been applied against past-due balances before computing the net delinquent amount."
          },
          {
            "id": "scr_ar_gpr_tieout",
            "name": "Rent Roll & GPR Tie-Out",
            "navigation": ["Accounts Receivable", "Reports", "Rent Roll Summary / GPR Schedule"],
            "purpose": "Reconcile the physical property rent roll with the general ledger revenue accounts (Gross Potential Rent, Vacancy, Concessions).",
            "whyRecordsAreHere": [
              "Multifamily properties bill rent at 100% market rent (GPR) and record vacancies, employee discounts, and concessions as contra-revenue."
            ],
            "keyFieldsAndFilters": [
              {"name": "As of Date", "description": "Last day of the accounting month."},
              {"name": "Summary Mode", "description": "Displays total units, occupied units, leased units, and total market rent."}
            ],
            "accountantActionSOP": [
              "Generate month-end Rent Roll Summary in RealPage.",
              "Extract: Total Market Rent, Vacancy Loss, Model Units, Employee Discounts, and Concessions.",
              "Verify that Net Billed Rent equals Net Rental Income on the Income Statement.",
              "Book monthly Gross Potential Rent (GPR) journal entry."
            ],
            "glAccountingImpact": "DR 5100-00 (Vacancy Loss) / DR 5150-00 (Concessions) / DR 1100-00 (Resident AR) / CR 5000-00 (Gross Potential Rent).",
            "whatHappensNext": "Certified revenue schedule attaches to AME package; locks rental revenue from further alteration.",
            "proTips": "Multiply total unit count by average market rent per unit to perform a quick sanity tie-out."
          }
        ]
      }
    ]
  },
  {
    "id": "gl",
    "title": "General Ledger (GL)",
    "shortCode": "GL",
    "icon": "book-outline",
    "color": "#818CF8",
    "description": "Standard journals, auto-reversing accruals, recurring amortization schedules, GL scrutiny, trial balance, and period close.",
    "submodules": [
      {
        "id": "gl_journals",
        "title": "Journals & Auto-Reversals",
        "screens": [
          {
            "id": "scr_gl_standard_je",
            "name": "Standard & Auto-Reversing Journal Entries",
            "navigation": ["General Ledger", "Journals", "Standard Journal"],
            "purpose": "Record non-invoice transactions: month-end expense accruals, reclassifications, sweep entries, and intercompany allocations.",
            "whyRecordsAreHere": [
              "Adjustments required to comply with US GAAP matching principles and correct site-team coding errors."
            ],
            "keyFieldsAndFilters": [
              {"name": "Journal Type", "description": "Standard, Auto-Reversing, Accrual, Recurring."},
              {"name": "Effective Date", "description": "Must be within target open period (e.g. 08/31/2026)."},
              {"name": "Reversal Date", "description": "Day 1 of subsequent month (e.g. 09/01/2026)."},
              {"name": "Description & Reference", "description": "Audit trail mandatory explanation."}
            ],
            "accountantActionSOP": [
              "Draft entry with balanced Debits and Credits (Total Debits == Total Credits).",
              "For month-end accruals (utilities, marketing, payroll), select 'Auto-Reverse' on Day 1 of next month.",
              "Attach Excel calculation support and third-party backup (e.g., utility rate bills, payroll summary).",
              "Post or submit for Onshore Reviewer approval depending on property authority policies."
            ],
            "glAccountingImpact": "Directly updates GL account balances and reflects immediately on the Trial Balance.",
            "whatHappensNext": "If auto-reversing, RealPage system job automatically creates offsetting reversal entry on the 1st of next month.",
            "proTips": "Always include the calculation formula and month in the line-item description (e.g., 'Aug 2026 Utility Accrual - 5 unbilled days')."
          },
          {
            "id": "scr_gl_duplicate_je",
            "name": "Duplicate Journal Entry (Same Book or Other Books)",
            "navigation": ["General Ledger", "All", "Journal Entry", "View Transactions", "View > Duplicate"],
            "purpose": "Clone an existing complex multi-line journal entry into the current journal or a different book (Accrual, Tax, Provisional, User-Defined) without re-keying account numbers, cost centers, and descriptions.",
            "whyRecordsAreHere": [
              "Accountants execute recurring monthly journal entries (mortgage interest, utilities, management fee accruals, billbacks) where only dates or amounts change.",
              "Allows testing entry impact: copy an entry into a Provisional/User-Defined book first to review financial statement impact before recording to the main Accrual book.",
              "Eliminates manual data entry errors and transposition mistakes on multi-line reclassifications."
            ],
            "keyFieldsAndFilters": [
              {"name": "Duplicate Button", "description": "Located on the top action toolbar when viewing a transaction or checking transactions in the list."},
              {"name": "Duplicate To Box", "description": "Dialog that opens to specify the destination Book (Accrual, GAAP, Tax, User-Defined) and Journal."},
              {"name": "Date Selection", "description": "Choose whether to use the original entry date or specify a new replacement target period date."},
              {"name": "New Transaction ID", "description": "System automatically assigns a unique sequential ID while copying all distribution lines."}
            ],
            "accountantActionSOP": [
              "Step 1: Navigate to General Ledger > All > Journal Entry > View Transactions.",
              "Step 2: Locate the prior month journal entry to copy; click View or select its check box in the list.",
              "Step 3: Click the Duplicate button on the top action bar.",
              "Step 4: In the Duplicate To pop-up dialog, select target Book (e.g. Accrual) and Journal.",
              "Step 5: In Date section, choose Specify Date and input current month-end date (e.g. 08/31/2026).",
              "Step 6: Click OK; RealPage opens the cloned entry with a new Transaction ID.",
              "Step 7: Edit distribution dollar amounts and line descriptions to reflect current month support.",
              "Step 8: Verify Debits equal Credits, then click Post (or Save as Draft)."
            ],
            "glAccountingImpact": "Cloned entry posts with new Transaction ID: Debits selected Expense/Asset GLs and Credits matching Liability/Equity GLs. Zero net imbalance allowed.",
            "whatHappensNext": "New journal entry posts to the General Ledger and Trial Balance. Reflected on the monthly GL Detail Report and Comparative Income Statement.",
            "proTips": "RealPage does NOT check for duplicate journal entries during imports or copying (as stated on page 18 of the Importing Data guide). Always verify the Transaction ID and description to prevent accidentally posting the exact same entry twice!"
          },
          {
            "id": "scr_gl_prepaid_duplicate",
            "name": "Duplicate a Prepaid Journal Entry",
            "navigation": ["General Ledger", "Periodic Tasks", "Prepaids", "Edit > Duplicate"],
            "purpose": "Duplicate an existing prepaid amortization schedule to create a new recurring schedule for renewed policies or newly capitalized multi-month prepaid expenses.",
            "whyRecordsAreHere": [
              "Annual insurance renewals, software subscriptions, or service contracts require setting up a new 12-month amortization schedule identical in structure to the expiring contract."
            ],
            "keyFieldsAndFilters": [
              {"name": "Duplicate Button", "description": "Appears when viewing or editing an existing prepaid record in General Ledger > Periodic Tasks > Prepaids."},
              {"name": "Asset & Expense Accounts", "description": "Prepaid Asset (1200-00) and Target Expense (6300-00)."},
              {"name": "Amortization Term", "description": "Number of months and start date."}
            ],
            "accountantActionSOP": [
              "Step 1: Navigate to General Ledger > Periodic Tasks > Prepaids.",
              "Step 2: Locate the expiring or template prepaid record; click Edit.",
              "Step 3: Click the Duplicate button on the header toolbar.",
              "Step 4: System copies all values into a new record with a new unique schedule ID.",
              "Step 5: Update total premium/contract cost, start date, and number of amortization months.",
              "Step 6: Click Save to activate the automated monthly amortization batch."
            ],
            "glAccountingImpact": "Monthly auto-batch posts: DR 6300-00 Insurance Expense / CR 1200-00 Prepaid Insurance Asset.",
            "whatHappensNext": "Schedule activates in the Pre-AME monthly recurring journal queue. Amortizes asset balance to $0 over term.",
            "proTips": "Check unamortized balance on the old schedule before activating the new duplicate to prevent overlapping double amortization."
          },
          {
            "id": "scr_gl_amortization",
            "name": "Recurring Amortization Schedules",
            "navigation": ["General Ledger", "Journals", "Recurring Journals", "Amortization Schedules"],
            "purpose": "Automate monthly expensing of multi-month prepaid items (prepaid insurance, property software licenses, upfront loan costs).",
            "whyRecordsAreHere": [
              "Large upfront payments must be capitalized as assets and systematically amortized over policy/loan term."
            ],
            "keyFieldsAndFilters": [
              {"name": "Asset Account", "description": "e.g., 1200-00 Prepaid Insurance."},
              {"name": "Expense Account", "description": "e.g., 6300-00 Insurance Expense."},
              {"name": "Term & Frequency", "description": "12 months, monthly post on the 1st or last day."}
            ],
            "accountantActionSOP": [
              "Set up schedule when the annual invoice is paid.",
              "Verify monthly amortization amount = Total Policy Cost / Total Policy Months.",
              "Run monthly recurring journal batch during Pre-AME phase.",
              "Check ending balance in Prepaid Asset on Balance Sheet agrees with unexpired policy period."
            ],
            "glAccountingImpact": "DR 6300-00 (Insurance Expense) / CR 1200-00 (Prepaid Insurance Asset).",
            "whatHappensNext": "Prepaid asset balance amortizes down to zero over policy life; monthly expense stabilizes on the Income Statement.",
            "proTips": "When an insurance policy is cancelled or renewed mid-term, adjust the schedule immediately to prevent negative prepaid balances."
          }
        ]
      },
      {
        "id": "gl_reports",
        "title": "Trial Balance & GL Scrutiny",
        "screens": [
          {
            "id": "scr_gl_trial_balance",
            "name": "Trial Balance & GL Detail Inquiry",
            "navigation": ["General Ledger", "Inquiries & Reports", "Trial Balance"],
            "purpose": "Inspect debit and credit balances for every single chart of accounts line to verify ledger equilibrium and audit line movements.",
            "whyRecordsAreHere": [
              "The bedrock report of property accounting. If Trial Balance is out of balance, financial statements cannot be issued."
            ],
            "keyFieldsAndFilters": [
              {"name": "Period & Date Range", "description": "Month-to-date, Quarter-to-date, Year-to-date."},
              {"name": "Zero Balance Accounts", "description": "Toggle to exclude inactive accounts for clarity."}
            ],
            "accountantActionSOP": [
              "Run Trial Balance immediately after posting month-end journals.",
              "Verify Total Debits == Total Credits (Variance == $0.00).",
              "Check for abnormal balances: debit balances in liabilities/revenues, or credit balances in assets/expenses.",
              "Drill down into transaction details for any unexpected or unmapped account balances."
            ],
            "glAccountingImpact": "Validates integrity of the complete double-entry bookkeeping ledger.",
            "whatHappensNext": "Forms the basis for the Balance Sheet and Income Statement in the preliminary AME package.",
            "proTips": "Always check GL Account 1099 (Cash Clearing) and GL 2099 (AP Clearing)—both MUST be $0.00 at month-end."
          }
        ]
      }
    ]
  },
  {
    "id": "cash",
    "title": "Cash Management & Banking",
    "shortCode": "Cash",
    "icon": "cash-outline",
    "color": "#34D399",
    "description": "Bank reconciliations, daily cash tracking, lockbox deposits, merchant processors, automated sweep entries, and liquidity management.",
    "submodules": [
      {
        "id": "cash_bank_recs",
        "title": "Bank Reconciliations & Clearing",
        "screens": [
          {
            "id": "scr_cash_bank_rec",
            "name": "Bank Reconciliation Workbench",
            "navigation": ["Cash Management", "Reconciliations", "Bank Reconciliation"],
            "purpose": "Reconcile property bank account statement balances against internal book general ledger cash balances.",
            "whyRecordsAreHere": [
              "Mandatory internal control performed monthly for every bank account (Operating, Depository, Security Deposit, Escrow)."
            ],
            "keyFieldsAndFilters": [
              {"name": "Statement Ending Balance", "description": "Exact closing balance printed on the official bank statement."},
              {"name": "Cutoff Date", "description": "Statement period end date (e.g. 08/31/2026)."},
              {"name": "Difference to Balance", "description": "Must equal exactly $0.00 before reconciliation can be saved/posted."}
            ],
            "accountantActionSOP": [
              "Enter statement ending balance and cutoff date from bank PDF.",
              "Clear checks, ACH disbursements, and bank debits that match statement records.",
              "Clear customer deposits and merchant settlement batches.",
              "Post any unrecorded bank fees or interest directly from the reconciliation screen.",
              "Confirm 'Difference to Balance' equals $0.00; generate and sign reconciliation package."
            ],
            "glAccountingImpact": "Interest Earned: DR 1010-00 / CR 7100-00 Interest Income. Bank Charges: DR 6850-00 / CR 1010-00 Cash.",
            "whatHappensNext": "Signed bank rec report attaches to monthly MOR package for Onshore Reviewer and Lender inspection.",
            "proTips": "If there is a difference, check for duplicate cleared items or checks cleared for an amount different than written (bank encoding error)."
          },
          {
            "id": "scr_cash_sweeps",
            "name": "Sweep Entries & Inter-Account Transfers",
            "navigation": ["Cash Management", "Transactions", "Account Transfers / Sweeps"],
            "purpose": "Record daily or monthly automated bank sweeps between depository accounts and main concentration/operating accounts.",
            "whyRecordsAreHere": [
              "Properties use depository accounts for local resident check deposits, which banks sweep nightly into central concentration accounts."
            ],
            "keyFieldsAndFilters": [
              {"name": "Source Account", "description": "Depository Account."},
              {"name": "Destination Account", "description": "Operating Account."},
              {"name": "Transfer Amount & Date", "description": "Must match bank sweep debit/credit exactly."}
            ],
            "accountantActionSOP": [
              "Pull daily bank statements for both Depository and Operating accounts.",
              "Match the debit in Depository with the credit in Operating.",
              "Post Transfer in RealPage Cash Management to mirror the sweep on company books.",
              "Verify both accounts reflect balanced cash without double-counting."
            ],
            "glAccountingImpact": "DR 1010-00 (Operating Cash) / CR 1020-00 (Depository Cash). Zero net impact on Total Cash.",
            "whatHappensNext": "Balances on Depository account return to zero, preventing false negative book balances.",
            "proTips": "Sweeps that occur on the last day of the month often credit the receiving bank on the 1st of next month. Book as Deposit in Transit!"
          }
        ]
      }
    ]
  },
  {
    "id": "approvals",
    "title": "Approval Policy Manager (APM)",
    "shortCode": "APM",
    "icon": "shield-checkmark-outline",
    "color": "#F59E0B",
    "description": "Multi-tiered authorization matrices, threshold escalations, Receipt of Goods (ROG) matching, and audit approval logs.",
    "submodules": [
      {
        "id": "apm_workbench",
        "title": "Approval Workbench & Queues",
        "screens": [
          {
            "id": "scr_apm_workbench",
            "name": "Approval Workbench",
            "navigation": ["Accounts Payable", "Approval Policy Manager", "Approval Workbench"],
            "purpose": "Central hub where approvers (PM, RPM, Accounting) review invoice details, approve, reject, or re-route bills.",
            "whyRecordsAreHere": [
              "Invoices route through sequential policy tiers based on property code, invoice dollar amount, and GL department."
            ],
            "keyFieldsAndFilters": [
              {"name": "Current Tier", "description": "Tier 1 (PM < $1,000), Tier 2 (RPM < $5,000), Tier 3 (VP < $25,000), Tier 4 (Accounting)."},
              {"name": "Approval Status", "description": "Pending, Approved, Rejected, Escalated."}
            ],
            "accountantActionSOP": [
              "Monitor queue daily for items pending Accounting Final Review.",
              "Verify that PM and RPM approvals comply with signature authority matrix.",
              "Check that budget variance notes are provided for any over-budget line items.",
              "Click Approve to release invoice into AP Subledger."
            ],
            "glAccountingImpact": "Final accounting approval triggers invoice posting to General Ledger (DR Expense / CR AP).",
            "whatHappensNext": "Invoice moves to AP payment eligibility pool and will be paid in next weekly check/ACH run.",
            "proTips": "If an invoice is rejected, always enter a detailed rejection note so the site team understands what correction is required."
          }
        ]
      }
    ]
  },
  {
    "id": "close",
    "title": "Financial Close Management",
    "shortCode": "Close",
    "icon": "lock-closed-outline",
    "color": "#EF4444",
    "description": "Module locking (AP, AR, Cash, GL), close checklists, diagnostic audits, and period lock governance.",
    "submodules": [
      {
        "id": "close_dashboard",
        "title": "Close Control & Subledger Locking",
        "screens": [
          {
            "id": "scr_close_dashboard",
            "name": "Financial Close Dashboard & Subledger Lock",
            "navigation": ["General Ledger", "Close Management", "Period Close Dashboard"],
            "purpose": "Enforce strict accounting period cutoffs by locking subledgers sequentially to prevent unauthorized backdating.",
            "whyRecordsAreHere": [
              "Audit requirement. Once AP, AR, and Cash are verified, they must be locked so site teams cannot post late entries."
            ],
            "keyFieldsAndFilters": [
              {"name": "Period", "description": "Target accounting month/year (e.g. 08/2026)."},
              {"name": "Module Lock Status", "description": "Open, Staged, Closed, Locked."}
            ],
            "accountantActionSOP": [
              "Step 1: Lock AP Subledger on Day 3 of close after all vendor invoices are entered.",
              "Step 2: Lock AR Subledger on Day 4 after rent roll and delinquency are balanced.",
              "Step 3: Lock Cash Management after bank reconciliations tie to $0.00.",
              "Step 4: Execute GL close diagnostic report to verify zero unposted batches.",
              "Step 5: Lock General Ledger and request Controller sign-off."
            ],
            "glAccountingImpact": "Locks Retained Earnings and Net Operating Income (NOI) against any further postings.",
            "whatHappensNext": "Period is permanently locked. Any subsequent adjustments must be booked in the following accounting month.",
            "proTips": "Never unlock a closed subledger without written authorization from the Financial Controller."
          }
        ]
      }
    ]
  },
  {
    "id": "job_cost",
    "title": "Job Cost & Replacement Reserves",
    "shortCode": "Capex",
    "icon": "construct-outline",
    "color": "#F97316",
    "description": "Capital expenditure (Capex) project tracking, replacement reserve draws, contractor lien waivers, and lender escrow reimbursements.",
    "submodules": [
      {
        "id": "job_cost_reserves",
        "title": "Capital Projects & Reserve Draws",
        "screens": [
          {
            "id": "scr_job_cost_draws",
            "name": "Replacement Reserve Draw Compiler",
            "navigation": ["General Ledger", "Job Cost & Reserves", "Replacement Reserves / Capital Draws"],
            "purpose": "Compile paid capital invoices, proof of payment (cleared checks), and contractor lien waivers to request reimbursement from mortgage lender reserves.",
            "whyRecordsAreHere": [
              "Multifamily owners escrow funds monthly with lenders for major capital upgrades (roofs, HVAC, asphalt, unit turns)."
            ],
            "keyFieldsAndFilters": [
              {"name": "Job Code / Project ID", "description": "Unique capital improvement project number."},
              {"name": "Eligible Invoices", "description": "Invoices meeting capital threshold (> $1,000 / life > 1 year)."},
              {"name": "Lien Waiver Status", "description": "Verified unconditional final lien waiver attached."}
            ],
            "accountantActionSOP": [
              "Gather paid vendor invoices and cancelled checks for completed capital projects.",
              "Verify each invoice has an approved contractor lien waiver.",
              "Prepare official Lender Draw Request Form categorized by approved escrow lines.",
              "Submit draw package to Onshore Reviewer and Lender Inspector.",
              "Upon receipt of wire from lender: post deposit to operating cash and reduce reserve receivable."
            ],
            "glAccountingImpact": "Wire received: DR 1010-00 (Operating Cash) / CR 1230-00 (Replacement Reserve Escrow / Due from Lender).",
            "whatHappensNext": "Lender wire replenishes operating bank cash for funds spent on capital projects.",
            "proTips": "Lenders immediately reject draw packages missing even a single contractor lien waiver—verify waivers before submitting."
          }
        ]
      }
    ]
  },
  {
    "id": "fixed_assets",
    "title": "Fixed Assets & Depreciation",
    "shortCode": "Assets",
    "icon": "business-outline",
    "color": "#EC4899",
    "description": "Asset capitalization threshold verification, monthly depreciation posting, accumulated depreciation roll-forwards, and disposals.",
    "submodules": [
      {
        "id": "fixed_assets_depr",
        "title": "Depreciation Schedules",
        "screens": [
          {
            "id": "scr_fixed_assets_depr",
            "name": "Fixed Asset Register & Depreciation Posting",
            "navigation": ["General Ledger", "Fixed Assets", "Depreciation Processing"],
            "purpose": "Calculate and post monthly depreciation expense for buildings, building improvements, furniture, appliances, and land improvements.",
            "whyRecordsAreHere": [
              "Capitalized assets lose economic value over time and must be depreciated under US GAAP straight-line rules."
            ],
            "keyFieldsAndFilters": [
              {"name": "Asset Class", "description": "Building (27.5 yrs), Land Improvements (15 yrs), FF&E (5-7 yrs)."},
              {"name": "Depreciation Method", "description": "Straight-line, Half-Year Convention."}
            ],
            "accountantActionSOP": [
              "Review monthly additions to verify they meet property capitalization threshold (typically > $1,000 or $2,500).",
              "Execute monthly depreciation calculation batch in RealPage Fixed Assets.",
              "Verify depreciation schedule ties to Balance Sheet Accumulated Depreciation contra-asset account.",
              "Post depreciation journal entry."
            ],
            "glAccountingImpact": "DR 6900-00 (Depreciation Expense) / CR 1750-00 (Accumulated Depreciation).",
            "whatHappensNext": "Depreciation expense posts below Net Operating Income (NOI); accumulated depreciation reduces net book value of property assets.",
            "proTips": "Land is NEVER depreciated. Ensure land acquisition values are separated into non-depreciable asset account 1500-00."
          }
        ]
      }
    ]
  },
  {
    "id": "reporting",
    "title": "Reporting Portal & Packages",
    "shortCode": "Reports",
    "icon": "stats-chart-outline",
    "color": "#A78BFA",
    "description": "Monthly Operating Report (MOR) packages, preliminary AME tie-outs, gross potential rent reconciliation, and investor reporting.",
    "submodules": [
      {
        "id": "rep_packages",
        "title": "Financial Reporting Packages",
        "screens": [
          {
            "id": "scr_rep_mor_package",
            "name": "MOR (Monthly Operating Report) Compiler",
            "navigation": ["Reporting Portal", "Packages", "Monthly Operating Report (MOR)"],
            "purpose": "Compile the complete, standardized investor financial package (Balance Sheet, Income Statement, Cash Flow, Bank Recs, Rent Roll).",
            "whyRecordsAreHere": [
              "Standard monthly deliverable delivered to property owners, institutional clients (Goldman Sachs, OSSO), and lenders."
            ],
            "keyFieldsAndFilters": [
              {"name": "Reporting Period", "description": "Target month (e.g. August 2026)."},
              {"name": "Package Template", "description": "Investor specific template (e.g. GS Standard, Magnolia Core)."}
            ],
            "accountantActionSOP": [
              "Verify all AME tie-outs are complete and verified.",
              "Run package generator in RealPage Reporting Portal.",
              "Review compiled PDF for formatting, missing page numbers, or unattached schedules.",
              "Verify Net Income agrees across Balance Sheet, Income Statement, and Cash Flow Statement.",
              "Publish to SharePoint and submit to Onshore Reviewer."
            ],
            "glAccountingImpact": "Reflects finalized financial state; locks period upon distribution.",
            "whatHappensNext": "Transmitted to asset managers, investors, and lenders for debt service and operational reviews.",
            "proTips": "Always check that the Bank Rec Summary schedule in the MOR matches the Balance Sheet Cash line to the exact penny."
          }
        ]
      }
    ]
  }
]

js_code = f'''// Complete RealPage Accounting System Digital Twin & Screen Guide
// Synthesized from all 57 official RealPage User Guides and Manuals

export const REALPAGE_MODULES = {json.dumps(modules, indent=2)};
'''

with open(r'02-property-accounting\src\data\realPageModulesData.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print("Saved enriched realPageModulesData.js with all modules!")
