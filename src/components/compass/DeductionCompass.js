// Deduction Compass tab: learn RealPage's filing logic instead of memorizing paths.
//   Drill    – predict application → tab/section → list, then reveal the real path and the rule.
//   Scenario – type a situation; the deterministic matcher walks steps 1-2-3 to candidate screens.
//   Map      – applications × lifecycle stages; tap down to the lists and screens.
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { LAYOUT } from '../../theme/layout';
import { SegmentedToggle } from '../ui';
import { COMPASS_METRICS } from '../../utils/compassEngine';
import CompassDrill from './CompassDrill';
import ScenarioBox from './ScenarioBox';
import CompassMap from './CompassMap';

const MODES = [
  { key: 'drill', label: 'Drill', icon: 'help-circle-outline' },
  { key: 'scenario', label: 'Scenario', icon: 'chatbox-ellipses-outline' },
  { key: 'map', label: 'Map', icon: 'grid-outline' },
];

/**
 * @param {Function} onOpenScreen     (screenId, context) → click-by-click SOP modal
 * @param {Function} onOpenInExplorer (moduleId, screenId) → RealPage Explorer deep link
 * @param {Function} onOpenMastery    (task) → 5-point MasteryModal for a Daily Hub task
 * @param {Function} onSearchAll      (query) → Triage & Search (CommandSearch) with the query
 */
export default function DeductionCompass({ onOpenScreen, onOpenInExplorer, onOpenMastery, onSearchAll }) {
  const [mode, setMode] = useState('drill');
  const m = COMPASS_METRICS;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="compass" size={18} color={COLORS.warning} />
          <Text style={styles.title}>Deduction Compass</Text>
        </View>
        <Text style={styles.subtitle}>
          Noun → application · verb → tab/section · noun + state → list. Tested on {m.screens.toLocaleString()} real menu paths:
          app {Math.round(m.appPrecision)}% · tab {Math.round(m.tabPrecisionGivenApp)}% · section {Math.round(m.sectionPrecisionGivenApp)}% · list{' '}
          {Math.round(m.submenuPrecisionGivenApp)}%.
        </Text>
        <SegmentedToggle options={MODES} value={mode} onChange={setMode} accent={COLORS.warning} />
      </View>
      <View style={styles.body}>
        {mode === 'drill' && (
          <CompassDrill onOpenScreen={onOpenScreen} onOpenInExplorer={onOpenInExplorer} onOpenMastery={onOpenMastery} />
        )}
        {mode === 'scenario' && <ScenarioBox onOpenScreen={onOpenScreen} onSearchAll={onSearchAll} onOpenMastery={onOpenMastery} />}
        {mode === 'map' && <CompassMap onOpenScreen={onOpenScreen} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', maxWidth: LAYOUT.READING_MAX, alignSelf: 'center' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 11.5, lineHeight: 16, color: COLORS.textSecondary, marginTop: 4, marginBottom: 10 },
  body: { flex: 1 },
});
