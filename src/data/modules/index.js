// RealPage Master Module Registry
// Combines all 9 core accounting modules into REALPAGE_MODULES

import { glModule } from './01_general_ledger';
import { apModule } from './02_accounts_payable';
import { cashModule } from './03_cash_management';
import { arModule } from './04_accounts_receivable';
import { closeModule } from './05_financial_close';
import { jobcostModule } from './06_jobcost_capex_reserves';
import { fixedAssetsModule } from './07_fixed_assets';
import { budgetingModule } from './08_budgeting_forecasting';
import { reportingAdminModule } from './09_reporting_admin';

export const REALPAGE_MODULES = [
  apModule,
  arModule,
  glModule,
  cashModule,
  closeModule,
  jobcostModule,
  fixedAssetsModule,
  budgetingModule,
  reportingAdminModule
];

export {
  glModule,
  apModule,
  cashModule,
  arModule,
  closeModule,
  jobcostModule,
  fixedAssetsModule,
  budgetingModule,
  reportingAdminModule
};
