import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { MONO, RADII } from '../theme/layout';

// "Senior SME analysis" card: the hand-written purpose / root-cause layer for a screen
// (src/data/sme/). Violet frame for the analysis, crimson box for what fails if skipped.
// Used by ScreenDetail (Explorer / SOP modal).

const CONFIDENCE = {
  high: { label: 'HIGH CONFIDENCE', color: COLORS.success },
  medium: { label: 'MEDIUM · INFERRED', color: COLORS.warning },
};

function Chips({ items, mono = false, color = COLORS.textSecondary }) {
  return (
    <View style={styles.chipRow}>
      {items.map((t) => (
        <View key={t} style={[styles.chip, { borderColor: `${color}55`, backgroundColor: `${color}12` }]}>
          <Text style={[styles.chipText, mono && styles.mono, { color }]}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

function Label({ children }) {
  return <Text style={styles.label}>{children}</Text>;
}

export default function SmeAnalysisCard({ sme }) {
  if (!sme) return null;
  const conf = CONFIDENCE[sme.confidence] || CONFIDENCE.high;
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>SENIOR SME ANALYSIS</Text>
        <View style={[styles.confBadge, { borderColor: `${conf.color}66`, backgroundColor: `${conf.color}1A` }]}>
          <Text style={[styles.confText, { color: conf.color }]}>{conf.label}</Text>
        </View>
      </View>

      <Label>PURPOSE</Label>
      <Text style={styles.body}>{sme.purpose}</Text>

      <Label>BUSINESS OUTCOME</Label>
      <Text style={styles.body}>{sme.outcome}</Text>

      <Label>ROOT CAUSE · WHY THIS SCREEN EXISTS</Label>
      <Text style={styles.body}>{sme.rootCause}</Text>

      <View style={styles.riskBox}>
        <View style={styles.riskHeader}>
          <Ionicons name="warning" size={14} color={COLORS.danger} />
          <Text style={styles.riskLabel}>WHAT FAILS IF THIS IS SKIPPED</Text>
        </View>
        <Text style={styles.body}>{sme.ifSkipped}</Text>
      </View>

      {sme.glAccounts?.length > 0 && (
        <>
          <Label>GL ACCOUNTS IN PLAY</Label>
          <Chips items={sme.glAccounts} mono color={COLORS.success} />
        </>
      )}
      {sme.gaap?.length > 0 && (
        <>
          <Label>GAAP & STANDARDS</Label>
          {sme.gaap.map((g) => (
            <Text key={g} style={styles.bullet}>
              §  {g}
            </Text>
          ))}
        </>
      )}
      {sme.stakeholders?.length > 0 && (
        <>
          <Label>STAKEHOLDERS</Label>
          <Chips items={sme.stakeholders} color={COLORS.info} />
        </>
      )}
      {sme.reports?.length > 0 && (
        <>
          <Label>DOWNSTREAM REPORTS</Label>
          <Chips items={sme.reports} color={COLORS.primaryLight} />
        </>
      )}
      {sme.redFlags?.length > 0 && (
        <>
          <Label>WHAT THE ONSHORE REVIEWER WILL CHALLENGE</Label>
          {sme.redFlags.map((r) => (
            <View key={r} style={styles.flagRow}>
              <Ionicons name="flag" size={11} color={COLORS.warning} style={styles.flagIcon} />
              <Text style={styles.flagText}>{r}</Text>
            </View>
          ))}
        </>
      )}
      {sme.yardi ? (
        <>
          <Label>YARDI VOYAGER CONTRAST</Label>
          <Text style={styles.body}>{sme.yardi}</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: `${COLORS.close}59`,
    borderTopWidth: 2,
    borderTopColor: COLORS.close,
    padding: 14,
    marginTop: 18,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' },
  title: { fontSize: 11, fontWeight: '800', color: COLORS.close, letterSpacing: 1, marginRight: 8 },
  confBadge: { borderWidth: 1, borderRadius: RADII.pill, paddingHorizontal: 8, paddingVertical: 3 },
  confText: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.7 },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.9,
    marginTop: 12,
    marginBottom: 4,
  },
  body: { fontSize: 13, color: COLORS.text, lineHeight: 19 },
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderRadius: RADII.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    maxWidth: '100%',
  },
  chipText: { fontSize: 11.5, fontWeight: '600' },
  mono: { fontFamily: MONO },
  bullet: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 18.5, marginBottom: 4 },
  flagRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  flagIcon: { marginTop: 4, marginRight: 8 },
  flagText: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 18.5, flex: 1 },
});
