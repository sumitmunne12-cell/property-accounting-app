# Autonomous RealPage & Yardi Mastery Data Generation Guide
> **Audience:** AI Coding Agent / Language Model (Claude 3.5, GPT-4o, Gemini 1.5 Pro)
> **Workspace:** `02-property-accounting`
> **Objective:** Completely flesh out all 9 accounting module data files with 100% software screen and button coverage, mapped to the strict 5-point mastery framework.

---

## 1. Context & Architecture

The user is an offshore US multifamily real estate property accountant (managing institutional portfolios like Goldman Sachs, Magnolia Capital, OSSO) who needs complete operational mastery over **RealPage Financial Suite** and **Yardi Voyager**.

We have converted all **57 official RealPage manuals (12,793 pages)** into 9 clean, layout-aware Markdown files inside:
📂 `02-property-accounting/manuals_markdown/`

Your job is to read each Markdown file and write/update the corresponding JavaScript module file in:
📂 `02-property-accounting/src/data/modules/`

All 9 files are loaded on demand by `02-property-accounting/src/data/moduleLoader.js` (one lazy chunk per module). Search and lists run on `src/data/searchIndex.json` and `src/data/moduleManifest.json`, which `npm run build:modules` regenerates from the module files.

---

## 2. File Mapping Reference

| Step | Source Markdown File | Target Destination File | Export Name |
| :--- | :--- | :--- | :--- |
| **1** | `manuals_markdown/01_general_ledger.md` | `src/data/modules/01_general_ledger.js` | `glModule` |
| **2** | `manuals_markdown/02_accounts_payable.md` | `src/data/modules/02_accounts_payable.js` | `apModule` |
| **3** | `manuals_markdown/03_cash_management.md` | `src/data/modules/03_cash_management.js` | `cashModule` |
| **4** | `manuals_markdown/04_accounts_receivable.md` | `src/data/modules/04_accounts_receivable.js` | `arModule` |
| **5** | `manuals_markdown/05_financial_close.md` | `src/data/modules/05_financial_close.js` | `closeModule` |
| **6** | `manuals_markdown/06_jobcost_capex_reserves.md` | `src/data/modules/06_jobcost_capex_reserves.js` | `jobcostModule` |
| **7** | `manuals_markdown/07_fixed_assets.md` | `src/data/modules/07_fixed_assets.js` | `fixedAssetsModule` |
| **8** | `manuals_markdown/08_budgeting_forecasting.md` | `src/data/modules/08_budgeting_forecasting.js` | `budgetingModule` |
| **9** | `manuals_markdown/09_reporting_admin.md` | `src/data/modules/09_reporting_admin.js` | `reportingAdminModule` |

Also refer to `manuals_markdown/master_screen_catalog.json` for the comprehensive checklist of all 12,520 indexed screens, chapters, and topics.

---

## 3. Strict Schema Specification

Every module file **MUST** export its named module object with `submodules` and `screens`.
Every screen **MUST** include all 10 fields below:

```javascript
export const [exportName] = {
  id: "module_id",
  title: "Module Title",
  shortCode: "CODE",
  icon: "ionicon-name", // e.g. 'book-outline', 'receipt-outline', 'wallet-outline'
  color: "#HEX_COLOR",  // e.g. '#10B981', '#38BDF8', '#F59E0B'
  description: "Comprehensive operational overview.",
  submodules: [
    {
      id: "submodule_unique_id",
      title: "Menu / Feature Group Name",
      screens: [
        {
          id: "scr_unique_snake_case_id",
          name: "Exact Screen, Report, or Toolbar Button Name",
          navigation: [
            "Module",
            "Submenu",
            "Screen",
            "Action Button"
          ],
          purpose: "Detailed explanation of what this screen or button does, date ranges, parameters, and why it exists in US property accounting.",
          whyRecordsAreHere: [
            "Operational / business reason 1 why an accountant navigates here or why records appear here.",
            "Operational / business reason 2 (e.g. month-end true-up, vendor exception, bank mismatch)."
          ],
          keyFieldsAndFilters: [
            {
              name: "Field or Parameter Name",
              description: "What it does, valid inputs, or dropdown options."
            }
          ],
          accountantActionSOP: [
            "1. Exact click-by-click step instruction.",
            "2. Verification or parameter selection.",
            "3. Action button click (e.g. Save, Post, Duplicate, Void).",
            "4. Critical warning or check (e.g. RealPage does not auto-check duplicate IDs)."
          ],
          glAccountingImpact: "Exact Debits and Credits (DR / CR), affected accounts (e.g. DR 6320 Repairs / CR 2110 Accruals), posting books (GAAP vs Tax), or 'No GL impact until posted'.",
          whatHappensNext: "Downstream workflow routing, subledger posting status, next reviewer, or affected financial statement (Balance Sheet, Income Statement).",
          yardiEquivalent: "Exact equivalent screen or workflow in Yardi Voyager (e.g. Yardi: Financial > Journal Entry > Copy Batch).",
          pdfManualSource: "Exact manual title and page number cited from the markdown file (e.g. RP Accounting General Ledger User Guide.pdf, Page 405)"
        }
      ]
    }
  ]
};
```

---

## 4. Worked Example: General Ledger Screen

```javascript
{
  id: "scr_gl_duplicate_je",
  name: "Duplicate Journal Entry to Another Book",
  navigation: [
    "Applications",
    "General Ledger",
    "All",
    "Journal Entry",
    "View Transactions",
    "View",
    "Duplicate"
  ],
  purpose: "Copies header, distribution lines, amounts, and descriptions of an existing journal entry directly into a different accounting book (e.g., from 'Provisional' to 'Accrual/GAAP' or 'Tax') to test entry impact or reclassify entries across reporting ledgers.",
  whyRecordsAreHere: [
    "Accountant created a preliminary or adjusting entry in a provisional book to test impact on financial statements before posting to the main book.",
    "Recurring quarterly tax adjustments or amortization entries that must be duplicated into the Tax book.",
    "Reclassifying prior-period entries without re-keying multi-line allocations."
  ],
  keyFieldsAndFilters: [
    { name: "Target Book", description: "Select the destination book: GAAP, Tax, or User-Defined Provisional book." },
    { name: "Target Journal", description: "Select destination journal code (e.g., GJ - General Journal, ADJ - Adjusting Journal)." },
    { name: "Reference Number", description: "Transaction ID. Note: RealPage does NOT auto-verify duplicate reference numbers; accountant must verify uniqueness." }
  ],
  accountantActionSOP: [
    "1. Navigate to Applications > General Ledger > All > Journal Entry and select the book containing the source entry.",
    "2. Click 'View Transactions' to open the transaction register.",
    "3. Locate the entry, click 'View', and then click the 'Duplicate' toolbar button at the top.",
    "4. In the 'Duplicate To' dialog, select the Target Book and Target Journal.",
    "5. Click 'Continue'. RealPage copies all line items into the target journal in Draft/Unposted status.",
    "6. Open the target journal, review DR/CR distribution, update the Transaction Reference ID, and click 'Submit' or 'Post'."
  ],
  glAccountingImpact: "No immediate GL change in target book until posted. Upon posting: generates mirrored DR/CR lines in the target book while preserving source book records.",
  whatHappensNext: "Entry lands in the Unposted Journal Transactions queue of the target book awaiting approval or batch posting.",
  yardiEquivalent: "Yardi Voyager: Financial > Journal Entry > Find Batch > Select Entry > 'Copy' button.",
  pdfManualSource: "RP Accounting General Ledger User Guide.pdf, Page 404-406"
}
```

---

## 5. Execution Rules (Zero-Shortcut Policy)

1. **NO Placeholders:** Never output `// ... add remaining screens here` or `/* rest of fields */`. Every screen in the module must be fully articulated.
2. **True Software Hierarchy:** Group screens by their actual RealPage menu structure (e.g., Invoices, Approvals, Check Runs, Bank Reconciliations, Journal Entries, Prepaids, Allocations).
3. **Valid JavaScript Export:** Ensure every file starts with `export const [exportName] = {` and ends with `};`. Do not leave syntax errors.
4. **Preserve Yardi & Citations:** Always populate `yardiEquivalent` and `pdfManualSource`. Offshore accountants rely on these two fields to transition between software platforms.
