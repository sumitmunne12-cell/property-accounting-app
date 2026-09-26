import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { MULTIFAMILY_TERMS } from '../data/glossaryData';
import RegulatoryGuardrailCard from './RegulatoryGuardrailCard';

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

export default function ScreenDetail({ screen }) {
  const [openAcronym, setOpenAcronym] = useState(null);
  const acronyms = useMemo(() => findAcronyms(screen), [screen]);

  return (
    <View>
      {/* Exact Breadcrumbs Box */}
      <View style={styles.detailSection}>
        <Text style={styles.sectionLabel}>EXACT NAVIGATION PATH</Text>
        <View style={styles.breadcrumbBox}>
          {screen.navigation.map((step, idx) => (
            <Text key={idx} style={styles.breadcrumbStepText}>
              {idx > 0 && '  ›  '}
              {step}
            </Text>
          ))}
        </View>
      </View>

      {/* Screen Purpose */}
      <View style={styles.detailSection}>
        <Text style={styles.sectionLabel}>SCREEN & REPORT PURPOSE</Text>
        <Text style={styles.purposeText}>{screen.purpose}</Text>
      </View>

      {/* Legal & audit guardrails */}
      <RegulatoryGuardrailCard guardrail={screen.regulatoryGuardrail} />

      {/* One-click acronyms */}
      {acronyms.length > 0 && (
        <View style={styles.detailSection}>
          <Text style={styles.sectionLabel}>TERMS ON THIS SCREEN (TAP FOR DEFINITION)</Text>
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

      {/* Why Records Are Here */}
      <View style={styles.detailSection}>
        <Text style={[styles.sectionLabel, { color: COLORS.danger }]}>WHY RECORDS ARE HERE (ROOT CAUSE)</Text>
        {(Array.isArray(screen.whyRecordsAreHere) ? screen.whyRecordsAreHere : [screen.whyRecordsAreHere]).map(
          (reason, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <View style={[styles.bulletDot, { backgroundColor: COLORS.danger }]} />
              <Text style={styles.bulletText}>{reason}</Text>
            </View>
          )
        )}
      </View>

      {/* Key Fields & Filters */}
      {screen.keyFieldsAndFilters && (
        <View style={styles.detailSection}>
          <Text style={[styles.sectionLabel, { color: COLORS.warning }]}>KEY FIELDS, BUTTONS & FILTERS</Text>
          {screen.keyFieldsAndFilters.map((field, idx) => (
            <View key={idx} style={styles.fieldItem}>
              <Text style={styles.fieldName}>{field.name}:</Text>
              <Text style={styles.fieldDesc}>{field.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Step-by-Step SOP */}
      <View style={styles.detailSection}>
        <Text style={[styles.sectionLabel, { color: COLORS.primaryLight }]}>ACCOUNTANT STEP-BY-STEP ACTION SOP</Text>
        {screen.accountantActionSOP.map((step, idx) => (
          <View key={idx} style={styles.sopRow}>
            <View style={styles.sopNumBadge}>
              <Text style={styles.sopNumText}>{idx + 1}</Text>
            </View>
            <Text style={styles.sopStepText}>{stripStepNumber(step)}</Text>
          </View>
        ))}
      </View>

      {/* GL Impact */}
      <View style={styles.glSection}>
        <Text style={styles.glSectionLabel}>DOWNSTREAM GL ACCOUNTING IMPACT</Text>
        <Text style={styles.glSectionFormula}>{screen.glAccountingImpact}</Text>
      </View>

      {/* What Happens Next */}
      {screen.whatHappensNext ? (
        <View style={styles.detailSection}>
          <Text style={[styles.sectionLabel, { color: COLORS.info }]}>WHAT HAPPENS NEXT</Text>
          <Text style={styles.bodyText}>{screen.whatHappensNext}</Text>
        </View>
      ) : null}

      {/* Yardi Equivalent */}
      {screen.yardiEquivalent ? (
        <View style={styles.yardiBox}>
          <Text style={styles.yardiLabel}>YARDI VOYAGER EQUIVALENT</Text>
          <Text style={styles.bodyText}>{screen.yardiEquivalent}</Text>
        </View>
      ) : null}

      {/* Manual Citation */}
      {screen.pdfManualSource ? (
        <View style={styles.sourceRow}>
          <Ionicons name="document-text-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.sourceText}>{screen.pdfManualSource}</Text>
        </View>
      ) : null}

      {/* Pro Tip */}
      {screen.proTips ? (
        <View style={styles.tipBox}>
          <Ionicons name="sparkles" size={15} color={COLORS.gold} />
          <Text style={styles.tipText}>{screen.proTips}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  detailSection: {
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  breadcrumbBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  breadcrumbStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.info,
  },
  purposeText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  acronymChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${COLORS.gold}60`,
    backgroundColor: `${COLORS.gold}15`,
    marginRight: 6,
    marginBottom: 6,
  },
  acronymChipActive: {
    backgroundColor: `${COLORS.gold}40`,
  },
  acronymChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gold,
  },
  acronymDefBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  acronymDefTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  bodyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  fieldItem: {
    marginBottom: 6,
  },
  fieldName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warning,
  },
  fieldDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  sopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  sopNumBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  sopNumText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sopStepText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    flex: 1,
  },
  glSection: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
    marginTop: 12,
  },
  glSectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 4,
  },
  glSectionFormula: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  yardiBox: {
    backgroundColor: `${COLORS.yardi}15`,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.yardi}40`,
    marginTop: 12,
  },
  yardiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.yardi,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  sourceText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.gold}15`,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
    marginTop: 10,
  },
  tipText: {
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 17,
    marginLeft: 8,
    flex: 1,
  },
});
