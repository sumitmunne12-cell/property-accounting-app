// Shared cards for the Deduction Compass: a rule that fired, an exception that overrides the
// rules, and the real RealPage path as breadcrumbs.
import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { RADII } from '../../theme/layout';
import { Breadcrumbs } from '../ui';

const STEP_COLORS = { 1: COLORS.info, 2: COLORS.close, 3: COLORS.success };

export const RuleCard = memo(function RuleCard({ rule, highlight = false }) {
  const color = STEP_COLORS[rule.step] || COLORS.textSecondary;
  return (
    <View style={[styles.card, highlight && { borderColor: `${color}88` }]}>
      <View style={styles.row}>
        <View style={[styles.stepDot, { backgroundColor: `${color}22`, borderColor: `${color}77` }]}>
          <Text style={[styles.stepNum, { color }]}>{rule.step}</Text>
        </View>
        <Text style={styles.title}>{rule.title}</Text>
      </View>
      <Text style={styles.body}>{rule.text}</Text>
    </View>
  );
});

export const ExceptionCard = memo(function ExceptionCard({ exception, compact = false }) {
  return (
    <View style={styles.excCard}>
      <View style={styles.row}>
        <Ionicons name="warning-outline" size={14} color={COLORS.warning} />
        <Text style={styles.excId}>{exception.id}</Text>
        <Text style={styles.excTitle}>{exception.title}</Text>
      </View>
      {!compact ? (
        <>
          <Text style={styles.excLabel}>TRAP</Text>
          <Text style={styles.body}>{exception.trap}</Text>
          <Text style={styles.excLabel}>WHY REALPAGE PUT IT THERE</Text>
          <Text style={styles.body}>{exception.why}</Text>
        </>
      ) : null}
      <View style={styles.hook}>
        <Ionicons name="bulb-outline" size={13} color={COLORS.gold} />
        <Text style={styles.hookText}>{exception.hook}</Text>
      </View>
    </View>
  );
});

export const PathCrumbs = memo(function PathCrumbs({ parts, accent = COLORS.info }) {
  return <Breadcrumbs parts={parts.filter(Boolean)} accent={accent} />;
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { fontSize: 10.5, fontWeight: '800' },
  title: { flex: 1, fontSize: 12.5, fontWeight: '700', color: COLORS.text },
  body: { fontSize: 12.5, lineHeight: 18, color: COLORS.textSecondary, marginTop: 5 },
  excCard: {
    backgroundColor: COLORS.warningSoft,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.warning}55`,
    padding: 10,
    marginBottom: 8,
  },
  excId: { fontSize: 11, fontWeight: '800', color: COLORS.warning },
  excTitle: { flex: 1, fontSize: 12.5, fontWeight: '700', color: COLORS.text },
  excLabel: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.8, color: COLORS.textMuted, marginTop: 8 },
  hook: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.warning}33`,
  },
  hookText: { flex: 1, fontSize: 12.5, fontStyle: 'italic', color: COLORS.gold },
});
