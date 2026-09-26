// Exception Triage Playbook for RealPage & Yardi Property Accounting
// Real-world operational troubleshooting matrix for offshore property accountants

export const EXCEPTION_PLAYBOOKS = [
  {
    id: 'ex_po_variance',
    code: 'EX_PO_VAR',
    title: 'PO Price or Quantity Variance (> 5%)',
    severity: 'High',
    software: 'Both (RealPage & Yardi)',
    frequency: 'Very Common (Daily)',
    navigation: {
      realpage: ['Accounts Payable', 'Invoices', 'Manage Invoices', 'Exception Code: EX_PO_VAR'],
      yardi: ['AP', 'Invoice Processing', 'PO Invoices with Variance']
    },
    symptom: 'Invoice total or line-item price exceeds the approved Purchase Order amount by more than 5% or $100.',
    whyItHappens: [
      'Vendor added unanticipated delivery, freight, or emergency trip charges.',
      'Contractor encountered unexpected scope additions during turnover (e.g. extra drywall repair).',
      'Site team created PO with estimated pricing before receiving the vendor’s final binding proposal.'
    ],
    whatTheReportIsFor: 'Prevents unauthorized spending and ensures contractors cannot bill beyond authorized contract limits without explicit management review.',
    resolutionSOP: [
      'Open invoice and inspect the PO variance audit tab in RealPage/Yardi.',
      'Compare vendor line items against original PO lines to isolate exact dollar discrepancy.',
      'If variance is legitimate: notify Property Manager to initiate a PO Change Order / Revision in RealPage Purchasing.',
      'If variance is erroneous: contact vendor for revised invoice or issue a short-pay adjustment.',
      'Once the PO revision is approved by Regional PM, click "Re-evaluate Exception" to clear invoice.'
    ],
    downstreamImpact: {
      glPosting: 'DR Operating Expense (e.g. 6150-00 Turn Painting) / CR 2000-00 (Accounts Payable).',
      workflowNextStep: 'Invoice advances to PM 1st Level Approval Workbench.',
      affectedReports: ['Open Purchase Order Report', 'Cash Requirements Report', 'Job Cost / Budget Variance']
    },
    proTip: 'Never override a PO variance without a documented PM Change Order. Unapproved overrides are severe audit findings during investor reviews.'
  },
  {
    id: 'ex_missing_rog',
    code: 'EX_NO_ROG',
    title: 'Missing Receipt of Goods (ROG)',
    severity: 'High',
    software: 'Both (RealPage & Yardi)',
    frequency: 'Very Common (Daily)',
    navigation: {
      realpage: ['Accounts Payable', 'Purchasing', 'Receipt of Goods', 'Pending Receipts'],
      yardi: ['Purchasing', 'PO Receipts', 'Unreceived Invoices']
    },
    symptom: 'Invoice is entered and matched to a PO, but goods or services have not been marked as received by the property team.',
    whyItHappens: [
      'Appliances, paint, or maintenance supplies were physically delivered to property, but site staff forgot to click "Receive" in the system.',
      'Service contractor completed HVAC or roof repair, but the maintenance supervisor hasn’t verified completion.',
      'Partial delivery: only 5 of 10 refrigerators were delivered.'
    ],
    whatTheReportIsFor: 'Ensures the property never pays for merchandise or contractor work that was never actually received at the physical asset.',
    resolutionSOP: [
      'Extract list of pending ROG invoices older than 24 hours.',
      'Send daily email notification to Maintenance Supervisor and PM with PO#, Vendor, and Item Description.',
      'Site staff inspects loading dock / physical work and enters digital receiving ticket with delivery slip image.',
      'Upon receiving entry, RealPage automated batch job automatically clears the ROG exception within 15 minutes.'
    ],
    downstreamImpact: {
      glPosting: 'Upon ROG receipt: DR 1300-00 Inventory or Expense / CR 2050-00 Accrued PO Clearing. Upon payment: DR 2050-00 / CR Cash.',
      workflowNextStep: 'Invoice moves into PM Approval Queue.',
      affectedReports: ['Pending ROG Report', 'Unreceived PO Aging', 'Weekly AP Check Run']
    },
    proTip: 'Check with site teams on Thursday mornings so ROGs are completed before Friday check run cut-off.'
  },
  {
    id: 'ex_vendor_compliance',
    code: 'EX_VEND_HOLD',
    title: 'Vendor Compliance Block (Missing W-9 or Expired COI)',
    severity: 'Critical',
    software: 'Both (RealPage & Yardi)',
    frequency: 'Common (Weekly)',
    navigation: {
      realpage: ['Accounts Payable', 'Vendors', 'Vendor Compliance & Holds'],
      yardi: ['Vendor Management', 'Compliance', 'Vendor Hold Status']
    },
    symptom: 'Invoice cannot be approved or scheduled for payment because the vendor profile is flagged as Non-Compliant.',
    whyItHappens: [
      'Vendor’s General Liability or Workers Compensation Certificate of Insurance (COI) expired.',
      'New vendor was set up without an official IRS Form W-9 or Taxpayer Identification Number (TIN).',
      'Insurance policy coverage falls below ownership threshold (e.g. less than $1,000,000 occurrence).'
    ],
    whatTheReportIsFor: 'Protects the property ownership entity against liability lawsuits, IRS 1099 penalties, and uninsured damage claims.',
    resolutionSOP: [
      'Check RealPage Vendor Compliance module to see the exact expiration date or missing document.',
      'Send urgent compliance notice to the vendor contact and copy the Property Manager.',
      'Request updated ACORD Certificate of Insurance naming the Property Ownership LLC as Additional Insured.',
      'Once received, upload document to Vendor Compliance portal or submit to Compliance Administrator.',
      'Remove hold tag; invoice immediately returns to eligible payment queue.'
    ],
    downstreamImpact: {
      glPosting: 'Invoice can be approved to GL (DR Expense / CR AP), but payments are locked from check/ACH release.',
      workflowNextStep: 'Released to Cash Requirements register once compliance is verified active.',
      affectedReports: ['Vendor Compliance Audit', '1099 Year-End Tax Report', 'Unpaid Vendor Hold Report']
    },
    proTip: 'Never approve a compliance override for roofing, tree trimming, or major plumbing vendors due to extreme insurance liability.'
  },
  {
    id: 'ex_invalid_gl',
    code: 'EX_INV_GL',
    title: 'Invalid or Closed GL Account / Cost Center',
    severity: 'Medium',
    software: 'Both (RealPage & Yardi)',
    frequency: 'Common (Month-End)',
    navigation: {
      realpage: ['Accounts Payable', 'Invoices', 'Distribution Line Coding'],
      yardi: ['AP', 'Invoice Details', 'Account Code Error']
    },
    symptom: 'Invoice distribution line fails posting with error "GL Account Inactive", "Not Valid for Property", or "Invalid Department".',
    whyItHappens: [
      'Site staff manually typed an obsolete GL code that was retired during chart of accounts standardization.',
      'Wrong property code entered (e.g. invoice for Property A coded to Property B).',
      'Capital improvement item coded to operating expense GL that is restricted for site staff.'
    ],
    whatTheReportIsFor: 'Ensures financial data integrity, prevents orphaned transactions, and enforces corporate chart of accounts governance.',
    resolutionSOP: [
      'Open invoice in RealPage AP > Manage Invoices > Edit Distribution.',
      'Cross-reference current Master Chart of Accounts mapping spreadsheet.',
      'Replace obsolete GL code with current active account (e.g. replace 6120-00 with 6100-15 Turn Repairs).',
      'Verify department and job cost codes; save distribution changes.',
      'Click "Validate & Save" to re-queue for approval.'
    ],
    downstreamImpact: {
      glPosting: 'DR Correct Expense GL / CR 2000-00 Accounts Payable.',
      workflowNextStep: 'Reroutes through Approval Workbench if new GL department has different approver.',
      affectedReports: ['Trial Balance', 'Budget vs Actual Income Statement', 'General Ledger Audit Trail']
    },
    proTip: 'Keep a laminated or bookmarked Chart of Accounts cheat sheet on your screen for instant lookup of R&M vs Capex accounts.'
  },
  {
    id: 'ex_duplicate_invoice',
    code: 'EX_DUP_INV',
    title: 'Duplicate Invoice Number Warning',
    severity: 'Critical',
    software: 'Both (RealPage & Yardi)',
    frequency: 'Occasional (Weekly)',
    navigation: {
      realpage: ['Accounts Payable', 'Invoices', 'Duplicate Invoice Inquiry'],
      yardi: ['AP', 'Invoices', 'Duplicate Invoice Check']
    },
    symptom: 'System flags: "Warning: An invoice with number [INV#] already exists for this vendor."',
    whyItHappens: [
      'Vendor emailed invoice twice or mailed physical copy after submitting PDF.',
      'Site staff uploaded invoice through portal while automated OCR / EDI already imported it.',
      'Vendor billed a recurring monthly service using the same base invoice number without adding the month.'
    ],
    whatTheReportIsFor: 'Critical anti-fraud and financial control preventing double-payment to vendors.',
    resolutionSOP: [
      'Search vendor invoice history in RealPage AP for the matching invoice number.',
      'Inspect both invoice images side-by-side (amounts, billing dates, line item descriptions).',
      'If true duplicate: void/reject the duplicate invoice immediately with reason "Duplicate of Invoice #[X] paid on [Date]".',
      'If legitimate separate bill (e.g. utility with same account number): verify bill date range, adjust invoice number suffix (e.g. INV-AUG26), and document explanation.'
    ],
    downstreamImpact: {
      glPosting: 'Prevents duplicate debit to expense and credit to cash.',
      workflowNextStep: 'Duplicate invoice deleted or voided; original invoice proceeds.',
      affectedReports: ['Invoice Register', 'Duplicate Payment Audit', 'Cash Book']
    },
    proTip: 'Utility companies often use the billing date or meter reading as invoice numbers. Always verify service period dates before assuming it is a duplicate.'
  },
  {
    id: 'ex_unbalanced_bank_rec',
    code: 'EX_UNBAL_REC',
    title: 'Bank Reconciliation Out-of-Balance Discrepancy',
    severity: 'Critical',
    software: 'Both (RealPage & Yardi)',
    frequency: 'Common (Month-End Close)',
    navigation: {
      realpage: ['Cash Management', 'Reconciliations', 'Bank Reconciliation', 'Discrepancy Tab'],
      yardi: ['Financials', 'Cash Management', 'Bank Reconciliation Summary']
    },
    symptom: 'Bank Reconciliation screen shows "Difference to Balance" is NOT $0.00 (e.g. Difference: $245.50).',
    whyItHappens: [
      'Unrecorded bank fees, merchant service charges, or wire debit fees.',
      'Check cleared the bank for a different amount than written (transposition or bank encoding error).',
      'Resident NSF return check was not reversed in internal books.',
      'Manual journal entry was posted directly to Cash GL account outside the Cash Management module.'
    ],
    whatTheReportIsFor: 'Substantiates cash balance on the Balance Sheet; auditors consider out-of-balance bank recs a material internal control deficiency.',
    resolutionSOP: [
      'Calculate the exact variance: (Bank Statement Balance - Total Outstanding Checks + Total Deposits in Transit) - Book Balance.',
      'Divide difference by 9: if evenly divisible, search for transposed numbers (e.g. $45 vs $54).',
      'Search bank statement for single transactions matching the exact variance amount.',
      'Check for manual Journal Entries posted to the Cash GL account (1010-00) that bypassed Cash Management.',
      'Post adjusting journal entry for valid bank fees/interest, or correct book errors.',
      'Verify Difference equals exactly $0.00; sign off reconciliation.'
    ],
    downstreamImpact: {
      glPosting: 'DR 6850-00 (Bank Charges) / CR 1010-00 (Cash) to bring book balance in line with bank.',
      workflowNextStep: 'Reconciliation approved by Onshore Reviewer; included in MOR package.',
      affectedReports: ['Bank Reconciliation Report', 'Balance Sheet Cash Schedule', 'Cash Flow Statement']
    },
    proTip: 'Never post a journal entry directly to GL 1010-00 without using the Bank Transactions screen, or your subledger will forever be out of sync with your GL.'
  }
];
