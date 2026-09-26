// RealPage ↔ Yardi Voyager "Rosetta Stone"
//
// The 50 daily, periodic and month-end operations an offshore multifamily accountant performs.
// Each entry links the RealPage side to a catalog screen (`realpage.screenId`); the RealPage
// navigation shown in the app is read from that screen, so it always matches the manual.
// Yardi Voyager paths use standard Voyager 7S menu names; menus vary by version, role and
// client customization, so confirm the exact path in each client's Voyager instance.

export const ROSETTA_DISCLAIMER =
  'Yardi Voyager menu labels differ by version (7S / 8), role and client menu customization. Paths shown are the standard Voyager menus; confirm the exact label in each client\'s instance.';

export const ROSETTA_CATEGORIES = [
  'All',
  'Accounts Payable',
  'General Ledger',
  'Cash & Banking',
  'Accounts Receivable',
  'Capital & Assets',
  'Close & Reporting',
];

export const ROSETTA_CADENCES = ['All', 'Daily', 'Weekly', 'Monthly', 'Quarterly / Annual'];

export const ROSETTA_OPERATIONS = [
  // ───────────────────────────── ACCOUNTS PAYABLE ─────────────────────────────
  {
    id: 'ros_invoice_entry',
    title: 'Vendor Invoice Entry',
    category: 'Accounts Payable',
    cadence: 'Daily',
    realpage: {
      name: 'Add A/P Invoice',
      screenId: 'scr_ap_adding_an_a_p_invoice_manually',
      howItWorks: 'Enter the header (vendor, invoice #, dates, location), then Invoice Entries lines with G/L account, location/department and amount. Post, or Submit when A/P approvals are enabled.',
    },
    yardi: {
      name: 'AP Enter Batch (Payable / Payable Batch)',
      navigation: ['Payables', 'Payable Batch', 'Add'],
      howItWorks: 'Create a payable batch (post month + batch description), add each payable with vendor, property, GL account and amount; post the batch or route through PAYscan workflow.',
    },
    terminology: [
      { realpage: 'A/P invoice', yardi: 'Payable', note: 'Same document; Yardi calls every AP document a "payable".' },
      { realpage: 'Location', yardi: 'Property', note: 'RealPage location dimension = Yardi property code.' },
      { realpage: 'A/P summary / posting period', yardi: 'Post Month', note: 'Both control which accounting period the entry lands in.' },
    ],
    pitfalls: [
      'Yardi defaults the post month from the property; RealPage defaults the posting date — check both against the service period for accrual cut-off.',
      'RealPage warns on duplicate vendor invoice numbers only when configured; always search the vendor history before posting in either system.',
      'Yardi "Notes" and RealPage "Description" feed different reports — put the service period in the line memo in both.',
    ],
    glImpact: 'DR 6xxx Operating Expense / CR 2010 Accounts Payable in both systems.',
  },
  {
    id: 'ros_three_way_match',
    title: 'Invoice Entry & 3-Way Match (PO – Receipt – Invoice)',
    category: 'Accounts Payable',
    cadence: 'Daily',
    realpage: {
      name: 'Invoice Package / PO-matched A/P invoice',
      screenId: 'scr_ap_creating_a_p_invoice_packages',
      howItWorks: 'Build an A/P invoice package or convert the received purchase order to an A/P invoice so line quantities and prices carry from the PO and receipt; variances beyond tolerance hold the invoice for approval.',
    },
    yardi: {
      name: 'PO Invoice Match (Procure to Pay)',
      navigation: ['Purchasing', 'Purchase Order', 'Receive', 'Invoice (Match to PO)'],
      howItWorks: 'Receive the PO, then in PAYscan match the scanned invoice to the PO/receipt lines; over-tolerance lines route to the PO approver before the payable is created.',
    },
    terminology: [
      { realpage: 'Receiving goods (receipt)', yardi: 'PO Receipt', note: 'Both are the "ROG" step of the 3-way match.' },
      { realpage: 'Invoice package', yardi: 'Invoice Register / Batch', note: 'Grouping of invoices for review and posting.' },
      { realpage: 'Tolerance (Spend Management)', yardi: 'PO variance tolerance', note: 'Percent/amount over PO allowed before approval.' },
    ],
    pitfalls: [
      'Receiving the full PO when only part was delivered lets the invoice pass the match — receive actual quantities.',
      'Converting a PO that was already invoiced manually creates a duplicate payable in both systems.',
      'Change orders must be approved on the PO before matching; editing the invoice amount instead breaks the audit trail.',
    ],
    glImpact: 'Receipt: no GL (unless receipt accruals are enabled). Matched invoice: DR 6xxx or 1410 CIP / CR 2010 Accounts Payable.',
  },
  {
    id: 'ros_invoice_scanning',
    title: 'Scanned / AI Invoice Capture',
    category: 'Accounts Payable',
    cadence: 'Daily',
    realpage: {
      name: 'AI-Invoice Scanning & Queue',
      screenId: 'scr_ap_ai_invoice_queue',
      howItWorks: 'Invoices arrive by email/upload, AI extracts vendor, amounts and coding; accountant validates the AI-Invoice Queue and converts items to A/P invoices.',
    },
    yardi: {
      name: 'PAYscan Invoice Register',
      navigation: ['PAYscan', 'Invoice Register', 'Process'],
      howItWorks: 'Scanned invoices land in the Invoice Register; the processor keys or confirms OCR data, codes it, and releases it to workflow.',
    },
    terminology: [
      { realpage: 'AI-Invoice Queue', yardi: 'PAYscan Invoice Register', note: 'Holding area before a payable exists.' },
      { realpage: 'Full Service (outsourced processing)', yardi: 'Yardi Invoice Processing Services', note: 'Vendor keying service in each suite.' },
    ],
    pitfalls: [
      'OCR misreads invoice dates (MM/DD vs DD/MM) — verify service period before approving.',
      'Multi-property invoices need manual allocation lines in both tools; AI/OCR codes them to a single property.',
      'Deleting from the scan queue does not notify the vendor — reply to the vendor for rejected documents.',
    ],
    glImpact: 'None until the invoice is created and posted: then DR expense / CR 2010 A/P.',
  },
  {
    id: 'ros_invoice_approval',
    title: 'Invoice Approval Workflow',
    category: 'Accounts Payable',
    cadence: 'Daily',
    realpage: {
      name: 'Approval Workbench (Approval Policy Manager)',
      screenId: 'scr_ap_viewing_the_approval_workbench',
      howItWorks: 'Approval policies (amount, property, vendor, job type) route invoices to approvers; approvers act in the Approval Workbench; the final approval posts.',
    },
    yardi: {
      name: 'PAYscan Workflow Approvals',
      navigation: ['PAYscan', 'Invoice Register', 'Workflow', 'Approve'],
      howItWorks: 'Sequential workflow steps (site entry → PM → RPM/asset manager → accounting) set in workflow setup; each approver approves in the register or "My Approvals".',
    },
    terminology: [
      { realpage: 'Approval policy / level', yardi: 'Workflow / Step', note: 'RealPage routes by rules; Yardi by numbered workflow steps.' },
      { realpage: 'Decline', yardi: 'Reject / Send back', note: 'Returns the document to the submitter.' },
      { realpage: 'Delegate', yardi: 'Workflow proxy', note: 'Temporary approver during absence.' },
    ],
    pitfalls: [
      'RealPage posts on final approval — a Decline after partial approval does not reverse anything; in Yardi the payable may already exist in an unposted batch.',
      'Approver lacking location/property access sees an empty workbench in RealPage — fix the user\'s entity/location restrictions, not the policy.',
      'Never self-approve: both systems allow admins to bypass — auditors test for it.',
    ],
    glImpact: 'Approval itself posts nothing; final approval releases DR expense / CR 2010 A/P.',
  },
  {
    id: 'ros_invoice_reclass',
    title: 'Reclassify an Invoice (Change GL Coding)',
    category: 'Accounts Payable',
    cadence: 'Weekly',
    realpage: {
      name: 'Reclassify A/P Invoice',
      screenId: 'scr_ap_reclassifying_one_invoice',
      howItWorks: 'Open the posted invoice and click Reclassify to change G/L accounts or dimensions in an open period; A/P, amounts and payments are untouched.',
    },
    yardi: {
      name: 'Payable Reclass / Journal Entry',
      navigation: ['Financials', 'Journal Entry', 'Add (reclass)'],
      howItWorks: 'Paid payables are generally corrected with a reclass JE (DR correct account / CR wrong account); unpaid payables can be reversed and re-entered.',
    },
    terminology: [
      { realpage: 'Reclassify', yardi: 'Reclass JE', note: 'RealPage edits the invoice distribution; Yardi typically uses a separate JE.' },
    ],
    pitfalls: [
      'RealPage blocks reclass into a closed period — reclass in the current period and document it.',
      'Yardi reclass JEs do not change the payable detail, so the payable register still shows the old account; note the JE number on the payable.',
      'Reclassing between properties/entities creates intercompany balances — check Due To/Due From afterwards.',
    ],
    glImpact: 'DR correct 6xxx account / CR original 6xxx account; A/P unchanged.',
  },
  {
    id: 'ros_vendor_credit',
    title: 'Vendor Credit Memo / Debit Adjustment',
    category: 'Accounts Payable',
    cadence: 'Weekly',
    realpage: {
      name: 'A/P Credit or Debit Adjustment',
      screenId: 'scr_ap_adding_an_a_p_credit_or_debit_adjustment',
      howItWorks: 'Enter an A/P adjustment (credit reduces what you owe) and apply it to open invoices during payment.',
    },
    yardi: {
      name: 'Negative Payable (Credit)',
      navigation: ['Payables', 'Payable', 'Add (negative amount)'],
      howItWorks: 'Enter a payable with a negative amount for the vendor; check processing nets it against open payables for the same vendor/property.',
    },
    terminology: [
      { realpage: 'A/P adjustment (credit)', yardi: 'Negative payable / credit', note: 'Same economic effect.' },
    ],
    pitfalls: [
      'Unapplied credits sit in the aging in both systems and can be refunded by mistake — apply them to specific invoices.',
      'Yardi nets credits only within the same vendor and property; RealPage applies by vendor and entity — watch cross-property credits.',
    ],
    glImpact: 'Credit: DR 2010 Accounts Payable / CR 6xxx Expense.',
  },
  {
    id: 'ros_recurring_payables',
    title: 'Recurring Payables (Contracts, Leases, Service Agreements)',
    category: 'Accounts Payable',
    cadence: 'Monthly',
    realpage: {
      name: 'Recurring A/P Invoices',
      screenId: 'scr_ap_recurring_a_p_invoices_list',
      howItWorks: 'Define the schedule (start, frequency, end) on a recurring A/P invoice; the system creates each occurrence and reports success/failure.',
    },
    yardi: {
      name: 'Recurring Payable',
      navigation: ['Payables', 'Recurring Payable', 'Add'],
      howItWorks: 'Create the recurring payable template with frequency and date range, then run "Post Recurring Payables" for the month.',
    },
    terminology: [
      { realpage: 'Recurring transaction schedule', yardi: 'Recurring payable + post run', note: 'RealPage generates automatically; Yardi requires the post step.' },
    ],
    pitfalls: [
      'Yardi recurring payables do nothing until the monthly post run — add it to the close checklist.',
      'RealPage failures (inactive vendor/account) appear only in the Last result column — review it monthly.',
      'End-date contracts when they expire or you will keep paying a terminated vendor.',
    ],
    glImpact: 'Each occurrence: DR 6xxx Expense / CR 2010 A/P.',
  },
  {
    id: 'ros_check_run',
    title: 'Payment Check Run',
    category: 'Accounts Payable',
    cadence: 'Weekly',
    realpage: {
      name: 'Pay A/P Invoices / Check Run',
      screenId: 'scr_ap_paying_a_p_invoices',
      howItWorks: 'Select approved, due invoices by bank account and due date, create payment requests, print/confirm checks; payments post when checks are confirmed.',
    },
    yardi: {
      name: 'Check Processing & AP Payment Register',
      navigation: ['Payables', 'Check Processing', 'Create Checks'],
      howItWorks: 'Auto-pay selects payables by property, bank and due date into a check batch; review the Payment Register report, then print checks and post the batch.',
    },
    terminology: [
      { realpage: 'Payment request', yardi: 'Check batch (unposted checks)', note: 'Staged payments before release.' },
      { realpage: 'Confirm checks', yardi: 'Post check batch', note: 'The step that posts cash.' },
      { realpage: 'Check run', yardi: 'Auto Pay run', note: 'Bulk payment selection.' },
    ],
    pitfalls: [
      'RealPage posts payments only after checks are confirmed — unconfirmed checks are not in the GL or bank rec.',
      'Yardi pays from the property\'s default bank unless overridden — confirm the bank account for each property before auto-pay.',
      'Apply credits first in both systems to avoid overpaying.',
    ],
    glImpact: 'DR 2010 Accounts Payable / CR 1110 Operating Cash.',
  },
  {
    id: 'ros_positive_pay',
    title: 'Positive Pay File',
    category: 'Accounts Payable',
    cadence: 'Weekly',
    realpage: {
      name: 'Positive Pay File',
      screenId: 'scr_cash_manually_generating_a_positive_pay_file',
      howItWorks: 'Generate the issued-check file for the bank account (automatically or manually) after checks are confirmed; transmit to the bank the same day.',
    },
    yardi: {
      name: 'Positive Pay Export',
      navigation: ['Payables', 'Positive Pay', 'Export'],
      howItWorks: 'Select bank and check date range and export in the bank\'s Positive Pay format configured on the bank setup.',
    },
    terminology: [
      { realpage: 'Positive pay file', yardi: 'Positive Pay export', note: 'Same bank file; formats are set per bank.' },
    ],
    pitfalls: [
      'Voided checks must be sent as void records or the bank may still honor them.',
      'Checks printed after the file was sent are rejected as exceptions — resend incremental files.',
    ],
    glImpact: 'None — fraud control only.',
  },
  {
    id: 'ros_ach_payments',
    title: 'Vendor ACH / Electronic Payments',
    category: 'Accounts Payable',
    cadence: 'Weekly',
    realpage: {
      name: 'Electronic Payments (ACH)',
      screenId: 'scr_ap_setting_up_vendors_for_electronic_payments',
      howItWorks: 'Vendor bank details and payment method ACH on the vendor; pay invoices with the ACH method to create the NACHA file or RealPage Payments transmission.',
    },
    yardi: {
      name: 'EFT (ACH) Processing',
      navigation: ['Payables', 'EFT', 'Create / Export ACH File'],
      howItWorks: 'Vendors flagged for EFT are paid in check processing with EFT type; export the NACHA file for the bank.',
    },
    terminology: [
      { realpage: 'Electronic payment method (ACH)', yardi: 'EFT', note: 'Yardi uses "EFT" for ACH payments.' },
    ],
    pitfalls: [
      'Verify every vendor bank change by call-back to a known number — business email compromise targets ACH vendors.',
      'Prenote/verification periods delay the first payment; plan due dates.',
    ],
    glImpact: 'DR 2010 Accounts Payable / CR 1110 Operating Cash.',
  },
  {
    id: 'ros_manual_payment',
    title: 'Manual Check / Wire / Auto-Debit',
    category: 'Accounts Payable',
    cadence: 'Weekly',
    realpage: {
      name: 'Manual Payment / Record Transfer',
      screenId: 'scr_ap_recording_a_payment_with_record_transfer',
      howItWorks: 'Record a payment made outside the check run (wire, hand check, bank debit) against the open invoice so it closes and appears in the bank rec.',
    },
    yardi: {
      name: 'Manual Check',
      navigation: ['Payables', 'Manual Check', 'Add'],
      howItWorks: 'Enter the manual check/wire number, bank and date and select the payables it pays.',
    },
    terminology: [
      { realpage: 'Record transfer / manual payment', yardi: 'Manual Check', note: 'Wires and ACH debits are recorded as manual checks in Yardi.' },
    ],
    pitfalls: [
      'Utility auto-debits often hit the bank before the invoice is entered — record them or the next check run pays the bill again.',
      'Use the actual bank date so the bank rec clears.',
    ],
    glImpact: 'DR 2010 Accounts Payable / CR 1110 Operating Cash.',
  },
  {
    id: 'ros_void_check',
    title: 'Void & Reissue a Check',
    category: 'Accounts Payable',
    cadence: 'Weekly',
    realpage: {
      name: 'Void Check',
      screenId: 'scr_ap_voiding_a_check',
      howItWorks: 'Void from the check register with a void date in an open period; choose whether the invoice returns to open for reissue.',
    },
    yardi: {
      name: 'Void Check',
      navigation: ['Payables', 'Check', 'Find', 'Void'],
      howItWorks: 'Find the check, choose Void, set the void post month/date and whether to also void (reverse) the payable.',
    },
    terminology: [
      { realpage: 'Void (invoice reopens)', yardi: 'Void check only', note: 'Payable stays open for reissue.' },
      { realpage: 'Void invoice too', yardi: 'Void check and payable', note: 'Reverses the expense as well.' },
    ],
    pitfalls: [
      'Check the bank portal first — voiding a check that already cleared creates a bank rec break.',
      'Voiding into the original (closed) period is blocked in RealPage and changes closed financials in Yardi if the period is open — void in the current period.',
      'Send the void to Positive Pay.',
    ],
    glImpact: 'DR 1110 Operating Cash / CR 2010 Accounts Payable (invoice reopened).',
  },
  {
    id: 'ros_vendor_setup',
    title: 'Vendor Setup & Compliance (W-9, COI)',
    category: 'Accounts Payable',
    cadence: 'Daily',
    realpage: {
      name: 'Vendor (Supplier) Record',
      screenId: 'scr_ap_adding_vendor_supplier_records',
      howItWorks: 'Create the vendor with remit-to contact, 1099 settings, payment method and Insurance/License tab; vendor approval policies can require approval before use.',
    },
    yardi: {
      name: 'Vendor Setup / VendorCafe',
      navigation: ['Payables', 'Vendor', 'Add'],
      howItWorks: 'Create the vendor code and profile (remit, 1099, EFT); compliance (W-9, COI) typically managed in VendorCafe with holds on non-compliant vendors.',
    },
    terminology: [
      { realpage: 'Vendor ID', yardi: 'Vendor code', note: 'Keep the same naming convention across systems.' },
      { realpage: 'Pay-to contact', yardi: 'Remit address', note: 'Where payments are sent.' },
      { realpage: 'Insurance/License tab', yardi: 'Insurance (VendorCafe compliance)', note: 'COI tracking.' },
    ],
    pitfalls: [
      'Search before adding — duplicate vendors split 1099 totals and allow duplicate payments.',
      'Never change remit/bank details from an emailed request without call-back verification.',
    ],
    glImpact: 'None — master data.',
  },
  {
    id: 'ros_1099',
    title: 'Year-End 1099 Processing',
    category: 'Accounts Payable',
    cadence: 'Quarterly / Annual',
    realpage: {
      name: 'Vendor 1099s',
      screenId: 'scr_ap_guide_to_vendor_1099s',
      howItWorks: '1099 type/box on the vendor defaults onto payments; review 1099 reports, correct with 1099 transaction updates, then print/e-file forms.',
    },
    yardi: {
      name: '1099 Processing',
      navigation: ['Payables', '1099 Processing'],
      howItWorks: 'Run the 1099 report by year, adjust 1099 amounts, then generate forms/electronic file.',
    },
    terminology: [
      { realpage: '1099 type & box (NEC Box 1 / MISC)', yardi: '1099 type & box', note: 'Same IRS forms.' },
    ],
    pitfalls: [
      'Payments made before the vendor was flagged 1099 are excluded in both systems — run a correction/update.',
      'Credit-card and third-party network payments are reported by the processor (1099-K) — exclude them.',
    ],
    glImpact: 'None — tax reporting only.',
  },
  {
    id: 'ros_purchase_order',
    title: 'Purchase Order Creation',
    category: 'Accounts Payable',
    cadence: 'Daily',
    realpage: {
      name: 'Purchase Order (Spend Management)',
      screenId: 'scr_ap_adding_a_new_purchase_order',
      howItWorks: 'Create the PO with vendor, lines, G/L/job coding and delivery; approval policies and budget checks run before the PO is issued.',
    },
    yardi: {
      name: 'PO Entry (Procure to Pay)',
      navigation: ['Purchasing', 'Purchase Order', 'Add'],
      howItWorks: 'Create the PO (catalog or free-form), route through PO workflow, then send to the vendor.',
    },
    terminology: [
      { realpage: 'Purchase order / commitment', yardi: 'Purchase Order', note: 'No GL impact until invoiced (unless encumbrance tracking).' },
      { realpage: 'Storefront / punchout', yardi: 'Marketplace', note: 'Catalog purchasing.' },
    ],
    pitfalls: [
      'After-the-fact POs (created after the invoice) defeat the control — owners and auditors flag them.',
      'Close short-shipped POs or open commitments overstate budget usage.',
    ],
    glImpact: 'None at PO; the matched invoice posts DR expense/CIP / CR 2010 A/P.',
  },
  {
    id: 'ros_receiving',
    title: 'Receiving Goods (ROG)',
    category: 'Accounts Payable',
    cadence: 'Daily',
    realpage: {
      name: 'Receive Goods for a Purchase Order',
      screenId: 'scr_ap_receiving_goods_for_a_purchase_order',
      howItWorks: 'Site staff records quantities received against the PO lines; receipts enable matching the vendor invoice.',
    },
    yardi: {
      name: 'PO Receipt',
      navigation: ['Purchasing', 'Purchase Order', 'Receive'],
      howItWorks: 'Receive full or partial quantities on the PO; the receipt date supports accrual of received-not-invoiced items.',
    },
    terminology: [
      { realpage: 'Receiving goods', yardi: 'Receipt / Receive PO', note: 'Same 3-way-match step.' },
    ],
    pitfalls: [
      'Receiving before physical delivery ("to clear the queue") defeats the control.',
      'Month-end: received-not-invoiced items must be accrued in both systems.',
    ],
    glImpact: 'None, or receipt accrual DR expense / CR 2020 Accrued Expenses if configured.',
  },
  {
    id: 'ros_expense_reports',
    title: 'Employee Expense Reimbursement',
    category: 'Accounts Payable',
    cadence: 'Weekly',
    realpage: {
      name: 'Expense Reports',
      screenId: 'scr_ap_adding_an_expense_report',
      howItWorks: 'Employees submit expense reports with receipts; approved reports become payable to the employee and are reimbursed in the payment run.',
    },
    yardi: {
      name: 'Payable to Employee Vendor',
      navigation: ['Payables', 'Payable', 'Add (employee vendor)'],
      howItWorks: 'Employee reimbursements are entered as payables to the employee set up as a vendor (or via Procure to Pay expense workflow).',
    },
    terminology: [
      { realpage: 'Expense report / staff expense', yardi: 'Employee payable', note: 'Yardi has no native expense-report document.' },
    ],
    pitfalls: [
      'Employee-vendors in Yardi can be flagged 1099 by mistake — reimbursements are not 1099 income.',
      'Code each line to the property that benefited, not the employee\'s home property.',
    ],
    glImpact: 'DR 6xxx Expense / CR 2150 Employee Reimbursements Payable (RealPage) or CR 2010 A/P (Yardi).',
  },

  // ───────────────────────────── GENERAL LEDGER ─────────────────────────────
  {
    id: 'ros_journal_entry',
    title: 'Standard Journal Entry',
    category: 'General Ledger',
    cadence: 'Daily',
    realpage: {
      name: 'Journal Entry',
      screenId: 'scr_gl_adding_a_journal_entry',
      howItWorks: 'Select the journal, posting date, description; enter balanced lines with account + location/department; Post or Submit for approval.',
    },
    yardi: {
      name: 'Journal Entry Batch',
      navigation: ['Financials', 'Journal Entry', 'Add'],
      howItWorks: 'Enter date, post month, book and reference; add property/account lines; post the batch.',
    },
    terminology: [
      { realpage: 'Journal (symbol) + transaction/batch no.', yardi: 'JE Batch + Book', note: 'RealPage picks a journal (GJ, ADJ, GAAP); Yardi picks a book (Accrual, Cash, adjustments).' },
      { realpage: 'Posting date', yardi: 'Post Month + Date', note: 'Yardi separates post month from transaction date.' },
    ],
    pitfalls: [
      'Yardi "Book" determines accrual vs cash reporting — a JE in the wrong book disappears from the owner\'s statements.',
      'RealPage JEs in approval-enabled journals are not in the GL until approved.',
    ],
    glImpact: 'Balanced DR/CR lines as entered.',
  },
  {
    id: 'ros_accrual_reversing',
    title: 'Auto-Reversing Month-End Accrual',
    category: 'General Ledger',
    cadence: 'Monthly',
    realpage: {
      name: 'Automatic Reversal Date',
      screenId: 'scr_gl_scheduling_an_automatic_reversal_for_the_entry',
      howItWorks: 'Enter the accrual JE with an Automatic reversal date (day 1 of next month); the system posts the inverse entry on that date.',
    },
    yardi: {
      name: 'JE with Auto Reverse',
      navigation: ['Financials', 'Journal Entry', 'Add', 'Auto Reverse'],
      howItWorks: 'Check Auto Reverse (or choose accrual type) and the reversal post month; Yardi creates the reversing batch.',
    },
    terminology: [
      { realpage: 'Automatic reversal date', yardi: 'Auto Reverse / reversal post month', note: 'Same concept.' },
    ],
    pitfalls: [
      'Forgetting the reversal double-counts the expense when the real invoice posts.',
      'If the real invoice arrives with a different amount, the difference is the true-up — do not reverse twice.',
    ],
    glImpact: 'Accrual DR 6xxx / CR 2020 Accrued Expenses; reversal DR 2020 / CR 6xxx on day 1.',
  },
  {
    id: 'ros_duplicate_je',
    title: 'Duplicating Journal Entries',
    category: 'General Ledger',
    cadence: 'Monthly',
    realpage: {
      name: 'View > Duplicate',
      screenId: 'scr_gl_duplicating_journal_entries_to_other_books',
      howItWorks: 'Open the posted JE (View) and click Duplicate; choose the target book/journal and date; edit and post the copy.',
    },
    yardi: {
      name: 'Copy Batch',
      navigation: ['Financials', 'Journal Entry', 'Find Batch', 'Copy'],
      howItWorks: 'Find the prior batch and use Copy to create a new unposted batch; change dates/post month/amounts and post.',
    },
    terminology: [
      { realpage: 'Duplicate (to same or other book)', yardi: 'Copy (batch)', note: 'Yardi copies within the same book unless changed.' },
    ],
    pitfalls: [
      'Neither system blocks duplicate entries — change the reference/description to the new month before posting.',
      'Copies keep the original posting date/post month by default — change it or you post into the prior period.',
    ],
    glImpact: 'Same DR/CR as the source entry, in the new period/book.',
  },
  {
    id: 'ros_reverse_je',
    title: 'Reverse a Posted Journal Entry',
    category: 'General Ledger',
    cadence: 'Weekly',
    realpage: {
      name: 'Reverse',
      screenId: 'scr_gl_reversing_a_journal_entry',
      howItWorks: 'Open the JE, click Reverse, enter the reversal date and memo; the original remains, a mirror entry posts.',
    },
    yardi: {
      name: 'Reverse JE',
      navigation: ['Financials', 'Journal Entry', 'Find', 'Reverse'],
      howItWorks: 'Find the JE and use Reverse with the reversal post month.',
    },
    terminology: [
      { realpage: 'Reverse', yardi: 'Reverse', note: 'Both keep an audit trail; deleting does not.' },
    ],
    pitfalls: [
      'Reverse in an open period — RealPage cannot reverse into a closed period; Yardi can if the post month is still open, which changes delivered financials.',
    ],
    glImpact: 'Exact inverse of the original entry.',
  },
  {
    id: 'ros_recurring_je',
    title: 'Recurring Journal Entries',
    category: 'General Ledger',
    cadence: 'Monthly',
    realpage: {
      name: 'Recurring Journal Entries',
      screenId: 'scr_gl_recurring_journal_entries_list',
      howItWorks: 'Define the entry and schedule (frequency, start/end); the system posts each occurrence (or routes it for approval).',
    },
    yardi: {
      name: 'Recurring Journal Entry',
      navigation: ['Financials', 'Recurring Journal Entry', 'Add'],
      howItWorks: 'Create the template with frequency and period range; post with the recurring JE post routine each month.',
    },
    terminology: [
      { realpage: 'Recurring schedule', yardi: 'Recurring JE + post routine', note: 'Yardi needs the monthly post run.' },
    ],
    pitfalls: [
      'Yardi recurring JEs are not posted until the routine runs — put it on the close checklist.',
      'End-date loan-driven entries at maturity or refinance.',
    ],
    glImpact: 'Each occurrence posts its template DR/CR.',
  },
  {
    id: 'ros_allocations',
    title: 'Expense Allocations Across Properties',
    category: 'General Ledger',
    cadence: 'Monthly',
    realpage: {
      name: 'Allocations',
      screenId: 'scr_gl_allocations_overview',
      howItWorks: 'Allocation definitions split a source amount across locations by fixed percentages or dynamic bases (units, statistical accounts).',
    },
    yardi: {
      name: 'Recurring JE Allocation / Expense Pool',
      navigation: ['Financials', 'Recurring Journal Entry', 'Allocation'],
      howItWorks: 'Allocation tables/percentages on recurring JEs or Payables expense pools distribute shared invoices to properties.',
    },
    terminology: [
      { realpage: 'Allocation (dynamic by statistical account)', yardi: 'Allocation table / expense pool', note: 'RealPage can drive percentages from statistical accounts.' },
    ],
    pitfalls: [
      'Percentages must total 100% — confirm the source clearing account nets to zero.',
      'Cross-entity allocations create Due To/Due From; settle them.',
    ],
    glImpact: 'DR 6xxx at receiving properties / CR 6xxx (or clearing) at source.',
  },
  {
    id: 'ros_prepaid',
    title: 'Prepaid Expense Amortization',
    category: 'General Ledger',
    cadence: 'Monthly',
    realpage: {
      name: 'Prepaids',
      screenId: 'scr_gl_adding_a_prepaid_journal_entry',
      howItWorks: 'Create a prepaid journal entry with start/end dates; the schedule generates monthly amortization entries.',
    },
    yardi: {
      name: 'Recurring JE Amortization / Payable Amortize',
      navigation: ['Financials', 'Recurring Journal Entry', 'Add (amortization)'],
      howItWorks: 'Set up a recurring JE for the policy term (or use the amortize option on the payable line).',
    },
    terminology: [
      { realpage: 'Prepaid schedule', yardi: 'Amortization recurring JE', note: 'Same monthly DR expense / CR prepaid.' },
    ],
    pitfalls: [
      'Mid-term cancellations/renewals leave stale schedules — adjust immediately.',
      'Tie the prepaid balance to the schedule monthly.',
    ],
    glImpact: 'DR 6610 Insurance (etc.) / CR 1310 Prepaid Expenses monthly.',
  },
  {
    id: 'ros_accrual_workbench',
    title: 'Month-End Accrual Templates',
    category: 'General Ledger',
    cadence: 'Monthly',
    realpage: {
      name: 'Accrual Workbench',
      screenId: 'scr_gl_accrual_workbench',
      howItWorks: 'Accrual templates (e.g. invoices not received, utility pending export) calculate accruals in the Accrual Workbench; review, post and auto-reverse.',
    },
    yardi: {
      name: 'Accrual JE (manual or recurring)',
      navigation: ['Financials', 'Journal Entry', 'Add', 'Auto Reverse'],
      howItWorks: 'Accruals are typically built in Excel from open POs/utility history and imported or keyed as auto-reversing JEs.',
    },
    terminology: [
      { realpage: 'Accrual template', yardi: 'Accrual JE (ETL import)', note: 'RealPage automates the calculation.' },
    ],
    pitfalls: [
      'Review template output — it accrues what the rule finds, not what you know is missing.',
    ],
    glImpact: 'DR 6xxx / CR 2020 Accrued Expenses, reversing next period.',
  },
  {
    id: 'ros_intercompany',
    title: 'Intercompany Due To / Due From',
    category: 'General Ledger',
    cadence: 'Monthly',
    realpage: {
      name: 'Inter-Entity Account Mapping',
      screenId: 'scr_gl_inter_entity_account_mapping_page',
      howItWorks: 'Inter-entity mappings auto-create due-to/due-from lines when a transaction spans entities; balances eliminate in consolidation.',
    },
    yardi: {
      name: 'Intercompany Accounts',
      navigation: ['Setup', 'Intercompany Accounts'],
      howItWorks: 'Paying from another property\'s cash automatically books Due To/Due From via intercompany account setup.',
    },
    terminology: [
      { realpage: 'Inter-entity', yardi: 'Intercompany', note: 'Same concept.' },
      { realpage: 'Entity', yardi: 'Property / Entity', note: 'RealPage entity = legal owner; Yardi property often = entity.' },
    ],
    pitfalls: [
      'Manual JEs to Due To/From bypass the mapping and break the net-to-zero check.',
    ],
    glImpact: 'Payer: DR 1230 Due From / CR cash; beneficiary: DR expense / CR 2130 Due To.',
  },
  {
    id: 'ros_mgmt_fee',
    title: 'Management Fee Calculation',
    category: 'General Ledger',
    cadence: 'Monthly',
    realpage: {
      name: 'Fees (Calculate Percentage Fees)',
      screenId: 'scr_gl_calculate_percentage_fees',
      howItWorks: 'Fee templates define the income accounts and percentage; calculate, review and post — the fee becomes an A/P invoice to the management company.',
    },
    yardi: {
      name: 'Management Fees',
      navigation: ['Financials', 'Management Fees', 'Calculate'],
      howItWorks: 'Management fee setup per property (basis accounts, rate); calculate and post creates payables.',
    },
    terminology: [
      { realpage: 'Fee template', yardi: 'Management fee setup', note: 'Same fee base definition.' },
    ],
    pitfalls: [
      'Recalculate after late receipts or reclasses to income accounts.',
      'Exclude non-qualifying income (security deposits, insurance proceeds) per the agreement.',
    ],
    glImpact: 'DR 6510 Management Fees / CR 2010 A/P (or 2130 Due To).',
  },
  {
    id: 'ros_adjusting_books',
    title: 'GAAP / Tax Adjusting Entries (Separate Books)',
    category: 'General Ledger',
    cadence: 'Quarterly / Annual',
    realpage: {
      name: 'GAAP (Compliance) & Tax Adjusting Journals',
      screenId: 'scr_gl_adding_a_gaap_compliance_adjusting_or_tax_adjusting_entry',
      howItWorks: 'Post audit/tax adjustments to GAAP or tax adjustment journals; reports combine the reporting book with selected adjustment books.',
    },
    yardi: {
      name: 'Adjustment Books',
      navigation: ['Financials', 'Journal Entry', 'Add', 'Book: Accrual Adjustments / Tax'],
      howItWorks: 'Post to a user-defined adjustment book; Financial Analytics includes it via book selection.',
    },
    terminology: [
      { realpage: 'Adjustment journal / book', yardi: 'Book', note: 'Both keep operating books clean.' },
    ],
    pitfalls: [
      'Reports must include the adjustment book to show audited numbers — check book selections.',
    ],
    glImpact: 'Adjustment DR/CR in the adjustment book only.',
  },

  {
    id: 'ros_trial_balance',
    title: 'Trial Balance Review',
    category: 'General Ledger',
    cadence: 'Monthly',
    realpage: {
      name: 'Trial Balance Report',
      screenId: 'scr_gl_trial_balance_report',
      howItWorks: 'Run by reporting period, reporting book and location; drill into amounts for GL detail.',
    },
    yardi: {
      name: 'Financial Analytics > Trial Balance',
      navigation: ['Analytics', 'Financial Analytics', 'Trial Balance'],
      howItWorks: 'Select property list, book and period; drill down to the ledger.',
    },
    terminology: [
      { realpage: 'Reporting book (Accrual/Cash)', yardi: 'Book', note: 'Select the same basis as the owner package.' },
    ],
    pitfalls: [
      'Location/entity filter excluding child locations understates balances — use Include subs.',
    ],
    glImpact: 'None — review.',
  },

  // ───────────────────────────── CASH & BANKING ─────────────────────────────
  {
    id: 'ros_bank_rec',
    title: 'Month-End Bank Reconciliation',
    category: 'Cash & Banking',
    cadence: 'Monthly',
    realpage: {
      name: 'Bank Reconciliation (Auto-Match Rules)',
      screenId: 'scr_cash_bank_reconciliation_new',
      howItWorks: 'Import bank transactions, auto-match with rule sets, manually match the rest, create transactions for bank-only items, reconcile to the statement balance and submit for approval.',
    },
    yardi: {
      name: 'Bank Rec Screen',
      navigation: ['Financials', 'Bank Reconciliation'],
      howItWorks: 'Select bank and statement date/balance, clear checks and deposits (manually or via Bank Rec import auto-clear), post the reconciliation and print the Bank Rec Report.',
    },
    terminology: [
      { realpage: 'Matching rules / rule sets', yardi: 'Auto-clear / Auto-match', note: 'RealPage rules are configurable by field and tolerance.' },
      { realpage: 'Reconciling item', yardi: 'Outstanding item', note: 'Deposits in transit / outstanding checks.' },
      { realpage: 'Finalize reconciliation', yardi: 'Post Bank Rec', note: 'Locks cleared items.' },
    ],
    pitfalls: [
      'RealPage lets you create fee/interest transactions from unmatched bank lines; in Yardi record them first by JE, then clear.',
      'Reopening a finalized rec in either system un-clears items — never reopen without approval.',
      'Ending book balance must equal the GL cash balance for the same date in both systems.',
    ],
    glImpact: 'None for matching; adjustments e.g. DR 6420 Bank Charges / CR 1110 Cash.',
  },

  {
    id: 'ros_deposits',
    title: 'Bank Deposits (Undeposited Funds)',
    category: 'Cash & Banking',
    cadence: 'Daily',
    realpage: {
      name: 'Deposits',
      screenId: 'scr_cash_adding_a_deposit',
      howItWorks: 'Receipts post to undeposited funds; select them into a deposit slip for the bank account.',
    },
    yardi: {
      name: 'Deposit',
      navigation: ['Residents', 'Receipt Batch', 'Deposit'],
      howItWorks: 'Receipt batches are deposited to the bank; the deposit number ties to the bank credit.',
    },
    terminology: [
      { realpage: 'Undeposited funds', yardi: 'Undeposited receipts', note: 'Clearing account before the deposit.' },
    ],
    pitfalls: [
      'Deposit totals must equal the bank credit — split deposits by the bank\'s actual credits.',
    ],
    glImpact: 'DR 1110 Operating Cash / CR 1130 Undeposited Funds.',
  },
  {
    id: 'ros_transfers',
    title: 'Bank Transfers & Sweeps',
    category: 'Cash & Banking',
    cadence: 'Weekly',
    realpage: {
      name: 'Funds Transfer',
      screenId: 'scr_cash_adding_a_funds_transfer',
      howItWorks: 'Record a transfer between bank accounts (single or bulk); both accounts show the item in their reconciliations.',
    },
    yardi: {
      name: 'Cash Transfer JE',
      navigation: ['Financials', 'Journal Entry', 'Add (cash to cash)'],
      howItWorks: 'Record DR destination cash / CR source cash; intercompany transfers add Due To/From.',
    },
    terminology: [
      { realpage: 'Funds transfer', yardi: 'Cash transfer JE', note: 'Yardi has no dedicated transfer document in most setups.' },
    ],
    pitfalls: [
      'Month-end sweeps posting on the 1st create reconciling items — record in the bank\'s date.',
    ],
    glImpact: 'DR 1110 destination / CR 1110 source (plus Due To/From across entities).',
  },
  {
    id: 'ros_escheat',
    title: 'Stale Checks & Escheatment',
    category: 'Cash & Banking',
    cadence: 'Quarterly / Annual',
    realpage: {
      name: 'Escheatment Workbench',
      screenId: 'scr_cash_escheatment_workbench',
      howItWorks: 'Mark aged outstanding payments as aged payables, then escheated when remitted to the state.',
    },
    yardi: {
      name: 'Void to Unclaimed Property',
      navigation: ['Payables', 'Check', 'Find', 'Void (to unclaimed property account)'],
      howItWorks: 'Void stale checks to an unclaimed-property liability and pay the state via a payable.',
    },
    terminology: [
      { realpage: 'Aged payable / escheated', yardi: 'Unclaimed property', note: 'Same regulatory process.' },
    ],
    pitfalls: [
      'Perform owner due-diligence letters before escheating.',
    ],
    glImpact: 'DR 1110 Cash (void) / CR 2170 Unclaimed Property; remit DR 2170 / CR Cash.',
  },

  // ─────────────────────────── ACCOUNTS RECEIVABLE ───────────────────────────
  {
    id: 'ros_receipts',
    title: 'Receipt Posting & Application',
    category: 'Accounts Receivable',
    cadence: 'Daily',
    realpage: {
      name: 'Receive Payment',
      screenId: 'scr_ar_receiving_a_payment',
      howItWorks: 'Receive the customer payment and apply it to open invoices (or leave as an advance); it posts to undeposited funds.',
    },
    yardi: {
      name: 'Receipt Batch',
      navigation: ['Residents', 'Receipt Batch', 'Add'],
      howItWorks: 'Enter receipts per resident; Yardi applies them by charge-code priority (fees, utilities, rent).',
    },
    terminology: [
      { realpage: 'Customer', yardi: 'Resident / Tenant', note: 'RealPage Accounting A/R uses customers.' },
      { realpage: 'Advance / unapplied', yardi: 'Prepayment', note: 'Credit balance on the ledger.' },
    ],
    pitfalls: [
      'Application order differs — RealPage applies to selected invoices; Yardi uses charge-code priority (often mandated by state law).',
    ],
    glImpact: 'DR 1130 Undeposited Funds / CR 1210 A/R.',
  },
  {
    id: 'ros_nsf',
    title: 'NSF / Returned Payment',
    category: 'Accounts Receivable',
    cadence: 'Weekly',
    realpage: {
      name: 'Reverse Payment',
      screenId: 'scr_ar_reversing_payments',
      howItWorks: 'Reverse the payment (from the deposit, summary or receipts register) with the bank return date; charges re-open; add the NSF fee.',
    },
    yardi: {
      name: 'Reverse Receipt (NSF)',
      navigation: ['Residents', 'Receipt', 'Find', 'Reverse (NSF)'],
      howItWorks: 'Reverse the receipt with NSF reason; optionally auto-charge the NSF fee.',
    },
    terminology: [
      { realpage: 'Reverse payment', yardi: 'NSF reversal', note: 'Same effect on the ledger.' },
    ],
    pitfalls: [
      'Use the bank debit date so the bank rec ties.',
    ],
    glImpact: 'DR 1210 A/R / CR 1110 Cash; NSF fee DR 1210 / CR 4100.',
  },
  {
    id: 'ros_billing',
    title: 'Charges & Billing (A/R Invoices)',
    category: 'Accounts Receivable',
    cadence: 'Monthly',
    realpage: {
      name: 'A/R Invoice',
      screenId: 'scr_ar_adding_an_a_r_invoice',
      howItWorks: 'Create A/R invoices (single, recurring or quick entry) with revenue accounts and locations; print/email documents.',
    },
    yardi: {
      name: 'Charge / Charge Batch',
      navigation: ['Residents', 'Charge Batch', 'Add'],
      howItWorks: 'One-time charges in charge batches; recurring rent from the lease\'s recurring charges posted monthly.',
    },
    terminology: [
      { realpage: 'A/R invoice', yardi: 'Charge', note: 'Yardi charges are posted to the resident ledger.' },
      { realpage: 'Recurring invoice', yardi: 'Recurring charges (post rent)', note: 'Monthly rent posting.' },
    ],
    pitfalls: [
      'Charge codes map to GL in Yardi; A/R invoice lines map to accounts in RealPage — verify mapping for new fee types.',
    ],
    glImpact: 'DR 1210 A/R / CR 4xxx Revenue.',
  },
  {
    id: 'ros_gpr_tieout',
    title: 'Rent Roll to GL GPR Tie-Out',
    category: 'Accounts Receivable',
    cadence: 'Monthly',
    realpage: {
      name: 'AR Gross Potential Rent tie-out (Rent Roll)',
      screenId: 'scr_ar_gpr_tieout',
      howItWorks: 'Compare rent-roll market rent × units to GL GPR; bridge loss/gain to lease, vacancy, concessions and non-revenue units to net rental income.',
    },
    yardi: {
      name: 'Resident Ledger / GPR Report',
      navigation: ['Analytics', 'Residential Analytics', 'Gross Potential Rent'],
      howItWorks: 'Run the GPR/rent roll reports and compare to GL rent accounts; investigate differences on resident ledgers.',
    },
    terminology: [
      { realpage: 'GPR / Loss to lease', yardi: 'GPR / Loss-Gain to Lease posting', note: 'Yardi can post GPR automatically.' },
    ],
    pitfalls: [
      'Concessions coded to rent accounts break the tie-out — use the concession contra-revenue account.',
      'Down/model units must be in GPR and in non-revenue loss.',
    ],
    glImpact: 'None for the review; corrections by reclass JE.',
  },
  {
    id: 'ros_aging',
    title: 'Delinquency / Aging Review',
    category: 'Accounts Receivable',
    cadence: 'Weekly',
    realpage: {
      name: 'Customer Aging Report',
      screenId: 'scr_ar_customer_aging_report',
      howItWorks: 'Run aging by as-of date and aging buckets; tie total to GL A/R.',
    },
    yardi: {
      name: 'Aging / Delinquency Report',
      navigation: ['Analytics', 'Receivable Analytics', 'Aging'],
      howItWorks: 'Run resident aging by property and post month; net of prepayments.',
    },
    terminology: [
      { realpage: 'Aging period', yardi: 'Aging bucket', note: 'Configure the same buckets (0-30, 31-60…).' },
    ],
    pitfalls: [
      'Aging "as of" date vs post month: Yardi ages by post month; RealPage by date — match the GL date.',
    ],
    glImpact: 'None — review.',
  },
  {
    id: 'ros_writeoff',
    title: 'Write-Offs & Adjustments',
    category: 'Accounts Receivable',
    cadence: 'Monthly',
    realpage: {
      name: 'A/R Adjustment',
      screenId: 'scr_ar_adding_an_a_r_adjustment',
      howItWorks: 'Credit adjustment to bad debt/concession accounts, applied to the open invoices.',
    },
    yardi: {
      name: 'Write Off',
      navigation: ['Residents', 'Write Off'],
      howItWorks: 'Write off former-resident balances to bad debt after deposit application; send to collections.',
    },
    terminology: [
      { realpage: 'Credit adjustment', yardi: 'Write off / credit charge', note: 'Same entry.' },
    ],
    pitfalls: [
      'Apply security deposits before writing off.',
    ],
    glImpact: 'DR 4050 Bad Debt / CR 1210 A/R.',
  },
  {
    id: 'ros_deposit_disposition',
    title: 'Security Deposit Disposition (FAS)',
    category: 'Accounts Receivable',
    cadence: 'Weekly',
    realpage: {
      name: 'Security Deposits - Multifamily report & deposit accounting',
      screenId: 'scr_gl_security_deposits_multifamily',
      howItWorks: 'Apply the deposit liability to move-out charges, refund the remainder through A/P, reconcile the deposit liability report to the GL.',
    },
    yardi: {
      name: 'Move Out > Deposit Accounting (FAS)',
      navigation: ['Residents', 'Move Out', 'Deposit Accounting'],
      howItWorks: 'Final Account Statement applies deposits to charges and generates the refund payable or balance due.',
    },
    terminology: [
      { realpage: 'Deposit application', yardi: 'FAS / Deposit accounting', note: 'Same statutory process.' },
    ],
    pitfalls: [
      'Refund deadlines are statutory — track move-out date + state days.',
    ],
    glImpact: 'DR 2110 Security Deposits / CR 1210 A/R and CR cash (refund).',
  },
  {
    id: 'ros_billbacks',
    title: 'Intercompany Bill-Backs',
    category: 'Accounts Receivable',
    cadence: 'Monthly',
    realpage: {
      name: 'Intercompany Bill-Backs',
      screenId: 'scr_ar_intercompany_bill_backs',
      howItWorks: 'Bill costs paid by one entity to another; creates the A/R invoice in the billing entity and the A/P invoice in the billed entity.',
    },
    yardi: {
      name: 'Intercompany Payable / Expense Pool',
      navigation: ['Payables', 'Payable', 'Add (pay from other property)'],
      howItWorks: 'Pay on behalf of other properties generating Due To/From, or bill through expense pools.',
    },
    terminology: [
      { realpage: 'Bill-back', yardi: 'Intercompany / expense pool', note: 'Mechanics differ; outcome the same.' },
    ],
    pitfalls: [
      'Both sides must post in the same period to keep intercompany balanced.',
    ],
    glImpact: 'Biller: DR 1230 / CR expense recovery; billed: DR expense / CR 2130.',
  },

  // ───────────────────────────── CAPITAL & ASSETS ─────────────────────────────
  {
    id: 'ros_capex_draws',
    title: 'CapEx Draws & Job Cost Tracking',
    category: 'Capital & Assets',
    cadence: 'Monthly',
    realpage: {
      name: 'Replacement Reserves Draw',
      screenId: 'scr_jobcost_adding_a_replacement_reserve_draw',
      howItWorks: 'Build the draw from job costs mapped to draw-model lender categories and funding sources; submit; record the draw receipt when funded.',
    },
    yardi: {
      name: 'Job Cost Contract & Draw',
      navigation: ['Job Cost', 'Draw', 'Add'],
      howItWorks: 'Jobs with contracts and cost categories accumulate costs; create the draw (AIA G702/G703) and record lender funding.',
    },
    terminology: [
      { realpage: 'Draw model / funding source', yardi: 'Draw / funding source', note: 'Lender categories.' },
      { realpage: 'Cost code', yardi: 'Cost category', note: 'Job-level coding.' },
    ],
    pitfalls: [
      'Draw totals must tie to job cost detail and paid invoices.',
      'Collect unconditional lien waivers before submission.',
    ],
    glImpact: 'Draw receipt DR 1110 Cash / CR 1340 Reserve Escrow (or 2210 Loan).',
  },

  {
    id: 'ros_depreciation',
    title: 'Monthly Depreciation',
    category: 'Capital & Assets',
    cadence: 'Monthly',
    realpage: {
      name: 'Post Depreciation',
      screenId: 'scr_fixed_assets_post_depreciation',
      howItWorks: 'Preview assets not depreciated, then post depreciation journal entries by location for the period.',
    },
    yardi: {
      name: 'Fixed Assets Depreciation',
      navigation: ['Fixed Assets', 'Depreciation', 'Calculate & Post'],
      howItWorks: 'Calculate depreciation for the period and post the depreciation batch.',
    },
    terminology: [
      { realpage: 'Depreciation batch', yardi: 'Depreciation batch', note: 'Same.' },
    ],
    pitfalls: [
      'Run for every period in order — skipped months need catch-up.',
    ],
    glImpact: 'DR 7110 Depreciation / CR 1590 Accumulated Depreciation.',
  },
  {
    id: 'ros_asset_disposal',
    title: 'Asset Disposal / Replacement',
    category: 'Capital & Assets',
    cadence: 'Quarterly / Annual',
    realpage: {
      name: 'Dispose or Partially Dispose of an Asset',
      screenId: 'scr_fixed_assets_disposing_or_partially_disposing_of_an_asset',
      howItWorks: 'Dispose fully or partially; the system removes cost and accumulated depreciation and books gain/loss.',
    },
    yardi: {
      name: 'Asset Disposal',
      navigation: ['Fixed Assets', 'Asset', 'Dispose'],
      howItWorks: 'Record disposal date and proceeds; gain/loss posts.',
    },
    terminology: [
      { realpage: 'Partial disposal', yardi: 'Partial disposal', note: 'Component replacement.' },
    ],
    pitfalls: [
      'Replaced roofs/HVAC left on the books overstate assets.',
    ],
    glImpact: 'DR 1590 Acc. Depr., DR loss / CR 1530 asset cost.',
  },

  // ───────────────────────────── CLOSE & REPORTING ─────────────────────────────
  {
    id: 'ros_subledger_close',
    title: 'Subledger Lock (Post Month)',
    category: 'Close & Reporting',
    cadence: 'Monthly',
    realpage: {
      name: 'Close A/P and A/R Subledgers',
      screenId: 'scr_ap_closing_the_a_p_subledger',
      howItWorks: 'Close A/P and A/R subledger summaries by period after cut-off; then close books in the GL.',
    },
    yardi: {
      name: 'Post Month (AP / AR)',
      navigation: ['Financials', 'Closing', 'Post Month'],
      howItWorks: 'Advance the AP and AR post month per property, which blocks entries into the prior month.',
    },
    terminology: [
      { realpage: 'Close subledger / close books', yardi: 'Post Month advance / period close', note: 'Same lock.' },
    ],
    pitfalls: [
      'Yardi post month is per property — one missed property stays open.',
      'RealPage close books can be scoped by entity — confirm all entities.',
    ],
    glImpact: 'None — locks posting.',
  },
  {
    id: 'ros_close_books',
    title: 'Close GL Period (Close Books)',
    category: 'Close & Reporting',
    cadence: 'Monthly',
    realpage: {
      name: 'Close Books',
      screenId: 'scr_gl_closing_books_from_the_g_l_workbench',
      howItWorks: 'From the G/L workbench, Books > Close for the period and entities after all subledgers are closed.',
    },
    yardi: {
      name: 'GL Period Close',
      navigation: ['Financials', 'Closing', 'Close Period'],
      howItWorks: 'Close the GL period for the property list after post months advance.',
    },
    terminology: [
      { realpage: 'Close books', yardi: 'Close period', note: 'Same.' },
    ],
    pitfalls: [
      'Re-opening needs controller approval in both systems.',
    ],
    glImpact: 'None — locks posting.',
  },
  {
    id: 'ros_close_checklist',
    title: 'Close Checklist & Work Papers',
    category: 'Close & Reporting',
    cadence: 'Monthly',
    realpage: {
      name: 'Financial Close Management (Close Checklist)',
      screenId: 'scr_close_dashboard',
      howItWorks: 'Monthly checklists generate tasks; work paper packages bundle reconciliations for approval.',
    },
    yardi: {
      name: 'Close checklist (Task Runner / external tool)',
      navigation: ['Administration', 'Task Runner'],
      howItWorks: 'No native work-paper packager in Voyager; teams use Task Runner schedules, Document Management and external close tools.',
    },
    terminology: [
      { realpage: 'Work paper package', yardi: 'Close binder (DMS / external)', note: 'Evidence of close.' },
    ],
    pitfalls: [
      'Work papers must be regenerated after late entries.',
    ],
    glImpact: 'None.',
  },
  {
    id: 'ros_budget_bva',
    title: 'Budget Upload & Budget vs Actual',
    category: 'Close & Reporting',
    cadence: 'Monthly',
    realpage: {
      name: 'Publish Working Budget / BVA',
      screenId: 'scr_budget_gl_comparison',
      howItWorks: 'Publish the working budget to a G/L budget; run Income Statement Budget Comparison and enter BVA notes.',
    },
    yardi: {
      name: 'Budget Import & Budget Comparison',
      navigation: ['Analytics', 'Financial Analytics', 'Budget Comparison'],
      howItWorks: 'Import the budget (Financials > Budget) and run Budget Comparison with the budget book.',
    },
    terminology: [
      { realpage: 'Working budget → published G/L budget', yardi: 'Budget book / budget import', note: 'Where budget amounts live.' },
    ],
    pitfalls: [
      'Select the same budget version (original vs reforecast) in both systems.',
    ],
    glImpact: 'None — budget data.',
  },
  {
    id: 'ros_owner_package',
    title: 'Investor / Owner Financial Package',
    category: 'Close & Reporting',
    cadence: 'Monthly',
    realpage: {
      name: 'Report Groups',
      screenId: 'scr_rep_mor_package',
      howItWorks: 'Group financial reports into a report group and run or schedule it for distribution.',
    },
    yardi: {
      name: 'Report Packet / Report Scheduler',
      navigation: ['Analytics', 'Report Packet'],
      howItWorks: 'Build the packet of Financial Analytics reports and schedule distribution.',
    },
    terminology: [
      { realpage: 'Report group', yardi: 'Report packet', note: 'Bundle of reports.' },
    ],
    pitfalls: [
      'Check entity filters — never send one owner another owner\'s data.',
    ],
    glImpact: 'None.',
  },
  {
    id: 'ros_year_end',
    title: 'Year-End Close & Retained Earnings',
    category: 'Close & Reporting',
    cadence: 'Quarterly / Annual',
    realpage: {
      name: 'Close Books (year-end)',
      screenId: 'scr_gl_close_books_page',
      howItWorks: 'Closing the last period of the fiscal year rolls income statement balances into retained earnings.',
    },
    yardi: {
      name: 'Year End Close',
      navigation: ['Financials', 'Closing', 'Year End Close'],
      howItWorks: 'Run year-end close to roll P&L into retained earnings per property.',
    },
    terminology: [
      { realpage: 'Retained earnings account (close account)', yardi: 'Retained earnings (year-end)', note: 'Same.' },
    ],
    pitfalls: [
      'Post audit adjustments in an adjustment book to avoid reopening the year.',
    ],
    glImpact: 'DR revenue / CR expenses, net to 3100 Retained Earnings.',
  },
];
