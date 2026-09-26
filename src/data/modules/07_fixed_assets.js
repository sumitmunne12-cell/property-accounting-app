// RealPage Module: Fixed Assets
// Source Manuals: manuals_markdown/07_fixed_assets.md

export const fixedAssetsModule = {
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
          "navigation": [
            "General Ledger",
            "Fixed Assets",
            "Depreciation Processing"
          ],
          "purpose": "Calculate and post monthly depreciation expense for buildings, building improvements, furniture, appliances, and land improvements.",
          "whyRecordsAreHere": [
            "Capitalized assets lose economic value over time and must be depreciated under US GAAP straight-line rules."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Asset Class",
              "description": "Building (27.5 yrs), Land Improvements (15 yrs), FF&E (5-7 yrs)."
            },
            {
              "name": "Depreciation Method",
              "description": "Straight-line, Half-Year Convention."
            }
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
};
