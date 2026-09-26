import { Platform } from 'react-native';

// Monospace stack for ledger amounts (tabular digits line up in DR/CR columns).
export const MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});

export const RADII = { sm: 6, md: 10, lg: 14, pill: 999 };

// Responsive breakpoints: phones use the bottom tab bar; from DESKTOP_MIN the app switches to
// a fixed sidebar with the content centered in a max-width column.
export const LAYOUT = {
  DESKTOP_MIN: 1024,
  SIDEBAR_WIDTH: 244,
  CONTENT_MAX: 1120,
  READING_MAX: 860,
};
