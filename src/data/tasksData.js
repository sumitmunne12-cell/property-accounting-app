// Generated 5-Point Mastery Task Database for RealPage & Yardi Property Accounting
// Total Tasks: 78 (49 Core Workflow Tasks + 29 Supplementary Tasks)

export const ALL_TASKS = [
  {
    "id": "task_60039",
    "name": "Invoice approval + Exception queue clearing",
    "phase": "Ongoing - Daily",
    "category": "Invoice Processing",
    "frequency": "Daily",
    "priority": "Medium",
    "notes": "",
    "rpModule": "AP",
    "navigation": {
      "realpage": [
        "Accounts Payable",
        "Invoices",
        "Manage Invoices",
        "Filter: Status = Exception"
      ],
      "yardi": [
        "AP",
        "Invoice Processing",
        "Invoice Exceptions Workbench"
      ]
    },
    "purpose": "Investigate, resolve, and clear all invoices caught in the RealPage Exception Queue so they can resume the approval workflow and be paid on schedule.",
    "rootCause": "Invoices land in exception due to: 1) PO dollar/quantity mismatch > 5%, 2) Missing Receipt of Goods (ROG), 3) Missing vendor W-9 or expired COI, 4) Inactive GL account, 5) Duplicate invoice number.",
    "actionSOP": [
      "Navigate to RealPage AP > Invoices > Manage Invoices > select 'Exception' filter.",
      "Click on the Exception Code / Message for each stuck invoice to identify root cause.",
      "If PO mismatch: check with site team if a PO change order was submitted; adjust distribution line or request PO revision.",
      "If ROG missing: ping PM/maintenance supervisor to receive items in the procurement module.",
      "If Vendor compliance hold: contact vendor management to upload valid Certificate of Insurance (COI) or W-9.",
      "Once rectified, click 'Re-evaluate / Release Exception' to move invoice to 1st Approval Queue."
    ],
    "downstreamImpact": {
      "glImpact": "Pending release: No GL posting. Upon release & final approval: DR Expense GL / CR 2000-00 AP Subledger.",
      "nextWorkflowStep": "Invoice leaves Exception Queue and enters PM 1st Level Approval Workbench.",
      "keyStakeholders": [
        "Property Accountant",
        "Property Manager",
        "Vendor Compliance Team"
      ],
      "downstreamReports": [
        "AP Invoice Exception Report",
        "Unapproved Invoice Report",
        "Vendor Compliance Audit"
      ]
    },
    "proTips": [
      "Sort exception queue by dollar amount descending—clear large vendor invoices first to avoid supply holds.",
      "Check for duplicate invoice warnings: vendors often resubmit PDFs with slight space variations."
    ],
    "commonPitfalls": [
      "Manually overriding an exception without documenting supporting approval from the Regional PM."
    ],
    "isCore49": true
  },
  {
    "id": "task_10512",
    "name": "Pending ROG Approval queue - intimate site team",
    "phase": "Ongoing - Daily",
    "category": "Invoice Processing",
    "frequency": "Daily",
    "priority": "Medium",
    "notes": "",
    "rpModule": "AP",
    "navigation": {
      "realpage": [
        "Accounts Payable",
        "Purchasing",
        "Receipt of Goods",
        "Pending Receipts Queue"
      ],
      "yardi": [
        "Purchasing",
        "PO Receipts",
        "Unreceived Purchase Orders"
      ]
    },
    "purpose": "Identify purchase order invoices where goods/services have been delivered but the site team has not marked 'Receipt of Goods' (ROG) in RealPage.",
    "rootCause": "Maintenance supervisors or PMs received physical items (e.g., HVAC units, paint, appliances) but forgot to perform digital receiving in RealPage.",
    "actionSOP": [
      "Navigate to RealPage Purchasing / AP > Invoices > Filter 'Pending ROG'.",
      "Extract list of pending ROG items with PO number, vendor name, description, and dollar amount.",
      "Email site maintenance supervisor and PM requesting physical delivery verification and digital receipting.",
      "Once site team clicks 'Receive', system automatically clears the ROG exception."
    ],
    "downstreamImpact": {
      "glImpact": "Upon receiving: DR 1300-00 Inventory/Expense / CR 2050-00 Accrued PO Clearing",
      "nextWorkflowStep": "Invoice automatically matches with the ROG and advances to PM Approval Workbench.",
      "keyStakeholders": [
        "Site Maintenance Supervisor",
        "Property Manager",
        "Property Accountant"
      ],
      "downstreamReports": [
        "Pending ROG Status Report",
        "Open Purchase Order Report"
      ]
    },
    "proTips": [
      "Remind site staff that they can take a picture of packing slips on mobile to support digital receiving.",
      "Always cross-check unit turnovers (turns) to identify appliance deliveries quickly."
    ],
    "commonPitfalls": [
      "Letting ROG queues age past Friday cut-off, delaying essential vendor payments."
    ],
    "isCore49": true
  },
  {
    "id": "task_83512",
    "name": "Checks void and re-issue",
    "phase": "Ongoing - Daily",
    "category": "Payment Processing",
    "frequency": "Daily",
    "priority": "High",
    "notes": "",
    "rpModule": "AP",
    "navigation": {
      "realpage": [
        "Accounts Payable",
        "Payments",
        "Void Payments / Re-issue"
      ],
      "yardi": [
        "AP",
        "Payments",
        "Void Checks / Re-issue Payment"
      ]
    },
    "purpose": "Void lost, damaged, stale-dated, or incorrect checks and re-issue payments to vendors or former residents.",
    "rootCause": "Vendor reported lost check in transit, incorrect remit address, incorrect payee name, or check stale-dated (>90 days).",
    "actionSOP": [
      "Obtain written Stop Payment confirmation from the bank portal before voiding.",
      "In RealPage, navigate to Accounts Payable > Payments > Manage Payments.",
      "Search check number; click 'Void Payment'.",
      "Select void date: use Current Accounting Period (never backdate into closed months).",
      "Choose whether to 'Void & Re-issue' (generates new check number) or 'Void & Reinstate Invoice' (returns bill to AP queue).",
      "Attach bank stop-payment PDF support to the void transaction record."
    ],
    "downstreamImpact": {
      "glImpact": "Reversal: DR 1010-00 (Operating Cash) / CR 2000-00 (Accounts Payable) [Then re-issue: DR 2000-00 / CR 1010-00]",
      "nextWorkflowStep": "Voided check clears bank rec outstanding list; reissued check appears on next AP check run.",
      "keyStakeholders": [
        "Property Accountant",
        "Banking Operations",
        "Vendor / Resident Payee"
      ],
      "downstreamReports": [
        "Check Register",
        "Bank Reconciliation Outstanding Check List",
        "Void Check Audit Report"
      ]
    },
    "proTips": [
      "Always verify the bank stop payment is confirmed active BEFORE voiding in RealPage to prevent double-clearing.",
      "If re-issuing a resident deposit refund, verify current forwarding address in leasing records."
    ],
    "commonPitfalls": [
      "Voiding with an old date in a closed month, which will alter historical retained earnings and tie-outs."
    ],
    "isCore49": true
  },
  {
    "id": "task_74973",
    "name": "Clearing BS Rec items (Oustanding Bank rec items)",
    "phase": "Ongoing - Daily",
    "category": "BS Reconciliation",
    "frequency": "Daily",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Inquiries & Reports",
        "Account Inquiry / Reconciliation Ledger"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Account Details",
        "Balance Sheet Accounts"
      ]
    },
    "purpose": "Investigate, substantiate, and clear reconciling items sitting in Balance Sheet clearing accounts (AP Other, AR Other, Clearing Cash, CMA).",
    "rootCause": "Timing differences, manual unmapped sweeps, unidentified wire credits, bank fees posted without GL coding, or rounding differences during merchant processing.",
    "actionSOP": [
      "Run GL Account Detail for the clearing accounts (e.g., 1099-00 Cash Clearing, 2099-00 AP Other).",
      "Export transactions to Excel and cross-reference with bank statements and merchant statements.",
      "Identify the offsetting entry: match clearing transactions to corresponding subledger invoices or deposits.",
      "Draft clearing Journal Entry in RealPage GL > Journals > Standard Journal.",
      "Attach bank support and tie-out proof; submit for Onshore Reviewer sign-off."
    ],
    "downstreamImpact": {
      "glImpact": "DR/CR Clearing Account (1099/2099) to Zero balance / CR/DR Target Operating GL (e.g., 6850-00 Bank Fees or 1010-00 Cash)",
      "nextWorkflowStep": "Clearing account balance returns to zero ($0.00) on the Monthly Balance Sheet Package.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Balance Sheet Detail Report",
        "Bank Reconciliation Tie-Out",
        "Clearing Account Schedule"
      ]
    },
    "proTips": [
      "Never let items age past 30 days in clearing accounts—onshore reviewers treat uncleared items as audit flags.",
      "Always annotate the bank transaction reference number in the JE description."
    ],
    "commonPitfalls": [
      "Lumping multiple unexplained variances into miscellaneous expense instead of investigating root causes."
    ],
    "isCore49": true
  },
  {
    "id": "task_08998",
    "name": "AP Check run (Vendors + Resident Refunds)",
    "phase": "Ongoing - Weekly",
    "category": "Payment Processing",
    "frequency": "Weekly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "AP",
    "navigation": {
      "realpage": [
        "Accounts Payable",
        "Payments",
        "Payment Processing",
        "Select Invoices for Payment"
      ],
      "yardi": [
        "AP",
        "Payments",
        "Select Invoices / Process Payments"
      ]
    },
    "purpose": "Generate and process the weekly payment run for approved vendor invoices and resident security deposit refunds via physical check, ACH, or wire.",
    "rootCause": "Weekly obligation to satisfy accounts payable, maintain vendor trade credit, adhere to discount terms, and comply with statutory resident refund timelines.",
    "actionSOP": [
      "Check operating bank account available cash balance from morning bank activity report.",
      "Navigate to RealPage AP > Payments > Select Invoices for Payment.",
      "Filter by Due Date (e.g., invoices due within next 7-10 days) and Property ID.",
      "Review Cash Requirements Summary; ensure total proposed disbursements do not exceed cash threshold.",
      "Exclude any invoices on dispute or pending vendor credit memos.",
      "Generate payment batch; review check/ACH preview register; submit for Onshore sign-off and release."
    ],
    "downstreamImpact": {
      "glImpact": "DR 2000-00 (Accounts Payable Subledger) / CR 1010-00 (Operating Cash Account)",
      "nextWorkflowStep": "Checks printed or ACH NACHA file uploaded to bank portal; disbursements posted to Cash Book.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Treasury / Onshore Signer"
      ],
      "downstreamReports": [
        "Cash Requirements Report",
        "Payment Register",
        "Pre-Check Run Summary"
      ]
    },
    "proTips": [
      "Always verify resident refund forwarding addresses and ensure deduction supports are attached.",
      "Verify that the operating bank account has sufficient collected funds including overnight sweep minimums."
    ],
    "commonPitfalls": [
      "Releasing payments for vendors with expired compliance or unverified tax IDs."
    ],
    "isCore49": true
  },
  {
    "id": "task_74086",
    "name": "Weekly Site Team Call – Key Review Points",
    "phase": "Ongoing - Weekly",
    "category": "Weekly calls - Review points",
    "frequency": "Weekly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Weekly Site Team Call – Key Review Points in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Weekly calls - Review points to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Weekly Site Team Call – Key Review Points.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Weekly calls - Review points GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_02263",
    "name": "Mortgage wire process",
    "phase": "Ongoing - Monthly",
    "category": "Payment Processing",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Mortgage wire process in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Payment Processing to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Mortgage wire process.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Payment Processing GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_13913",
    "name": "Bank Activity - Operating account",
    "phase": "Pre-AME",
    "category": "Bank Reconciliation",
    "frequency": "Weekly",
    "priority": "High",
    "notes": "Activity as of 08.17",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Bank Accounts",
        "Bank Transactions / Cash Log"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Bank Activity Log"
      ]
    },
    "purpose": "Download daily bank statements, record receipts and disbursements, update the property cash position, and monitor liquidity.",
    "rootCause": "Ensure daily visibility into operating cash, detect unauthorized debits, verify resident payment deposits, and track sweep transactions.",
    "actionSOP": [
      "Log in to the bank portal (e.g., PNC, KeyBank, Wells Fargo) and download previous day's activity statement.",
      "Enter opening balance, total ACH deposits, credit card merchant batches, check clearings, and wires in Cash Log.",
      "Identify any unknown debit/credit; notify property manager or bank representative.",
      "In RealPage Cash Management, post daily bank activity transactions (merchant fees, interest earned, bank charges).",
      "Confirm calculated ending cash agrees with bank statement ledger balance."
    ],
    "downstreamImpact": {
      "glImpact": "Bank Fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Operating Cash) | Interest: DR 1010-00 Cash / CR 7100-00 Interest Income",
      "nextWorkflowStep": "Cash log updated in shared drive; feeds weekly funding projections and monthly bank reconciliation.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Onshore Treasury"
      ],
      "downstreamReports": [
        "Daily Cash Position Report",
        "Bank Activity Summary",
        "Treasury Liquidity Forecast"
      ]
    },
    "proTips": [
      "Reconcile merchant processor batches (RentPayment, ClickPay) to net bank deposits daily.",
      "Highlight NSF (non-sufficient funds) chargebacks and notify site team to reverse tenant ledger credits."
    ],
    "commonPitfalls": [
      "Failing to log unmapped bank sweep entries, causing fictitious book overdrafts."
    ],
    "isCore49": true
  },
  {
    "id": "task_28877",
    "name": "Bank Activity - Depository account",
    "phase": "Pre-AME",
    "category": "Bank Reconciliation",
    "frequency": "Weekly",
    "priority": "High",
    "notes": "Activity as of 08.17",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Bank Accounts",
        "Bank Transactions / Cash Log"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Bank Activity Log"
      ]
    },
    "purpose": "Download daily bank statements, record receipts and disbursements, update the property cash position, and monitor liquidity.",
    "rootCause": "Ensure daily visibility into operating cash, detect unauthorized debits, verify resident payment deposits, and track sweep transactions.",
    "actionSOP": [
      "Log in to the bank portal (e.g., PNC, KeyBank, Wells Fargo) and download previous day's activity statement.",
      "Enter opening balance, total ACH deposits, credit card merchant batches, check clearings, and wires in Cash Log.",
      "Identify any unknown debit/credit; notify property manager or bank representative.",
      "In RealPage Cash Management, post daily bank activity transactions (merchant fees, interest earned, bank charges).",
      "Confirm calculated ending cash agrees with bank statement ledger balance."
    ],
    "downstreamImpact": {
      "glImpact": "Bank Fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Operating Cash) | Interest: DR 1010-00 Cash / CR 7100-00 Interest Income",
      "nextWorkflowStep": "Cash log updated in shared drive; feeds weekly funding projections and monthly bank reconciliation.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Onshore Treasury"
      ],
      "downstreamReports": [
        "Daily Cash Position Report",
        "Bank Activity Summary",
        "Treasury Liquidity Forecast"
      ]
    },
    "proTips": [
      "Reconcile merchant processor batches (RentPayment, ClickPay) to net bank deposits daily.",
      "Highlight NSF (non-sufficient funds) chargebacks and notify site team to reverse tenant ledger credits."
    ],
    "commonPitfalls": [
      "Failing to log unmapped bank sweep entries, causing fictitious book overdrafts."
    ],
    "isCore49": true
  },
  {
    "id": "task_71431",
    "name": "Bank Activity - Security Deposit account",
    "phase": "Pre-AME",
    "category": "Bank Reconciliation",
    "frequency": "Weekly",
    "priority": "High",
    "notes": "Activity as of 08.17",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Bank Accounts",
        "Bank Transactions / Cash Log"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Bank Activity Log"
      ]
    },
    "purpose": "Download daily bank statements, record receipts and disbursements, update the property cash position, and monitor liquidity.",
    "rootCause": "Ensure daily visibility into operating cash, detect unauthorized debits, verify resident payment deposits, and track sweep transactions.",
    "actionSOP": [
      "Log in to the bank portal (e.g., PNC, KeyBank, Wells Fargo) and download previous day's activity statement.",
      "Enter opening balance, total ACH deposits, credit card merchant batches, check clearings, and wires in Cash Log.",
      "Identify any unknown debit/credit; notify property manager or bank representative.",
      "In RealPage Cash Management, post daily bank activity transactions (merchant fees, interest earned, bank charges).",
      "Confirm calculated ending cash agrees with bank statement ledger balance."
    ],
    "downstreamImpact": {
      "glImpact": "Bank Fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Operating Cash) | Interest: DR 1010-00 Cash / CR 7100-00 Interest Income",
      "nextWorkflowStep": "Cash log updated in shared drive; feeds weekly funding projections and monthly bank reconciliation.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Onshore Treasury"
      ],
      "downstreamReports": [
        "Daily Cash Position Report",
        "Bank Activity Summary",
        "Treasury Liquidity Forecast"
      ]
    },
    "proTips": [
      "Reconcile merchant processor batches (RentPayment, ClickPay) to net bank deposits daily.",
      "Highlight NSF (non-sufficient funds) chargebacks and notify site team to reverse tenant ledger credits."
    ],
    "commonPitfalls": [
      "Failing to log unmapped bank sweep entries, causing fictitious book overdrafts."
    ],
    "isCore49": true
  },
  {
    "id": "task_73647",
    "name": "Prepaid expense amortization",
    "phase": "Pre-AME",
    "category": "Amortization Entries",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Prepaid expense amortization in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Amortization Entries to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Prepaid expense amortization.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Amortization Entries GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_14366",
    "name": "Prepaid insurance amortization",
    "phase": "Pre-AME",
    "category": "Amortization Entries",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Prepaid insurance amortization in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Amortization Entries to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Prepaid insurance amortization.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Amortization Entries GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_95601",
    "name": "Mortgage interest accrual",
    "phase": "Pre-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Mortgage interest accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Mortgage interest accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_83731",
    "name": "Property tax accrual",
    "phase": "Pre-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "JEs are created",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal / Auto-Reversing Accrual"
      ],
      "yardi": [
        "Financials",
        "Journal Entries",
        "Standard Accrual (Auto-Reverse)"
      ]
    },
    "purpose": "Accrue operating expenses incurred during the month where actual third-party invoices or payroll registers have not yet been billed or paid.",
    "rootCause": "GAAP matching principle: expenses must be recognized in the period they occur regardless of billing or payment timing.",
    "actionSOP": [
      "Review prior month actuals, annual approved budget, and contract schedules for recurring obligations.",
      "For Property Tax: Calculate monthly accrual = Total Annual Assessed Tax / 12 months.",
      "For Insurance: Calculate monthly expense = Total Annual Policy Premium / 12 months.",
      "For Payroll: Calculate unbilled days at month-end based on site staff payroll schedule.",
      "Draft Auto-Reversing Journal Entry in RealPage with effective date as last day of month.",
      "Set auto-reversal date to Day 1 of subsequent month."
    ],
    "downstreamImpact": {
      "glImpact": "DR 6400-00 (Property Tax Exp) or DR 6300-00 (Insurance Exp) / CR 2100-00 (Accrued Expenses)",
      "nextWorkflowStep": "Journal entry posts to trial balance; automatically reverses next month to prevent double-counting upon invoice entry.",
      "keyStakeholders": [
        "Property Accountant",
        "Reviewer",
        "Asset Manager"
      ],
      "downstreamReports": [
        "Monthly Accrual Schedule",
        "Trial Balance Detail",
        "Budget vs Actual Variance Report"
      ]
    },
    "proTips": [
      "Always verify whether property taxes are paid via lender escrow or direct payment before booking escrow entries.",
      "Use auto-reversing flags in RealPage to eliminate manual reversal mistakes."
    ],
    "commonPitfalls": [
      "Forgetting to flag entry as auto-reversing, resulting in duplicate expenses when the actual invoice arrives."
    ],
    "isCore49": true
  },
  {
    "id": "task_39088",
    "name": "Payroll Accrual",
    "phase": "Pre-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "JEs are created",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal / Auto-Reversing Accrual"
      ],
      "yardi": [
        "Financials",
        "Journal Entries",
        "Standard Accrual (Auto-Reverse)"
      ]
    },
    "purpose": "Accrue operating expenses incurred during the month where actual third-party invoices or payroll registers have not yet been billed or paid.",
    "rootCause": "GAAP matching principle: expenses must be recognized in the period they occur regardless of billing or payment timing.",
    "actionSOP": [
      "Review prior month actuals, annual approved budget, and contract schedules for recurring obligations.",
      "For Property Tax: Calculate monthly accrual = Total Annual Assessed Tax / 12 months.",
      "For Insurance: Calculate monthly expense = Total Annual Policy Premium / 12 months.",
      "For Payroll: Calculate unbilled days at month-end based on site staff payroll schedule.",
      "Draft Auto-Reversing Journal Entry in RealPage with effective date as last day of month.",
      "Set auto-reversal date to Day 1 of subsequent month."
    ],
    "downstreamImpact": {
      "glImpact": "DR 6400-00 (Property Tax Exp) or DR 6300-00 (Insurance Exp) / CR 2100-00 (Accrued Expenses)",
      "nextWorkflowStep": "Journal entry posts to trial balance; automatically reverses next month to prevent double-counting upon invoice entry.",
      "keyStakeholders": [
        "Property Accountant",
        "Reviewer",
        "Asset Manager"
      ],
      "downstreamReports": [
        "Monthly Accrual Schedule",
        "Trial Balance Detail",
        "Budget vs Actual Variance Report"
      ]
    },
    "proTips": [
      "Always verify whether property taxes are paid via lender escrow or direct payment before booking escrow entries.",
      "Use auto-reversing flags in RealPage to eliminate manual reversal mistakes."
    ],
    "commonPitfalls": [
      "Forgetting to flag entry as auto-reversing, resulting in duplicate expenses when the actual invoice arrives."
    ],
    "isCore49": true
  },
  {
    "id": "task_28457",
    "name": "AME reports saved in drive",
    "phase": "Post-AME",
    "category": "AME Reports",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "Reporting Portal",
    "navigation": {
      "realpage": [
        "Reporting Portal",
        "Financial Packages",
        "AME Package / Monthly Operating Report (MOR)"
      ],
      "yardi": [
        "Financials",
        "Reports",
        "Financial Package Publisher",
        "MOR Package"
      ]
    },
    "purpose": "Generate, assemble, balance, and publish the complete monthly financial reporting package for property owners, asset managers, and lenders.",
    "rootCause": "Monthly contractual reporting deadline to deliver certified financial statements to institutional investors and compliance partners.",
    "actionSOP": [
      "Verify all subledgers (AP, AR, Cash Management) are locked and posted in RealPage.",
      "Navigate to Reporting Portal > Financial Packages > select AME / MOR Package.",
      "Run report generator for target month; verify Balance Sheet balances (Assets = Liabilities + Equity).",
      "Assemble required supporting schedules: Bank Recs, Rent Roll, Delinquency, Escrows, Capex Schedule.",
      "Check that Net Income on Income Statement ties to Balance Sheet Current Year Earnings.",
      "Publish compiled PDF package to shared drive / SharePoint for executive distribution."
    ],
    "downstreamImpact": {
      "glImpact": "Finalizes financial ledger; locks accounting period to prevent retroactive changes.",
      "nextWorkflowStep": "Transmitted to Onshore Reviewers, Asset Managers, and Institutional Investors (e.g., Goldman Sachs, OSSO).",
      "keyStakeholders": [
        "Property Accountant",
        "Onshore Reviewer",
        "Asset Manager",
        "Lender"
      ],
      "downstreamReports": [
        "Balance Sheet",
        "Income Statement (Month & YTD)",
        "Cash Flow Statement",
        "MOR Package Complete"
      ]
    },
    "proTips": [
      "Always verify the 'Tie-Out Triangle': Net Income on Income Statement == Change in Retained Earnings == Cash Flow Operating Net.",
      "Double-check header dates and property name formatting before PDF publishing."
    ],
    "commonPitfalls": [
      "Publishing reports before confirming that all late reclassification entries have been posted to the general ledger."
    ],
    "isCore49": true
  },
  {
    "id": "task_57292",
    "name": "AME reports tie out",
    "phase": "Post-AME",
    "category": "AME Reports",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "Reporting Portal",
    "navigation": {
      "realpage": [
        "Reporting Portal",
        "Financial Packages",
        "AME Package / Monthly Operating Report (MOR)"
      ],
      "yardi": [
        "Financials",
        "Reports",
        "Financial Package Publisher",
        "MOR Package"
      ]
    },
    "purpose": "Generate, assemble, balance, and publish the complete monthly financial reporting package for property owners, asset managers, and lenders.",
    "rootCause": "Monthly contractual reporting deadline to deliver certified financial statements to institutional investors and compliance partners.",
    "actionSOP": [
      "Verify all subledgers (AP, AR, Cash Management) are locked and posted in RealPage.",
      "Navigate to Reporting Portal > Financial Packages > select AME / MOR Package.",
      "Run report generator for target month; verify Balance Sheet balances (Assets = Liabilities + Equity).",
      "Assemble required supporting schedules: Bank Recs, Rent Roll, Delinquency, Escrows, Capex Schedule.",
      "Check that Net Income on Income Statement ties to Balance Sheet Current Year Earnings.",
      "Publish compiled PDF package to shared drive / SharePoint for executive distribution."
    ],
    "downstreamImpact": {
      "glImpact": "Finalizes financial ledger; locks accounting period to prevent retroactive changes.",
      "nextWorkflowStep": "Transmitted to Onshore Reviewers, Asset Managers, and Institutional Investors (e.g., Goldman Sachs, OSSO).",
      "keyStakeholders": [
        "Property Accountant",
        "Onshore Reviewer",
        "Asset Manager",
        "Lender"
      ],
      "downstreamReports": [
        "Balance Sheet",
        "Income Statement (Month & YTD)",
        "Cash Flow Statement",
        "MOR Package Complete"
      ]
    },
    "proTips": [
      "Always verify the 'Tie-Out Triangle': Net Income on Income Statement == Change in Retained Earnings == Cash Flow Operating Net.",
      "Double-check header dates and property name formatting before PDF publishing."
    ],
    "commonPitfalls": [
      "Publishing reports before confirming that all late reclassification entries have been posted to the general ledger."
    ],
    "isCore49": true
  },
  {
    "id": "task_17346",
    "name": "Inform site team to begin entering comments for Income GL",
    "phase": "Post-AME",
    "category": "Variance Notes - Site team",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Inform site team to begin entering comments for Income GL in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Variance Notes - Site team to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Inform site team to begin entering comments for Income GL.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Variance Notes - Site team GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_77265",
    "name": "Management Fees calculation",
    "phase": "Post-AME",
    "category": "PM Fees calculation",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal",
        "Management Fee Calculation"
      ],
      "yardi": [
        "Financials",
        "Management Fees",
        "Calculate & Post Fees"
      ]
    },
    "purpose": "Calculate and post the monthly property management fee owed to the third-party property management company based on the management agreement.",
    "rootCause": "Management agreements mandate a contractual fee (typically 2.5% to 4.0% of Total Operating Collections or Gross Revenue).",
    "actionSOP": [
      "Review Management Agreement to confirm agreed fee percentage (e.g. 3.0%) and collection base.",
      "Run Cash Collections Report or Net Operating Revenue Report for the month.",
      "Multiply eligible collected revenue by management fee percentage.",
      "Deduct any exclusions specified in contract (e.g., insurance claim proceeds, security deposit forfeitures).",
      "Post Journal Entry in RealPage: Debit Management Fee Expense, Credit Accrued Management Fees / Due to PM.",
      "Stage management fee invoice or wire for payment approval."
    ],
    "downstreamImpact": {
      "glImpact": "DR 6200-00 (Management Fees Expense) / CR 2120-00 (Accrued Management Fees / Due to Management Co)",
      "nextWorkflowStep": "Management fee approved in AME review and disbursed via wire in following month AP check run.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Property Management Executive"
      ],
      "downstreamReports": [
        "Management Fee Calculation Schedule",
        "Cash Collections Report",
        "Income Statement"
      ]
    },
    "proTips": [
      "Confirm whether fee is based on Cash Collections or Accrual Revenue—misinterpreting this is a very common audit finding.",
      "Check for monthly minimum fee clauses during lease-up phases."
    ],
    "commonPitfalls": [
      "Including capital contribution proceeds or insurance recovery checks in eligible revenue for fee calculations."
    ],
    "isCore49": true
  },
  {
    "id": "task_72229",
    "name": "Invoice & PO accruals file - share with site team",
    "phase": "Post-AME",
    "category": "Invoice & PO accrual - Site team",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Invoice & PO accruals file - share with site team in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Invoice & PO accrual - Site team to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Invoice & PO accruals file - share with site team.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Invoice & PO accrual - Site team GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_53151",
    "name": "Bad debt calculation (90+days)",
    "phase": "Post-AME",
    "category": "Bad Debt",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal",
        "Bad Debt Allowance Schedule"
      ],
      "yardi": [
        "Financials",
        "Journal Entries",
        "Bad Debt Calculation & Reserve"
      ]
    },
    "purpose": "Calculate and record monthly Bad Debt Expense and Allowance for Uncollectible Accounts based on delinquent resident balances aged 60+ and 90+ days.",
    "rootCause": "Accounts receivable from current and past residents over 60/90 days have low collection probability and must be reserved under GAAP conservatism.",
    "actionSOP": [
      "Run Delinquency Aging Report from RealPage Leasing & Rents module as of month-end.",
      "Separate delinquent balances into: Current Residents vs. Evicted/Moved-Out Residents.",
      "Apply ownership policy reserve rates (e.g. 50% for 60-89 days, 100% for 90+ days and all skipped/evicted residents).",
      "Calculate required ending balance in Allowance for Doubtful Accounts (GL 1150-00).",
      "Post Journal Entry for the delta between current GL allowance balance and required reserve balance."
    ],
    "downstreamImpact": {
      "glImpact": "DR 6350-00 (Bad Debt Expense) / CR 1150-00 (Allowance for Doubtful Accounts - Contra Asset)",
      "nextWorkflowStep": "Delinquency schedule and reserve calculation added to AME workpapers for Onshore Review.",
      "keyStakeholders": [
        "Property Accountant",
        "Property Manager",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Delinquency Aging Report",
        "Bad Debt Reserve Roll-Forward",
        "Rent Roll Detail"
      ]
    },
    "proTips": [
      "Verify if former resident security deposits have already been applied against outstanding charges before calculating bad debt.",
      "Check for active payment plans before fully reserving 60-day balances."
    ],
    "commonPitfalls": [
      "Directly writing off resident balances to Bad Debt Expense instead of booking through the Allowance contra-asset account."
    ],
    "isCore49": true
  },
  {
    "id": "task_11914",
    "name": "Marketing Accrual",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Marketing Accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Marketing Accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_84125",
    "name": "Management Fees Accrual",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal",
        "Management Fee Calculation"
      ],
      "yardi": [
        "Financials",
        "Management Fees",
        "Calculate & Post Fees"
      ]
    },
    "purpose": "Calculate and post the monthly property management fee owed to the third-party property management company based on the management agreement.",
    "rootCause": "Management agreements mandate a contractual fee (typically 2.5% to 4.0% of Total Operating Collections or Gross Revenue).",
    "actionSOP": [
      "Review Management Agreement to confirm agreed fee percentage (e.g. 3.0%) and collection base.",
      "Run Cash Collections Report or Net Operating Revenue Report for the month.",
      "Multiply eligible collected revenue by management fee percentage.",
      "Deduct any exclusions specified in contract (e.g., insurance claim proceeds, security deposit forfeitures).",
      "Post Journal Entry in RealPage: Debit Management Fee Expense, Credit Accrued Management Fees / Due to PM.",
      "Stage management fee invoice or wire for payment approval."
    ],
    "downstreamImpact": {
      "glImpact": "DR 6200-00 (Management Fees Expense) / CR 2120-00 (Accrued Management Fees / Due to Management Co)",
      "nextWorkflowStep": "Management fee approved in AME review and disbursed via wire in following month AP check run.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Property Management Executive"
      ],
      "downstreamReports": [
        "Management Fee Calculation Schedule",
        "Cash Collections Report",
        "Income Statement"
      ]
    },
    "proTips": [
      "Confirm whether fee is based on Cash Collections or Accrual Revenue—misinterpreting this is a very common audit finding.",
      "Check for monthly minimum fee clauses during lease-up phases."
    ],
    "commonPitfalls": [
      "Including capital contribution proceeds or insurance recovery checks in eligible revenue for fee calculations."
    ],
    "isCore49": true
  },
  {
    "id": "task_77893",
    "name": "AM Fees/CM Fees Accrual",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "No Invoice available for July, Accrual estimate for August to be shared by Aman by 8/28",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify AM Fees/CM Fees accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for AM Fees/CM Fees accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_03061",
    "name": "Invoice Accrual",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Invoice Accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Invoice Accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_11233",
    "name": "PO Accrual",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify PO Accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for PO Accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_48356",
    "name": "Recurring contracts accrual",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Recurring contracts accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Recurring contracts accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_46621",
    "name": "STYL/MCMC Billback accruals",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal",
        "Billback Intercompany Processing"
      ],
      "yardi": [
        "Financials",
        "Intercompany",
        "Process Billbacks"
      ]
    },
    "purpose": "Process intercompany billbacks and wire settlements for corporate payroll, shared insurance, or technology fees paid centrally on behalf of properties.",
    "rootCause": "Central corporate entities (STYL/MCMC) disburse shared operating expenses (e.g. centralized marketing, IT, specialized maintenance) that must be allocated to property books.",
    "actionSOP": [
      "Obtain weekly billback schedule and supporting corporate invoices from the RF team.",
      "Review allocation percentages across properties based on unit counts or specific usage metrics.",
      "Post billback Journal Entry or AP invoice in RealPage against appropriate property expense GL.",
      "Prepare wire funding authorization to reimburse STYL/MCMC corporate account.",
      "Ensure Intercompany Due To/From accounts tie to penny."
    ],
    "downstreamImpact": {
      "glImpact": "Property: DR 6500-00 (Shared Service Expense) / CR 2150-00 (Due to Affiliate/MCMC) [Wire: DR 2150-00 / CR 1010-00 Cash]",
      "nextWorkflowStep": "RF corporate team confirms wire receipt; intercompany reconciliation schedules match.",
      "keyStakeholders": [
        "Property Accountant",
        "RF Team",
        "Corporate Accounting Team"
      ],
      "downstreamReports": [
        "Intercompany Reconciliation Schedule",
        "Wire Transfer Authorization",
        "General Ledger Detail"
      ]
    },
    "proTips": [
      "Maintain an ongoing Excel roll-forward of Due To/From STYL/MCMC to prevent month-end out-of-balance.",
      "Always confirm allocation formula approved by Asset Management."
    ],
    "commonPitfalls": [
      "Posting the billback without verifying if prior month accrual needs to be reversed, causing double expense."
    ],
    "isCore49": true
  },
  {
    "id": "task_23757",
    "name": "Utilities Accrual",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Utilities Accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Utilities Accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_07176",
    "name": "Derivatives Posting",
    "phase": "Post-AME",
    "category": "Derivatives",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Derivatives Posting in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Derivatives to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Derivatives Posting.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Derivatives GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_30663",
    "name": "Depreciation posting",
    "phase": "Post-AME",
    "category": "Depreciation",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Depreciation posting in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Depreciation to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Depreciation posting.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Depreciation GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_64896",
    "name": "Bank Reconciliation - Operating/SD account",
    "phase": "Post-AME",
    "category": "Bank Reconciliation",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Reconciliations",
        "Bank Reconciliation",
        "Select Account & Period"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Reconcile Bank Account"
      ]
    },
    "purpose": "Reconcile the property's general ledger cash account with the official bank statement, accounting for outstanding checks and deposits in transit.",
    "rootCause": "Ensure internal accounting books match actual bank cash, prevent fraud, identify unrecorded bank fees or sweeps, and substantiate Balance Sheet Cash.",
    "actionSOP": [
      "Download month-end bank statement and pull RealPage Bank Reconciliation module for target account.",
      "Input bank statement ending balance and statement cut-off date.",
      "Clear cleared checks, ACH payments, and wires matching the bank statement.",
      "Clear matching deposits and customer payments in transit.",
      "Verify that 'Difference to Balance' equals exactly $0.00.",
      "Print Bank Reconciliation Summary, Outstanding Check List, and Deposits in Transit support.",
      "Submit signed rec package for Onshore review."
    ],
    "downstreamImpact": {
      "glImpact": "No GL posting from rec itself; adjusting entries booked for fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Cash)",
      "nextWorkflowStep": "Bank Rec approved by Onshore Reviewer; included as Schedule 1 in MOR package.",
      "keyStakeholders": [
        "Property Accountant",
        "Xshore Reviewer",
        "Onshore Reviewer",
        "Lender"
      ],
      "downstreamReports": [
        "Bank Reconciliation Report",
        "Outstanding Check List",
        "Deposits in Transit Ledger"
      ]
    },
    "proTips": [
      "Always investigate outstanding deposits older than 3 days—they often indicate missed NSF reversals or bank errors.",
      "Checks outstanding over 90 days should be flagged for void/reissue or escheatment review."
    ],
    "commonPitfalls": [
      "Forcing a bank reconciliation balance with an unexplained plug entry instead of locating the exact missing transaction."
    ],
    "isCore49": true
  },
  {
    "id": "task_66420",
    "name": "Bank Reconciliation - Depository account",
    "phase": "Post-AME",
    "category": "Bank Reconciliation",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Reconciliations",
        "Bank Reconciliation",
        "Select Account & Period"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Reconcile Bank Account"
      ]
    },
    "purpose": "Reconcile the property's general ledger cash account with the official bank statement, accounting for outstanding checks and deposits in transit.",
    "rootCause": "Ensure internal accounting books match actual bank cash, prevent fraud, identify unrecorded bank fees or sweeps, and substantiate Balance Sheet Cash.",
    "actionSOP": [
      "Download month-end bank statement and pull RealPage Bank Reconciliation module for target account.",
      "Input bank statement ending balance and statement cut-off date.",
      "Clear cleared checks, ACH payments, and wires matching the bank statement.",
      "Clear matching deposits and customer payments in transit.",
      "Verify that 'Difference to Balance' equals exactly $0.00.",
      "Print Bank Reconciliation Summary, Outstanding Check List, and Deposits in Transit support.",
      "Submit signed rec package for Onshore review."
    ],
    "downstreamImpact": {
      "glImpact": "No GL posting from rec itself; adjusting entries booked for fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Cash)",
      "nextWorkflowStep": "Bank Rec approved by Onshore Reviewer; included as Schedule 1 in MOR package.",
      "keyStakeholders": [
        "Property Accountant",
        "Xshore Reviewer",
        "Onshore Reviewer",
        "Lender"
      ],
      "downstreamReports": [
        "Bank Reconciliation Report",
        "Outstanding Check List",
        "Deposits in Transit Ledger"
      ]
    },
    "proTips": [
      "Always investigate outstanding deposits older than 3 days—they often indicate missed NSF reversals or bank errors.",
      "Checks outstanding over 90 days should be flagged for void/reissue or escheatment review."
    ],
    "commonPitfalls": [
      "Forcing a bank reconciliation balance with an unexplained plug entry instead of locating the exact missing transaction."
    ],
    "isCore49": true
  },
  {
    "id": "task_26161",
    "name": "Escrows Tie out",
    "phase": "Post-AME",
    "category": "Escrows",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Inquiries & Reports",
        "Account Inquiry - Escrow Ledger"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Escrow Account Details"
      ]
    },
    "purpose": "Reconcile property tax, insurance, and replacement reserve escrow balances held by mortgage lenders with lender monthly mortgage statements.",
    "rootCause": "Lenders collect monthly escrow deposits with mortgage payments and pay taxes/insurance on property's behalf; book balances must match lender records.",
    "actionSOP": [
      "Obtain latest monthly mortgage lender billing statement showing escrow account balances.",
      "Run RealPage GL Detail for Escrow Accounts (1210-00 Tax Escrow, 1220-00 Insurance Escrow, 1230-00 Replacement Reserve Escrow).",
      "Match monthly lender escrow deposits to mortgage wire payment breakdown.",
      "Record lender disbursements for property taxes or insurance premiums against the escrow asset.",
      "Draft adjustment journal entry for lender escrow interest earned or servicing fees.",
      "Ensure ending RealPage escrow balance matches lender statement to the penny."
    ],
    "downstreamImpact": {
      "glImpact": "Disbursement by lender: DR 2100-00 (Accrued Taxes/Insurance) / CR 1210-00 (Tax Escrow Asset)",
      "nextWorkflowStep": "Escrow tie-out schedule included in monthly balance sheet workpapers for review.",
      "keyStakeholders": [
        "Property Accountant",
        "Mortgage Lender",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Escrow Tie-Out Schedule",
        "Lender Mortgage Statement",
        "Balance Sheet Detail"
      ]
    },
    "proTips": [
      "Lenders often take 30-60 days to reflect tax payments; track local county tax collector receipts as interim proof.",
      "Verify interest earned on escrow accounts is booked to Interest Income."
    ],
    "commonPitfalls": [
      "Expensing insurance or taxes when the lender pays them, rather than reducing the prepaid/escrow asset account."
    ],
    "isCore49": true
  },
  {
    "id": "task_40215",
    "name": "GL scrutiny",
    "phase": "Post-AME",
    "category": "Self Analysis",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Reports",
        "General Ledger Detail / Comparative Income Statement"
      ],
      "yardi": [
        "Financials",
        "Reports",
        "Trial Balance / Budget Variance Analysis"
      ]
    },
    "purpose": "Perform detailed line-by-line review of all balance sheet and income statement accounts, detecting miscoded entries, unexpected variances, and anomalies before review submission.",
    "rootCause": "Ensures financial integrity, catches miscoded invoices, verifies accrual reversals, and prepares the accountant to explain operational variances to management.",
    "actionSOP": [
      "Generate GL Detail Report for the month and export to Excel alongside Approved Budget.",
      "Run Comparative Income Statement (Current Month Actual vs. Budget vs. Prior Month).",
      "Highlight all revenue variances > $1,000 and expense variances > $2,500 or 10%.",
      "Inspect underlying journal entries and invoice distributions for any highlighted anomalies.",
      "Correct miscoded entries via reclassifying journal entry before period close.",
      "Draft clear, concise variance explanations for the Onshore Review team."
    ],
    "downstreamImpact": {
      "glImpact": "Reclassification entries if needed: DR Correct Expense GL / CR Miscoded Expense GL",
      "nextWorkflowStep": "Clean financials ready for Xshore Internal Review and Preliminary AME package submission.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Asset Manager"
      ],
      "downstreamReports": [
        "General Ledger Detail Report",
        "Budget Variance Report",
        "Trailing 12-Month (T12) Income Statement"
      ]
    },
    "proTips": [
      "Look for debit balances in liability accounts or credit balances in expense accounts—they almost always signal miscoding.",
      "Scan the T12 horizontally to spot missing monthly recurring bills (e.g. trash, landscaping)."
    ],
    "commonPitfalls": [
      "Writing vague variance explanations like 'higher expenses due to timing' without investigating specific invoices."
    ],
    "isCore49": true
  },
  {
    "id": "task_65595",
    "name": "Budget Variance Analysis",
    "phase": "Post-AME",
    "category": "Self Analysis",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Reports",
        "General Ledger Detail / Comparative Income Statement"
      ],
      "yardi": [
        "Financials",
        "Reports",
        "Trial Balance / Budget Variance Analysis"
      ]
    },
    "purpose": "Perform detailed line-by-line review of all balance sheet and income statement accounts, detecting miscoded entries, unexpected variances, and anomalies before review submission.",
    "rootCause": "Ensures financial integrity, catches miscoded invoices, verifies accrual reversals, and prepares the accountant to explain operational variances to management.",
    "actionSOP": [
      "Generate GL Detail Report for the month and export to Excel alongside Approved Budget.",
      "Run Comparative Income Statement (Current Month Actual vs. Budget vs. Prior Month).",
      "Highlight all revenue variances > $1,000 and expense variances > $2,500 or 10%.",
      "Inspect underlying journal entries and invoice distributions for any highlighted anomalies.",
      "Correct miscoded entries via reclassifying journal entry before period close.",
      "Draft clear, concise variance explanations for the Onshore Review team."
    ],
    "downstreamImpact": {
      "glImpact": "Reclassification entries if needed: DR Correct Expense GL / CR Miscoded Expense GL",
      "nextWorkflowStep": "Clean financials ready for Xshore Internal Review and Preliminary AME package submission.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Asset Manager"
      ],
      "downstreamReports": [
        "General Ledger Detail Report",
        "Budget Variance Report",
        "Trailing 12-Month (T12) Income Statement"
      ]
    },
    "proTips": [
      "Look for debit balances in liability accounts or credit balances in expense accounts—they almost always signal miscoding.",
      "Scan the T12 horizontally to spot missing monthly recurring bills (e.g. trash, landscaping)."
    ],
    "commonPitfalls": [
      "Writing vague variance explanations like 'higher expenses due to timing' without investigating specific invoices."
    ],
    "isCore49": true
  },
  {
    "id": "task_55747",
    "name": "T12 income statement analysis",
    "phase": "Post-AME",
    "category": "Self Analysis",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Reports",
        "General Ledger Detail / Comparative Income Statement"
      ],
      "yardi": [
        "Financials",
        "Reports",
        "Trial Balance / Budget Variance Analysis"
      ]
    },
    "purpose": "Perform detailed line-by-line review of all balance sheet and income statement accounts, detecting miscoded entries, unexpected variances, and anomalies before review submission.",
    "rootCause": "Ensures financial integrity, catches miscoded invoices, verifies accrual reversals, and prepares the accountant to explain operational variances to management.",
    "actionSOP": [
      "Generate GL Detail Report for the month and export to Excel alongside Approved Budget.",
      "Run Comparative Income Statement (Current Month Actual vs. Budget vs. Prior Month).",
      "Highlight all revenue variances > $1,000 and expense variances > $2,500 or 10%.",
      "Inspect underlying journal entries and invoice distributions for any highlighted anomalies.",
      "Correct miscoded entries via reclassifying journal entry before period close.",
      "Draft clear, concise variance explanations for the Onshore Review team."
    ],
    "downstreamImpact": {
      "glImpact": "Reclassification entries if needed: DR Correct Expense GL / CR Miscoded Expense GL",
      "nextWorkflowStep": "Clean financials ready for Xshore Internal Review and Preliminary AME package submission.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Asset Manager"
      ],
      "downstreamReports": [
        "General Ledger Detail Report",
        "Budget Variance Report",
        "Trailing 12-Month (T12) Income Statement"
      ]
    },
    "proTips": [
      "Look for debit balances in liability accounts or credit balances in expense accounts—they almost always signal miscoding.",
      "Scan the T12 horizontally to spot missing monthly recurring bills (e.g. trash, landscaping)."
    ],
    "commonPitfalls": [
      "Writing vague variance explanations like 'higher expenses due to timing' without investigating specific invoices."
    ],
    "isCore49": true
  },
  {
    "id": "task_33817",
    "name": "Financial Report update",
    "phase": "Reporting",
    "category": "Month end reporting",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "Reporting Portal",
    "navigation": {
      "realpage": [
        "Reporting Portal",
        "Financial Packages",
        "AME Package / Monthly Operating Report (MOR)"
      ],
      "yardi": [
        "Financials",
        "Reports",
        "Financial Package Publisher",
        "MOR Package"
      ]
    },
    "purpose": "Generate, assemble, balance, and publish the complete monthly financial reporting package for property owners, asset managers, and lenders.",
    "rootCause": "Monthly contractual reporting deadline to deliver certified financial statements to institutional investors and compliance partners.",
    "actionSOP": [
      "Verify all subledgers (AP, AR, Cash Management) are locked and posted in RealPage.",
      "Navigate to Reporting Portal > Financial Packages > select AME / MOR Package.",
      "Run report generator for target month; verify Balance Sheet balances (Assets = Liabilities + Equity).",
      "Assemble required supporting schedules: Bank Recs, Rent Roll, Delinquency, Escrows, Capex Schedule.",
      "Check that Net Income on Income Statement ties to Balance Sheet Current Year Earnings.",
      "Publish compiled PDF package to shared drive / SharePoint for executive distribution."
    ],
    "downstreamImpact": {
      "glImpact": "Finalizes financial ledger; locks accounting period to prevent retroactive changes.",
      "nextWorkflowStep": "Transmitted to Onshore Reviewers, Asset Managers, and Institutional Investors (e.g., Goldman Sachs, OSSO).",
      "keyStakeholders": [
        "Property Accountant",
        "Onshore Reviewer",
        "Asset Manager",
        "Lender"
      ],
      "downstreamReports": [
        "Balance Sheet",
        "Income Statement (Month & YTD)",
        "Cash Flow Statement",
        "MOR Package Complete"
      ]
    },
    "proTips": [
      "Always verify the 'Tie-Out Triangle': Net Income on Income Statement == Change in Retained Earnings == Cash Flow Operating Net.",
      "Double-check header dates and property name formatting before PDF publishing."
    ],
    "commonPitfalls": [
      "Publishing reports before confirming that all late reclassification entries have been posted to the general ledger."
    ],
    "isCore49": true
  },
  {
    "id": "task_42656",
    "name": "Save all supports in drive",
    "phase": "Reporting",
    "category": "Month end reporting",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Save all supports in drive in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Month end reporting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Save all supports in drive.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Month end reporting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_87327",
    "name": "Schedule Ops call",
    "phase": "Reporting",
    "category": "Ops call",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Schedule Ops call in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Ops call to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Schedule Ops call.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Ops call GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_71645",
    "name": "Xshore Internal review of financials",
    "phase": "Review",
    "category": "Internal Review - Xshore",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Xshore Internal review of financials in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Internal Review - Xshore to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Xshore Internal review of financials.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Internal Review - Xshore GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_15097",
    "name": "Inform site team to begin variance comments",
    "phase": "Reporting",
    "category": "Variance Notes - Site team",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Inform site team to begin variance comments in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Variance Notes - Site team to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Inform site team to begin variance comments.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Variance Notes - Site team GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_91803",
    "name": "1st Onshore review",
    "phase": "Review",
    "category": "Onshore review",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify 1st Onshore review in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Onshore review to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for 1st Onshore review.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Onshore review GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_68460",
    "name": "2nd Onshore review",
    "phase": "Review",
    "category": "Onshore review",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify 2nd Onshore review in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Onshore review to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for 2nd Onshore review.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Onshore review GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_98909",
    "name": "Email to AM team",
    "phase": "Reporting",
    "category": "AM Review",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "Was Awaiting PMs to finish entering comments",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Email to AM team in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for AM Review to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Email to AM team.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate AM Review GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_17794",
    "name": "MOR package compile",
    "phase": "Reporting",
    "category": "MOR package",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "Awaiting GS confirmation on Budget report to be shared. Last follow up - 9/14",
    "rpModule": "Reporting Portal",
    "navigation": {
      "realpage": [
        "Reporting Portal",
        "Financial Packages",
        "AME Package / Monthly Operating Report (MOR)"
      ],
      "yardi": [
        "Financials",
        "Reports",
        "Financial Package Publisher",
        "MOR Package"
      ]
    },
    "purpose": "Generate, assemble, balance, and publish the complete monthly financial reporting package for property owners, asset managers, and lenders.",
    "rootCause": "Monthly contractual reporting deadline to deliver certified financial statements to institutional investors and compliance partners.",
    "actionSOP": [
      "Verify all subledgers (AP, AR, Cash Management) are locked and posted in RealPage.",
      "Navigate to Reporting Portal > Financial Packages > select AME / MOR Package.",
      "Run report generator for target month; verify Balance Sheet balances (Assets = Liabilities + Equity).",
      "Assemble required supporting schedules: Bank Recs, Rent Roll, Delinquency, Escrows, Capex Schedule.",
      "Check that Net Income on Income Statement ties to Balance Sheet Current Year Earnings.",
      "Publish compiled PDF package to shared drive / SharePoint for executive distribution."
    ],
    "downstreamImpact": {
      "glImpact": "Finalizes financial ledger; locks accounting period to prevent retroactive changes.",
      "nextWorkflowStep": "Transmitted to Onshore Reviewers, Asset Managers, and Institutional Investors (e.g., Goldman Sachs, OSSO).",
      "keyStakeholders": [
        "Property Accountant",
        "Onshore Reviewer",
        "Asset Manager",
        "Lender"
      ],
      "downstreamReports": [
        "Balance Sheet",
        "Income Statement (Month & YTD)",
        "Cash Flow Statement",
        "MOR Package Complete"
      ]
    },
    "proTips": [
      "Always verify the 'Tie-Out Triangle': Net Income on Income Statement == Change in Retained Earnings == Cash Flow Operating Net.",
      "Double-check header dates and property name formatting before PDF publishing."
    ],
    "commonPitfalls": [
      "Publishing reports before confirming that all late reclassification entries have been posted to the general ledger."
    ],
    "isCore49": true
  },
  {
    "id": "task_48224",
    "name": "Save Final Income statement to sharepoint",
    "phase": "Reporting",
    "category": "Sharepoint upload",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Save Final Income statement to sharepoint in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Sharepoint upload to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Save Final Income statement to sharepoint.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Sharepoint upload GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_42587",
    "name": "Send reports to lender for lender reporting",
    "phase": "Reporting",
    "category": "Lender reporting",
    "frequency": "Monthly/Quaterly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Send reports to lender for lender reporting in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Lender reporting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Send reports to lender for lender reporting.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Lender reporting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": true
  },
  {
    "id": "task_24884",
    "name": "STYL/MCMC Billback wires + Invoice posting",
    "phase": "Ongoing - Weekly",
    "category": "STYL/MCMC Billbacks",
    "frequency": "Weekly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal",
        "Billback Intercompany Processing"
      ],
      "yardi": [
        "Financials",
        "Intercompany",
        "Process Billbacks"
      ]
    },
    "purpose": "Process intercompany billbacks and wire settlements for corporate payroll, shared insurance, or technology fees paid centrally on behalf of properties.",
    "rootCause": "Central corporate entities (STYL/MCMC) disburse shared operating expenses (e.g. centralized marketing, IT, specialized maintenance) that must be allocated to property books.",
    "actionSOP": [
      "Obtain weekly billback schedule and supporting corporate invoices from the RF team.",
      "Review allocation percentages across properties based on unit counts or specific usage metrics.",
      "Post billback Journal Entry or AP invoice in RealPage against appropriate property expense GL.",
      "Prepare wire funding authorization to reimburse STYL/MCMC corporate account.",
      "Ensure Intercompany Due To/From accounts tie to penny."
    ],
    "downstreamImpact": {
      "glImpact": "Property: DR 6500-00 (Shared Service Expense) / CR 2150-00 (Due to Affiliate/MCMC) [Wire: DR 2150-00 / CR 1010-00 Cash]",
      "nextWorkflowStep": "RF corporate team confirms wire receipt; intercompany reconciliation schedules match.",
      "keyStakeholders": [
        "Property Accountant",
        "RF Team",
        "Corporate Accounting Team"
      ],
      "downstreamReports": [
        "Intercompany Reconciliation Schedule",
        "Wire Transfer Authorization",
        "General Ledger Detail"
      ]
    },
    "proTips": [
      "Maintain an ongoing Excel roll-forward of Due To/From STYL/MCMC to prevent month-end out-of-balance.",
      "Always confirm allocation formula approved by Asset Management."
    ],
    "commonPitfalls": [
      "Posting the billback without verifying if prior month accrual needs to be reversed, causing double expense."
    ],
    "isCore49": true
  },
  {
    "id": "task_duplicate_je",
    "name": "Duplicate Journal Entry (Clone Recurring & Monthly Entries)",
    "phase": "Pre-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "RealPage General Ledger User Guide (Pages 404-446) & Prepaids (Page 492)",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "All",
        "Journal Entry",
        "View Transactions",
        "View > Duplicate"
      ],
      "yardi": [
        "Financials",
        "Journal Entries",
        "Copy Journal / Duplicate Batch"
      ]
    },
    "purpose": "Clone an existing multi-line journal entry into the current journal or a different book (Accrual, Tax, Provisional, User-Defined) without re-keying account numbers, cost centers, and line descriptions.",
    "rootCause": "Accountants execute identical recurring monthly journal entries (mortgage interest, utilities, management fee accruals, billbacks) where only dates or minor amounts change. Cloning prevents manual transposition errors and miscoded accounts.",
    "actionSOP": [
      "Navigate to General Ledger > All > Journal Entry > View Transactions.",
      "Locate the prior month journal entry to copy; click View or select its check box in the list.",
      "Click the 'Duplicate' button on the top action bar.",
      "In the 'Duplicate to' pop-up dialog, select target Book (e.g. Accrual) and Journal.",
      "In Date section, choose 'Specify Date' and input current month-end date (e.g. 08/31/2026).",
      "Click OK; RealPage opens the cloned entry with a new Transaction ID and copied lines.",
      "Edit distribution dollar amounts and line descriptions to reflect current month support.",
      "Verify Debits equal Credits, then click Post (or Save as Draft)."
    ],
    "downstreamImpact": {
      "glImpact": "Cloned entry posts with new Transaction ID: Debits selected Expense/Asset GLs and Credits matching Liability/Equity GLs. Zero net imbalance allowed.",
      "nextWorkflowStep": "New journal entry posts to the General Ledger and Trial Balance. Reflected on the monthly GL Detail Report and Comparative Income Statement.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail Report",
        "Comparative Income Statement"
      ]
    },
    "proTips": [
      "RealPage does NOT check for duplicate journal entries during imports or copying (as stated on page 18 of the Importing Data guide). Always verify the Transaction ID and description to prevent accidentally posting the exact same entry twice!",
      "To test an entry before committing to official books: duplicate it into a 'Provisional' user-defined book, review the financial statement, then duplicate to the main Accrual book."
    ],
    "commonPitfalls": [
      "Leaving the original prior-month date on the duplicated entry, causing it to post into a closed historical period.",
      "Duplicating an entry that was already auto-reversed, causing duplicate reverse entries."
    ],
    "isCore49": false
  },
  {
    "id": "task_07881",
    "name": "Invoice approval - 4th Workflow - Yardi",
    "phase": "Ongoing - Daily",
    "category": "Invoice Processing",
    "frequency": "Daily",
    "priority": "Medium",
    "notes": "All Approved as of 8/19/26",
    "rpModule": "AP",
    "navigation": {
      "realpage": [
        "Accounts Payable",
        "Approval Policy Manager",
        "Approval Workbench"
      ],
      "yardi": [
        "AP",
        "Invoice Processing",
        "Approve Invoices",
        "Workflow 4 - Accounting Review"
      ]
    },
    "purpose": "Review and grant final accounting approval for property invoices in Yardi Workflow 4 before they are posted to the AP ledger and staged for check/ACH payment.",
    "rootCause": "Invoices entered by the site team (Workflow 1) and approved by PM (Workflow 2) and RPM (Workflow 3) queue here for accounting review of GL coding, tax calculation, PO matching, and budget compliance.",
    "actionSOP": [
      "Navigate to Yardi AP > Approve Invoices > select Workflow 4 (Offshore/Regional Accounting).",
      "Open each invoice batch and inspect attached PDF invoice against entered header and line-item details.",
      "Verify GL Account number, Property Code, Unit Number (if applicable), and Job Cost codes.",
      "Check invoice date vs. current accounting period; ensure invoice is not backdated into closed periods.",
      "Click 'Approve' to advance invoice to posted AP status, or 'Reject' with clear comments to return to site team."
    ],
    "downstreamImpact": {
      "glImpact": "DR 6000-6999 (Operating Expense GL / R&M) / CR 2000-00 (Accounts Payable Subledger)",
      "nextWorkflowStep": "Invoice posts to AP subledger and appears on the Cash Requirements Report for weekly payment run.",
      "keyStakeholders": [
        "Property Accountant",
        "Property Manager (PM)",
        "Regional PM (RPM)"
      ],
      "downstreamReports": [
        "Yardi AP Invoice Register",
        "Cash Requirements Report",
        "Unposted Invoice Report"
      ]
    },
    "proTips": [
      "Always verify W-9 and 1099 eligibility check-boxes before approving new vendors.",
      "Double-check utility bills for disconnect notices or late penalty additions."
    ],
    "commonPitfalls": [
      "Approving an invoice where the job cost code does not tie out to an approved PO revision.",
      "Approving invoices dated in a closed accounting month without adjusting posting date."
    ],
    "isCore49": false
  },
  {
    "id": "task_59726",
    "name": "Pending 1st/2nd Approval queue - intimate site team",
    "phase": "Ongoing - Daily",
    "category": "Invoice Processing",
    "frequency": "Daily",
    "priority": "Medium",
    "notes": "Approx. 4-5 Invoices are in Queue",
    "rpModule": "Approvals",
    "navigation": {
      "realpage": [
        "Accounts Payable",
        "Approval Policy Manager",
        "Approval Workbench",
        "Pending Approvals Queue"
      ],
      "yardi": [
        "AP",
        "Reports",
        "Invoice Workflow Status Report",
        "Filter: Workflow 1 & 2"
      ]
    },
    "purpose": "Identify invoices currently stalled in PM (1st) or RPM (2nd) approval queues and send formal daily reminders to site teams to maintain compliance.",
    "rootCause": "Property Managers and Regional Managers face heavy operational workloads and overlook their approval workbench queues, causing vendor payment delays.",
    "actionSOP": [
      "Navigate to RealPage AP > Approvals > Approval Workbench.",
      "Filter status by 'Pending Approval 1 (PM)' and 'Pending Approval 2 (RPM)'.",
      "Export aged queue to Excel; highlight invoices older than 48 hours.",
      "Send standard notification template to PM/RPM with Invoice #, Vendor, Amount, and Age in Days.",
      "Document follow-up in the offshore tracking log."
    ],
    "downstreamImpact": {
      "glImpact": "No GL entry yet (Invoices remain unposted in approval staging tables until all approval tiers sign off).",
      "nextWorkflowStep": "Site PM/RPM approves the invoice in RealPage, advancing it to Accounting Review.",
      "keyStakeholders": [
        "Property Manager",
        "Regional Property Manager",
        "Offshore Accountant"
      ],
      "downstreamReports": [
        "Unapproved Invoice Aging Report",
        "Daily Queue Status Tracker"
      ]
    },
    "proTips": [
      "Group invoices by PM to make it easy for them to review in bulk during morning standups.",
      "Flag utility bills over $1,000 as urgent to avoid late fee penalties."
    ],
    "commonPitfalls": [
      "Failing to follow up prior to weekly payment run cut-off, causing missed discount terms."
    ],
    "isCore49": false
  },
  {
    "id": "task_47539",
    "name": "STYL/MCMC Billback wires + Invoices to be sent to RF team",
    "phase": "Ongoing - Weekly",
    "category": "STYL/MCMC Billbacks",
    "frequency": "Weekly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal",
        "Billback Intercompany Processing"
      ],
      "yardi": [
        "Financials",
        "Intercompany",
        "Process Billbacks"
      ]
    },
    "purpose": "Process intercompany billbacks and wire settlements for corporate payroll, shared insurance, or technology fees paid centrally on behalf of properties.",
    "rootCause": "Central corporate entities (STYL/MCMC) disburse shared operating expenses (e.g. centralized marketing, IT, specialized maintenance) that must be allocated to property books.",
    "actionSOP": [
      "Obtain weekly billback schedule and supporting corporate invoices from the RF team.",
      "Review allocation percentages across properties based on unit counts or specific usage metrics.",
      "Post billback Journal Entry or AP invoice in RealPage against appropriate property expense GL.",
      "Prepare wire funding authorization to reimburse STYL/MCMC corporate account.",
      "Ensure Intercompany Due To/From accounts tie to penny."
    ],
    "downstreamImpact": {
      "glImpact": "Property: DR 6500-00 (Shared Service Expense) / CR 2150-00 (Due to Affiliate/MCMC) [Wire: DR 2150-00 / CR 1010-00 Cash]",
      "nextWorkflowStep": "RF corporate team confirms wire receipt; intercompany reconciliation schedules match.",
      "keyStakeholders": [
        "Property Accountant",
        "RF Team",
        "Corporate Accounting Team"
      ],
      "downstreamReports": [
        "Intercompany Reconciliation Schedule",
        "Wire Transfer Authorization",
        "General Ledger Detail"
      ]
    },
    "proTips": [
      "Maintain an ongoing Excel roll-forward of Due To/From STYL/MCMC to prevent month-end out-of-balance.",
      "Always confirm allocation formula approved by Asset Management."
    ],
    "commonPitfalls": [
      "Posting the billback without verifying if prior month accrual needs to be reversed, causing double expense."
    ],
    "isCore49": false
  },
  {
    "id": "task_38917",
    "name": "Insurance accrual",
    "phase": "Pre-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "JEs are created",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal / Auto-Reversing Accrual"
      ],
      "yardi": [
        "Financials",
        "Journal Entries",
        "Standard Accrual (Auto-Reverse)"
      ]
    },
    "purpose": "Accrue operating expenses incurred during the month where actual third-party invoices or payroll registers have not yet been billed or paid.",
    "rootCause": "GAAP matching principle: expenses must be recognized in the period they occur regardless of billing or payment timing.",
    "actionSOP": [
      "Review prior month actuals, annual approved budget, and contract schedules for recurring obligations.",
      "For Property Tax: Calculate monthly accrual = Total Annual Assessed Tax / 12 months.",
      "For Insurance: Calculate monthly expense = Total Annual Policy Premium / 12 months.",
      "For Payroll: Calculate unbilled days at month-end based on site staff payroll schedule.",
      "Draft Auto-Reversing Journal Entry in RealPage with effective date as last day of month.",
      "Set auto-reversal date to Day 1 of subsequent month."
    ],
    "downstreamImpact": {
      "glImpact": "DR 6400-00 (Property Tax Exp) or DR 6300-00 (Insurance Exp) / CR 2100-00 (Accrued Expenses)",
      "nextWorkflowStep": "Journal entry posts to trial balance; automatically reverses next month to prevent double-counting upon invoice entry.",
      "keyStakeholders": [
        "Property Accountant",
        "Reviewer",
        "Asset Manager"
      ],
      "downstreamReports": [
        "Monthly Accrual Schedule",
        "Trial Balance Detail",
        "Budget vs Actual Variance Report"
      ]
    },
    "proTips": [
      "Always verify whether property taxes are paid via lender escrow or direct payment before booking escrow entries.",
      "Use auto-reversing flags in RealPage to eliminate manual reversal mistakes."
    ],
    "commonPitfalls": [
      "Forgetting to flag entry as auto-reversing, resulting in duplicate expenses when the actual invoice arrives."
    ],
    "isCore49": false
  },
  {
    "id": "task_40265",
    "name": "GPR entry posting and tie out",
    "phase": "Post-AME",
    "category": "GPR Posting",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal",
        "GPR Posting & Rent Roll"
      ],
      "yardi": [
        "Financials",
        "Journal Entries",
        "Gross Potential Rent Tie-Out"
      ]
    },
    "purpose": "Post Gross Potential Rent (GPR) and tie out the property's rent roll to the general ledger to verify total potential revenue, vacancy loss, and concessions.",
    "rootCause": "US multifamily accounting records revenue at Gross Potential Rent (100% occupancy at market rent) minus vacancy, concessions, and employee units.",
    "actionSOP": [
      "Generate month-end Rent Roll and GPR Summary report from RealPage Leasing & Rents module.",
      "Extract Market Rent, Gross Potential Rent, Vacancy Loss, Gain/Loss to Lease, and Rent Concessions.",
      "Draft GPR journal entry in GL module matching rent roll totals exactly.",
      "Verify that Net Rental Income on Income Statement ties to Rent Roll Net Billed Rent.",
      "Document any variances between resident ledger billings and GL posting."
    ],
    "downstreamImpact": {
      "glImpact": "DR 5100-00 (Vacancy Loss) / DR 5150-00 (Concessions) / DR 1100-00 (Accounts Receivable - Residents) / CR 5000-00 (Gross Potential Rent)",
      "nextWorkflowStep": "Rental revenue certified for AME package; supports Asset Management operational review.",
      "keyStakeholders": [
        "Property Accountant",
        "Property Manager",
        "Asset Management"
      ],
      "downstreamReports": [
        "Rent Roll Summary",
        "Gross Potential Rent Tie-Out Schedule",
        "Income Statement"
      ]
    },
    "proTips": [
      "Ensure month-end gross potential rent ties to total unit count * average market rent.",
      "Cross-reference model units and employee discounts with approved HR lists."
    ],
    "commonPitfalls": [
      "Posting GPR without matching current month market rent changes made by the leasing office."
    ],
    "isCore49": false
  },
  {
    "id": "task_02170",
    "name": "Invoice & PO accruals file - from site team",
    "phase": "Post-AME",
    "category": "Invoice & PO accrual - Site team",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Invoice & PO accruals file - from site team in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Invoice & PO accrual - Site team to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Invoice & PO accruals file - from site team.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Invoice & PO accrual - Site team GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  },
  {
    "id": "task_58454",
    "name": "Utilities Re-bill Accrual",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Utilities Re-bill Accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Utilities Re-bill Accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  },
  {
    "id": "task_97179",
    "name": "Sweep entries posting",
    "phase": "Post-AME",
    "category": "Bank Reconciliation",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Sweep entries posting in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Bank Reconciliation to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Sweep entries posting.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Bank Reconciliation GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  },
  {
    "id": "task_64339",
    "name": "Email to site team to begin variance comments -cc AM team",
    "phase": "Reporting",
    "category": "Variance Notes - Site team",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Email to site team to begin variance comments -cc AM team in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Variance Notes - Site team to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Email to site team to begin variance comments -cc AM team.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Variance Notes - Site team GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  },
  {
    "id": "task_05117",
    "name": "Replacement Reserve Draw",
    "phase": "Ongoing - Quarterly",
    "category": "Replacement Reserve Draw",
    "frequency": "Quarterly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Job Cost & Reserves",
        "Replacement Reserves / Capital Draws"
      ],
      "yardi": [
        "Financials",
        "Job Cost",
        "Draw Requests & Funding"
      ]
    },
    "purpose": "Compile capital expenditure (Capex) invoices, proofs of payment, and lien waivers to request reimbursement funds from lender escrow or investor partners.",
    "rootCause": "Capital improvement projects (roof replacement, exterior paint, clubhouse remodel) are funded from reserved escrow accounts upon verified completion.",
    "actionSOP": [
      "Gather paid Capex vendor invoices, cancelled checks/wire confirmations, and contractor lien waivers.",
      "Verify all items meet capital expenditure threshold (typically > $1,000 and life > 1 year).",
      "Prepare formal Lender Reserve Draw Request Form matching lender-approved work categories.",
      "Submit draw package to Onshore Reviewer and Lender inspector.",
      "Upon receipt of wire funding: post deposit to operating cash and reduce receivable from lender reserve."
    ],
    "downstreamImpact": {
      "glImpact": "Wire received: DR 1010-00 (Operating Cash) / CR 1230-00 (Replacement Reserve Escrow / Due from Lender)",
      "nextWorkflowStep": "Lender releases escrow funds to operating account; replenishes operating cash reserves.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Lender Inspector",
        "General Contractor"
      ],
      "downstreamReports": [
        "Replacement Reserve Draw Schedule",
        "Capex Budget Tracking Ledger",
        "Bank Statement"
      ]
    },
    "proTips": [
      "Keep unconditional final lien waivers organized per vendor—lenders reject draw packages missing even a single waiver.",
      "Tie out drawn amounts to cumulative capital project GL balances."
    ],
    "commonPitfalls": [
      "Submitting routine repair and maintenance (R&M) operating expenses as capital reserve draws, which will be rejected by lender auditors."
    ],
    "isCore49": false
  },
  {
    "id": "task_06302",
    "name": "AM Fees/CM Fees Accrual",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify AM Fees/CM Fees Accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for AM Fees/CM Fees Accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  },
  {
    "id": "task_83192",
    "name": "Bank Reconciliation - PNC account",
    "phase": "Post-AME",
    "category": "Bank Reconciliation",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Reconciliations",
        "Bank Reconciliation",
        "Select Account & Period"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Reconcile Bank Account"
      ]
    },
    "purpose": "Reconcile the property's general ledger cash account with the official bank statement, accounting for outstanding checks and deposits in transit.",
    "rootCause": "Ensure internal accounting books match actual bank cash, prevent fraud, identify unrecorded bank fees or sweeps, and substantiate Balance Sheet Cash.",
    "actionSOP": [
      "Download month-end bank statement and pull RealPage Bank Reconciliation module for target account.",
      "Input bank statement ending balance and statement cut-off date.",
      "Clear cleared checks, ACH payments, and wires matching the bank statement.",
      "Clear matching deposits and customer payments in transit.",
      "Verify that 'Difference to Balance' equals exactly $0.00.",
      "Print Bank Reconciliation Summary, Outstanding Check List, and Deposits in Transit support.",
      "Submit signed rec package for Onshore review."
    ],
    "downstreamImpact": {
      "glImpact": "No GL posting from rec itself; adjusting entries booked for fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Cash)",
      "nextWorkflowStep": "Bank Rec approved by Onshore Reviewer; included as Schedule 1 in MOR package.",
      "keyStakeholders": [
        "Property Accountant",
        "Xshore Reviewer",
        "Onshore Reviewer",
        "Lender"
      ],
      "downstreamReports": [
        "Bank Reconciliation Report",
        "Outstanding Check List",
        "Deposits in Transit Ledger"
      ]
    },
    "proTips": [
      "Always investigate outstanding deposits older than 3 days—they often indicate missed NSF reversals or bank errors.",
      "Checks outstanding over 90 days should be flagged for void/reissue or escheatment review."
    ],
    "commonPitfalls": [
      "Forcing a bank reconciliation balance with an unexplained plug entry instead of locating the exact missing transaction."
    ],
    "isCore49": false
  },
  {
    "id": "task_82702",
    "name": "Capex Funding",
    "phase": "Ongoing - Monthly",
    "category": "GS Funding",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Job Cost & Reserves",
        "Replacement Reserves / Capital Draws"
      ],
      "yardi": [
        "Financials",
        "Job Cost",
        "Draw Requests & Funding"
      ]
    },
    "purpose": "Compile capital expenditure (Capex) invoices, proofs of payment, and lien waivers to request reimbursement funds from lender escrow or investor partners.",
    "rootCause": "Capital improvement projects (roof replacement, exterior paint, clubhouse remodel) are funded from reserved escrow accounts upon verified completion.",
    "actionSOP": [
      "Gather paid Capex vendor invoices, cancelled checks/wire confirmations, and contractor lien waivers.",
      "Verify all items meet capital expenditure threshold (typically > $1,000 and life > 1 year).",
      "Prepare formal Lender Reserve Draw Request Form matching lender-approved work categories.",
      "Submit draw package to Onshore Reviewer and Lender inspector.",
      "Upon receipt of wire funding: post deposit to operating cash and reduce receivable from lender reserve."
    ],
    "downstreamImpact": {
      "glImpact": "Wire received: DR 1010-00 (Operating Cash) / CR 1230-00 (Replacement Reserve Escrow / Due from Lender)",
      "nextWorkflowStep": "Lender releases escrow funds to operating account; replenishes operating cash reserves.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Lender Inspector",
        "General Contractor"
      ],
      "downstreamReports": [
        "Replacement Reserve Draw Schedule",
        "Capex Budget Tracking Ledger",
        "Bank Statement"
      ]
    },
    "proTips": [
      "Keep unconditional final lien waivers organized per vendor—lenders reject draw packages missing even a single waiver.",
      "Tie out drawn amounts to cumulative capital project GL balances."
    ],
    "commonPitfalls": [
      "Submitting routine repair and maintenance (R&M) operating expenses as capital reserve draws, which will be rejected by lender auditors."
    ],
    "isCore49": false
  },
  {
    "id": "task_19530",
    "name": "Capex Accrual",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Capex Accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Capex Accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  },
  {
    "id": "task_34399",
    "name": "Loan cost amortization",
    "phase": "Pre-AME",
    "category": "Amortization Entries",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Loan cost amortization in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Amortization Entries to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Loan cost amortization.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Amortization Entries GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  },
  {
    "id": "task_90224",
    "name": "Bad debt calculation (60+days)",
    "phase": "Post-AME",
    "category": "Bad Debt",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Journals",
        "Standard Journal",
        "Bad Debt Allowance Schedule"
      ],
      "yardi": [
        "Financials",
        "Journal Entries",
        "Bad Debt Calculation & Reserve"
      ]
    },
    "purpose": "Calculate and record monthly Bad Debt Expense and Allowance for Uncollectible Accounts based on delinquent resident balances aged 60+ and 90+ days.",
    "rootCause": "Accounts receivable from current and past residents over 60/90 days have low collection probability and must be reserved under GAAP conservatism.",
    "actionSOP": [
      "Run Delinquency Aging Report from RealPage Leasing & Rents module as of month-end.",
      "Separate delinquent balances into: Current Residents vs. Evicted/Moved-Out Residents.",
      "Apply ownership policy reserve rates (e.g. 50% for 60-89 days, 100% for 90+ days and all skipped/evicted residents).",
      "Calculate required ending balance in Allowance for Doubtful Accounts (GL 1150-00).",
      "Post Journal Entry for the delta between current GL allowance balance and required reserve balance."
    ],
    "downstreamImpact": {
      "glImpact": "DR 6350-00 (Bad Debt Expense) / CR 1150-00 (Allowance for Doubtful Accounts - Contra Asset)",
      "nextWorkflowStep": "Delinquency schedule and reserve calculation added to AME workpapers for Onshore Review.",
      "keyStakeholders": [
        "Property Accountant",
        "Property Manager",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Delinquency Aging Report",
        "Bad Debt Reserve Roll-Forward",
        "Rent Roll Detail"
      ]
    },
    "proTips": [
      "Verify if former resident security deposits have already been applied against outstanding charges before calculating bad debt.",
      "Check for active payment plans before fully reserving 60-day balances."
    ],
    "commonPitfalls": [
      "Directly writing off resident balances to Bad Debt Expense instead of booking through the Allowance contra-asset account."
    ],
    "isCore49": false
  },
  {
    "id": "task_43955",
    "name": "Utility re-bill Write off",
    "phase": "Post-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Utility re-bill Write off in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Utility re-bill Write off.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  },
  {
    "id": "task_79508",
    "name": "Send reports to OSSO for lender reporting",
    "phase": "Reporting",
    "category": "Lender reporting",
    "frequency": "Monthly/Quaterly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Send reports to OSSO for lender reporting in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Lender reporting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Send reports to OSSO for lender reporting.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Lender reporting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  },
  {
    "id": "task_88787",
    "name": "Clearing BS Rec items (AP other/AR other)",
    "phase": "Ongoing - Daily",
    "category": "BS Reconciliation",
    "frequency": "Daily",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Inquiries & Reports",
        "Account Inquiry / Reconciliation Ledger"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Account Details",
        "Balance Sheet Accounts"
      ]
    },
    "purpose": "Investigate, substantiate, and clear reconciling items sitting in Balance Sheet clearing accounts (AP Other, AR Other, Clearing Cash, CMA).",
    "rootCause": "Timing differences, manual unmapped sweeps, unidentified wire credits, bank fees posted without GL coding, or rounding differences during merchant processing.",
    "actionSOP": [
      "Run GL Account Detail for the clearing accounts (e.g., 1099-00 Cash Clearing, 2099-00 AP Other).",
      "Export transactions to Excel and cross-reference with bank statements and merchant statements.",
      "Identify the offsetting entry: match clearing transactions to corresponding subledger invoices or deposits.",
      "Draft clearing Journal Entry in RealPage GL > Journals > Standard Journal.",
      "Attach bank support and tie-out proof; submit for Onshore Reviewer sign-off."
    ],
    "downstreamImpact": {
      "glImpact": "DR/CR Clearing Account (1099/2099) to Zero balance / CR/DR Target Operating GL (e.g., 6850-00 Bank Fees or 1010-00 Cash)",
      "nextWorkflowStep": "Clearing account balance returns to zero ($0.00) on the Monthly Balance Sheet Package.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Balance Sheet Detail Report",
        "Bank Reconciliation Tie-Out",
        "Clearing Account Schedule"
      ]
    },
    "proTips": [
      "Never let items age past 30 days in clearing accounts—onshore reviewers treat uncleared items as audit flags.",
      "Always annotate the bank transaction reference number in the JE description."
    ],
    "commonPitfalls": [
      "Lumping multiple unexplained variances into miscellaneous expense instead of investigating root causes."
    ],
    "isCore49": false
  },
  {
    "id": "task_67196",
    "name": "Opex Funding",
    "phase": "Ongoing - Quarterly",
    "category": "OSSO Funding",
    "frequency": "Quarterly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Job Cost & Reserves",
        "Replacement Reserves / Capital Draws"
      ],
      "yardi": [
        "Financials",
        "Job Cost",
        "Draw Requests & Funding"
      ]
    },
    "purpose": "Compile capital expenditure (Capex) invoices, proofs of payment, and lien waivers to request reimbursement funds from lender escrow or investor partners.",
    "rootCause": "Capital improvement projects (roof replacement, exterior paint, clubhouse remodel) are funded from reserved escrow accounts upon verified completion.",
    "actionSOP": [
      "Gather paid Capex vendor invoices, cancelled checks/wire confirmations, and contractor lien waivers.",
      "Verify all items meet capital expenditure threshold (typically > $1,000 and life > 1 year).",
      "Prepare formal Lender Reserve Draw Request Form matching lender-approved work categories.",
      "Submit draw package to Onshore Reviewer and Lender inspector.",
      "Upon receipt of wire funding: post deposit to operating cash and reduce receivable from lender reserve."
    ],
    "downstreamImpact": {
      "glImpact": "Wire received: DR 1010-00 (Operating Cash) / CR 1230-00 (Replacement Reserve Escrow / Due from Lender)",
      "nextWorkflowStep": "Lender releases escrow funds to operating account; replenishes operating cash reserves.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Lender Inspector",
        "General Contractor"
      ],
      "downstreamReports": [
        "Replacement Reserve Draw Schedule",
        "Capex Budget Tracking Ledger",
        "Bank Statement"
      ]
    },
    "proTips": [
      "Keep unconditional final lien waivers organized per vendor—lenders reject draw packages missing even a single waiver.",
      "Tie out drawn amounts to cumulative capital project GL balances."
    ],
    "commonPitfalls": [
      "Submitting routine repair and maintenance (R&M) operating expenses as capital reserve draws, which will be rejected by lender auditors."
    ],
    "isCore49": false
  },
  {
    "id": "task_01402",
    "name": "Bank Reconciliation - CMA account",
    "phase": "Post-AME",
    "category": "Bank Reconciliation",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Reconciliations",
        "Bank Reconciliation",
        "Select Account & Period"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Reconcile Bank Account"
      ]
    },
    "purpose": "Reconcile the property's general ledger cash account with the official bank statement, accounting for outstanding checks and deposits in transit.",
    "rootCause": "Ensure internal accounting books match actual bank cash, prevent fraud, identify unrecorded bank fees or sweeps, and substantiate Balance Sheet Cash.",
    "actionSOP": [
      "Download month-end bank statement and pull RealPage Bank Reconciliation module for target account.",
      "Input bank statement ending balance and statement cut-off date.",
      "Clear cleared checks, ACH payments, and wires matching the bank statement.",
      "Clear matching deposits and customer payments in transit.",
      "Verify that 'Difference to Balance' equals exactly $0.00.",
      "Print Bank Reconciliation Summary, Outstanding Check List, and Deposits in Transit support.",
      "Submit signed rec package for Onshore review."
    ],
    "downstreamImpact": {
      "glImpact": "No GL posting from rec itself; adjusting entries booked for fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Cash)",
      "nextWorkflowStep": "Bank Rec approved by Onshore Reviewer; included as Schedule 1 in MOR package.",
      "keyStakeholders": [
        "Property Accountant",
        "Xshore Reviewer",
        "Onshore Reviewer",
        "Lender"
      ],
      "downstreamReports": [
        "Bank Reconciliation Report",
        "Outstanding Check List",
        "Deposits in Transit Ledger"
      ]
    },
    "proTips": [
      "Always investigate outstanding deposits older than 3 days—they often indicate missed NSF reversals or bank errors.",
      "Checks outstanding over 90 days should be flagged for void/reissue or escheatment review."
    ],
    "commonPitfalls": [
      "Forcing a bank reconciliation balance with an unexplained plug entry instead of locating the exact missing transaction."
    ],
    "isCore49": false
  },
  {
    "id": "task_53127",
    "name": "Maintain cash log",
    "phase": "Ongoing - Daily",
    "category": "Bank/Cash Management",
    "frequency": "Daily",
    "priority": "Medium",
    "notes": "",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Bank Accounts",
        "Bank Transactions / Cash Log"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Bank Activity Log"
      ]
    },
    "purpose": "Download daily bank statements, record receipts and disbursements, update the property cash position, and monitor liquidity.",
    "rootCause": "Ensure daily visibility into operating cash, detect unauthorized debits, verify resident payment deposits, and track sweep transactions.",
    "actionSOP": [
      "Log in to the bank portal (e.g., PNC, KeyBank, Wells Fargo) and download previous day's activity statement.",
      "Enter opening balance, total ACH deposits, credit card merchant batches, check clearings, and wires in Cash Log.",
      "Identify any unknown debit/credit; notify property manager or bank representative.",
      "In RealPage Cash Management, post daily bank activity transactions (merchant fees, interest earned, bank charges).",
      "Confirm calculated ending cash agrees with bank statement ledger balance."
    ],
    "downstreamImpact": {
      "glImpact": "Bank Fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Operating Cash) | Interest: DR 1010-00 Cash / CR 7100-00 Interest Income",
      "nextWorkflowStep": "Cash log updated in shared drive; feeds weekly funding projections and monthly bank reconciliation.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Onshore Treasury"
      ],
      "downstreamReports": [
        "Daily Cash Position Report",
        "Bank Activity Summary",
        "Treasury Liquidity Forecast"
      ]
    },
    "proTips": [
      "Reconcile merchant processor batches (RentPayment, ClickPay) to net bank deposits daily.",
      "Highlight NSF (non-sufficient funds) chargebacks and notify site team to reverse tenant ledger credits."
    ],
    "commonPitfalls": [
      "Failing to log unmapped bank sweep entries, causing fictitious book overdrafts."
    ],
    "isCore49": false
  },
  {
    "id": "task_49051",
    "name": "Bank Activity - Depository account/Key bank",
    "phase": "Pre-AME",
    "category": "Bank Reconciliation",
    "frequency": "Weekly",
    "priority": "High",
    "notes": "",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Bank Accounts",
        "Bank Transactions / Cash Log"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Bank Activity Log"
      ]
    },
    "purpose": "Download daily bank statements, record receipts and disbursements, update the property cash position, and monitor liquidity.",
    "rootCause": "Ensure daily visibility into operating cash, detect unauthorized debits, verify resident payment deposits, and track sweep transactions.",
    "actionSOP": [
      "Log in to the bank portal (e.g., PNC, KeyBank, Wells Fargo) and download previous day's activity statement.",
      "Enter opening balance, total ACH deposits, credit card merchant batches, check clearings, and wires in Cash Log.",
      "Identify any unknown debit/credit; notify property manager or bank representative.",
      "In RealPage Cash Management, post daily bank activity transactions (merchant fees, interest earned, bank charges).",
      "Confirm calculated ending cash agrees with bank statement ledger balance."
    ],
    "downstreamImpact": {
      "glImpact": "Bank Fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Operating Cash) | Interest: DR 1010-00 Cash / CR 7100-00 Interest Income",
      "nextWorkflowStep": "Cash log updated in shared drive; feeds weekly funding projections and monthly bank reconciliation.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Onshore Treasury"
      ],
      "downstreamReports": [
        "Daily Cash Position Report",
        "Bank Activity Summary",
        "Treasury Liquidity Forecast"
      ]
    },
    "proTips": [
      "Reconcile merchant processor batches (RentPayment, ClickPay) to net bank deposits daily.",
      "Highlight NSF (non-sufficient funds) chargebacks and notify site team to reverse tenant ledger credits."
    ],
    "commonPitfalls": [
      "Failing to log unmapped bank sweep entries, causing fictitious book overdrafts."
    ],
    "isCore49": false
  },
  {
    "id": "task_48357",
    "name": "Bank Reconciliation - Key bank account",
    "phase": "Post-AME",
    "category": "Bank Reconciliation",
    "frequency": "Monthly",
    "priority": "High",
    "notes": "",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Reconciliations",
        "Bank Reconciliation",
        "Select Account & Period"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Reconcile Bank Account"
      ]
    },
    "purpose": "Reconcile the property's general ledger cash account with the official bank statement, accounting for outstanding checks and deposits in transit.",
    "rootCause": "Ensure internal accounting books match actual bank cash, prevent fraud, identify unrecorded bank fees or sweeps, and substantiate Balance Sheet Cash.",
    "actionSOP": [
      "Download month-end bank statement and pull RealPage Bank Reconciliation module for target account.",
      "Input bank statement ending balance and statement cut-off date.",
      "Clear cleared checks, ACH payments, and wires matching the bank statement.",
      "Clear matching deposits and customer payments in transit.",
      "Verify that 'Difference to Balance' equals exactly $0.00.",
      "Print Bank Reconciliation Summary, Outstanding Check List, and Deposits in Transit support.",
      "Submit signed rec package for Onshore review."
    ],
    "downstreamImpact": {
      "glImpact": "No GL posting from rec itself; adjusting entries booked for fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Cash)",
      "nextWorkflowStep": "Bank Rec approved by Onshore Reviewer; included as Schedule 1 in MOR package.",
      "keyStakeholders": [
        "Property Accountant",
        "Xshore Reviewer",
        "Onshore Reviewer",
        "Lender"
      ],
      "downstreamReports": [
        "Bank Reconciliation Report",
        "Outstanding Check List",
        "Deposits in Transit Ledger"
      ]
    },
    "proTips": [
      "Always investigate outstanding deposits older than 3 days—they often indicate missed NSF reversals or bank errors.",
      "Checks outstanding over 90 days should be flagged for void/reissue or escheatment review."
    ],
    "commonPitfalls": [
      "Forcing a bank reconciliation balance with an unexplained plug entry instead of locating the exact missing transaction."
    ],
    "isCore49": false
  },
  {
    "id": "task_78318",
    "name": "GS Reporting package",
    "phase": "Reporting",
    "category": "Lender reporting",
    "frequency": "Monthly/Quaterly",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify GS Reporting package in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Lender reporting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for GS Reporting package.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Lender reporting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  },
  {
    "id": "task_53597",
    "name": "Update Cash log",
    "phase": "Ongoing - Daily",
    "category": "Bank/Cash Management",
    "frequency": "Daily",
    "priority": "High",
    "notes": "",
    "rpModule": "Cash Management",
    "navigation": {
      "realpage": [
        "Cash Management",
        "Bank Accounts",
        "Bank Transactions / Cash Log"
      ],
      "yardi": [
        "Financials",
        "Cash Management",
        "Bank Activity Log"
      ]
    },
    "purpose": "Download daily bank statements, record receipts and disbursements, update the property cash position, and monitor liquidity.",
    "rootCause": "Ensure daily visibility into operating cash, detect unauthorized debits, verify resident payment deposits, and track sweep transactions.",
    "actionSOP": [
      "Log in to the bank portal (e.g., PNC, KeyBank, Wells Fargo) and download previous day's activity statement.",
      "Enter opening balance, total ACH deposits, credit card merchant batches, check clearings, and wires in Cash Log.",
      "Identify any unknown debit/credit; notify property manager or bank representative.",
      "In RealPage Cash Management, post daily bank activity transactions (merchant fees, interest earned, bank charges).",
      "Confirm calculated ending cash agrees with bank statement ledger balance."
    ],
    "downstreamImpact": {
      "glImpact": "Bank Fees: DR 6850-00 (Bank Charges) / CR 1010-00 (Operating Cash) | Interest: DR 1010-00 Cash / CR 7100-00 Interest Income",
      "nextWorkflowStep": "Cash log updated in shared drive; feeds weekly funding projections and monthly bank reconciliation.",
      "keyStakeholders": [
        "Property Accountant",
        "Asset Manager",
        "Onshore Treasury"
      ],
      "downstreamReports": [
        "Daily Cash Position Report",
        "Bank Activity Summary",
        "Treasury Liquidity Forecast"
      ]
    },
    "proTips": [
      "Reconcile merchant processor batches (RentPayment, ClickPay) to net bank deposits daily.",
      "Highlight NSF (non-sufficient funds) chargebacks and notify site team to reverse tenant ledger credits."
    ],
    "commonPitfalls": [
      "Failing to log unmapped bank sweep entries, causing fictitious book overdrafts."
    ],
    "isCore49": false
  },
  {
    "id": "task_89413",
    "name": "Clearing BS Rec items (CMA Reconciliation)",
    "phase": "Ongoing - Daily",
    "category": "BS Reconciliation",
    "frequency": "Daily",
    "priority": "High",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Inquiries & Reports",
        "Account Inquiry / Reconciliation Ledger"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Account Details",
        "Balance Sheet Accounts"
      ]
    },
    "purpose": "Investigate, substantiate, and clear reconciling items sitting in Balance Sheet clearing accounts (AP Other, AR Other, Clearing Cash, CMA).",
    "rootCause": "Timing differences, manual unmapped sweeps, unidentified wire credits, bank fees posted without GL coding, or rounding differences during merchant processing.",
    "actionSOP": [
      "Run GL Account Detail for the clearing accounts (e.g., 1099-00 Cash Clearing, 2099-00 AP Other).",
      "Export transactions to Excel and cross-reference with bank statements and merchant statements.",
      "Identify the offsetting entry: match clearing transactions to corresponding subledger invoices or deposits.",
      "Draft clearing Journal Entry in RealPage GL > Journals > Standard Journal.",
      "Attach bank support and tie-out proof; submit for Onshore Reviewer sign-off."
    ],
    "downstreamImpact": {
      "glImpact": "DR/CR Clearing Account (1099/2099) to Zero balance / CR/DR Target Operating GL (e.g., 6850-00 Bank Fees or 1010-00 Cash)",
      "nextWorkflowStep": "Clearing account balance returns to zero ($0.00) on the Monthly Balance Sheet Package.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Balance Sheet Detail Report",
        "Bank Reconciliation Tie-Out",
        "Clearing Account Schedule"
      ]
    },
    "proTips": [
      "Never let items age past 30 days in clearing accounts—onshore reviewers treat uncleared items as audit flags.",
      "Always annotate the bank transaction reference number in the JE description."
    ],
    "commonPitfalls": [
      "Lumping multiple unexplained variances into miscellaneous expense instead of investigating root causes."
    ],
    "isCore49": false
  },
  {
    "id": "task_12639",
    "name": "Interest rate cap accrual",
    "phase": "Pre-AME",
    "category": "Accrual Posting",
    "frequency": "Monthly",
    "priority": "Medium",
    "notes": "",
    "rpModule": "GL",
    "navigation": {
      "realpage": [
        "General Ledger",
        "Processes",
        "Monthly Accounting Tasks"
      ],
      "yardi": [
        "Financials",
        "General Ledger",
        "Standard Processing"
      ]
    },
    "purpose": "Execute and verify Interest rate cap accrual in accordance with offshore US property accounting standards and operational calendars.",
    "rootCause": "Essential control requirement for Accrual Posting to maintain timely, balanced property books and investor compliance.",
    "actionSOP": [
      "Review standard operating procedure instructions for Interest rate cap accrual.",
      "Open target property in RealPage and verify subledger period status.",
      "Gather supporting documentation, third-party confirmations, or site team reports.",
      "Execute required calculations, journal entries, or file uploads.",
      "Verify trial balance integrity and archive workpapers in shared property folder."
    ],
    "downstreamImpact": {
      "glImpact": "Balances appropriate Accrual Posting GL accounts in accordance with US GAAP matching principles.",
      "nextWorkflowStep": "Updates financial workpapers and advances property status towards monthly review sign-off.",
      "keyStakeholders": [
        "Property Accountant",
        "Internal Xshore Reviewer",
        "Onshore Reviewer"
      ],
      "downstreamReports": [
        "Trial Balance",
        "General Ledger Detail",
        "AME Supporting Workpapers"
      ]
    },
    "proTips": [
      "Always save working Excel files with clear formula links and date stamps.",
      "Promptly flag any material variances to your team lead."
    ],
    "commonPitfalls": [
      "Skipping self-review before submitting task completion status."
    ],
    "isCore49": false
  }
];

export const TASK_PHASES = [
  "All",
  "Ongoing - Daily",
  "Ongoing - Weekly",
  "Pre-AME",
  "Post-AME",
  "Review",
  "Reporting",
  "Ongoing - Monthly",
  "Ongoing - Quarterly"
];

export const TASK_PRIORITIES = [
  "High",
  "Medium",
  "Low"
];

export const TASK_CATEGORIES = Array.from(new Set(ALL_TASKS.map(t => t.category))).sort();

export const PROPERTIES = [
  "All Properties",
  "Arcadian (Goldman Sachs - Yardi)",
  "OSSO Portfolio",
  "Wholly Owned / GS-RP"
];
