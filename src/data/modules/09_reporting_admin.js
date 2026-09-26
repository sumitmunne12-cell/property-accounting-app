// RealPage Module: Reporting & Admin
// Source Manuals: manuals_markdown/09_reporting_admin.md

export const reportingAdminModule = {
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
          "navigation": [
            "Reporting Portal",
            "Packages",
            "Monthly Operating Report (MOR)"
          ],
          "purpose": "Compile the complete, standardized investor financial package (Balance Sheet, Income Statement, Cash Flow, Bank Recs, Rent Roll).",
          "whyRecordsAreHere": [
            "Standard monthly deliverable delivered to property owners, institutional clients (Goldman Sachs, OSSO), and lenders."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Reporting Period",
              "description": "Target month (e.g. August 2026)."
            },
            {
              "name": "Package Template",
              "description": "Investor specific template (e.g. GS Standard, Magnolia Core)."
            }
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
};
