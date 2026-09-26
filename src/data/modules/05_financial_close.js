// RealPage Module: Financial Close
// Source Manuals: manuals_markdown/05_financial_close.md

export const closeModule = {
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
          "navigation": [
            "General Ledger",
            "Close Management",
            "Period Close Dashboard"
          ],
          "purpose": "Enforce strict accounting period cutoffs by locking subledgers sequentially to prevent unauthorized backdating.",
          "whyRecordsAreHere": [
            "Audit requirement. Once AP, AR, and Cash are verified, they must be locked so site teams cannot post late entries."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Period",
              "description": "Target accounting month/year (e.g. 08/2026)."
            },
            {
              "name": "Module Lock Status",
              "description": "Open, Staged, Closed, Locked."
            }
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
};
