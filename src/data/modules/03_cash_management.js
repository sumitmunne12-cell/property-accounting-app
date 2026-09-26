// RealPage Module: Cash Management
// Source Manuals: manuals_markdown/03_cash_management.md

export const cashModule = {
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
          "navigation": [
            "Cash Management",
            "Reconciliations",
            "Bank Reconciliation"
          ],
          "purpose": "Reconcile property bank account statement balances against internal book general ledger cash balances.",
          "whyRecordsAreHere": [
            "Mandatory internal control performed monthly for every bank account (Operating, Depository, Security Deposit, Escrow)."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Statement Ending Balance",
              "description": "Exact closing balance printed on the official bank statement."
            },
            {
              "name": "Cutoff Date",
              "description": "Statement period end date (e.g. 08/31/2026)."
            },
            {
              "name": "Difference to Balance",
              "description": "Must equal exactly $0.00 before reconciliation can be saved/posted."
            }
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
          "navigation": [
            "Cash Management",
            "Transactions",
            "Account Transfers / Sweeps"
          ],
          "purpose": "Record daily or monthly automated bank sweeps between depository accounts and main concentration/operating accounts.",
          "whyRecordsAreHere": [
            "Properties use depository accounts for local resident check deposits, which banks sweep nightly into central concentration accounts."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Source Account",
              "description": "Depository Account."
            },
            {
              "name": "Destination Account",
              "description": "Operating Account."
            },
            {
              "name": "Transfer Amount & Date",
              "description": "Must match bank sweep debit/credit exactly."
            }
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
};
