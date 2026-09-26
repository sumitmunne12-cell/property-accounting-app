import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { MONO, RADII } from '../theme/layout';

// "⚖️ Legal & Audit Guardrails" card: authority badge, regulation code, plain-English rule and
// the audit-risk callout. Gold frame for the rule, crimson frame for the liability.
// Used by ScreenDetail (Explorer / SOP modal) and the MasteryModal.
export default function RegulatoryGuardrailCard({ guardrail, sourceLabel, compact = false }) {
  if (!guardrail) return null;
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>⚖️  LEGAL & AUDIT GUARDRAILS</Text>
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.authorityBadge}>
          <Ionicons name="shield-checkmark" size={12} color={COLORS.gold} />
          <Text style={styles.authorityText}>{guardrail.governingAuthority}</Text>
        </View>
      </View>
      <View style={styles.codeBox}>
        <Text style={styles.code}>{guardrail.regulationCode}</Text>
      </View>

      <Text style={styles.label}>THE RULE IN PLAIN ENGLISH</Text>
      <Text style={styles.rule}>{guardrail.plainEnglishRule}</Text>

      <View style={styles.riskBox}>
        <View style={styles.riskHeader}>
          <Ionicons name="warning" size={14} color={COLORS.danger} />
          <Text style={styles.riskLabel}>AUDIT RISK / LIABILITY IF VIOLATED</Text>
        </View>
        <Text style={styles.riskText}>{guardrail.auditRisk}</Text>
      </View>

      {sourceLabel ? <Text style={styles.source}>{sourceLabel}</Text> : null}
      <Text style={styles.disclaimer}>
        Guidance for accounting operations, not legal advice. State rules vary; confirm with the controller or counsel for the property's state.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.guardrailSurface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: `${COLORS.gold}59`,
    borderTopWidth: 2,
    borderTopColor: COLORS.gold,
    padding: 14,
    marginTop: 18,
  },
  cardCompact: { marginTop: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 11, fontWeight: '800', color: COLORS.gold, letterSpacing: 1 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  authorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.gold}1A`,
    borderWidth: 1,
    borderColor: `${COLORS.gold}66`,
    borderRadius: RADII.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
    maxWidth: '100%',
  },
  authorityText: { color: COLORS.gold, fontSize: 11.5, fontWeight: '700', marginLeft: 6, flexShrink: 1 },
  codeBox: {
    backgroundColor: COLORS.surfaceInput,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  code: { fontSize: 11.5, color: COLORS.text, fontFamily: MONO, lineHeight: 17 },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.9,
    marginTop: 12,
    marginBottom: 4,
  },
  rule: { fontSize: 13, color: COLORS.text, lineHeight: 19 },
  riskBox: {
    backgroundColor: `${COLORS.crimson}1F`,
    borderWidth: 1,
    borderColor: `${COLORS.crimson}AA`,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger,
    borderRadius: RADII.md,
    padding: 11,
    marginTop: 12,
  },
  riskHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  riskLabel: { fontSize: 10, fontWeight: '800', color: COLORS.danger, letterSpacing: 0.8, marginLeft: 6 },
  riskText: { fontSize: 12.5, color: COLORS.text, lineHeight: 18.5 },
  source: { fontSize: 11, color: COLORS.textMuted, marginTop: 10 },
  disclaimer: { fontSize: 10, color: COLORS.textMuted, marginTop: 8, lineHeight: 14, fontStyle: 'italic' },
});
