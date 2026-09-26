// RealPage Module: General Ledger
// Source Manuals: manuals_markdown/01_general_ledger.md

export const glModule = {
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
          "navigation": [
            "General Ledger",
            "Journals",
            "Standard Journal"
          ],
          "purpose": "Record non-invoice transactions: month-end expense accruals, reclassifications, sweep entries, and intercompany allocations.",
          "whyRecordsAreHere": [
            "Adjustments required to comply with US GAAP matching principles and correct site-team coding errors."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Journal Type",
              "description": "Standard, Auto-Reversing, Accrual, Recurring."
            },
            {
              "name": "Effective Date",
              "description": "Must be within target open period (e.g. 08/31/2026)."
            },
            {
              "name": "Reversal Date",
              "description": "Day 1 of subsequent month (e.g. 09/01/2026)."
            },
            {
              "name": "Description & Reference",
              "description": "Audit trail mandatory explanation."
            }
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
          "navigation": [
            "General Ledger",
            "All",
            "Journal Entry",
            "View Transactions",
            "View > Duplicate"
          ],
          "purpose": "Clone an existing complex multi-line journal entry into the current journal or a different book (Accrual, Tax, Provisional, User-Defined) without re-keying account numbers, cost centers, and descriptions.",
          "whyRecordsAreHere": [
            "Accountants execute recurring monthly journal entries (mortgage interest, utilities, management fee accruals, billbacks) where only dates or amounts change.",
            "Allows testing entry impact: copy an entry into a Provisional/User-Defined book first to review financial statement impact before recording to the main Accrual book.",
            "Eliminates manual data entry errors and transposition mistakes on multi-line reclassifications."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Duplicate Button",
              "description": "Located on the top action toolbar when viewing a transaction or checking transactions in the list."
            },
            {
              "name": "Duplicate To Box",
              "description": "Dialog that opens to specify the destination Book (Accrual, GAAP, Tax, User-Defined) and Journal."
            },
            {
              "name": "Date Selection",
              "description": "Choose whether to use the original entry date or specify a new replacement target period date."
            },
            {
              "name": "New Transaction ID",
              "description": "System automatically assigns a unique sequential ID while copying all distribution lines."
            }
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
          "navigation": [
            "General Ledger",
            "Periodic Tasks",
            "Prepaids",
            "Edit > Duplicate"
          ],
          "purpose": "Duplicate an existing prepaid amortization schedule to create a new recurring schedule for renewed policies or newly capitalized multi-month prepaid expenses.",
          "whyRecordsAreHere": [
            "Annual insurance renewals, software subscriptions, or service contracts require setting up a new 12-month amortization schedule identical in structure to the expiring contract."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Duplicate Button",
              "description": "Appears when viewing or editing an existing prepaid record in General Ledger > Periodic Tasks > Prepaids."
            },
            {
              "name": "Asset & Expense Accounts",
              "description": "Prepaid Asset (1200-00) and Target Expense (6300-00)."
            },
            {
              "name": "Amortization Term",
              "description": "Number of months and start date."
            }
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
          "navigation": [
            "General Ledger",
            "Journals",
            "Recurring Journals",
            "Amortization Schedules"
          ],
          "purpose": "Automate monthly expensing of multi-month prepaid items (prepaid insurance, property software licenses, upfront loan costs).",
          "whyRecordsAreHere": [
            "Large upfront payments must be capitalized as assets and systematically amortized over policy/loan term."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Asset Account",
              "description": "e.g., 1200-00 Prepaid Insurance."
            },
            {
              "name": "Expense Account",
              "description": "e.g., 6300-00 Insurance Expense."
            },
            {
              "name": "Term & Frequency",
              "description": "12 months, monthly post on the 1st or last day."
            }
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
          "navigation": [
            "General Ledger",
            "Inquiries & Reports",
            "Trial Balance"
          ],
          "purpose": "Inspect debit and credit balances for every single chart of accounts line to verify ledger equilibrium and audit line movements.",
          "whyRecordsAreHere": [
            "The bedrock report of property accounting. If Trial Balance is out of balance, financial statements cannot be issued."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Period & Date Range",
              "description": "Month-to-date, Quarter-to-date, Year-to-date."
            },
            {
              "name": "Zero Balance Accounts",
              "description": "Toggle to exclude inactive accounts for clarity."
            }
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
};
