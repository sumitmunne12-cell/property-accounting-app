// Executive dark theme: zinc/slate surfaces, hairline borders and one accent per accounting
// domain. Every color is a 6-digit hex so components can append an alpha suffix
// (e.g. `${COLORS.gold}40`).

// Domain accents: one hue per area of the ledger, used for module tabs, chips and gauges.
export const ACCENTS = {
  emerald: '#10B981', // General Ledger / Fixed Assets (balance sheet, assets)
  sky: '#38BDF8', // Accounts Payable / spend
  amber: '#F59E0B', // Cash / warnings
  violet: '#8B5CF6', // Financial close / period end
  rose: '#F43F5E', // Exceptions / audit risk
};

export const COLORS = {
  // Backgrounds (zinc scale, darkest to lightest)
  background: '#09090B',
  surface: '#111114',
  surfaceLight: '#18181C',
  surfaceHighlight: '#232329',
  surfaceInput: '#0D0D10',
  surfaceRaised: '#1C1C21',

  // Borders
  border: '#232329',
  borderLight: '#2F2F37',
  borderFocus: '#8B5CF6',

  // Text
  text: '#F4F4F5',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textInverse: '#09090B',

  // Brand / interactive
  primary: '#7C6CF6',
  primaryDark: '#5B4BDB',
  primaryLight: '#A99CFB',
  primarySoft: 'rgba(124, 108, 246, 0.14)',

  // Semantic (mapped onto the domain accents)
  success: ACCENTS.emerald,
  successDark: '#059669',
  successSoft: 'rgba(16, 185, 129, 0.14)',

  warning: ACCENTS.amber,
  warningDark: '#D97706',
  warningSoft: 'rgba(245, 158, 11, 0.14)',

  danger: ACCENTS.rose,
  dangerDark: '#E11D48',
  dangerSoft: 'rgba(244, 63, 94, 0.14)',

  info: ACCENTS.sky,
  infoDark: '#0284C7',
  infoSoft: 'rgba(56, 189, 248, 0.14)',

  close: ACCENTS.violet,
  closeSoft: 'rgba(139, 92, 246, 0.14)',

  yardi: '#C084FC', // Yardi Voyager side of every comparison
  yardiSoft: 'rgba(192, 132, 252, 0.14)',

  // Legal & audit guardrails
  gold: '#E3B341',
  goldSoft: 'rgba(227, 179, 65, 0.14)',
  crimson: '#BE123C',
  guardrailSurface: '#15110C',

  // Accounting tables
  debit: '#34D399',
  credit: '#FBBF24',

  // Badges & statuses
  badgeDaily: '#38BDF8',
  badgeWeekly: '#A99CFB',
  badgePreAME: '#F472B6',
  badgePostAME: '#F59E0B',
  badgeReview: '#34D399',
  badgeReporting: '#C084FC',
};

// Accent per RealPage module id (matches the generated module colors).
export const MODULE_ACCENTS = {
  gl: ACCENTS.emerald,
  fixed_assets: '#34D399',
  ap: ACCENTS.sky,
  cash: ACCENTS.amber,
  close: ACCENTS.violet,
  ar: '#2DD4BF',
  job_cost: '#FB923C',
  budgeting: '#818CF8',
  reporting: '#60A5FA',
};
