"""
US legal, tax and accounting regulatory guardrails for every RealPage screen.

Each knowledge-base topic (scripts/rp_kb.py) maps to the regulation that governs the work done on
that screen: US GAAP (FASB ASC), the Internal Revenue Code and Treasury Regulations, SOX 404 /
COSO internal-control expectations, the UCC, NACHA and FinCEN rules, state landlord-tenant,
lien and unclaimed-property statutes, and the lender/HUD rules that bind multifamily owners.

State citations use Texas (plus California where the rule differs materially) as the reference
state, and the text says the rule "varies by state". Accountants must confirm the rule for the
property's state.

`guardrail_for(topic_key, action)` returns the regulatoryGuardrail object; actions that
change or remove posted records add the record-retention/audit-trail obligation.
"""

G = {}


def g(keys, authority, code, rule, risk):
    for k in keys.split():
        G[k] = {
            'governingAuthority': authority,
            'regulationCode': code,
            'plainEnglishRule': rule,
            'auditRisk': risk,
        }


# ── Platform, controls & records ──────────────────────────────────────────────────────────
g('help', 'COSO Internal Control Framework',
  'COSO 2013 Principle 4 (competence); SOX 404 control environment',
  'Owners must staff accounting with people trained to perform their controls. Use official documentation and support channels rather than guesswork when a system behaves unexpectedly, and document any workaround you apply.',
  'Undocumented workarounds and untrained operators are reported as control-environment deficiencies in SOX 404 / SOC 1 reviews, and errors they cause are not defensible to auditors.')

g('attachments', 'IRS Recordkeeping',
  'IRC § 6001; Treas. Reg. § 1.6001-1; Rev. Proc. 98-25 (electronic records)',
  'Every transaction must be supported by source documents (invoice, contract, bank statement, calculation) kept as long as they may be material to a tax return, generally at least 3 years after filing and 7 years in practice. Electronic images are acceptable if they are complete, legible and retrievable.',
  'Missing support lets the IRS disallow deductions (plus the 20% accuracy-related penalty under IRC § 6662), and auditors report unsupported entries as exceptions.')

g('audit_trail', 'SOX / Federal Records Law',
  'SOX § 802 (18 U.S.C. § 1519); SOX 404; AU-C 240 / PCAOB AS 2401',
  'The history of who created, changed, approved and posted a record is audit evidence and must never be altered or deleted. Changes are corrected with new, documented entries so the original trail stays visible.',
  'Tampering with or destroying records to obstruct an audit or investigation is a federal crime (up to 20 years under 18 U.S.C. § 1519). Gaps in audit trails are material-weakness indicators.')

g('import_generic', 'SOX 404 IT General Controls',
  'SOX 404 ITGC (data conversion & interfaces); Rev. Proc. 98-25',
  'Bulk imports bypass keyed-entry controls, so the loaded file must be reviewed, approved and reconciled to its source (record counts and control totals) before and after import. Keep the import file as the electronic record.',
  'Unreconciled or duplicate imports are a common source of misstatement. Auditors test conversion completeness and flag imports posted without review as ITGC deficiencies.')

g('ai_agent', 'SOX 404 / COSO (Automated Controls)',
  'SOX 404; COSO 2013 Principle 11 (technology general controls); IRC § 6001',
  'AI-captured and AI-coded transactions are still the accountant\'s responsibility: a human must review coding, amounts and supporting images before approval. The automation itself must be governed like any other IT control (access, change management, monitoring).',
  'Relying on unreviewed automated coding is treated as a missing review control. Misclassified expenses flow to tax returns and owner reports with no defensible sign-off.')

g('approval', 'SOX 404 / COSO (Segregation of Duties)',
  'SOX 404; COSO 2013 Principle 10 (control activities, segregation of duties)',
  'Transactions must be approved by someone with delegated authority who did not create them, within their dollar and property limits. Approval evidence must be retained in the system.',
  'Self-approval or approval beyond authority is a segregation-of-duties failure, the most frequently cited internal-control deficiency, and it opens the door to vendor fraud.')

g('ui security platform mobile company', 'SOX 404 IT General Controls',
  'SOX 404 ITGC (logical access & change management); AICPA SSAE 18 (SOC 1)',
  'System access must be limited to what each user\'s job requires, reviewed periodically and removed promptly when people leave. Configuration changes, custom rules and settings must be approved, tested and documented.',
  'Excessive access, shared logins or untested configuration changes are ITGC deficiencies. They undermine reliance on every automated control and appear as exceptions in SOC 1 and audit reports.')

# ── Procurement & payables ──────────────────────────────────────────────────────────────
g('storefront purchase_order', 'US GAAP / SOX 404',
  'ASC 440-10 (commitments); SOX 404 / COSO Principle 10 (authorization)',
  'Purchases must be authorized before the commitment is made, and received goods must be verified before payment (3-way match). Significant unrecorded purchase commitments must be disclosed in the financial statements.',
  'Paying without an approved PO or receipt is an authorization-control failure. Undisclosed material commitments are a GAAP disclosure deficiency.')

g('contract', 'US GAAP / State Contract & Prompt-Pay Law',
  'ASC 440-10 (commitments); ASC 360-10 (capital projects); state prompt-payment acts (e.g., TX Prop. Code ch. 28)',
  'Contracts and change orders fix what the owner may be billed, and costs above the approved contract value need a signed change order. Many states require owners to pay contractors within set deadlines (for example 35 days under Texas Property Code ch. 28).',
  'Paying above the contract without a change order is an authorization finding. Late payment can trigger statutory interest (e.g., 1.5%/month under TX Prop. Code § 28.004) and lien exposure.')

g('full_service', 'AICPA SSAE 18 (Service Organizations)',
  'AICPA SSAE 18 / AU-C 402 (SOC 1 Type II reports); SOX 404',
  'When invoice processing is outsourced, the owner still owns the control. Obtain and review the provider\'s SOC 1 Type II report and perform the complementary user-entity controls it lists (for example reviewing exceptions and approving invoices).',
  'Without a reviewed SOC 1 report and documented user-entity controls, auditors cannot rely on the outsourced process and must expand testing. That is often reported as a control gap.')

g('expense_report', 'IRS Accountable Plan Rules',
  'Treas. Reg. § 1.62-2 (accountable plans); IRC § 274(d) (substantiation)',
  'Employee reimbursements are tax-free only under an accountable plan: each expense needs a business purpose, receipts (required for lodging and for items of $75 or more) and submission within a reasonable time, and any excess must be returned. Unsubstantiated reimbursements are taxable wages.',
  'Non-compliant reimbursements must be reported as W-2 wages with payroll taxes; the IRS can assess the employer for unwithheld taxes and penalties. Auditors flag missing receipts and approvals.')

g('pc_card credit_card', 'IRS Substantiation / PCI DSS',
  'IRC § 274(d); IRC § 6001; PCI DSS v4.0 (card data security)',
  'Every card charge needs an itemized receipt, business purpose and correct property/GL coding before the statement closes. Full card numbers must never be stored in notes, attachments or spreadsheets.',
  'Unsupported card spend is disallowed for tax and is a top fraud red flag in audits. Storing card data violates PCI DSS and can bring card-brand fines and breach liability.')

g('escheat', 'State Unclaimed Property Law',
  'Revised Uniform Unclaimed Property Act (2016) as adopted by states; e.g., TX Prop. Code ch. 74; 12 Del. C. ch. 11',
  'Uncashed vendor checks and resident refunds become abandoned after the state dormancy period (commonly 1–5 years). The holder must attempt owner contact (due diligence), then report and remit them to the state; they cannot be written back to income.',
  'States audit holders (often via contract auditors) and assess the unreported property plus interest and penalties (e.g., up to 25% in some states). Writing stale checks back to income is a classic finding.')

g('1099', 'IRS Information Reporting',
  'IRC § 6041 / § 6041A (Forms 1099-NEC and 1099-MISC); IRC § 6721 / § 6722 (penalties); IRC § 3406',
  'Payments of $600 or more in a year to non-corporate vendors for services (1099-NEC Box 1) or rents (1099-MISC Box 1), and attorney payments, must be reported to the IRS and the vendor by January 31. Collect a valid W-9 before paying.',
  'Late, missing or incorrect 1099s carry per-form penalties under §§ 6721/6722 (and much higher for intentional disregard), and a missing TIN triggers 24% backup withholding liability.')

g('vendor', 'IRS / Treasury (OFAC) / FinCEN',
  'IRC § 6109 & § 3406 (TIN / backup withholding); 31 CFR Part 501 (OFAC sanctions); SOX 404 vendor-master controls',
  'Vendors must provide a W-9 with a valid TIN before payment, must not appear on the OFAC Specially Designated Nationals list, and bank-detail changes must be verified independently (call-back) and approved by someone other than the requester.',
  'Paying a sanctioned party is a strict-liability OFAC violation. Unverified bank changes are the leading cause of vendor-payment fraud losses, and a missing W-9 creates backup-withholding liability.')

g('ap_recurring', 'US GAAP / IRS',
  'ASC 405-10 (liabilities); IRC § 461(h) (economic performance)',
  'A recurring invoice must match a current contract and be recorded in the period the service is received. Schedules must end when the contract ends.',
  'Recurring bills for terminated contracts are a common duplicate/overpayment finding. Expenses recorded in the wrong period misstate accrual financials and tax deductions.')

g('mgmt_fee', 'Related-Party Rules / Management Agreement',
  'ASC 850-10 (related-party disclosures); IRC § 482 (arm\'s-length); property management agreement',
  'Management fees must be calculated exactly as the management agreement defines the fee base and percentage. Fees paid to an affiliate of the owner or manager are related-party transactions that require disclosure.',
  'Overcharged fees are a breach of the management agreement (refund claims, termination). Undisclosed related-party fees are a GAAP disclosure deficiency.')

g('ap_adjust', 'US GAAP',
  'ASC 405-20 (extinguishment of liabilities); ASC 330/340 vendor credits',
  'A liability is reduced only when the vendor issues a credit or the obligation is legally released. Credits must be applied to the specific invoice and reflected in the period received.',
  'Unsupported debit memos or unapplied credits misstate A/P and can hide duplicate payments. Auditors test vendor statements against the aging.')

g('ap_advance', 'US GAAP / IRS',
  'ASC 340-10 (prepaid assets); IRC § 461(h) (economic performance)',
  'A deposit paid before work is performed is an asset (prepaid/advance), not an expense, until the vendor delivers. It is applied to the final invoice when the work is done.',
  'Expensing advances overstates expense and deductions in the payment period, and unapplied advances can be paid twice.')

g('ap_void', 'Uniform Commercial Code / State Unclaimed Property',
  'UCC § 4-404 (checks over 6 months); UCC § 4-403 (stop payment); state unclaimed property acts',
  'A bank is not obliged to pay a check more than six months old, but the underlying debt still exists. Voiding a check re-opens the liability, which must be paid again or, if the payee cannot be found, escheated.',
  'Voiding and writing off old checks to income instead of re-paying or escheating them is an unclaimed-property violation, and voiding without a stop payment risks double payment.')

g('ap_manual_pay', 'Uniform Commercial Code (Funds Transfers) / FinCEN',
  'UCC Article 4A (wire transfers); NACHA Operating Rules; 31 CFR Part 501 (OFAC)',
  'Wires and ACH debits are final once executed, so the beneficiary, amount and bank details must be verified against approved instructions (call-back) before release. Record each manual payment immediately with its bank confirmation.',
  'Under UCC 4A the originator generally bears the loss of a wire sent on fraudulent instructions if the bank followed an agreed security procedure. Unrecorded manual payments lead to duplicate payment.')

g('ap_payment', 'NACHA / Uniform Commercial Code / OFAC',
  'NACHA Operating Rules; UCC Article 3 & § 4-404; 31 CFR Part 501 (OFAC); SOX 404',
  'Only approved, due invoices may be paid, from the property\'s authorized bank account, by an authorized signer. ACH payments must follow NACHA formatting and authorization rules, and payees must not be sanctioned parties.',
  'Unapproved or duplicate disbursements are the highest-risk cash finding. NACHA violations can bring fines passed down by the bank, and paying an OFAC-listed party is a strict-liability violation.')

g('ap_bill', 'US GAAP / SOX 404 / IRS',
  'ASC 405-10 (liabilities); ASC 360-10 & Treas. Reg. § 1.263(a)-3 (capital vs. repair); IRC § 461(h); SOX 404',
  'Record a vendor invoice as a liability in the period the goods or services were received, coded to the right property and GL account. Improvements that better, restore or adapt a unit of property are capitalized; routine repairs are expensed.',
  'Cut-off errors and capital/repair misclassification misstate NOI and taxable income (IRS can reclassify with § 6662 penalties). Duplicate or unapproved invoices are top audit exceptions.')

g('ap_subledger', 'SOX 404 / US GAAP',
  'SOX 404 (subledger-to-GL reconciliation controls); ASC 405-10',
  'The A/P aging must equal the A/P control account at every period end. The subledger is locked once the period is closed so reported liabilities cannot change silently.',
  'An unreconciled A/P control account means liabilities may be misstated. Auditors treat it as a key control failure, and posting into closed periods is flagged as a management override.')

# ── Cash & banking ────────────────────────────────────────────────────────────────────────
g('bank_rec bank_feed', 'Uniform Commercial Code / SOX 404',
  'UCC § 4-406 (duty to examine bank statements); SOX 404 / COSO Principle 12',
  'Every bank account must be reconciled promptly each month and reviewed by someone other than the preparer. Under UCC § 4-406 the customer must examine statements and report unauthorized or altered items promptly, or lose the right to recover them from the bank (outer limit one year).',
  'Late reconciliations can forfeit recovery of forged or altered items under UCC § 4-406. Unreconciled or unreviewed cash is the most serious close finding and a common fraud-concealment path.')

g('deposit other_receipt', 'IRS / FinCEN (Cash Reporting)',
  'IRC § 6050I & 31 CFR § 1010.330 (Form 8300 for cash > $10,000); UCC § 4-406',
  'Receipts must be deposited intact and promptly, and deposits must tie to bank credits. Receiving more than $10,000 in cash (or certain cash equivalents) from one payer in related transactions requires filing IRS Form 8300 within 15 days.',
  'Failure to file Form 8300 carries civil penalties (and criminal liability if willful). Deposits that do not tie to the bank point to lapping or skimming.')

g('transfer', 'US GAAP / Loan Documents',
  'ASC 230-10 (cash flow classification); loan cash-management / lockbox agreements; partnership agreement (distributions)',
  'Transfers between accounts and entities must follow the loan\'s cash-management rules (lockbox, sweep and reserve waterfalls). Owner distributions are allowed only when the loan and partnership agreements permit.',
  'Distributions made during a lender cash-trap or covenant breach can trigger default and guarantor liability. Misclassified transfers misstate the cash flow statement.')

g('petty_cash', 'SOX 404 / IRS Recordkeeping',
  'COSO Principle 10 (control activities); IRC § 6001 & § 274(d)',
  'Petty cash is an imprest fund: receipts plus cash on hand must always equal the fixed fund amount. Every disbursement needs a receipt and business purpose.',
  'Unreconciled petty cash is a textbook misappropriation finding, and unsupported disbursements are non-deductible.')

g('available_cash', 'Loan Documents / Partnership Agreement',
  'Loan agreement (minimum balance, reserves, cash trap); ASC 230-10',
  'Payments and distributions must respect lender-required minimum balances, reserves and cash-trap provisions, and the owner\'s funding rules. Cash above those amounts is available.',
  'Paying or distributing restricted cash can breach loan covenants (default interest, recourse triggers). Restricted cash must be presented separately under GAAP.')

g('positive_pay', 'Uniform Commercial Code (Check Fraud)',
  'UCC § 3-406 & § 4-406 (comparative negligence for forged/altered checks)',
  'Positive Pay files must be sent every time checks are issued, and exceptions decided before the bank deadline. Failing to use available fraud controls can shift check-fraud losses to the account holder.',
  'Courts apply UCC comparative fault: if the owner declined or neglected bank fraud tools, it may bear losses from forged or altered checks.')

g('bank_account', 'FinCEN / SOX 404',
  'FinCEN CDD Rule (31 CFR § 1010.230, beneficial ownership); SOX 404 (banking authority controls)',
  'Opening or changing a bank account requires verified ownership information for the legal entity, board/owner authorization and dual control over signers and payment settings. The GL cash account must map to exactly one bank account.',
  'Unauthorized accounts or signers are a fraud red flag and an ITGC/authorization deficiency. Incorrect beneficial-ownership filings expose the entity to bank and FinCEN penalties.')

# ── Receivables & resident accounting ────────────────────────────────────────────────────
g('ar_nsf', 'NACHA / State NSF Fee Law',
  'NACHA Operating Rules (return entries); TX Bus. & Com. Code § 3.506 (NSF processing fee cap); lease terms',
  'Returned payments are reversed on the date the bank debits the account, and the resident\'s charges re-open. NSF fees may be charged only as the lease allows and within the state cap (for example a maximum processing fee of $30 in Texas).',
  'Excess NSF fees violate state law and invite consumer claims. NSFs posted in the wrong period break the bank reconciliation.')

g('ar_writeoff', 'US GAAP / IRS / Consumer Protection',
  'ASC 842-30-35-3 (operating lease collectibility); IRC § 166 (bad debts); FDCPA 15 U.S.C. § 1692 & FCRA § 1681s-2 (collections/reporting)',
  'When a resident balance is not probable of collection, lease income is limited to cash received, and uncollectible balances are written off per policy after applying deposits. Accounts sent to collection agencies must be accurate, because agencies and credit reporting are regulated.',
  'Overstated receivables misstate income. Inaccurate balances reported to collectors or bureaus can create FDCPA/FCRA liability, and inconsistent write-off policy is an audit finding.')

g('ar_adjust', 'US GAAP (Lessor Accounting)',
  'ASC 842-30-25-11 (straight-line lease income incl. incentives); SOX 404 (credit approval)',
  'Rent concessions and free rent are lease incentives: GAAP recognizes total lease income straight-line over the lease term and reports concessions separately. Credits and waivers need documented approval.',
  'Concessions netted into rent or recognized in one month misstate revenue trends. Unapproved credits are a revenue-fraud red flag.')

g('ar_payment', 'US GAAP / IRS / FinCEN',
  'ASC 842-30 (lessor receipts); IRC § 6050I (Form 8300 for cash > $10,000); state payment-application rules',
  'Resident payments must be applied according to the lease and any state rules on application order, and unapplied cash or prepaid rent held as a liability. Large cash payments (over $10,000 in related transactions) require IRS Form 8300.',
  'Misapplied payments can create wrongful late fees and eviction disputes. Unfiled Form 8300s bring IRS penalties.')

g('ar_invoice', 'US GAAP (Lessor & Revenue Recognition)',
  'ASC 842-30 (operating lease income); ASC 606 (non-lease services and fees)',
  'Rent is lease income recognized over the lease term; separate services and fees (utilities billed, amenities, bill-backs) follow ASC 606 when they are distinct. Charges must match the lease and addenda.',
  'Charges not supported by the lease are unenforceable and invite resident claims. Misclassified revenue components mislead lenders reviewing the T-12.')

g('deferred_rev', 'US GAAP / IRS',
  'ASC 842-30-25-11 & ASC 606-10-45 (contract liabilities); Treas. Reg. § 1.61-8(b) (advance rent taxable when received)',
  'Rent collected before it is earned is a liability for GAAP and is recognized as the period passes. For tax, advance rent is generally income when received.',
  'Recognizing prepaid rent early overstates income. Ignoring the book-tax difference misstates taxable income and deferred balances.')

g('ar_customer', 'Fair Housing / Consumer Privacy',
  'Fair Housing Act (42 U.S.C. § 3604); FCRA (15 U.S.C. § 1681); state data-privacy laws',
  'Customer and resident records contain personal data that must be accurate, protected and used only for legitimate business purposes. Terms and fees must be applied consistently to all residents.',
  'Inconsistent treatment can support fair-housing claims, and exposed personal data triggers breach-notification duties and regulatory penalties.')

g('ar_aging', 'US GAAP / SOX 404',
  'ASC 842-30-35-3 (collectibility); SOX 404 (subledger reconciliation)',
  'The receivable aging must equal the A/R control account, and collectibility must be assessed each period. Balances not probable of collection are reserved or written off.',
  'An unreconciled or stale aging overstates receivables and income. Auditors test aging accuracy and the reserve methodology.')

g('security_deposit', 'State Property Code (Landlord-Tenant)',
  'TX Prop. Code §§ 92.103–92.109; CA Civ. Code § 1950.5 (rules vary by state)',
  'Security deposits are resident money held by the landlord: an itemized disposition (FAS) and any refund are due within the statutory deadline after move-out (30 days in Texas, 21 in California). Deductions are allowed only for unpaid rent and damage beyond normal wear and tear.',
  'Bad-faith retention can cost statutory damages (Texas: $100 plus three times the wrongfully withheld amount plus attorney fees; California: up to twice the deposit). Deposits must stay fully recorded as a liability.')

g('tax', 'State & Local Tax Law',
  'State sales/use tax statutes; ASC 606-10-32-2A (sales-tax net presentation)',
  'Taxable charges must carry the correct state and local rate, tax collected is a liability held for the state, and returns are filed on schedule. Use tax is owed on taxable purchases where the vendor did not charge sales tax.',
  'Under-collected tax is assessed against the property with interest and penalties, and collected but unremitted tax is a trust-fund liability that can reach responsible individuals.')

# ── General ledger ────────────────────────────────────────────────────────────────────────
g('statistical', 'Lender & Investor Reporting',
  'Loan agreement reporting covenants; NCREIF/NAREIT KPI definitions (occupancy, per-unit metrics)',
  'Unit counts, occupancy and square footage used in KPIs must tie to the rent roll and be defined consistently every period. They drive per-unit ratios that lenders and investors rely on.',
  'Misstated occupancy or unit data in lender reports can be treated as a reporting-covenant misrepresentation.')

g('allocation', 'IRS (Related Parties) / Management Agreement',
  'IRC § 482 (arm\'s-length allocations); ASC 850 (related parties); property management agreement',
  'Shared costs may be allocated to a property only when the management agreement permits it, using a documented and consistently applied basis (units, square feet, time). Allocations between related entities must be arm\'s length.',
  'Unsupported allocations are a frequent owner audit claim (reimbursement demands). Non-arm\'s-length related-party allocations can be adjusted by the IRS.')

g('prepaid', 'US GAAP / IRS',
  'ASC 340-10 (prepaid expenses); Treas. Reg. § 1.263(a)-4(f) (12-month rule)',
  'Costs paid in advance are assets and are expensed over the period they benefit. For tax, prepayments whose benefit does not extend beyond 12 months (or the end of the next tax year) may be deducted when paid.',
  'Stale or unamortized prepaid balances overstate assets and understate expense. Book-tax differences must be tracked.')

g('accrual', 'US GAAP / IRS',
  'US GAAP accrual basis (FASB Concepts Statement No. 6); ASC 405-10; IRC § 461(h) (economic performance, recurring-item exception)',
  'Expenses are recorded in the period the goods or services are received, even if not yet invoiced, and accruals reverse when the invoice arrives. For tax, the deduction generally requires economic performance.',
  'Missing or duplicated accruals are the most common cut-off audit adjustment and distort monthly NOI and covenant tests.')

g('recurring_je je je_reverse', 'SOX 404 / Auditing Standards',
  'SOX 404; AU-C 240 / PCAOB AS 2401.58–.62 (journal-entry testing); IRC § 6001',
  'Every manual journal entry needs a clear description, supporting documentation and independent review or approval. Corrections are made by reversing entries, not by editing or deleting history.',
  'Auditors specifically test manual and unusual journal entries for management override and fraud. Unsupported or unapproved entries become audit exceptions or material-weakness findings.')

g('intercompany', 'US GAAP / IRS',
  'ASC 810-10-45-1 (elimination of intercompany balances); IRC § 482; ASC 850',
  'Balances between related entities must agree on both sides and be eliminated in consolidated statements. Intercompany charges and loans must be documented and arm\'s length.',
  'Out-of-balance intercompany accounts block consolidation and can hide unauthorized fund movements. Undocumented related-party loans can be recharacterized for tax.')

g('currency', 'US GAAP',
  'ASC 830 (foreign currency matters)',
  'Foreign-currency balances are remeasured at the period-end rate and transactions at the rate on the transaction date, with gains and losses recognized. The rate source must be consistent and documented.',
  'Unrevalued foreign balances misstate assets, liabilities and income.')

g('period_close', 'SOX 404 / US GAAP',
  'SOX 404 (financial close & reporting controls); ASC 855 (subsequent events)',
  'Periods are closed only after reconciliations and reviews are complete, and re-opening requires documented controller approval. Events after period-end that affect balances must be evaluated before issuing statements.',
  'Posting into closed periods without approval is a management-override red flag, and unreviewed subsequent events can require restatement.')

g('books', 'US GAAP / IRS (Accounting Methods)',
  'ASC 250 (accounting changes & error corrections); IRC § 446 (methods of accounting; § 446(e) consent)',
  'GAAP, tax and cash-basis books follow different rules and must be kept separate, with adjustments tracked by book. A change in tax accounting method requires IRS consent (generally Form 3115).',
  'Posting to the wrong book misstates either GAAP or tax results. Unauthorized method changes can be reversed by the IRS with adjustments and penalties.')

g('reporting_period', 'IRS / US GAAP',
  'IRC § 441 (taxable year); ASC 270 (interim reporting)',
  'The fiscal year and reporting periods must match the entity\'s tax year and the owner\'s reporting calendar, and be used consistently in reports and budgets.',
  'Mismatched periods produce MTD/YTD figures that do not agree with tax returns or owner packages.')

g('budget', 'Loan & Partnership Agreements',
  'Loan agreement approved-budget covenants; partnership / operating agreement major-decision provisions',
  'Many loans and partnership agreements require an annual budget approved by the lender or investor, and spending beyond it may need consent. The published budget must be the approved version.',
  'Material unapproved spending can breach the operating or loan agreement. Reporting against the wrong budget version misleads investors.')

g('budget_payroll', 'US Labor & Payroll Tax Law',
  'FLSA 29 U.S.C. § 207 (overtime); IRC §§ 3111, 3301 (FICA / FUTA); state unemployment tax',
  'Budgeted payroll must include legally required costs: overtime for non-exempt staff (1.5× hours over 40 per week), employer FICA (7.65%), FUTA/SUTA and benefits. On-site staff classification (exempt vs non-exempt) drives these costs.',
  'Budgets that omit mandatory payroll costs cause systematic variances, and misclassifying employees as exempt creates back-pay and penalty liability.')

g('coa', 'US GAAP / HUD (where applicable)',
  'ASC 205 & 220 (presentation); HUD Handbook 4370.2 & HUD chart of accounts (HUD-insured properties)',
  'The chart of accounts must classify assets, liabilities, revenue and expense consistently with GAAP presentation. HUD-insured or subsidized properties must use HUD\'s prescribed chart of accounts.',
  'Misclassified accounts produce misleading statements. Non-conforming HUD financial submissions can be rejected and lead to HUD compliance findings.')

g('dimension', 'US GAAP / Lender Reporting',
  'ASC 280-10 (segment reporting, public REITs); loan property-level reporting requirements',
  'Every transaction must be tagged to the correct property, entity and department so each legal entity\'s books and each property\'s lender reports are complete and separable.',
  'Transactions tagged to the wrong entity misstate separate-entity financials, a problem for single-purpose-entity loan covenants.')

# ── Financial close ───────────────────────────────────────────────────────────────────────
g('workpaper', 'Auditing Standards / SOX 404',
  'AU-C 230 (audit documentation); SOX 404 (evidence of review); IRC § 6001 (retention)',
  'Each balance-sheet account needs a reconciliation or schedule showing who prepared it, who reviewed it and when, with support attached. Work papers are retained as permanent close evidence.',
  'Missing or unsigned reconciliations mean the control did not operate. Auditors report them as deficiencies and expand substantive testing.')

g('close_checklist', 'SOX 404 / COSO',
  'SOX 404 (financial close and reporting process); COSO 2013 Principles 10–12',
  'Month-end close tasks are defined, assigned and completed in sequence, each with evidence and reviewer sign-off before the period is locked.',
  'Skipped or undocumented close steps are period-end financial reporting control deficiencies, a common root cause of restatements.')

# ── Capital, job cost & reserves ──────────────────────────────────────────────────────────
g('retainage', 'State Lien & Retainage Law',
  'TX Prop. Code §§ 53.101–53.105 (retainage) & § 53.281 (lien waivers); state prompt-payment and retainage statutes',
  'Owners withhold retainage (in Texas 10% of the contract price for 30 days after completion, to protect against subcontractor liens) and record it as a liability. It is released only after completion with valid final lien waivers.',
  'Failing to retain as the lien statute requires can make the owner personally liable to unpaid subcontractors up to the retainage amount. Releasing without waivers risks paying twice.')

g('draw', 'State Mechanic\'s Lien Law / Loan Documents',
  'State mechanic\'s lien statutes (e.g., TX Prop. Code ch. 53, § 53.281 statutory waiver forms); construction loan & reserve agreements',
  'Draw requests must be supported by invoices, proof of payment and lien waivers in the statutory form for the state. Funds drawn must be used only for the budgeted line items the lender approved.',
  'Draws without valid waivers expose the property to liens and the lender can refuse or claw back funds. Misapplying loan proceeds is a loan default.')

g('reserve', 'HUD / Agency Lender Requirements',
  'HUD Handbook 4350.1 ch. 4 (Reserve for Replacements); Fannie Mae / Freddie Mac replacement-reserve agreements',
  'Replacement reserves are restricted lender escrows: deposits are required monthly and withdrawals need lender approval for eligible capital items, supported by invoices and inspections.',
  'Using reserve funds for ineligible items or without approval is a loan default and, for HUD properties, a regulatory violation. Unreconciled reserve balances are an audit finding.')

g('jobcost', 'US GAAP / IRS (Capitalization)',
  'ASC 360-10 (property, plant & equipment); ASC 835-20 (capitalized interest); Treas. Reg. § 1.263(a)-3 (repair vs. improvement)',
  'Costs of capital projects are accumulated in construction-in-progress and capitalized when they better, restore or adapt the property. Routine repairs and maintenance are expensed. Interest during construction may need to be capitalized.',
  'Capital/expense misclassification misstates NOI and taxable income (IRS reclassification plus penalties), and stale CIP delays depreciation.')

g('depreciation', 'US GAAP / IRS',
  'ASC 360-10-35 (depreciation); IRC § 168 (MACRS: 27.5-yr residential rental, 39-yr nonresidential)',
  'Assets are depreciated over their useful lives from the date placed in service. GAAP lives and tax MACRS lives differ (residential rental buildings are 27.5 years for tax), so book and tax depreciation are tracked separately.',
  'Missed or wrong depreciation misstates income and asset values. Tax depreciation errors can require amended returns or a method change (Form 3115).')

g('asset_dispose', 'US GAAP / IRS',
  'ASC 360-10-40 (derecognition); IRC §§ 1231, 1245 & 1250 (gain/loss and recapture); Treas. Reg. § 1.168(i)-8 (partial dispositions)',
  'When an asset or component is replaced or sold, its remaining cost and accumulated depreciation are removed and a gain or loss is recognized. For tax, a partial-disposition election lets the remaining basis of a replaced component be deducted.',
  'Leaving replaced components on the books overstates assets and double-counts depreciation. Missing the partial-disposition election forfeits deductions.')

g('asset', 'US GAAP / IRS (Capitalization)',
  'ASC 360-10; Treas. Reg. § 1.263(a)-1(f) (de minimis safe harbor: $2,500 per item, or $5,000 with an applicable financial statement); § 1.263(a)-3',
  'Purchases above the owner\'s capitalization threshold with a useful life of more than one year are recorded as fixed assets. The IRS de minimis safe harbor allows expensing items up to $2,500 ($5,000 with audited financial statements) if the policy is in place at year start and elected annually.',
  'Inconsistent capitalization misstates NOI and taxable income; without a written policy and annual election the safe harbor is unavailable.')

# ── Investors, tax & payroll ─────────────────────────────────────────────────────────────
g('investor', 'IRS (Partnerships) / Securities Law',
  'IRC § 704(b) (capital accounts & allocations); IRC § 6031 (partnership returns / K-1s); Securities Act Reg D (investor disclosures)',
  'Contributions, distributions and allocations must follow the partnership agreement and maintain § 704(b) capital accounts. K-1s are due with the partnership return (March 15 for calendar-year partnerships).',
  'Allocation errors produce incorrect K-1s (penalties under IRC § 6698 and investor claims), and misleading investor reports can create securities-law liability.')

g('vat', 'Foreign VAT Law',
  'EU VAT Directive 2006/112/EC and local VAT statutes (non-US entities)',
  'For entities in VAT jurisdictions, VAT charged on sales is owed to the tax authority and VAT paid on business purchases is recoverable only with a valid VAT invoice. Returns are filed on the local schedule.',
  'Incorrect VAT recovery or late returns bring assessments, interest and penalties from the local tax authority.')

g('time', 'US Labor Law (FLSA)',
  'FLSA 29 U.S.C. § 211(c) & 29 CFR Part 516 (recordkeeping); 29 U.S.C. § 207 (overtime)',
  'Employers must keep accurate records of hours worked by non-exempt employees and pay overtime for hours over 40 in a workweek. Time allocated to properties must reflect actual work.',
  'Inaccurate time records create back-wage and liquidated-damages liability under the FLSA, and misallocated labor overcharges owners.')

# ── Reporting ────────────────────────────────────────────────────────────────────────────
g('dashboard report_writer fin_report', 'US GAAP Presentation / SEC (Non-GAAP)',
  'ASC 205 & 220 (financial statement presentation); SEC Regulation G / Item 10(e) of Reg S-K (non-GAAP measures such as NOI, public REITs)',
  'Financial reports must present GAAP figures accurately and consistently. Non-GAAP measures like NOI must be defined consistently and reconciled to GAAP when reported publicly. Report filters (book, period, entity) must match the purpose.',
  'Reports built on the wrong book, period or entity mislead lenders and investors. Inconsistent non-GAAP definitions draw SEC comment letters for public REITs.')

g('report_distribution', 'Records Retention / Confidentiality',
  'IRC § 6001 (retention); partnership / NDA confidentiality clauses; state data-privacy laws',
  'Issued financial packages are records that must be retained in their delivered form. They may be distributed only to authorized recipients for that owner or entity.',
  'Sending one owner\'s financials to another is a confidentiality breach (contract damages, loss of client), and overwriting issued reports destroys audit evidence.')

# ── Task-only rules (Daily Hub tasks that have no dedicated RealPage screen topic) ────────
g('derivative', 'US GAAP (Derivatives & Hedging)',
  'ASC 815-10 (derivatives at fair value); ASC 815-20 (hedge accounting); loan agreement rate-cap covenants',
  'Interest rate caps and swaps are derivatives recorded on the balance sheet at fair value, with changes in fair value recognized each period (in earnings, or in OCI only if hedge accounting is formally documented). Lenders usually require a rate cap on floating-rate loans to stay in place and be replaced before expiry.',
  'Missing fair-value updates misstate assets and earnings, and undocumented hedges cannot use hedge accounting. A lapsed rate cap is a loan default under most floating-rate loan agreements.')

g('loan_cost', 'US GAAP / IRS (Debt Issuance Costs)',
  'ASC 835-30-45-1A (debt issuance costs as a reduction of debt); ASC 835-30-35-2 (effective interest); IRC § 163 & Treas. Reg. § 1.446-5',
  'Loan fees and closing costs are presented as a reduction of the loan balance (not as an asset) and amortized to interest expense over the loan term. For tax they are amortized over the loan term as well, with any remaining balance deducted on refinancing or payoff.',
  'Expensing loan costs up front, or leaving them as a separate asset, misstates debt and interest expense. Unamortized costs left after a refinance are a common audit adjustment.')

REQUIRED_KEYS = ('governingAuthority', 'regulationCode', 'plainEnglishRule', 'auditRisk')

RECORD_CHANGE_ACTIONS = {'delete', 'reverse', 'edit'}
RECORD_NOTE = (' Posted records are corrected by documented reversing or adjusting entries, never deleted, '
               'so the audit trail required by IRC § 6001 and SOX 404 stays intact.')


def guardrail_for(topic_key, action, has_gl=False):
    """Return the regulatoryGuardrail for a screen's topic and action."""
    base = G[topic_key]
    out = dict(base)
    if action in RECORD_CHANGE_ACTIONS and has_gl:
        out['plainEnglishRule'] = base['plainEnglishRule'] + RECORD_NOTE
        if 'IRC § 6001' not in base['regulationCode']:
            out['regulationCode'] = base['regulationCode'] + '; IRC § 6001 (records)'
    return out
