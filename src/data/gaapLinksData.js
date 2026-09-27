// Curated Track A links for the Close Cockpit tasks and the exception triage playbooks: the ASC
// Topics whose rules decide the accounting in each step. Screen-level links are computed from the
// screen guardrails (utils/ascLinks); these cover workflows whose data carries no ASC citation.
// Order matters: the first Topic opens when the "📖 First-Principles GAAP" button is tapped.
// Every id and Topic is checked by scripts/test/asc.test.mjs.

export const CLOSE_TASK_ASC = {
  // Phase 1 — AP & purchasing cutoff
  p1_invoice_cutoff: ['405'],
  p1_exception_queue: ['405', '440'],
  p1_approvals: ['440'],
  p1_rog: ['405'],
  p1_accrual_not_received: ['405', '450'],
  p1_utility_accrual: ['405'],
  p1_recurring_ap: ['405'],
  p1_final_payment_run: ['405', '305'],
  p1_close_ap: ['405'],
  // Phase 2 — AR & resident accounting
  p2_receipts_deposits: ['842', '305'],
  p2_nsf: ['842'],
  p2_late_fees: ['842', '606'],
  p2_recurring_billing: ['842', '606'],
  p2_rent_roll_gpr: ['842'],
  p2_nru_trueup: ['842'],
  p2_security_deposits: ['842', '405'],
  p2_delinquency_writeoff: ['842', '450', '326'],
  p2_close_ar: ['842', '606'],
  // Phase 3 — cash & banking
  p3_bank_rec_operating: ['305', '230'],
  p3_unmatched_items: ['305', '230'],
  p3_merchant_sweep: ['305', '230'],
  p3_escrow_reserve: ['305', '230', '470'],
  p3_security_trust: ['305', '405'],
  p3_outstanding_items: ['405', '305'],
  p3_rec_approval: ['305'],
  // Phase 4 — subledger accruals & fixed assets
  p4_prepaids: ['340', '720'],
  p4_draft_assets: ['970', '360', '835'],
  p4_depreciation: ['360'],
  p4_payroll_accrual: ['710', '405'],
  p4_recurring_je: ['340', '405'],
  p4_mgmt_fee: ['606', '850'],
  p4_accrued_expense_review: ['450', '405'],
  // Phase 5 — intercompany
  p5_mapping: ['810'],
  p5_billbacks: ['810', '850'],
  p5_tieout: ['810', '850'],
  p5_settlement: ['810', '850'],
  p5_consolidation: ['810'],
  // Phase 6 — preliminary review
  p6_ap_tieout: ['405'],
  p6_fa_tieout: ['360'],
  p6_balance_sheet: ['210'],
  p6_t12: ['220', '270'],
  p6_bva: ['270'],
  p6_reclasses: ['250'],
  p6_work_papers: ['855', '450'],
  // Phase 7 — final lock & investor package
  p7_final_work_papers: ['855'],
  p7_approve_work_papers: ['855'],
  p7_close_books: ['855', '250'],
  p7_checklist_signoff: ['855'],
  p7_investor_package: ['205', '230', '235'],
  p7_store_distribute: [],
};

export const EXCEPTION_ASC = {
  ex_po_variance: ['405', '440'],
  ex_missing_rog: ['405'],
  ex_vendor_hold: ['405'],
  ex_unbalanced_rec: ['305', '842', '230'],
  ex_gpr_variance: ['842'],
  ex_prepaid_mismatch: ['340', '720'],
  ex_negative_trust: ['305', '405'],
  ex_intercompany_oob: ['810', '850'],
  ex_duplicate_invoice: ['405', '250'],
  ex_1099_miscode: [], // tax information reporting (IRC § 6041) — no GAAP entry
  ex_retainage: ['970', '360', '440'],
  ex_utility_trueup: ['405', '250'],
  ex_fas_discrepancy: ['842', '405'],
  ex_pet_miscode: ['405', '842', '606'],
  ex_ap_subledger_oob: ['405', '250'],
};
