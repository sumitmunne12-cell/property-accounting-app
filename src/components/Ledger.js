// Ledger presentation: DR/CR journal tables with monospace, right-aligned amounts and a
// balanced-totals footer, plus inline GL prose with DR/CR tokens and account numbers highlighted.
import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { MONO, RADII } from '../theme/layout';

export const money = (n) =>
  n ? Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';

const ACCOUNT = /^\d{4}(?:-\d{2,4})?$/;
const LEDGER_TOKEN = /(\bDR\b|\bCR\b|\b\d{4}(?:-\d{2,4})?\b)/g;

/** GL prose ("DR 1010-00 / CR 7100-00 Interest Income") with ledger tokens in monospace. */
export const LedgerText = memo(function LedgerText({ text, style }) {
  const parts = String(text || '').split(LEDGER_TOKEN);
  return (
    <Text style={[styles.glText, style]}>
      {parts.map((p, i) => {
        if (p === 'DR') return <Text key={i} style={[styles.token, styles.dr]}>DR</Text>;
        if (p === 'CR') return <Text key={i} style={[styles.token, styles.cr]}>CR</Text>;
        if (ACCOUNT.test(p)) return <Text key={i} style={styles.acct}>{p}</Text>;
        return p;
      })}
    </Text>
  );
});

/**
 * Journal entry: { label, lines: [{ account, debit?, credit? }], memo? } with totals.
 * `totals` = { debit, credit } (pass entryTotals(entry)).
 */
export const JournalTable = memo(function JournalTable({ entry, totals }) {
  const balanced = Math.abs(totals.debit - totals.credit) < 0.005;
  return (
    <View style={styles.box}>
      {entry.label ? <Text style={styles.label}>{entry.label}</Text> : null}
      <View style={styles.table}>
        <View style={[styles.row, styles.headRow]}>
          <Text style={[styles.acctCol, styles.head]}>ACCOUNT</Text>
          <Text style={[styles.amtCol, styles.head, { color: COLORS.debit }]}>DEBIT</Text>
          <Text style={[styles.amtCol, styles.head, { color: COLORS.credit }]}>CREDIT</Text>
        </View>
        {entry.lines.map((l, i) => (
          <View key={i} style={[styles.row, i % 2 === 1 && styles.zebra]}>
            <Text style={[styles.acctCol, styles.cell, l.credit ? styles.creditIndent : null]}>{l.account}</Text>
            <Text style={[styles.amtCol, styles.amt]}>{money(l.debit)}</Text>
            <Text style={[styles.amtCol, styles.amt]}>{money(l.credit)}</Text>
          </View>
        ))}
        <View style={[styles.row, styles.totalRow]}>
          <View style={[styles.acctCol, styles.balanceCell]}>
            <Ionicons
              name={balanced ? 'checkmark-circle' : 'alert-circle'}
              size={13}
              color={balanced ? COLORS.success : COLORS.danger}
            />
            <Text style={[styles.balanceText, { color: balanced ? COLORS.success : COLORS.danger }]}>
              {balanced ? 'Balanced' : 'OUT OF BALANCE'}
            </Text>
          </View>
          <Text style={[styles.amtCol, styles.amt, styles.totalAmt]}>{money(totals.debit)}</Text>
          <Text style={[styles.amtCol, styles.amt, styles.totalAmt]}>{money(totals.credit)}</Text>
        </View>
      </View>
      {entry.memo ? <Text style={styles.memo}>Memo: {entry.memo}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  glText: { fontSize: 12.5, color: COLORS.text, lineHeight: 20 },
  token: { fontFamily: MONO, fontWeight: '800', fontSize: 11.5 },
  dr: { color: COLORS.debit },
  cr: { color: COLORS.credit },
  acct: { fontFamily: MONO, fontSize: 12, color: COLORS.text, fontWeight: '600' },
  box: { marginBottom: 10 },
  label: { fontSize: 12.5, color: COLORS.text, fontWeight: '700', marginBottom: 6 },
  table: {
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6 },
  zebra: { backgroundColor: COLORS.surfaceLight },
  headRow: { backgroundColor: COLORS.surfaceInput, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  head: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.9, color: COLORS.textMuted },
  acctCol: { flex: 1, paddingRight: 8 },
  amtCol: { width: 96, textAlign: 'right' },
  cell: { fontSize: 12, color: COLORS.text },
  creditIndent: { paddingLeft: 16, color: COLORS.textSecondary },
  amt: { fontFamily: MONO, fontSize: 12, color: COLORS.text, fontVariant: ['tabular-nums'] },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.borderLight, backgroundColor: COLORS.surfaceInput },
  totalAmt: { fontWeight: '800', textDecorationLine: 'underline' },
  balanceCell: { flexDirection: 'row', alignItems: 'center' },
  balanceText: { fontSize: 11, fontWeight: '800', marginLeft: 5, letterSpacing: 0.3 },
  memo: { fontSize: 11, color: COLORS.textMuted, marginTop: 6, fontStyle: 'italic', lineHeight: 16 },
});
