// On-demand loader for the nine RealPage module files (~28 MB of screen detail).
//
// Nothing here is imported at app launch: search, lists and cross-links run on the compact
// searchIndex.json + moduleManifest.json (see utils/screenIndex). A module's full screen
// detail is only pulled in with import() the first time the user opens a screen in it.
// On web, Metro emits each module as its own chunk; on iOS/Android (Hermes) the module
// factory is not evaluated — so its objects never reach the JS heap — until it is loaded.
//
// Pure JS (no React Native imports) so it can be unit-tested in Node.

// import() paths must be static string literals for Metro to split them.
const IMPORTERS = {
  gl: () => import('./modules/01_general_ledger').then((m) => m.glModule),
  ap: () => import('./modules/02_accounts_payable').then((m) => m.apModule),
  cash: () => import('./modules/03_cash_management').then((m) => m.cashModule),
  ar: () => import('./modules/04_accounts_receivable').then((m) => m.arModule),
  close: () => import('./modules/05_financial_close').then((m) => m.closeModule),
  job_cost: () => import('./modules/06_jobcost_capex_reserves').then((m) => m.jobcostModule),
  fixed_assets: () => import('./modules/07_fixed_assets').then((m) => m.fixedAssetsModule),
  budgeting: () => import('./modules/08_budgeting_forecasting').then((m) => m.budgetingModule),
  reporting: () => import('./modules/09_reporting_admin').then((m) => m.reportingAdminModule),
};

// Hand-written SME analysis (src/data/sme/<moduleId>.js), keyed by screen id. It is loaded with
// its module and attached to each screen as `screen.sme`.
const SME_IMPORTERS = {
  gl: () => import('./sme/gl').then((m) => m.default),
  ap: () => import('./sme/ap').then((m) => m.default),
  cash: () => import('./sme/cash').then((m) => m.default),
  ar: () => import('./sme/ar').then((m) => m.default),
  close: () => import('./sme/close').then((m) => m.default),
  job_cost: () => import('./sme/job_cost').then((m) => m.default),
  fixed_assets: () => import('./sme/fixed_assets').then((m) => m.default),
  budgeting: () => import('./sme/budgeting').then((m) => m.default),
  reporting: () => import('./sme/reporting').then((m) => m.default),
};

export const MODULE_IDS = Object.keys(IMPORTERS);

/** The SME analysis map for one module ({ [screenId]: analysis }), without loading the module. */
export function loadSmeAnalysis(moduleId) {
  const importer = SME_IMPORTERS[moduleId];
  return importer ? importer() : Promise.reject(new Error(`Unknown module "${moduleId}"`));
}

const loaded = new Map(); // moduleId -> { module, screens: Map<screenId, screen> }
const inflight = new Map(); // moduleId -> Promise
const listeners = new Set();

export const isModuleLoaded = (moduleId) => loaded.has(moduleId);
export const getLoadedModule = (moduleId) => loaded.get(moduleId)?.module || null;
export const getLoadedScreen = (moduleId, screenId) => loaded.get(moduleId)?.screens.get(screenId) || null;
export const loadedModuleIds = () => Array.from(loaded.keys());

/** Notified with the moduleId whenever a module finishes loading. Returns an unsubscribe fn. */
export function subscribeModuleLoads(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Loads (once) and returns the full module object. Concurrent callers share one import. */
export function loadModule(moduleId) {
  if (loaded.has(moduleId)) return Promise.resolve(loaded.get(moduleId).module);
  if (inflight.has(moduleId)) return inflight.get(moduleId);
  const importer = IMPORTERS[moduleId];
  if (!importer) return Promise.reject(new Error(`Unknown module "${moduleId}"`));
  const p = Promise.all([importer(), SME_IMPORTERS[moduleId]()])
    .then(([module, sme]) => {
      const screens = new Map();
      for (const sub of module.submodules) {
        for (const s of sub.screens) {
          if (sme[s.id]) s.sme = sme[s.id];
          screens.set(s.id, s);
        }
      }
      loaded.set(moduleId, { module, screens });
      inflight.delete(moduleId);
      listeners.forEach((fn) => fn(moduleId));
      return module;
    })
    .catch((err) => {
      inflight.delete(moduleId); // allow a retry
      throw err;
    });
  inflight.set(moduleId, p);
  return p;
}

/** Loads the owning module and returns the full screen object (or null if the id is unknown). */
export async function loadScreen(moduleId, screenId) {
  await loadModule(moduleId);
  return getLoadedScreen(moduleId, screenId);
}
