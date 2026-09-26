// RealPage Module: Accounts Payable
// Source Manuals: manuals_markdown/02_accounts_payable.md

export const apModule = {
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
          "navigation": [
            "Accounts Payable",
            "Invoices",
            "Manage Invoices",
            "Status: Exception"
          ],
          "purpose": "Quarantine and resolve vendor invoices that failed automated validation rules (PO variance, missing ROG, vendor block, invalid GL).",
          "whyRecordsAreHere": [
            "PO line-item variance exceeds 5% or $100 dollar threshold.",
            "Goods have not been marked as received in the system (Missing Receipt of Goods / ROG).",
            "Vendor has expired Certificate of Insurance (COI) or missing W-9 tax identification form.",
            "Invoice distribution line contains an inactive, closed, or restricted GL code.",
            "System identified a duplicate invoice number from the same vendor within the past 12 months."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Exception Code",
              "description": "Standard RealPage code explaining the exact rule failure (e.g., EX_PO_VAR, EX_NO_ROG, EX_VEND_HOLD)."
            },
            {
              "name": "Invoice Status",
              "description": "Displays quarantine status: Exception - Action Required."
            },
            {
              "name": "Property ID",
              "description": "Filter by specific multifamily asset code."
            },
            {
              "name": "Amount & Variance",
              "description": "Shows invoice total vs PO authorized amount."
            }
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
          "navigation": [
            "Accounts Payable",
            "Invoices",
            "Manage Invoices"
          ],
          "purpose": "Central dashboard to search, view, edit, reclassify, or track the real-time workflow status of all property vendor invoices.",
          "whyRecordsAreHere": [
            "Every invoice scanned, imported via EDI, or manually entered by site staff or offshore processing teams resides here."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Status Filter",
              "description": "Pending Approval, Approved, Paid, Exception, Void, In Process."
            },
            {
              "name": "Invoice Date Range",
              "description": "Crucial for isolating invoices by target accounting period."
            },
            {
              "name": "Vendor Search",
              "description": "Look up by vendor trade name or RealPage vendor ID."
            }
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
          "navigation": [
            "Accounts Payable",
            "Payments",
            "Payment Processing",
            "Select Invoices"
          ],
          "purpose": "Select approved vendor bills and resident security deposit refunds to prepare physical check batches, ACH files, or wire transfers.",
          "whyRecordsAreHere": [
            "Invoices that have completed all approval tiers (1st, 2nd, and Accounting) and reached their due date appear in the eligible payment pool."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Payment Date",
              "description": "The check or ACH value date posted to the general ledger."
            },
            {
              "name": "Bank Account",
              "description": "Operating Account from which funds will be disbursed."
            },
            {
              "name": "Due Date Cutoff",
              "description": "Filters invoices due on or before specified calendar date."
            }
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
          "navigation": [
            "Accounts Payable",
            "Payments",
            "Manage Payments",
            "Void Payment"
          ],
          "purpose": "Void lost, expired, returned, or erroneous vendor checks and re-issue or restore the underlying invoice.",
          "whyRecordsAreHere": [
            "Checks returned as undeliverable, stale-dated (>90 days), or lost in transit by vendors or past residents."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Void Date",
              "description": "Must be within the current open accounting period; never backdate into closed periods."
            },
            {
              "name": "Void Reason",
              "description": "Required audit note (e.g., Stale Dated, Wrong Payee Name, Stop Payment Placed)."
            },
            {
              "name": "Re-issue Option",
              "description": "Choose whether to immediately generate a new check or restore invoice to unpaid status."
            }
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
          "navigation": [
            "Accounts Payable",
            "Reports",
            "Invoice Exception Report"
          ],
          "purpose": "Executive report listing all invoices currently blocked from payment, grouped by exception reason and property.",
          "whyRecordsAreHere": [
            "Used by accountants, PMs, and onshore managers during weekly AP reviews to ensure no critical bills are stalled."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "Property Selection",
              "description": "Run by individual asset or portfolio-wide."
            },
            {
              "name": "Aging Buckets",
              "description": "0-30 days, 31-60 days, 61-90 days, 90+ days."
            },
            {
              "name": "Exception Category",
              "description": "PO Variance, ROG, Compliance, GL Mismatch."
            }
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
          "navigation": [
            "Accounts Payable",
            "Reports",
            "Vendor Aging Report"
          ],
          "purpose": "Displays all unpaid vendor invoices categorized into 30, 60, 90, and 120+ day aging columns.",
          "whyRecordsAreHere": [
            "Essential month-end schedule to tie out the AP subledger to the General Ledger AP control account."
          ],
          "keyFieldsAndFilters": [
            {
              "name": "As of Date",
              "description": "Always set to last calendar day of the accounting month."
            },
            {
              "name": "Summary vs Detail",
              "description": "Detail view shows individual invoice numbers and dates."
            }
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
};
