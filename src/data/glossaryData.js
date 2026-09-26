// Offshore US Property Accounting Glossary & Yardi Voyager Cross-Reference Guide

export const GLOSSARY_TERMS = [
  {
    term: 'AME (Accounting Month End)',
    acronym: 'AME',
    category: 'Close Cycle',
    definition: 'The designated monthly window during which property accountants finalize all subledgers, post month-end accruals, reconcile bank accounts, and produce preliminary financial statements.',
    context: 'In your Daily Task Tracker, tasks are segmented into Pre-AME (Day -3 to Day 0), AME (Days 1-5), and Post-AME (Days 6-10).',
    whyItMatters: 'Institutional investors (e.g. Goldman Sachs, Magnolia Capital) have strict contractual deadlines for preliminary and final AME submissions.'
  },
  {
    term: 'MOR (Monthly Operating Report)',
    acronym: 'MOR',
    category: 'Reporting',
    definition: 'A comprehensive institutional reporting package compiled monthly containing the certified Balance Sheet, Income Statement (Actual vs Budget & T12), Cash Flow, Bank Reconciliations, Rent Roll, and Capital Schedules.',
    context: 'Typically compiled after all onshore reviews are completed and distributed to asset managers, lenders, and equity partners.',
    whyItMatters: 'Primary document used by executive leadership and asset managers to evaluate property financial health and debt service coverage.'
  },
  {
    term: 'GPR (Gross Potential Rent)',
    acronym: 'GPR',
    category: 'Revenue',
    definition: 'The theoretical maximum rental income a multifamily property would generate if 100% of all apartment units were occupied at 100% of full market rent.',
    context: 'multifamily accounting records revenue using the Gross Potential Rent method: GPR minus Vacancy Loss minus Concessions minus Bad Debt equals Net Rental Income.',
    whyItMatters: 'Ensures operational visibility into market rent trends versus actual collections.'
  },
  {
    term: 'ROG (Receipt of Goods)',
    acronym: 'ROG',
    category: 'AP & Procurement',
    definition: 'A digital verification step in RealPage/Yardi where the on-site maintenance supervisor or property manager confirms physical delivery and acceptable condition of ordered items.',
    context: 'Invoices matched to purchase orders will remain trapped in the "Pending ROG Exception Queue" until site staff enters this receipt.',
    whyItMatters: 'Protects the owner from paying for damaged, partial, or non-delivered merchandise.'
  },
  {
    term: 'T12 (Trailing 12 Months)',
    acronym: 'T12',
    category: 'Financial Analysis',
    definition: 'A financial statement presenting monthly financial results horizontally across the preceding 12 consecutive calendar months.',
    context: 'Used during month-end GL scrutiny to detect seasonality, missing recurring expenses (e.g. missing utility bills), or abnormal spikes.',
    whyItMatters: 'Critical underwriting statement used by lenders, appraisers, and buyers to value real estate assets.'
  },
  {
    term: 'STYL / MCMC Billbacks',
    acronym: 'STYL/MCMC',
    category: 'Intercompany',
    definition: 'Centralized operating expenses paid by corporate affiliate management entities (STYL/MCMC) on behalf of properties that must be billed back and reimbursed via wire.',
    context: 'Includes pooled marketing campaigns, centralized HR/recruiting, specialized software licenses, and regional engineering services.',
    whyItMatters: 'Requires weekly wire settlements and exact intercompany Due To/From reconciliation to avoid balance sheet audit flags.'
  },
  {
    term: 'Replacement Reserve Draw',
    acronym: 'RR Draw',
    category: 'Capital Funding',
    definition: 'A formal reimbursement request submitted to a mortgage lender or equity partner to release escrowed funds for completed capital improvement projects (Capex).',
    context: 'Requires compilation of paid vendor invoices, cancelled checks, and signed unconditional contractor lien waivers.',
    whyItMatters: 'Reimburses property operating cash for major capital outlays like roof replacements, exterior repainting, and appliance upgrades.'
  },
  {
    term: 'Sweep Account',
    acronym: 'Sweep',
    category: 'Treasury & Cash',
    definition: 'A banking arrangement where funds in local depository accounts are automatically transferred nightly into a central operating or concentration account to optimize cash management and interest earnings.',
    context: 'Accountants must post daily or monthly sweep journal entries in RealPage/Yardi to mirror these automated bank transfers on company books.',
    whyItMatters: 'Failure to record sweeps creates artificial book overdrafts in depository accounts.'
  },
  {
    term: 'Loss to Lease (LTL)',
    acronym: 'LTL',
    category: 'Revenue',
    definition: 'The difference between the property’s current market rent for an apartment unit and the actual lower contract rent stated in the resident’s existing lease.',
    context: 'Deducted from Gross Potential Rent on the income statement.',
    whyItMatters: 'Shows the revenue upside available as older leases expire and renew at higher prevailing market rates.'
  },
  {
    term: 'Escrows (Tax & Insurance)',
    acronym: 'Escrow',
    category: 'Balance Sheet',
    definition: 'Restricted reserve funds collected monthly by the mortgage lender alongside loan payments to pay annual property taxes, hazard insurance, and replacement reserves.',
    context: 'Must be reconciled monthly to the lender’s mortgage billing statement (Escrows Tie-Out).',
    whyItMatters: 'Disbursements by lenders must be recorded against escrow assets to prevent double-expensing.'
  }
];

export const YARDI_CROSS_REFERENCE = [
  {
    area: 'Invoice Approval Workflow',
    realpage: {
      menu: 'Accounts Payable > Approval Policy Manager > Approval Workbench',
      concept: 'Multi-tiered rules (Tier 1 PM, Tier 2 RPM, Tier 3 Accounting). Invoices route through sequential policy manager triggers.'
    },
    yardi: {
      menu: 'AP > Invoice Processing > Approve Invoices > select Workflow',
      concept: 'Workflow 1 (Entry/Site), Workflow 2 (PM Approval), Workflow 3 (RPM), Workflow 4 (Offshore/Regional Accounting Review). In Yardi, Workflow 4 is where property accountants give final accounting blessing.'
    },
    keyDifferences: 'RealPage uses dollar and category threshold triggers in Approval Policy Manager; Yardi assigns fixed sequential workflow numbers (1 through 4).'
  },
  {
    area: 'Bank Reconciliation',
    realpage: {
      menu: 'Cash Management > Reconciliations > Bank Reconciliation',
      concept: 'Standalone module where transactions clear, fees are posted inline, and Difference to Balance calculates automatically.'
    },
    yardi: {
      menu: 'Financials > Cash Management > Reconcile Bank Account',
      concept: 'Select Book/Bank account, input statement dates, match deposits and checks, run Auto-Match or manual check-off, post reconciliation batch.'
    },
    keyDifferences: 'RealPage allows direct fee posting from the rec screen; Yardi typically requires a separate Journal Entry batch or Cash Adjustment.'
  },
  {
    area: 'Journal Entries & Accruals',
    realpage: {
      menu: 'General Ledger > Journals > Standard Journal > Auto-Reverse toggle',
      concept: 'Single checkbox sets auto-reversal date to 1st of next month.'
    },
    yardi: {
      menu: 'Financials > Journal Entries > Select "Accrual" type',
      concept: 'Selecting "Accrual" prompt automatically generates a linked reversing batch in the subsequent month.'
    },
    keyDifferences: 'Both systems handle auto-reversals cleanly, but Yardi requires creating an explicit batch header first.'
  }
];
