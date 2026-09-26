// RealPage Module: Job Cost & Reserves
// Source Manuals: manuals_markdown/06_jobcost_capex_reserves.md

export const jobcostModule = {
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
          "navigation": [
            "General Ledger",
            "Job Cost & Reserves",
            "Replacement Reserves / Capital Draws"
          ],
          "purpose": "Compile paid capital invoices, proof of payment (cleared checks), and contractor lien waivers to request reimbursement from mortgage lender reserves.",
          "whyRecordsAreHere": [
            "Multifamily owners escrow funds monthly with lenders for major capital upgrades (roofs, HVAC, asphalt, unit turns)."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Job Code / Project ID",
              "description": "Unique capital improvement project number."
            },
            {
              "name": "Eligible Invoices",
              "description": "Invoices meeting capital threshold (> $1,000 / life > 1 year)."
            },
            {
              "name": "Lien Waiver Status",
              "description": "Verified unconditional final lien waiver attached."
            }
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
};
