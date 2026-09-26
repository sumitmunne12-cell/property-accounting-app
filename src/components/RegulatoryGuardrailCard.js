import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// "⚖️ Legal & Audit Guardrails" card: authority badge, regulation code, plain-English rule and
// the audit-risk callout. Used by ScreenDetail (Explorer / SOP modal) and the MasteryModal.
export default function RegulatoryGuardrailCard({ guardrail, sourceLabel, compact = false }) {
  if (!guardrail) return null;
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <Text style={styles.title}>⚖️ LEGAL & AUDIT GUARDRAILS</Text>

      <View style={styles.badgeRow}>
        <View style={styles.authorityBadge}>
          <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
          <Text style={styles.authorityText}>{guardrail.governingAuthority}</Text>
        </View>
      </View>
      <Text style={styles.code}>{guardrail.regulationCode}</Text>

      <Text style={styles.label}>THE RULE IN PLAIN ENGLISH</Text>
      <Text style={styles.rule}>{guardrail.plainEnglishRule}</Text>

      <View style={styles.riskBox}>
        <Ionicons name="warning" size={15} color={COLORS.danger} />
        <View style={styles.riskTextWrap}>
          <Text style={styles.riskLabel}>AUDIT RISK / LIABILITY IF VIOLATED</Text>
          <Text style={styles.riskText}>{guardrail.auditRisk}</Text>
        </View>
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
    backgroundColor: '#1A1530',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${COLORS.gold}70`,
    padding: 12,
    marginTop: 12,
  },
  cardCompact: {
    marginTop: 0,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  authorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 6,
    maxWidth: '100%',
  },
  authorityText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
    flexShrink: 1,
  },
  code: {
    fontSize: 12,
    color: COLORS.info,
    fontWeight: '600',
    lineHeight: 17,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 4,
  },
  rule: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  riskBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.danger}18`,
    borderWidth: 1,
    borderColor: `${COLORS.danger}60`,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  riskTextWrap: {
    flex: 1,
    marginLeft: 8,
  },
  riskLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.danger,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  riskText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  },
  source: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  disclaimer: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 6,
    lineHeight: 14,
    fontStyle: 'italic',
  },
});
