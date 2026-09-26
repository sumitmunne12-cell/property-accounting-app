// Exception Triage Playbooks — the 15 most common offshore multifamily accounting exceptions.
//
// Each playbook is an interactive diagnostic wizard (`diagnosticWizard`: yes/no questions that end
// in a verdict) plus Root Cause, Audit Risk, the Diagnostic RealPage Report (linked to a catalog
// screen), a Step-by-Step Resolution SOP and exact, balanced DR/CR adjusting entries.
//
// Codes such as EX_PO_VAR are this app's triage codes for grouping and search; they are not
// RealPage system error codes. Amounts in the entries are worked examples: replace them with
// the actual figures from the diagnostic report.

export const EXCEPTION_CODE_NOTE =
  'Triage codes (EX_…) are this app\'s shorthand for grouping exceptions, not RealPage system codes. Entry amounts are worked examples — use the figures from the diagnostic report.';

export const EXCEPTION_PLAYBOOKS = [
  {
    id: 'ex_po_variance',
    code: 'EX_PO_VAR',
    title: 'Invoice PO Variance (3-Way Match Failure)',
    severity: 'High',
    frequency: 'Very Common (Daily)',
    software: 'Both (RealPage & Yardi)',
    module: '02_accounts_payable',
    navigation: {
      realpage: ['Applications', 'Spend Management', 'All', 'Purchase Orders', 'View', 'Invoice lines vs PO lines'],
      yardi: ['Purchasing', 'Purchase Order', 'Invoice Match', 'Variance'],
    },
    symptom: 'The vendor invoice does not match the approved PO and receipt — unit price, quantity or extended amount exceeds the PO beyond tolerance — so the invoice is held for approval or cannot be converted.',
    rootCause: [
      'Price variance: vendor billed a higher unit price than the PO (price increase, freight, fuel or emergency surcharge).',
      'Quantity variance: more units invoiced than received (partial delivery, back-order billed early).',
      'Scope change: contractor performed extra work without an approved change order.',
      'PO created from an estimate before the final quote.',
    ],
    auditRisk: 'Paying above the approved commitment without a change order is an authorization failure. Auditors and asset managers treat it as a control deficiency, and on capital jobs it overstates cost and draw requests.',
    diagnosticReport: {
      name: 'Purchase Orders List → PO detail (lines, receipts, invoiced)',
      screenId: 'scr_ap_purchase_orders_list',
      whatToLookFor: 'Compare PO unit price × quantity with receipt quantity and invoice lines to isolate price vs quantity vs new-scope variance.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Does the invoiced quantity exceed the quantity received on the PO?',
        options: [
          { label: 'Yes', outcome: 'Quantity variance: ask the site to receive the remaining items if delivered. If not delivered, short-pay the undelivered quantity and request a corrected invoice.' },
          { label: 'No', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Is the unit price or extended amount higher than the PO?',
        options: [
          { label: 'Yes', next: 'q3' },
          { label: 'No', outcome: 'No real variance: check for tax or freight lines missing from the PO, or a PO line closed early. Add the line or reopen, then re-match.' },
        ],
      },
      {
        id: 'q3',
        question: 'Did the property manager authorize the extra cost (quote, email, emergency approval)?',
        options: [
          { label: 'Yes', outcome: 'Legitimate variance: create and approve a PO change order for the difference, then re-match the invoice.' },
          { label: 'No', outcome: 'Unauthorized variance: dispute with the vendor. Pay only the PO amount (short-pay) and request a credit memo for the difference.' },
        ],
      },
    ],
    resolutionSOP: [
      'Open the invoice and the linked PO; export PO lines, receipts and invoice lines.',
      'Classify the variance with the wizard (quantity, price, or scope).',
      'Quantity: have the site record the actual receipt; short-pay undelivered quantity.',
      'Price/scope authorized: PM submits a PO change order; approver approves it in the Approval Workbench.',
      'Price/scope unauthorized: email the vendor for a corrected invoice or credit; hold or short-pay.',
      'Re-match the invoice to the updated PO and let it continue to approval.',
      'At month-end, accrue the undisputed amount of any invoice still held.',
    ],
    adjustingEntries: [
      {
        label: 'Vendor credit for an unauthorized overbilling already posted ($350)',
        lines: [
          { account: '2010 Accounts Payable', debit: 350 },
          { account: '6110 Repairs & Maintenance', credit: 350 },
        ],
        memo: 'Vendor credit memo #CM-xxxx for price over PO #xxxx without change order.',
      },
    ],
    relatedScreenIds: ['scr_ap_adding_a_change_order_for_a_purchase_order', 'scr_ap_receiving_goods_for_a_purchase_order', 'scr_ap_budget_variance_with_commitments_report'],
    proTip: 'Never override a PO variance without a documented change order. Investor auditors sample overrides first.',
  },
  {
    id: 'ex_missing_rog',
    code: 'EX_NO_ROG',
    title: 'Missing Receipt of Goods (ROG)',
    severity: 'High',
    frequency: 'Very Common (Daily)',
    software: 'Both (RealPage & Yardi)',
    module: '02_accounts_payable',
    navigation: {
      realpage: ['Applications', 'Spend Management', 'All', 'Purchase Orders', 'Receive'],
      yardi: ['Purchasing', 'Purchase Order', 'Receive'],
    },
    symptom: 'The invoice is matched to a PO, but the site has not recorded a receipt, so the 3-way match cannot complete and the invoice sits unpaid.',
    rootCause: [
      'Goods were delivered but the maintenance supervisor did not click Receive.',
      'Contractor finished the work but completion was not verified.',
      'Partial delivery: only part of the order arrived.',
      'Invoice was keyed manually (not from the PO), so it bypassed matching while the PO still waits for a receipt, which risks double billing.',
    ],
    auditRisk: 'Receiving without inspection, or paying without a receipt, defeats the 3-way-match control. A manual invoice plus a later PO conversion can pay the vendor twice.',
    diagnosticReport: {
      name: 'Receiving Goods for a Purchase Order / open PO list',
      screenId: 'scr_ap_receiving_goods_for_a_purchase_order',
      whatToLookFor: 'Open PO lines with delivery dates past due and no receipt; search A/P for a manual invoice with the same vendor and amount.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Has a manual A/P invoice (not linked to the PO) already been posted for this vendor and amount?',
        options: [
          { label: 'Yes', outcome: 'Duplicate risk: do NOT convert the PO. Close the PO (or its lines) with reason "invoiced manually" and attach the PO to the manual invoice.' },
          { label: 'No', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Did the site confirm physical delivery or completion (delivery slip, photo, supervisor sign-off)?',
        options: [
          { label: 'Yes', outcome: 'Site records the receipt for the actual quantity; the invoice then matches and continues to approval.' },
          { label: 'No', next: 'q3' },
        ],
      },
      {
        id: 'q3',
        question: 'Is it month-end, with the goods/services received but not yet confirmed?',
        options: [
          { label: 'Yes', outcome: 'Accrue the received-not-invoiced amount (auto-reversing) and keep chasing the receipt.' },
          { label: 'No', outcome: 'Hold the invoice; send the daily pending-ROG list to the PM and maintenance supervisor.' },
        ],
      },
    ],
    resolutionSOP: [
      'Export open PO lines without receipts older than 24 hours.',
      'Check A/P for manual invoices from the same vendor and amount before any conversion.',
      'Email the maintenance supervisor and PM with the PO#, vendor, items and delivery date.',
      'Site records the receipt (actual quantity) with the delivery slip attached.',
      'Re-run matching; the invoice proceeds to approval.',
      'At month-end, accrue confirmed deliveries that are still unreceived in the system.',
    ],
    adjustingEntries: [
      {
        label: 'Month-end accrual for goods received but not yet received in the system ($1,850)',
        lines: [
          { account: '6110 Repairs & Maintenance', debit: 1850 },
          { account: '2020 Accrued Expenses', credit: 1850 },
        ],
        memo: 'Accrual — PO #xxxx delivered MM/DD, receipt pending; auto-reverse day 1.',
      },
      {
        label: 'Reverse a duplicate invoice created by PO conversion ($1,850)',
        lines: [
          { account: '2010 Accounts Payable', debit: 1850 },
          { account: '6110 Repairs & Maintenance', credit: 1850 },
        ],
        memo: 'Reverse duplicate of manual invoice #xxxx.',
      },
    ],
    relatedScreenIds: ['scr_ap_purchase_orders_list', 'scr_gl_adding_an_accrual_template_for_invoices_not_received'],
    proTip: 'The site must never "receive to clear the queue". A receipt is the owner\'s evidence that it got what it paid for.',
  },
  {
    id: 'ex_vendor_hold',
    code: 'EX_VEND_HOLD',
    title: 'Vendor Compliance Block (COI / W-9 / Backup Withholding)',
    severity: 'High',
    frequency: 'Common (Weekly)',
    software: 'Both (RealPage & Yardi)',
    module: '02_accounts_payable',
    navigation: {
      realpage: ['Applications', 'Accounts Payable', 'All', 'Vendors', 'Edit', 'Insurance/License tab'],
      yardi: ['Payables', 'Vendor', 'Insurance / 1099 tabs (VendorCafe compliance)'],
    },
    symptom: 'The vendor cannot be paid (or new POs are blocked) because its certificate of insurance expired, the W-9 is missing, or the TIN is invalid and backup withholding applies.',
    rootCause: [
      'COI expired and the vendor did not send a renewal.',
      'Vendor was set up without a W-9 (emergency vendor) and was never completed.',
      'IRS TIN mismatch (B-notice), so backup withholding (24%) is required.',
      'Vendor status set to "Don\'t pay" or inactive by credentialing.',
    ],
    auditRisk: 'Paying an uninsured contractor shifts injury and property-damage liability to the owner. Missing W-9s bring IRS penalties, and backup withholding not remitted is a trust-fund tax liability.',
    diagnosticReport: {
      name: 'Vendor Insurance Report',
      screenId: 'scr_ap_vendor_insurance_report',
      whatToLookFor: 'Vendors with expired or expiring coverage who have open invoices; vendors without tax ID or W-9 on file.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Is the block caused by an expired or missing COI?',
        options: [
          { label: 'Yes', outcome: 'Request the renewed COI (owner and management company named as additional insured), update the Insurance/License tab, then release the invoice.' },
          { label: 'No', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Is a W-9 missing, or did the IRS report a TIN mismatch (B-notice)?',
        options: [
          { label: 'Yes', next: 'q3' },
          { label: 'No', outcome: 'Check vendor status ("Don\'t pay"/inactive) and the approval policy for vendors; resolve with vendor management.' },
        ],
      },
      {
        id: 'q3',
        question: 'Must the payment be made before a valid W-9 is received?',
        options: [
          { label: 'Yes', outcome: 'Apply 24% backup withholding: pay the net amount and record the withholding liability for remittance to the IRS.' },
          { label: 'No', outcome: 'Hold payment until the W-9 is received and TIN-matched; update the vendor 1099 information.' },
        ],
      },
    ],
    resolutionSOP: [
      'Run the Vendor Insurance Report weekly; list vendors with open invoices and compliance gaps.',
      'Request the renewed COI or W-9 from the vendor (never accept bank changes in the same email without call-back).',
      'Update the vendor record (Insurance/License tab, 1099 information) and attach the documents.',
      'Release held invoices and include them in the next payment run.',
      'If paying before a valid W-9: withhold 24%, remit through the payroll/tax process, and report on the 1099.',
    ],
    adjustingEntries: [
      {
        label: 'Payment of a $1,000 invoice with 24% backup withholding',
        lines: [
          { account: '2010 Accounts Payable', debit: 1000 },
          { account: '1110 Operating Cash', credit: 760 },
          { account: '2180 Backup Withholding Payable', credit: 240 },
        ],
        memo: 'Backup withholding — missing/invalid TIN; remit with Form 945.',
      },
      {
        label: 'Remit backup withholding to the IRS',
        lines: [
          { account: '2180 Backup Withholding Payable', debit: 240 },
          { account: '1110 Operating Cash', credit: 240 },
        ],
        memo: 'EFTPS remittance of backup withholding.',
      },
    ],
    relatedScreenIds: ['scr_ap_vendors_suppliers_insurance_license_tab', 'scr_ap_adding_insurance_or_license_information_to_a_vendor', 'scr_ap_1099_information_for_the_vendor'],
    proTip: 'Keep emergency vendors to a minimum and complete their compliance within 5 days. Most vendor-fraud cases start with "urgent new vendor".',
  },
  {
    id: 'ex_unbalanced_rec',
    code: 'EX_UNBAL_REC',
    title: 'Unbalanced Bank Reconciliation',
    severity: 'Critical',
    frequency: 'Common (Monthly)',
    software: 'Both (RealPage & Yardi)',
    module: '03_cash_management',
    navigation: {
      realpage: ['Applications', 'Cash Management', 'All', 'Periodic Tasks', 'Reconciliation', 'Bank'],
      yardi: ['Financials', 'Bank Reconciliation'],
    },
    symptom: 'The adjusted book balance does not equal the adjusted bank balance, so the reconciliation shows a difference and cannot be finalized.',
    rootCause: [
      'Timing differences not identified (deposits in transit, outstanding checks) or items cleared in the wrong month.',
      'Unrecorded wire or ACH debit (utility, loan payment, tax).',
      'NSF chargeback posted by the bank but not reversed in A/R.',
      'Merchant processing fees netted from card deposits (deposit recorded gross, bank credited net).',
      'Encoding error: a check cleared for a different amount than written.',
    ],
    auditRisk: 'Unreconciled cash is the most serious close finding. It can hide misappropriation, and unexplained reconciling items are escalated to the owner.',
    diagnosticReport: {
      name: 'Bank Reconciliation (New) + unmatched bank transactions',
      screenId: 'scr_cash_why_doesnt_my_bank_reconciliation_balance_match_the_bank_stateme',
      whatToLookFor: 'Unmatched bank lines, the beginning balance vs. the prior rec ending balance, and items with the same amount but different signs.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Does this rec\'s beginning balance equal last month\'s reconciled ending balance?',
        options: [
          { label: 'No', outcome: 'A prior-month item was un-cleared or edited after finalizing. Compare the prior rec report with current cleared items and correct the prior-period change first.' },
          { label: 'Yes', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Are there unmatched bank lines (debits or credits) with no book transaction?',
        options: [
          { label: 'Yes', outcome: 'Record them: wires/auto-debits as payments, NSFs as A/R reversals, fees/interest as transactions (see entry). Then match.' },
          { label: 'No', next: 'q3' },
        ],
      },
      {
        id: 'q3',
        question: 'Is the difference divisible by 9, or equal to a single check amount?',
        options: [
          { label: 'Yes', outcome: 'Likely a transposition or encoding error: compare cleared check amounts with the bank image; correct the check or ask the bank for an encoding adjustment.' },
          { label: 'No', outcome: 'Check merchant deposits recorded gross vs. net and card chargebacks; record the fee/chargeback difference.' },
        ],
      },
    ],
    resolutionSOP: [
      'Confirm the statement ending balance and date entered in the rec match the bank statement.',
      'Verify the beginning balance equals last month\'s reconciled balance.',
      'Run auto-match, then work unmatched bank lines oldest first.',
      'Create transactions for bank-only items (fees, interest, wires, auto-debits, NSFs, merchant fees).',
      'Match remaining book items; list true timing items (DIT, outstanding checks).',
      'Difference = $0.00: finalize and submit for approval; attach statement and rec report.',
    ],
    adjustingEntries: [
      {
        label: 'Record merchant processing fees and an NSF chargeback found on the statement',
        lines: [
          { account: '6420 Bank Charges (merchant fees)', debit: 125.4 },
          { account: '1210 Resident A/R (NSF re-opened)', debit: 1450 },
          { account: '1110 Operating Cash', credit: 1575.4 },
        ],
        memo: 'Bank statement MM/YYYY: card processing fees + NSF item #xxxx.',
      },
    ],
    relatedScreenIds: ['scr_cash_bank_reconciliation_new', 'scr_cash_creating_transactions_or_journal_entries_for_unmatched_transacti', 'scr_ar_reversing_payments'],
    proTip: 'Never force a rec with a plug to "miscellaneous". Every difference has a transaction behind it, and plugs are the first thing auditors test.',
  },
  {
    id: 'ex_gpr_variance',
    code: 'EX_GPR_VAR',
    title: 'Gross Potential Rent (GPR) Tie-Out Variance',
    severity: 'High',
    frequency: 'Common (Monthly)',
    software: 'Both (RealPage & Yardi)',
    module: '04_accounts_receivable',
    navigation: {
      realpage: ['Applications', 'Reports', 'Rent Roll / Lost Rent Summary', 'vs', 'General Ledger', 'Trial Balance (4010)'],
      yardi: ['Analytics', 'Residential Analytics', 'Gross Potential Rent', 'vs', 'Financial Analytics', 'Trial Balance'],
    },
    symptom: 'Rent-roll GPR (units × market rent) does not tie to GL 4010, or the GPR-to-net-rent bridge (loss to lease, vacancy, concessions, NRU, bad debt) leaves an unexplained difference.',
    rootCause: [
      'Concessions posted as a reduction of rent (4010) instead of the concession contra account (4040).',
      'Market rent updated in the rent roll after GPR posted, or a unit missing from the rent roll.',
      'Down/model units excluded from GPR instead of posted as non-revenue loss.',
      'Mid-month move-in/move-out proration differences.',
    ],
    auditRisk: 'Misstated revenue components hide effective-rent trends and concessions from the owner. Lenders underwriting from the T-12 rely on GPR and concession lines.',
    diagnosticReport: {
      name: 'Rent Roll & GPR Tie-Out (Lost Rent Summary / Rent Roll Detail)',
      screenId: 'scr_ar_gpr_tieout',
      whatToLookFor: 'Unit count × market rent vs. GL 4010; concession amounts by resident vs. GL 4040; unit status (model/down).',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Does the rent roll unit count (occupied + vacant + NRU) equal the property\'s total units?',
        options: [
          { label: 'No', outcome: 'Unit missing or duplicated: fix unit status or setup, re-run the rent roll, then recompute GPR.' },
          { label: 'Yes', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Does the variance equal total concessions (or a specific resident concession)?',
        options: [
          { label: 'Yes', outcome: 'Concession miscoded to rent: reclass from 4010 to 4040 (see entry) and fix the charge code mapping.' },
          { label: 'No', next: 'q3' },
        ],
      },
      {
        id: 'q3',
        question: 'Does the variance equal the market rent of model/down units?',
        options: [
          { label: 'Yes', outcome: 'NRU not in GPR: post GPR at market for NRUs and offset to non-revenue unit loss.' },
          { label: 'No', outcome: 'Check proration and market-rent changes mid-month; compare daily GPR postings with the rent roll snapshot.' },
        ],
      },
    ],
    resolutionSOP: [
      'Run the month-end rent roll and the Lost Rent Summary report.',
      'Compute GPR = Σ market rent for all units; compare to GL 4010.',
      'Bridge: GPR − loss to lease − vacancy − concessions − NRU − bad debt = net rental income; compare each line to the GL.',
      'Use the wizard to isolate the component; reclass as needed.',
      'Correct the root cause (charge code mapping, unit status) so next month ties.',
    ],
    adjustingEntries: [
      {
        label: 'Reclass concession posted against rent revenue ($2,400)',
        lines: [
          { account: '4040 Concessions', debit: 2400 },
          { account: '4010 Gross Potential Rent', credit: 2400 },
        ],
        memo: 'Reclass move-in concession units 204/311 from rent to concessions.',
      },
    ],
    relatedScreenIds: ['scr_reporting_lost_rent_summary_report', 'scr_gl_rent_roll_report', 'scr_ap_recording_concessions'],
    proTip: 'A quick sanity check: total units × average market rent should be within 1% of GL GPR. If not, start with unit count.',
  },
  {
    id: 'ex_prepaid_mismatch',
    code: 'EX_PREPAID_MM',
    title: 'Prepaid Amortization Mismatch',
    severity: 'Medium',
    frequency: 'Common (Monthly)',
    software: 'Both (RealPage & Yardi)',
    module: '01_general_ledger',
    navigation: {
      realpage: ['Applications', 'General Ledger', 'All', 'Prepaids', 'View Schedule'],
      yardi: ['Financials', 'Recurring Journal Entry', 'Amortization'],
    },
    symptom: 'The amortization schedule has ended (or is on its final month), but GL 1310 Prepaid still carries a balance — or the GL balance differs from the schedule\'s remaining unamortized amount.',
    rootCause: [
      'Policy renewed or cancelled mid-term without adjusting the schedule.',
      'Invoice amount changed (endorsement, audit premium) after the schedule was created.',
      'A prepaid payment was coded to 1310 with no schedule created.',
      'Manual JE posted to 1310 outside the prepaid module.',
    ],
    auditRisk: 'Stale prepaid balances overstate assets and understate expense. Insurance and tax prepaids are sampled in lender and audit reviews.',
    diagnosticReport: {
      name: 'Prepaid Expenses Report / Prepaid Journal Entries List',
      screenId: 'scr_close_prepaid_expenses_report',
      whatToLookFor: 'GL 1310 by vendor/policy vs. schedule remaining balance; schedules with end date ≤ current month and remaining balance > 0.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Is there a GL 1310 balance with no prepaid schedule behind it?',
        options: [
          { label: 'Yes', outcome: 'Create the missing prepaid schedule from the invoice (start = coverage start) and post catch-up amortization.' },
          { label: 'No', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Has the schedule ended with a balance still on the GL?',
        options: [
          { label: 'Yes', outcome: 'Expense the remaining balance (formula: GL balance − schedule remaining) in the current month.' },
          { label: 'No', outcome: 'Schedule amount ≠ invoice: adjust the schedule to the final premium and true up the amortization to date.' },
        ],
      },
    ],
    resolutionSOP: [
      'Export GL 1310 detail and the prepaid schedule list.',
      'For each policy/contract: expected remaining = total premium × remaining months ÷ term months.',
      'True-up = GL balance − expected remaining.',
      'Post the true-up (current period) and fix the schedule (renewal, cancellation or endorsement).',
      'Tie GL 1310 to the Prepaid Expenses report after posting.',
    ],
    adjustingEntries: [
      {
        label: 'Expense remaining balance on an expired insurance schedule ($1,275)',
        lines: [
          { account: '6610 Insurance Expense', debit: 1275 },
          { account: '1310 Prepaid Expenses', credit: 1275 },
        ],
        memo: 'True-up: GL 1310 $1,275 − schedule remaining $0 = $1,275 (policy #xxxx expired MM/DD).',
      },
    ],
    relatedScreenIds: ['scr_gl_prepaid_journal_entries_list', 'scr_gl_adding_a_prepaid_journal_entry', 'scr_gl_amortization'],
    proTip: 'Formula to keep in the close binder: remaining prepaid = premium × (months left ÷ term months). Any GL difference is the true-up.',
  },
  {
    id: 'ex_negative_trust',
    code: 'EX_NEG_TRUST',
    title: 'Negative Cash in the Security Deposit Trust Account',
    severity: 'Critical',
    frequency: 'Occasional',
    software: 'Both (RealPage & Yardi)',
    module: '03_cash_management',
    navigation: {
      realpage: ['Applications', 'Cash Management', 'All', 'Bank Accounts', 'Security Deposit Trust', 'Reconciliation'],
      yardi: ['Financials', 'Bank Reconciliation', 'Deposit bank'],
    },
    symptom: 'The book (or bank) balance of the segregated security-deposit account is negative or below the deposit liability (GL 2110).',
    rootCause: [
      'Operating invoices paid from the deposit bank account (wrong default bank on the vendor or property).',
      'Deposit refunds paid from trust exceeded deposits held (damages not applied, or duplicate refund).',
      'New deposits collected into operating cash and never transferred to trust.',
      'Interest owed to residents (where required) not funded.',
    ],
    auditRisk: 'Many states require deposits to be held in trust and never commingled. A shortfall is a regulatory violation and a fiduciary breach, reportable to the owner immediately.',
    diagnosticReport: {
      name: 'Cash & Cash Equivalents Report + Security Deposits report',
      screenId: 'scr_close_cash_and_cash_equivalents_report',
      whatToLookFor: 'Trust bank GL balance vs. GL 2110 liability; payments from the trust bank that are not deposit refunds.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Were any non-refund payments (vendor invoices) drawn on the trust bank account?',
        options: [
          { label: 'Yes', outcome: 'Commingling: reclass those payments to operating cash and transfer the funds back to trust immediately. Then fix the default bank setting.' },
          { label: 'No', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Were deposits collected this month recorded in operating cash?',
        options: [
          { label: 'Yes', outcome: 'Transfer the collected deposits from operating to trust (see entry).' },
          { label: 'No', outcome: 'Review refunds: compare each refund with the FAS. Recover duplicate or overpaid refunds and fund the gap from operating.' },
        ],
      },
    ],
    resolutionSOP: [
      'Notify the controller the same day; a trust shortfall is not a month-end-only item.',
      'Reconcile the trust bank and list every disbursement in the period.',
      'Identify commingled payments, missing deposit transfers or excess refunds (wizard).',
      'Transfer funds from operating to trust for the shortfall; record the transfer.',
      'Correct vendor/property default bank settings so operating bills cannot draw on trust.',
      'Document the incident and remediation for the owner.',
    ],
    adjustingEntries: [
      {
        label: 'Fund the trust shortfall from operating cash ($3,200)',
        lines: [
          { account: '1115 Security Deposit Trust Cash', debit: 3200 },
          { account: '1110 Operating Cash', credit: 3200 },
        ],
        memo: 'Restore trust: deposits collected MM/YYYY recorded in operating.',
      },
    ],
    relatedScreenIds: ['scr_gl_security_deposits_multifamily', 'scr_cash_adding_a_funds_transfer', 'scr_cash_bank_rec'],
    proTip: 'Rule of thumb: the trust balance must always be at least GL 2110. Check it weekly, not only at close.',
  },
  {
    id: 'ex_intercompany_oob',
    code: 'EX_IC_OOB',
    title: 'Intercompany Out-of-Balance (Property LLC vs Management Entity)',
    severity: 'High',
    frequency: 'Common (Monthly)',
    software: 'Both (RealPage & Yardi)',
    module: '01_general_ledger',
    navigation: {
      realpage: ['Applications', 'General Ledger', 'Reports', 'Trial Balance', 'Due To / Due From accounts by entity'],
      yardi: ['Analytics', 'Financial Analytics', 'Trial Balance', 'Intercompany accounts'],
    },
    symptom: 'The property\'s Due To Management Company (2130) does not equal the management entity\'s Due From Property (1230).',
    rootCause: [
      'Billback recorded by one entity only (management company billed, property did not record, or the reverse).',
      'Settlement wire recorded in a different month on each side.',
      'Manual JE to Due To/Due From without the counter-entry (bypassing inter-entity mapping).',
      'Payroll allocation posted to the wrong property.',
    ],
    auditRisk: 'Intercompany differences prevent clean consolidation and may hide unapproved fund movements between owner and manager entities.',
    diagnosticReport: {
      name: 'Trial Balance by entity (intercompany matrix)',
      screenId: 'scr_gl_trial_balance_report',
      whatToLookFor: 'Each entity pair\'s Due From vs. Due To; then GL detail of both accounts for the month to find the one-sided entry.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Does the difference equal a single billback or payroll allocation amount?',
        options: [
          { label: 'Yes', outcome: 'One-sided billback: record the missing side in the other entity (see entry) using the same invoice reference.' },
          { label: 'No', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Does it equal a settlement wire recorded in a different month by the other entity?',
        options: [
          { label: 'Yes', outcome: 'Timing: record the settlement in the same period on both sides (use the bank date).' },
          { label: 'No', outcome: 'Check manual JEs to intercompany accounts and fix inter-entity mapping so both sides post automatically.' },
        ],
      },
    ],
    resolutionSOP: [
      'Build the intercompany matrix from the trial balance (every entity pair).',
      'Pull GL detail for both sides of the out-of-balance pair for the month.',
      'Match entries by reference/amount; isolate the one-sided or mistimed item.',
      'Record the missing side or correct the period.',
      'Re-run the matrix: net intercompany = $0.00.',
    ],
    adjustingEntries: [
      {
        label: 'Record the missing management-entity side of a payroll billback ($4,560)',
        lines: [
          { account: '1230 Due From Affiliates (Property LLC)', debit: 4560 },
          { account: '6010 Payroll (recovery)', credit: 4560 },
        ],
        memo: 'Mirror property billback #xxxx recorded DR 6010 / CR 2130.',
      },
    ],
    relatedScreenIds: ['scr_gl_inter_entity_account_mapping_page', 'scr_ar_intercompany_bill_backs', 'scr_reporting_running_consolidations'],
    proTip: 'Always use the same reference number on both sides of an intercompany entry; the tie-out takes minutes instead of hours.',
  },
  {
    id: 'ex_duplicate_invoice',
    code: 'EX_DUP_INV',
    title: 'Duplicate Invoice (Same Vendor Invoice # Across Fiscal Years)',
    severity: 'High',
    frequency: 'Common (Weekly)',
    software: 'Both (RealPage & Yardi)',
    module: '02_accounts_payable',
    navigation: {
      realpage: ['Applications', 'Accounts Payable', 'All', 'Invoice Research'],
      yardi: ['Payables', 'Payable', 'Find (vendor + invoice #)'],
    },
    symptom: 'The same vendor invoice number (or the same amount and date) exists twice. The copies are often in different fiscal years, so the prior-year copy is outside the current duplicate check.',
    rootCause: [
      'Vendor re-sent a past-due invoice (statement or reminder) and it was keyed again.',
      'Invoice keyed with a variation (leading zeros, suffix, spaces) that defeats the duplicate check.',
      'Duplicate check limited to the current year/period in configuration.',
      'Paper invoice and emailed PDF both processed.',
    ],
    auditRisk: 'Duplicate payments are a leading source of cash leakage. Paid duplicates in a closed prior year also misstate prior-year expense.',
    diagnosticReport: {
      name: 'Invoice Research (search by vendor, invoice #, amount)',
      screenId: 'scr_ap_invoice_research',
      whatToLookFor: 'Same vendor + amount within ±60 days, or the invoice number normalized (strip zeros/spaces) across all years.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Has the duplicate been paid?',
        options: [
          { label: 'No', outcome: 'Reverse (or delete, if still a draft) the duplicate invoice before the payment run.' },
          { label: 'Yes', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Is the duplicate in a closed prior fiscal year?',
        options: [
          { label: 'Yes', outcome: 'Do not reopen the year: record the vendor refund receivable in the current period (prior-period overpayment recovery) and request a refund or credit.' },
          { label: 'No', outcome: 'Request a vendor refund or credit memo; record the receivable and reverse the duplicate expense in the current period.' },
        ],
      },
    ],
    resolutionSOP: [
      'Search Invoice Research by vendor, amount and normalized invoice number across all years.',
      'Confirm the duplicate against the image (same service period and amount).',
      'Unpaid: reverse or delete it. Paid: contact the vendor for a refund or a credit against open invoices.',
      'Record the receivable/credit (see entry) and note the original invoice number.',
      'Standardize invoice-number keying (no leading zeros, no spaces) and enable the duplicate warning.',
    ],
    adjustingEntries: [
      {
        label: 'Paid duplicate in a closed prior year — record vendor refund receivable ($2,150)',
        lines: [
          { account: '1220 Other Receivables (vendor refund)', debit: 2150 },
          { account: '6110 Repairs & Maintenance', credit: 2150 },
        ],
        memo: 'Duplicate of invoice #xxxx paid MM/DD/YYYY; refund requested.',
      },
      {
        label: 'Unpaid duplicate in the current year — reverse the invoice ($2,150)',
        lines: [
          { account: '2010 Accounts Payable', debit: 2150 },
          { account: '6110 Repairs & Maintenance', credit: 2150 },
        ],
        memo: 'Reverse duplicate invoice #xxxx.',
      },
    ],
    relatedScreenIds: ['scr_ap_reversing_an_unpaid_a_p_invoice', 'scr_ap_adding_an_a_p_credit_or_debit_adjustment'],
    proTip: 'RealPage does not check for duplicate journal entries on import, and invoice checks depend on configuration. Treat "urgent past due" vendor emails as duplicate suspects.',
  },
  {
    id: 'ex_1099_miscode',
    code: 'EX_1099_MISCODE',
    title: '1099 Non-Employee Compensation Miscode (Box 1 vs Box 7)',
    severity: 'Medium',
    frequency: 'Seasonal (Q4 / January)',
    software: 'Both (RealPage & Yardi)',
    module: '02_accounts_payable',
    navigation: {
      realpage: ['Applications', 'Accounts Payable', 'All', 'Vendors', 'Edit', 'Additional information (1099)'],
      yardi: ['Payables', 'Vendor', '1099 tab'],
    },
    symptom: 'A contractor\'s payments report in the wrong 1099 box. Typically the vendor profile still uses legacy 1099-MISC Box 7 (non-employee compensation before 2020) or MISC Box 1 (Rents), when payments should be 1099-NEC Box 1.',
    rootCause: [
      'Vendor profile created before tax year 2020, when non-employee compensation moved from 1099-MISC Box 7 to 1099-NEC Box 1.',
      'Vendor type mapped to MISC Box 1 (Rents) — correct for landlords and equipment lessors, wrong for contractors.',
      'Payments made before the 1099 flag was set are missing from 1099 totals.',
      'Attorney payments not flagged (MISC Box 10 gross proceeds / NEC Box 1 fees).',
    ],
    auditRisk: 'Wrong forms or boxes trigger IRS CP2100/B-notices and per-form penalties, plus vendor disputes. There is no financial-statement impact.',
    diagnosticReport: {
      name: '1099 information for the vendor + 1099 reports',
      screenId: 'scr_ap_1099_information_for_the_vendor',
      whatToLookFor: 'Vendor 1099 type/box; YTD 1099 totals vs. payments to the vendor; vendors with payments over $600 and no 1099 type.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Is the vendor paid for services (labor, contracting, professional fees)?',
        options: [
          { label: 'Yes', outcome: 'Should be 1099-NEC Box 1: update the vendor 1099 type/box and run a 1099 transaction update so year-to-date payments move to NEC Box 1.' },
          { label: 'No', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Is the vendor paid rent (land, space, equipment)?',
        options: [
          { label: 'Yes', outcome: 'Correct box is 1099-MISC Box 1 (Rents); leave as is.' },
          { label: 'No', outcome: 'Check exemptions (corporations, credit-card/1099-K payments) and remove the 1099 flag if exempt.' },
        ],
      },
    ],
    resolutionSOP: [
      'Run the 1099 report for the year and export vendors with totals by form/box.',
      'Classify each vendor (services → NEC Box 1; rents → MISC Box 1; attorneys → NEC/MISC Box 10 as applicable).',
      'Update the vendor record and apply a 1099 transaction update for payments already made.',
      'Exclude card/third-party network payments (reported on 1099-K).',
      'Re-run the report, reconcile to vendor payment totals, then file; issue corrected forms if already filed.',
    ],
    adjustingEntries: [],
    noEntryReason: 'No journal entry: 1099 box/type is tax-reporting metadata. Correct the vendor profile and run a 1099 transaction update; the GL is unaffected.',
    relatedScreenIds: ['scr_ap_guide_to_vendor_1099s', 'scr_gl_importing_vendor_1099_transaction_update', 'scr_ap_correcting_a_mistake_on_a_1099_form'],
    proTip: 'Review 1099 setup in October, not January. Fixing box codes before year-end avoids corrected forms.',
  },
  {
    id: 'ex_retainage',
    code: 'EX_RETAINAGE',
    title: 'Retainage Payable Withholding on a CapEx PO / Contract',
    severity: 'Medium',
    frequency: 'Common (Monthly on active projects)',
    software: 'Both (RealPage & Yardi)',
    module: '06_jobcost_capex_reserves',
    navigation: {
      realpage: ['Applications', 'Job Cost & Reserves', 'All', 'Reports', 'Retainage Register'],
      yardi: ['Job Cost', 'Contract', 'Retention'],
    },
    symptom: 'A contractor pay application withheld 10% retainage, but retainage is not recorded as a liability, or the release at completion is not processed (or is paid without a final lien waiver).',
    rootCause: [
      'Invoice entered at the net amount paid instead of the gross pay application with retainage withheld.',
      'Retainage percentage missing on the contract/subcontract.',
      'Release paid before substantial completion or without an unconditional final lien waiver.',
      'Retainage released on the draw but not on A/P (or the reverse).',
    ],
    auditRisk: 'Unrecorded retainage understates liabilities and project cost. Releasing without lien waivers exposes the owner to mechanic\'s liens and double payment.',
    diagnosticReport: {
      name: 'Retainage Register Report',
      screenId: 'scr_jobcost_retainage_register_report',
      whatToLookFor: 'Retainage held by contract vs. contract terms (e.g. 10% until 50% complete, 5% after); GL 2015 vs. register total.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Was the pay application entered at the gross amount with retainage withheld?',
        options: [
          { label: 'No', outcome: 'Re-enter the pay application gross: cost = full amount earned, A/P = net due, retainage payable = withheld.' },
          { label: 'Yes', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Is the job substantially complete with an unconditional final lien waiver received?',
        options: [
          { label: 'Yes', outcome: 'Release retainage: move it from 2015 to A/P and include it in the next payment run and draw.' },
          { label: 'No', outcome: 'Hold retainage; do not release until the waiver and punch list are complete.' },
        ],
      },
    ],
    resolutionSOP: [
      'Confirm the retainage % and release terms on the contract.',
      'Enter each pay application gross with retainage withheld.',
      'Tie GL 2015 to the Retainage Register monthly.',
      'At completion: obtain the unconditional final lien waiver and sign-off, then release retainage.',
      'Include the release in the draw request if the project is lender-funded.',
    ],
    adjustingEntries: [
      {
        label: 'Pay application #3: $50,000 earned, 10% retainage withheld',
        lines: [
          { account: '1410 Construction in Progress', debit: 50000 },
          { account: '2010 Accounts Payable', credit: 45000 },
          { account: '2015 Retainage Payable', credit: 5000 },
        ],
        memo: 'Pay app #3, contract #xxxx, 10% retainage.',
      },
      {
        label: 'Release retainage on final lien waiver',
        lines: [
          { account: '2015 Retainage Payable', debit: 5000 },
          { account: '2010 Accounts Payable', credit: 5000 },
        ],
        memo: 'Retainage release — unconditional final waiver dated MM/DD.',
      },
    ],
    relatedScreenIds: ['scr_jobcost_lien_releases', 'scr_jobcost_adding_a_job_cost_draw', 'scr_ap_adding_a_change_order_for_a_subcontract'],
    proTip: 'Record cost at the gross earned amount. CIP must reflect work performed, not cash paid.',
  },
  {
    id: 'ex_utility_trueup',
    code: 'EX_UTIL_TRUEUP',
    title: 'Utility Accrual True-Up (Estimate vs Actual Bill)',
    severity: 'Medium',
    frequency: 'Very Common (Monthly)',
    software: 'Both (RealPage & Yardi)',
    module: '01_general_ledger',
    navigation: {
      realpage: ['Applications', 'General Ledger', 'All', 'Accruals', 'Accrual Workbench'],
      yardi: ['Financials', 'Journal Entry', 'Auto Reverse'],
    },
    symptom: 'The month-end utility accrual differs from the actual bill that arrives the next month, or the accrual was not reversed and the expense is doubled.',
    rootCause: [
      'Estimate based on stale averages (seasonal usage, rate change).',
      'Accrual posted without an automatic reversal date.',
      'Actual bill posted to the wrong service month (bill date instead of service period).',
      'Multiple meters accrued once in total, making reconciliation impossible.',
    ],
    auditRisk: 'Doubled or missing utility expense distorts monthly NOI and the T-12 the lender uses. Material recurring misses signal weak cut-off controls.',
    diagnosticReport: {
      name: 'Accrued Expenses report / T-12 utilities by month',
      screenId: 'scr_close_accrued_expenses_report',
      whatToLookFor: 'Utility accruals without reversals; T-12 months with zero or doubled utility expense; accrual vs. actual by meter.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Did the prior-month accrual reverse on day 1 of this month?',
        options: [
          { label: 'No', outcome: 'Post the reversal now (see entry), dated in the current open period, then investigate why the auto-reversal was missing.' },
          { label: 'Yes', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Is the actual bill more than 10% different from the accrual?',
        options: [
          { label: 'Yes', outcome: 'The difference lands in the current month automatically (true-up). Update the estimate method, e.g. use the same month last year × rate change.' },
          { label: 'No', outcome: 'Normal true-up; no further action.' },
        ],
      },
    ],
    resolutionSOP: [
      'Maintain an accrual calculator by meter/account (average daily cost × unbilled days).',
      'Post accruals with the automatic reversal date = day 1 of next month.',
      'When the bill arrives, post it to its service period; the reversal nets the accrual.',
      'Review T-12 utilities monthly for missing or doubled months.',
      'Document variances over 10% and refine the estimate.',
    ],
    adjustingEntries: [
      {
        label: 'Month-end electric accrual (estimate $4,200)',
        lines: [
          { account: '6210 Utilities – Electric', debit: 4200 },
          { account: '2020 Accrued Expenses', credit: 4200 },
        ],
        memo: 'Accrue 31 unbilled days @ $135.48/day; auto-reverse day 1.',
      },
      {
        label: 'Day-1 reversal of the accrual',
        lines: [
          { account: '2020 Accrued Expenses', debit: 4200 },
          { account: '6210 Utilities – Electric', credit: 4200 },
        ],
        memo: 'Auto-reversal of prior-month accrual.',
      },
      {
        label: 'Actual bill posted ($4,650) — net true-up $450 in the new month',
        lines: [
          { account: '6210 Utilities – Electric', debit: 4650 },
          { account: '2010 Accounts Payable', credit: 4650 },
        ],
        memo: 'Actual invoice for service period; $450 over estimate.',
      },
    ],
    relatedScreenIds: ['scr_gl_adding_an_accrual_template_for_realpage_utility_management_pendi', 'scr_gl_scheduling_an_automatic_reversal_for_the_entry', 'scr_gl_accrual_workbench'],
    proTip: 'Accrue by meter, not in total. Reconciling a single lump-sum accrual to 14 meters is impossible.',
  },
  {
    id: 'ex_fas_discrepancy',
    code: 'EX_FAS_DISC',
    title: 'Security Deposit Disposition (FAS) — Charges Exceed Deposit',
    severity: 'High',
    frequency: 'Common (Weekly)',
    software: 'Both (RealPage & Yardi)',
    module: '04_accounts_receivable',
    navigation: {
      realpage: ['Applications', 'Accounts Receivable', 'Security Deposits', 'Move-out disposition'],
      yardi: ['Residents', 'Move Out', 'Deposit Accounting (FAS)'],
    },
    symptom: 'At move-out, unpaid rent plus damage and cleaning charges exceed the security deposit. The FAS shows a balance due, but deposit application, damage posting or write-off is missing or inconsistent.',
    rootCause: [
      'Damages posted to income without supporting invoices/photos.',
      'Deposit not applied (liability still on GL 2110 after move-out).',
      'Pet deposit handled separately and not applied.',
      'Balance owed not written off or sent to collections after the statutory period.',
    ],
    auditRisk: 'States penalize late or unsupported deposit dispositions (often 2–3× the deposit). Leaving applied deposits on 2110 overstates liabilities.',
    diagnosticReport: {
      name: 'Security Deposits - Multifamily report / Resident Deposit Audit',
      screenId: 'scr_reporting_resident_deposit_audit_by_fiscal_period_report',
      whatToLookFor: 'Moved-out residents still holding a deposit; FAS dated beyond the state deadline; balance-due residents not in collections.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Has the security (and pet) deposit been applied to the move-out charges?',
        options: [
          { label: 'No', outcome: 'Apply the deposits to the charges (see entry) and issue the FAS letter within the state deadline.' },
          { label: 'Yes', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Are the damage charges supported by move-out inspection photos and invoices?',
        options: [
          { label: 'No', outcome: 'Remove unsupported charges (credit adjustment) before the FAS. Unsupported deductions are the main source of tenant claims.' },
          { label: 'Yes', outcome: 'Send the balance due to collections after the notice period, then write it off to bad debt per policy.' },
        ],
      },
    ],
    resolutionSOP: [
      'List move-outs in the period and the state disposition deadline for each.',
      'Post final charges (prorated rent, damages, cleaning) with support.',
      'Apply security and pet deposits to charges; prepare the FAS letter.',
      'Refund any credit balance through A/P, or send the balance due to collections.',
      'Write off uncollectible balances per policy; reconcile GL 2110 to the deposit report.',
    ],
    adjustingEntries: [
      {
        label: 'Post move-out damage and cleaning charges ($1,550)',
        lines: [
          { account: '1210 Resident A/R', debit: 1550 },
          { account: '4120 Damage Income', credit: 1300 },
          { account: '4100 Other Income (Cleaning)', credit: 250 },
        ],
        memo: 'Move-out unit 1207 — inspection MM/DD.',
      },
      {
        label: 'Apply the $1,000 security deposit to the resident balance',
        lines: [
          { account: '2110 Resident Security Deposits', debit: 1000 },
          { account: '1210 Resident A/R', credit: 1000 },
        ],
        memo: 'FAS: deposit applied to rent $600 + damages $1,300 + cleaning $250.',
      },
      {
        label: 'Write off remaining $1,150 after the collections period',
        lines: [
          { account: '4050 Bad Debt', debit: 1150 },
          { account: '1210 Resident A/R', credit: 1150 },
        ],
        memo: 'Sent to collections agency MM/DD.',
      },
    ],
    relatedScreenIds: ['scr_gl_security_deposits_multifamily', 'scr_ar_adding_an_a_r_adjustment', 'scr_ar_customer_aging_report'],
    proTip: 'Track move-out date plus the state deadline on a calendar. A missed deadline can forfeit the right to keep any of the deposit.',
  },
  {
    id: 'ex_pet_miscode',
    code: 'EX_PET_MISCODE',
    title: 'Pet Fee vs Pet Deposit GL Miscode',
    severity: 'Medium',
    frequency: 'Common (Monthly)',
    software: 'Both (RealPage & Yardi)',
    module: '04_accounts_receivable',
    navigation: {
      realpage: ['Applications', 'Accounts Receivable', 'Setup', 'Account Labels', 'Pet deposit / Pet fee'],
      yardi: ['Setup', 'Charge Codes', 'Pet Deposit / Pet Fee'],
    },
    symptom: 'Refundable pet deposits are posted to revenue (4100), or non-refundable pet fees are posted to the deposit liability (2110). Revenue and the deposit liability are both misstated.',
    rootCause: [
      'Account label/charge code for pet deposit mapped to an income account.',
      'Site staff used the pet fee code for a refundable deposit (or vice versa).',
      'Lease addendum terms (refundable vs non-refundable) not reflected in setup.',
    ],
    auditRisk: 'Refundable deposits recorded as income overstate revenue and understate liabilities. At move-out the refund has no liability to draw from.',
    diagnosticReport: {
      name: 'Security Deposits - Multifamily report vs GL 2110 / 4100 detail',
      screenId: 'scr_gl_security_deposits_multifamily',
      whatToLookFor: 'Pet deposit amounts on the deposit report missing from GL 2110; 4100 detail with "pet deposit" descriptions.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Is the pet charge refundable under the lease addendum?',
        options: [
          { label: 'Yes', outcome: 'It is a deposit: reclass from income to 2110 (see entry) and fix the charge-code/account-label mapping.' },
          { label: 'No', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Is it recurring monthly pet rent?',
        options: [
          { label: 'Yes', outcome: 'Pet rent is other income (4100). Make sure it is not posted to 4010 GPR.' },
          { label: 'No', outcome: 'A one-time non-refundable pet fee is income when earned. If it was posted to 2110, reclass to 4100.' },
        ],
      },
    ],
    resolutionSOP: [
      'Pull GL detail for 4100 and 2110 with pet-related descriptions for the period.',
      'Compare with lease addenda (refundable deposit vs non-refundable fee vs pet rent).',
      'Reclass misposted amounts (see entry).',
      'Correct the account label/charge code mapping so new charges post correctly.',
      'Re-run the deposit report tie-out to GL 2110.',
    ],
    adjustingEntries: [
      {
        label: 'Reclass refundable pet deposit posted to income ($500)',
        lines: [
          { account: '4100 Other Income (Pet)', debit: 500 },
          { account: '2110 Resident Security Deposits (Pet)', credit: 500 },
        ],
        memo: 'Refundable pet deposit per lease addendum, unit 318.',
      },
    ],
    relatedScreenIds: ['scr_reporting_resident_deposit_audit_by_fiscal_period_report', 'scr_ar_adding_an_a_r_adjustment'],
    proTip: '"Refundable" in the addendum means liability. Only non-refundable fees and pet rent are revenue.',
  },
  {
    id: 'ex_ap_subledger_oob',
    code: 'EX_AP_SUB_OOB',
    title: 'A/P Subledger Out-of-Balance with GL (Vendor Aging ≠ GL 2010)',
    severity: 'Critical',
    frequency: 'Occasional (Monthly check)',
    software: 'Both (RealPage & Yardi)',
    module: '02_accounts_payable',
    navigation: {
      realpage: ['Applications', 'Accounts Payable', 'Reports', 'Vendor Aging', 'vs', 'Trial Balance 2010'],
      yardi: ['Analytics', 'Payable Analytics', 'Aging', 'vs', 'Financial Analytics', 'Trial Balance'],
    },
    symptom: 'The vendor aging total at month-end does not equal the GL 2010 Accounts Payable balance on the trial balance.',
    rootCause: [
      'Manual journal entries posted directly to the A/P control account (not through the subledger).',
      'Payments dated before the invoice posting date, so aging and GL treat them in different periods.',
      'Reversals posting in a different period than the original (reversal configuration).',
      'Imported opening A/P balances or historical invoices without matching GL entries.',
      'Aging run with a different as-of date or entity filter than the trial balance.',
    ],
    auditRisk: 'An unreconciled A/P control account means liabilities may be misstated. It is a fundamental close control that auditors test every period.',
    diagnosticReport: {
      name: 'Running the Vendor Aging Report to Reconcile to the General Ledger',
      screenId: 'scr_ap_running_the_vendor_aging_report_to_reconcile_to_the_general_ledg',
      whatToLookFor: 'GL 2010 detail entries with source = General Ledger (manual JEs); payments with dates before invoice dates; reversals by period.',
    },
    diagnosticWizard: [
      {
        id: 'q1',
        question: 'Were the aging and trial balance run with the same as-of date, entity and location filters?',
        options: [
          { label: 'No', outcome: 'Re-run both with identical parameters before investigating. Most "differences" are filter mismatches.' },
          { label: 'Yes', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        question: 'Does GL 2010 detail include manual journal entries (source = G/L)?',
        options: [
          { label: 'Yes', outcome: 'Reverse the manual JE to A/P and record the item through the A/P subledger instead (see entries).' },
          { label: 'No', next: 'q3' },
        ],
      },
      {
        id: 'q3',
        question: 'Are there payments or reversals dated in a different period than their invoices?',
        options: [
          { label: 'Yes', outcome: 'Timing: correct the dates in the open period or document the reconciling item; review the A/P reversal configuration.' },
          { label: 'No', outcome: 'Check imported opening balances and historical invoices against the conversion JE.' },
        ],
      },
    ],
    resolutionSOP: [
      'Run the vendor aging and trial balance with identical as-of date and filters.',
      'Export GL 2010 detail for the period and filter source = General Ledger (manual).',
      'Reverse manual A/P entries and re-record them through A/P (adjustment or invoice).',
      'Review payment dates vs invoice posting dates and reversal periods.',
      'Re-run: aging = GL 2010; document any remaining timing items.',
      'Restrict manual JE access to the A/P control account going forward.',
    ],
    adjustingEntries: [
      {
        label: 'Reverse a manual JE that credited expense directly against A/P ($780)',
        lines: [
          { account: '6110 Repairs & Maintenance', debit: 780 },
          { account: '2010 Accounts Payable', credit: 780 },
        ],
        memo: 'Reverse GL-only JE #xxxx to A/P control; re-recorded as A/P credit adjustment.',
      },
      {
        label: 'Record the vendor credit through the A/P subledger ($780)',
        lines: [
          { account: '2010 Accounts Payable', debit: 780 },
          { account: '6110 Repairs & Maintenance', credit: 780 },
        ],
        memo: 'A/P credit adjustment for vendor xxxx (replaces manual JE).',
      },
    ],
    relatedScreenIds: ['scr_ap_aging_report', 'scr_ap_vendor_supplier_aging_report', 'scr_gl_trial_balance_report'],
    proTip: 'Make the A/P control account "subledger only" (no direct manual JEs) where your configuration allows. It prevents this exception entirely.',
  },
];

// Balanced-entry helper used by the UI and tests.
export const entryTotals = (entry) =>
  entry.lines.reduce(
    (acc, l) => ({ debit: acc.debit + (l.debit || 0), credit: acc.credit + (l.credit || 0) }),
    { debit: 0, credit: 0 }
  );
