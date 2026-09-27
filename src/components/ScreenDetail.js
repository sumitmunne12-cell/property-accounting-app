import React, { memo, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { RADII } from '../theme/layout';
import { MULTIFAMILY_TERMS } from '../data/glossaryData';
import { useScreenDetail } from '../utils/useModuleData';
import RegulatoryGuardrailCard from './RegulatoryGuardrailCard';
import GaapButton from './gaap/GaapButton';
import { getScreenEntry } from '../utils/screenIndex';
import { ascLinksForScreen } from '../utils/ascLinks';
import { Breadcrumbs, StepList, SectionLabel, ModuleLoading } from './ui';
import { LedgerText } from './Ledger';
// SOP steps are stored as "1. Do X" — the badge already shows the number.
export const stripStepNumber = (step) => step.replace(/^\s*(Step\s*)?\d+[.:)]\s*/i, '');

// One-click acronym definitions: curated multifamily acronyms found in a screen's text.
const ACRONYM_INDEX = MULTIFAMILY_TERMS.filter((t) => t.acronym && /^[A-Z0-9][A-Z0-9&/-]{1,7}$/.test(t.acronym)).map(
  (t) => ({
    term: t,
    rx: new RegExp(`(^|[^A-Za-z0-9])${t.acronym.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}([^A-Za-z0-9]|$)`),
  })
);

export function findAcronyms(screen) {
  const text = [screen.name, screen.purpose, screen.glAccountingImpact, ...(screen.whyRecordsAreHere || [])].join(' ');
  return ACRONYM_INDEX.filter((a) => a.rx.test(text)).map((a) => a.term);
}

function ScreenDetail({ screen, accent = COLORS.info }) {
  const [openAcronym, setOpenAcronym] = useState(null);
  const acronyms = useMemo(() => findAcronyms(screen), [screen]);
  // Track A: ASC Topics that govern this screen (guardrail citations + real-estate rules).
  const gaapLinks = useMemo(() => ascLinksForScreen(getScreenEntry(screen.id), screen), [screen]);
  const why = Array.isArray(screen.whyRecordsAreHere) ? screen.whyRecordsAreHere : [screen.whyRecordsAreHere];

  return (
    <View>
      <View style={styles.section}>
        <SectionLabel icon="navigate-outline">Exact navigation path</SectionLabel>
        <Breadcrumbs parts={screen.navigation} accent={accent} />
      </View>

      <View style={styles.section}>
        <SectionLabel icon="information-circle-outline">Screen & report purpose</SectionLabel>
        <Text style={styles.purposeText}>{screen.purpose}</Text>
      </View>

      <RegulatoryGuardrailCard guardrail={screen.regulatoryGuardrail} />

      <GaapButton links={gaapLinks} contextLabel={screen.name} />

      {acronyms.length > 0 && (
        <View style={styles.section}>
          <SectionLabel icon="book-outline">Terms on this screen · tap for definition</SectionLabel>
          <View style={styles.chipRow}>
            {acronyms.map((t) => (
              <TouchableOpacity
                key={t.term}
                style={[styles.acronymChip, openAcronym === t.term && styles.acronymChipActive]}
                onPress={() => setOpenAcronym(openAcronym === t.term ? null : t.term)}
              >
                <Text style={styles.acronymChipText}>{t.acronym}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {acronyms
            .filter((t) => t.term === openAcronym)
            .map((t) => (
              <View key={t.term} style={styles.acronymDefBox}>
                <Text style={styles.acronymDefTitle}>{t.term}</Text>
                <Text style={styles.bodyText}>{t.definition}</Text>
              </View>
            ))}
        </View>
      )}

      <View style={styles.section}>
        <SectionLabel icon="alert-circle-outline" color={COLORS.danger}>Why records are here (root cause)</SectionLabel>
        {why.map((reason, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{reason}</Text>
          </View>
        ))}
      </View>

      {screen.keyFieldsAndFilters && screen.keyFieldsAndFilters.length > 0 && (
        <View style={styles.section}>
          <SectionLabel icon="options-outline" color={COLORS.warning}>Key fields, buttons & filters</SectionLabel>
          <View style={styles.fieldTable}>
            {screen.keyFieldsAndFilters.map((field, idx) => (
              <View key={idx} style={[styles.fieldItem, idx > 0 && styles.fieldDivider]}>
                <Text style={styles.fieldName}>{field.name}</Text>
                <Text style={styles.fieldDesc}>{field.description}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <SectionLabel icon="list-outline" color={COLORS.primaryLight}>Accountant step-by-step action SOP</SectionLabel>
        <StepList steps={screen.accountantActionSOP} format={stripStepNumber} />
      </View>

      <View style={styles.glCard}>
        <SectionLabel icon="swap-horizontal-outline" color={COLORS.success}>Downstream GL accounting impact</SectionLabel>
        <LedgerText text={screen.glAccountingImpact} />
      </View>

      {screen.whatHappensNext ? (
        <View style={styles.section}>
          <SectionLabel icon="arrow-forward-circle-outline" color={COLORS.info}>What happens next</SectionLabel>
          <Text style={styles.bodyText}>{screen.whatHappensNext}</Text>
        </View>
      ) : null}

      {screen.yardiEquivalent ? (
        <View style={styles.yardiBox}>
          <SectionLabel icon="git-compare-outline" color={COLORS.yardi}>Yardi Voyager equivalent</SectionLabel>
          <Text style={styles.bodyText}>{screen.yardiEquivalent}</Text>
        </View>
      ) : null}

      {screen.pdfManualSource ? (
        <View style={styles.sourceRow}>
          <Ionicons name="document-text-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.sourceText}>{screen.pdfManualSource}</Text>
        </View>
      ) : null}

      {screen.proTips ? (
        <View style={styles.tipBox}>
          <Ionicons name="sparkles" size={15} color={COLORS.gold} />
          <Text style={styles.tipText}>{screen.proTips}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default memo(ScreenDetail);

/** ScreenDetail for a screen id: loads the owning module on demand, with a loading state. */
export function LazyScreenDetail({ screenId, accent }) {
  const { entry, screen, error, retry } = useScreenDetail(screenId);
  if (!entry) return <Text style={styles.missing}>Screen "{screenId}" is not in the catalog.</Text>;
  if (!screen) {
    return <ModuleLoading label={`${entry.moduleTitle} detail`} error={error} onRetry={retry} color={entry.moduleColor} />;
  }
  return <ScreenDetail screen={screen} accent={accent || entry.moduleColor} />;
}

const styles = StyleSheet.create({
  section: { marginTop: 18 },
  purposeText: { fontSize: 13.5, color: COLORS.text, lineHeight: 20 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  acronymChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: `${COLORS.gold}55`,
    backgroundColor: `${COLORS.gold}12`,
    marginRight: 6,
    marginBottom: 6,
  },
  acronymChipActive: { backgroundColor: `${COLORS.gold}33` },
  acronymChipText: { fontSize: 11, fontWeight: '800', color: COLORS.gold, letterSpacing: 0.3 },
  acronymDefBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADII.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  acronymDefTitle: { fontSize: 12.5, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 7 },
  bulletDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 7, marginRight: 9, backgroundColor: COLORS.danger },
  bulletText: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 19, flex: 1 },
  bodyText: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 19 },
  fieldTable: {
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  fieldItem: { paddingHorizontal: 12, paddingVertical: 9 },
  fieldDivider: { borderTopWidth: 1, borderTopColor: COLORS.border },
  fieldName: { fontSize: 12, fontWeight: '700', color: COLORS.warning, marginBottom: 2 },
  fieldDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  glCard: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.success}55`,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
    marginTop: 18,
  },
  yardiBox: {
    backgroundColor: `${COLORS.yardi}10`,
    padding: 12,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.yardi}40`,
    marginTop: 18,
  },
  sourceRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 14 },
  sourceText: { fontSize: 11, color: COLORS.textMuted, marginLeft: 6, flex: 1, lineHeight: 16 },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.gold}10`,
    padding: 12,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
    marginTop: 12,
  },
  tipText: { fontSize: 12, color: COLORS.text, lineHeight: 18, marginLeft: 8, flex: 1 },
  missing: { color: COLORS.danger, fontSize: 13, paddingVertical: 12 },
});
