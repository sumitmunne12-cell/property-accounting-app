// RealPage Module: Accounts Receivable
// Source Manuals: manuals_markdown/04_accounts_receivable.md

export const arModule = {
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
          "navigation": [
            "Accounts Receivable",
            "Reports",
            "Delinquency Aging Report"
          ],
          "purpose": "Track past-due resident balances aged 30, 60, and 90+ days to calculate bad debt reserves and initiate legal notices.",
          "whyRecordsAreHere": [
            "Residents who missed rent payments, failed to pay utility rebills, or incurred uncollected lease termination fees.",
            "Moved-out residents with damage charges exceeding their security deposit."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Resident Status",
              "description": "Current, Notice, Eviction, Moved Out."
            },
            {
              "name": "Aging Columns",
              "description": "Current, 30-59 days, 60-89 days, 90+ days."
            },
            {
              "name": "Exclude Inactive",
              "description": "Exclude residents whose accounts have been sent to third-party collections."
            }
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
          "navigation": [
            "Accounts Receivable",
            "Reports",
            "Rent Roll Summary / GPR Schedule"
          ],
          "purpose": "Reconcile the physical property rent roll with the general ledger revenue accounts (Gross Potential Rent, Vacancy, Concessions).",
          "whyRecordsAreHere": [
            "Multifamily properties bill rent at 100% market rent (GPR) and record vacancies, employee discounts, and concessions as contra-revenue."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "As of Date",
              "description": "Last day of the accounting month."
            },
            {
              "name": "Summary Mode",
              "description": "Displays total units, occupied units, leased units, and total market rent."
            }
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
};
